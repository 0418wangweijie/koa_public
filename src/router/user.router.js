const Router = require('koa-router')

const {register, login} = require('../controller/user.controller')
// prefix --前缀，也是同类路由的起始
const router = new Router({prefix: '/users'})
//注册
router.post('/register', register)
//登录
router.post('/login', login)

module.exports = router
