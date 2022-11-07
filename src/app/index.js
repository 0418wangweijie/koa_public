const Koa = require('koa')
const {koaBody} = require('koa-body')
const jwt = require('koa-jwt')

const userRouter = require('../router/user.router')
const http = require("../http/status");
const {ErrorToken} = require("../response/code.response");

const app = new Koa()

app.use(async (ctx, next) => {
    await next().catch(async (err)=>{
        if(err.status == '401'){
            ctx.status = http.STATUSOK;
            ctx.body =  await ErrorToken()
        }else {
            console.log("????????????")
            throw err;
        }
    })
})

app.use(jwt({secret:process.env.JWT_SECRET}).unless({
    path:[/^\/users\/login/]
}))

app.use(koaBody())
app.use(userRouter.routes())

module.exports = app
