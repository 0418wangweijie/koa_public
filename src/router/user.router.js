const Router = require('koa-router')

const {userValidator, conflictValidator, encryptPassword, verifyLogin} = require('../middleware/user.middleware')
const {auth} = require('../middleware/auth.middleware')
const {register, login,changeInformation} = require('../controller/user.controller')
// prefix --前缀，也是同类路由的起始
const router = new Router({prefix: '/users'})
//注册
router.post('/register', userValidator, conflictValidator, encryptPassword, register)
//登录
router.post('/login', userValidator, verifyLogin, login)
// 修改密码接口
router.patch('/information',encryptPassword, changeInformation)

module.exports = router
