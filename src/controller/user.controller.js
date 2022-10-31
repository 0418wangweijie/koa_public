const {createUser} = require('../service/user.service')

class UserController {
    async register(ctx, next) {
        // 获取数据
        console.log(ctx.request.body)
        // 操作数据库
        const {user_name, password} = ctx.request.body
        const res = await createUser(user_name, password)
        console.log(res)
        // 返回结果
        ctx.body = '用户注册'
    }

    async login(ctx, next) {
        ctx.body = '登录'
    }
}

module.exports = new UserController()
