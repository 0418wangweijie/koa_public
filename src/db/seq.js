const {Sequelize} = require('sequelize')
const {MYSQL_USER, MYSQL_PWD, MYSQL_DB, MYSQL_HOST} = require('../config/config.default')

const sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
    host: MYSQL_HOST,
    dialect: 'mysql'
})

sequelize.authenticate().then(res=>{
    console.log('连接成功')
}).catch(error=>{
    console.log(error,'连接失败')
})
module.exports = sequelize
