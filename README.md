# koa_public

# 项目初始化

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

# 项目搭建

### 安装koa框架

```init
yarn add koa
```

### 编写最基本的app

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

# 项目的基本优化

## 项目自启服务

### 安装自启工具

```puml
yarn add nodemon
```

### 编写package.json脚本

```json
"scripts": {
    "dev": "nodemon ./src/main.js"
  },
```

## 读取配置文件

- 安装``dotenv``,读取根目录中的.env文件，将配置写入process.env中

```puml
yarn add dotenv
```

- 创建.env文件

```puml
APP_PORT = 8000
```

- 创建src/config/config.default.js

```js
const dotenv = require('dotenv')

dotenv.config()

module.exports = process.env
```

- 改写main.js文件

```js
app.listen(APP_PORT, () => {
    console.log(`service is running on http://localhost:${APP_PORT}`)
})
```

# 添加路由

- 安装koa-router

```puml
yarn add koa-router
```

步骤：

- 导入包
- 实例化对象
- 编写路由
- 注册中间件

# 项目结构优化

- 将http服务和app业务拆分
- 将路由和控制器拆分

改写```user.route.js```

```js
const Router = require('koa-router')

const {register, login} = require('../controller/user.controller')
// prefix --前缀，也是同类路由的起始
const router = new Router({prefix: '/users'})
//注册
router.post('/register', register)
//登录
router.post('/login', login)

module.exports = router
```

# 解析body

- 安装koa-body

```puml
yarn add koa-body
```

- 注册中间件 改写app/index.js

```js
const {koaBody} = require('koa-body')
app.use(koaBody())
```

- 改写cotroller ``user.controller.js``

```js
async
register(ctx, next)
{
    // 获取数据
    console.log(ctx.request.body)
    // 操作数据库
    const {user_name, password} = ctx.request.body
    const res = await createUser(user_name, password)
    console.log(res)
    // 返回结果
    ctx.body = '用户注册'
}
```
- 拆分service层
    创建service文件夹
```js
class UserService {
    async createUser(user_name, password) {
        //    todo 写入数据库
        return '写入数据库'
    }
}

module.exports = new UserService()
```

