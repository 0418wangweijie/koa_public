const User = require('../model/user.model')
const {where, QueryTypes} = require("sequelize");

/*
* 用户处理
* */
class UserService {
    // 创建用户
    async createUser(user_name, password) {
        console.log(user_name, password)
        // todo 写入数据库
        // await 表达式： promise对象的值
        // const response = await User.create({user_name, password})
        return await User.create({user_name, password})
    }

    // 查询用户
    async getUserInfo({id, user_name, is_admin}) {
        const whereOpt = {}

        id && Object.assign(whereOpt, {id})
        user_name && Object.assign(whereOpt, {user_name})
        is_admin && Object.assign(whereOpt, {is_admin})

        return await User.findOne({
            attributes: ['id', 'user_name', 'password', 'is_admin'],
            where: whereOpt
        })
    }

    // 修改信息
    async updateById({id, user_name, password, is_admin}) {

        return await User.sequelize.query('UPDATE `user` SET password=? WHERE id=?', {
            type: QueryTypes.UPDATE,
            replacements: [password,id],
            raw: true
        })
    }
}

module.exports = new UserService()
