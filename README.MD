### 运行步骤
1. 开启Mysql数据库
2. 运行
```bash
$ npm install
$ node app.js
```

### 目录结构
controller ==> 操作数据库的文件

routes ==> 路由控制

data ==> Recipe数据表的数据

config.json ==> 首次使用的配置文件
```js
{
    // 数据库如果没有创建就设置false，true就表示已经创建
    "init": false,
    // 数据库配置 database里的database不写
    "database": {
        "host": "localhost",
        "user": "root",
        "port": 3306,
        "password": "",
        "database": ""
    }
}
```

sql.js ==> 创建数据表和创建admin用户的sql语句

public ==> 前端静态文件

public/image copy ==> 图片备份

### 后端api地址
|  作用  | url | method | 
|---|---|---|---|---|
|  获取全部食谱列表     | /api/recipe | GET | 
|  添加单个食谱     | /api/recipe | POST | 
|  修改单个食谱     | /api/recipe | PUT | 
|  删除单个食谱     | /api/recipe/:RecipeId | DELETE |
|  获取单个食谱详细信息     | /api/recipe/:RecipeId | GET | 
|  获取用户喜欢的食谱     | /api/love/:UserID | GET |
|  删除用户喜欢的食谱其中一个     | /api/love/:UserId/:RecipeId | DELETE | 
|  注册     | /api/user/register | POST | 
|  登录    | /api/user/login | POST | 
|  验证是否登录     | /api/user/validate | GET |
|  登出     | /api/user/logout | GET | 