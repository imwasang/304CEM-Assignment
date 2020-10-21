module.exports = [
    `
    CREATE TABLE IF NOT EXISTS love (
        UserId int(11) NOT NULL,
        RecipeId int(11) NOT NULL,
        AddTime varchar(50) NOT NULL
      )
    `,
    `
    CREATE TABLE IF NOT EXISTS recipe (
        RecipeId int(11) NOT NULL AUTO_INCREMENT,
        RecipeName varchar(100) NOT NULL,
        RecipePicture varchar(100) NOT NULL,
        RecipeMater varchar(100) DEFAULT NULL,
        RecipeStep text NOT NULL,
        RecipeTime varchar(100) NOT NULL,
        RecipeCategory varchar(100) NOT NULL,
        PRIMARY KEY (RecipeId)
      )
    `,

    `
    CREATE TABLE IF NOT EXISTS user (
        UserID int(11) NOT NULL AUTO_INCREMENT,
        UserName varchar(12) NOT NULL,
        Email varchar(50) NOT NULL,
        Password varchar(12) NOT NULL,
        Admin int(1) NOT NULL DEFAULT '0',
        PRIMARY KEY (UserID)
      )
    `,
    `
    INSERT INTO user (UserID, UserName, Password,Email,Admin) VALUES
        (1, 'admin', 'admin', 'admin@qq.com', 1)
    `
]