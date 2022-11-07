const jwt = require('jsonwebtoken')

const {createUser,updateById,getUserInfo} = require('../service/user.service')
const http = require('../http/status')
const {SuccessResponse, ErrorResponse} = require('../response/code.response')

class UserController {
    async register(ctx, next) {
        // 获取数据
        // 操作数据库
        const {user_name, password} = ctx.request.body

        try {
            const response = await createUser(user_name, password)
            const data = {
                id: response.dataValues.id,
                user_name: response.dataValues.user_name,
            }
            // 返回结果
            ctx.status = http.STATUSOK
            ctx.body = await SuccessResponse(data)
        } catch (error) {
            console.error("注册失败：", error)
            ctx.body = await ErrorResponse("注册失败")
        }
    }

    // async
    async login(ctx, next) {
        const {user_name} = ctx.request.body
        //   1.获取用户信息（在tocken的palylaod中，记录ID，user_name,is_admin）
        try {
            // 踢出password将其他数据放到一个对象中
            const {password, ...res} = await getUserInfo({user_name})
            console.log('查看返回数据',res.dataValues.id)
            ctx.state.id = res.dataValues.id
            ctx.body = {
                code: 10000,
                message: '登录成功',
                result: {
                    token: jwt.sign(res, process.env.JWT_SECRET, {expiresIn: '1d'})
                }
            }

        } catch (error) {
            console.error('用户登录失败')
        }
    }

    // 修改信息
    async changeInformation(ctx, next) {
        console.log(ctx.state.user.dataValues,ctx.state.user.dataValues.id)
        // 获取数据
        try {
            const id = ctx.state.user.dataValues.id
            const {password} = ctx.request.body
            const response = await updateById({id, password})
            // 由于原sql inster和update没有返回值，这里返回了数组，为成功
            if(response?.length > 0) {
                // 返回结果
                ctx.status = http.STATUSOK
                ctx.body = await SuccessResponse()
            }
        } catch (error) {
            console.error("更新失败：", error)
            ctx.body =  await ErrorResponse("更新失败")
        }
    }
}

module.exports = new UserController()
