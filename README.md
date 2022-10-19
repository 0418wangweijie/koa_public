# koa_public

## 项目初始化 
```init
yarn init -y
```
生成`package.json`
- 记录项目的依赖
## git初始化
```init
git init
```
生成`gitignore`文件

## 项目搭建
###安装koa框架
```init
yarn add koa
```
###编写最基本的app
```js
const koa = require('koa')

const app = new koa()

app.use(async (ctx,next)=>{
    ctx.body = 'hello api'
})

app.listen(3000,()=>{
    console.log('service is running on http://localhost:3000')
})
```
## 测试
```puml
node ./main.js
```

