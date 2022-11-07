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

app.use(async (ctx, next) => {
    ctx.body = 'hello api'
})

app.listen(3000, () => {
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
{
  "scripts": {
    "dev": "nodemon ./src/main.js"
  }
}
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

- 拆分service层 创建service文件夹

```js
class UserService {
    async createUser(user_name, password) {
        //    todo 写入数据库
        return '写入数据库'
    }
}

module.exports = new UserService()
```

# 数据库操作

- sequelize ORM``对象关系映射`` 数据库

```http request
https://www.sequelize.cn/
```

ORM：对象关系映射 - 数据表映射一个类 - 数据表中的数据行（记录）对应一个对象 - 数据表的字段对应对象的属性 - 数据表的操作对应对象的方法

- 安装sequelize

```puml
yarn add sequelize
yarn add mysql2
```

- 连接数据库
  ``src/db/seq.js``

```js
const {Sequelize} = require('sequelize')
const {MYSQL_ROPT, MYSQL_USER, MYSQL_PWD, MYSQL_DB, MYSQL_HOST} = require('../config/config.default')

const sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
    host: MYSQL_HOST,
    dialect: 'mysql'
})

module.exports = sequelize
```

- 编写配置文件

```puml
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PWD=wang0418
MYSQL_DB=koa-js
```

# 创建表

- sequence 主要通过Model对应数据表 创建src/model/user.model.js

```js
const {DataType, DataTypes} = require('sequelize')

const sequelize = require('../db/seq')

// 创建模型 对应数据表 js_users
const User = sequelize.define('user', {
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        commit: '用户名，唯一'
    },
    password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        commit: '密码'
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        commit: '是否是管理员，1是，0不是'
    }
}, {
    tableName: 'user',
    // 是否生成时间戳
    // timestamps: false
})
// 创建表   force 强制同步数据库
// User.sync({force: true})
```

# 创建数据

- 在service层添加创建用户数据操作

```js
 async
createUser(user_name, password)
{
    console.log(user_name, password)
    // todo 写入数据库
    // await 表达式： promise对象的值
    // const response = await User.create({user_name, password})
    return await User.create({user_name, password})
}
```

# 错误处理

- code码规范统一，创建``code.response.js``做code统一管理和数据返回

```js
const SuccessResponse = {code: 10000, message: '请求成功'}
ErrorResponse = {code: 10001, message: '请求失败'}
ErrorConflictResponse = {code: 10002, message: '存在冲突'}

class Response {
    async SuccessResponse(data) {
        let response = SuccessResponse
        response.data = data
        return response
    }

    async ErrorResponse(message) {
        let response = ErrorResponse
        response.message = message || ErrorResponse.message
        return response
    }

    async ErrorConflictResponse(message) {
        let response = ErrorResponse
        response.message = message || ErrorResponse.message
        return response
    }
}

module.exports = new Response()
```

- 在http请求码做统一处理在 ``http/status.js``

```js
const http = {
    STATUSOK: 200,

    STATUSBADREQUEST: 400,
    STATUSFORBIDDEN: 403,
    STATUSCONFLICT: 409,

    STATUSINTERNALSERVERERROR: 500
}
module.exports = http
```

- 错误逻辑处理需要再``controller``层进行处理

```js
if (!user_name || !password) {
    console.error('用户名或密码为空：', ctx.request.body)
    ctx.status = http.STATUSBADREQUEST
    ctx.body = await ErrorResponse('密码或用户名为空')
    return
}
if (getUserInfo({user_name})) {
    ctx.status = http.STATUSCONFLICT
    ctx.body = await ErrorConflictResponse('用户已存在')
    return
}
```
# 拆分中间件
# 用户登录
- 登录用户查询
- 登录用户密码校验
# 用户认证
jwt：jsonwebtoken
