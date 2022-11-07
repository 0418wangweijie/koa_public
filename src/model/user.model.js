const {DataType, DataTypes} = require('sequelize')

const sequelize = require('../db/seq')

// 创建模型 对应数据表 js_users
const User = sequelize.define('user', {
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        commit: '用户名，唯一'
    },
    password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        commit: '密码'
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        commit: '是否是管理员，1是，0不是'
    }
}, {
    tableName: 'user',
    // 是否生成时间戳
    // timestamps: false
})
// 创建表   force 强制同步数据库
// User.sync({force: true})
module.exports = User
