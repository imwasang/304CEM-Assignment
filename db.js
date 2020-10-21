var mysql = require('mysql');
var tableSql = require('./sql');
var fs = require('fs');
var reciepeData = require('./data/recipe.json')
var config = require('./config.json');

let con = mysql.createPool(config.database);

con.query('create database `RecipeDB` character set utf8 collate utf8_general_ci;', function (err) {
    config.database.database = 'RecipeDB'
    con = mysql.createConnection(config.database)
    tableSql.forEach(function (sqlItem) {
        con.query(sqlItem, function (err) { });
    })
    if (config.init == false) {
        reciepeData.forEach(function (item) {
            let keys = Object.keys(item).toString();
            let values = Object.values(item).map(function (item) {
                return `"${item}"`
            }).toString();
            con.query(
                `
                insert into recipe(${keys}) values(${values})
            `,
                function (err) {
                    config.init = true;
                    fs.writeFile('./config.json', JSON.stringify(config, null, 4), function (err) { })
                }
            )
        })


    }
})


module.exports = {
    /**
     * 
     * 根据数据表名称查找出所有的数据
     * @param {String} tableName 数据表名称
     * @param {Array<string>} fields 需要什么字段，空数代表*
     * @param {Function} cb 回调函数
     */
    getAll(tableName, fields = [], cb) {
        const sql = `select ${fields.length ? fields.toString() : '*'} from ${tableName}`
        con.query(sql, [], cb);
    },
    /**
     * 根据where条件查询
     * @param {String} tableName 数据表名称
     * @param {Object} data where需要的数据 类似: {id:2}
     * @param {Function} cb 回调函数
     */
    getAllByFilter(tableName, data, cb) {

        /**
         * 需要的sql格式
         *  select * from Person where id=? and username=?
         */

        let keywords = Object.keys(data)
        let vals = Object.values(data);

        // 拼接成 id=? and username=? 格式, 最后一个没有'=? and '直接 加上 '=?' 就行
        keywords = keywords.join('=? and ') + '=?';
        const sql = `select * from ${tableName} where ${keywords}`;
        // 直接传递vals即可, vals是一个数组, 按顺序对应的?号
        con.query(sql, vals, cb);
    },
    /**
     * 根据id查询
     * @param {String} tableName 数据表名称
     * @param {Object} data 只要是带id的这样传入{ xxId: 1 }
     * @param {Function} cb 回调函数
     */
    getOneById(tableName, data, cb) {
        let sql = `select * from ${tableName} where ${data.join('=')}`;
        con.query(sql, [], cb);
    },
    /**
     * 
     * @param {String} tableName 数据表名称
     * @param {Object} data 修改后的值可以有多个: { RecipeName: 'newName' }
     * @param {Object} where where条件: { RecipeId: 1 }, 可以只传入{}空对象代表无where条件
     * @param {Function} cb 回调函数
     */
    update(tableName, data, where, cb) {

        let setArr = []
        let newWhere = []
        Object.keys(data).forEach(function (key) {
            setArr.push(`${key}="${data[key]}"`)
        })

        if (Object.keys(where).length > 0) {
            Object.keys(where).forEach(function (key) {
                newWhere.push(`${key}="${where[key]}"`)
            })
            newWhere = ' where ' + newWhere.join(' and ')
        }
        const sql = `update ${tableName} set ${setArr.join(',')}${newWhere.toString()}`
        con.query(sql, [], cb);
    },
    /**
     * 插入一条数据
     * @param {String} tableName 数据表名称
     * @param {Object} data 例如：{ RecipeId:1,RecipeName:'John' } 种类型的数据, 对应的是数据表表中字段名和字段值
     * @param {Function} cb 回调函数
     */
    add(tableName, data, cb) {
        let keywords = Object.keys(data);
        let vals = Object.values(data);
        let questions = Object.keys(data).map(function () {
            return '?'
        });
        keywords = keywords.join(', ');
        questions = questions.join(',');
        const sql = `insert into ${tableName} (${keywords}) values(${questions})`;
        con.query(sql, vals, cb);
    },
    remove(tableName, where, cb) {
        let sql = '';
        let newWhere = []
        if (where) {
            Object.keys(where).forEach(function (key) {
                newWhere.push(`${key}="${where[key]}"`)
            })
            newWhere = ' where ' + newWhere.join(' and ')
        }
        sql = `delete from ${tableName}${newWhere}`
        con.query(sql, [], cb);
    },
    /**
     * 
     * 获取喜欢的列表
     * @param {Number} UserID 
     * @param {Function} cb 
     */
    getFavourite(UserID, cb) {
        let where = ''
        if (UserID) {
            where = ` where u.UserID = ${UserID}`
        }
        let sql = `
            select c.UserID, c.RecipeId, c.AddTime, r.RecipeName, r.RecipePicture, r.RecipeTime,r.RecipeCategory from love c 
            left join user u on u.UserID = c.UserID 
            left join recipe r on r.RecipeId = c.RecipeId${where} 
            `;
        con.query(sql, [], cb);
    }
}


