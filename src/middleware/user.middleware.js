const bcrypt = require('bcryptjs');

const http = require("../http/status");
const {ErrorResponse, ErrorConflictResponse, ErrorInternalServer} = require("../response/code.response");
const {getUserInfo} = require("../service/user.service");

// 用户名、密码为空校验
const userValidator = async (ctx, next) => {
    const {user_name, password} = ctx.request.body

    if (!user_name || !password) {
        console.error('用户名或密码为空：', ctx.request.body)
        ctx.status = http.STATUSBADREQUEST
        ctx.body = await ErrorResponse('密码或用户名为空')
        return
    }
    await next()
}
// 用户重复校验
const conflictValidator = async (ctx, next) => {
    const {user_name} = ctx.request.body

    // if(await getUserInfo({user_name})){
    //     ctx.status = http.STATUSCONFLICT
    //     ctx.body = await ErrorConflictResponse('用户已存在')
    //     return
    // }
    try {
        const res = await getUserInfo({user_name})
        if (res) {
            console.error("用户已经存在：", user_name)
            ctx.status = http.STATUSCONFLICT
            ctx.body = await ErrorConflictResponse('用户已存在')
            return
        }
    } catch (error) {
        console.error("用户注册失败：", error)
        ctx.status = http.STATUSINTERNALSERVERERROR
        ctx.body = await ErrorInternalServer('用户注册失败')
    }
    await next()
}

// 密码加密
const encryptPassword = async (ctx, next) => {
    const {password} = ctx.request.body
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        ctx.request.body.password = hash
        await next()
    } catch (error) {
        console.error('密码加密失败：', error)
        return
    }
}

// 登录校验用户是否存在
const verifyLogin = async (ctx,next)=>{
    const {user_name,password} = ctx.request.body
    try {
        const res = await getUserInfo({user_name})
        if (!res) {
            console.error("用户不存在：", user_name)
            ctx.status = http.STATUSFORBIDDEN
            ctx.body = await ErrorResponse('用户不存在')
            return
        }
        if(!bcrypt.compareSync(password,res.password)){
            console.error("密码不匹配：", user_name)
            ctx.status = http.STATUSFORBIDDEN
            ctx.body = await ErrorResponse('密码不匹配')
            return
        }
    } catch (error) {
        console.error("用户登录失败：", error)
        ctx.status = http.STATUSINTERNALSERVERERROR
        ctx.body = await ErrorInternalServer('用户登录失败')
        return
    }
    await next()
}

module.exports = {
    userValidator,
    conflictValidator,
    encryptPassword,
    verifyLogin
}
