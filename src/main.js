const koa = require('koa')

const app = new koa()

app.use(async (ctx,next)=>{
    ctx.body = 'hello api'
})

app.listen(3000,()=>{
    console.log('service is running on http://localhost:3000')
})
