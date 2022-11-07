const jwt = require('jsonwebtoken')

const {ErrorTokenExpired, ErrorToken,ErrorInternalServer} = require('../response/code.response')
const http = require("../http/status");
const {decode} = require("jsonwebtoken");

const auth = async (ctx, next) => {
    const {authorization} = ctx.request.header
    const token = authorization.replace('Bearer ', '')
    try {
        // user中包含了payload的信息(id,user_name,is_admin)
        const user = await jwt.verify(token, process.env.JWT_SECRET).catch(err=>{
            console.error("new",err)
        })
        console.log(user)
        ctx.state.user = user
    } catch (error) {
        console.error("token解析错误:",error)
        switch (error.name) {
            case 'TokenExpiredError':
                console.error("token过期：", error)
                ctx.status = http.STATUSFORBIDDEN
                return await ErrorTokenExpired()
            case 'JsonWebTokenError':
                console.error("token错误：", error)
                ctx.status = http.STATUSFORBIDDEN
                return await ErrorToken()
            default:
                console.error("token解析错误:",error)
                ctx.status = http.STATUSFORBIDDEN
                return await ErrorInternalServer()
        }
        console.error("解析token出错：", error)
        ctx.status = http.STATUSFORBIDDEN
        return await ErrorInternalServer()

    }
    await next()
}

module.exports = {
    auth
}
