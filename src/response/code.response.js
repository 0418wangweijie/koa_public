const
    SuccessResponse = {code: 10000, message: '请求成功'},
    ErrorResponse = {code: 10001, message: '请求失败'},
    ErrorConflictResponse = {code: 10002, message: '存在冲突'},
    ErrorInternalServer = {code: 10003, message: '系统错误'},

    ErrorTokenExpired = {code: 10101, message: 'token已过期'},
    ErrorToken = {code: 10102, message: '无效token'}

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
        let response = ErrorConflictResponse
        response.message = message || ErrorConflictResponse.message
        return response
    }

    async ErrorInternalServer(message) {
        let response = ErrorInternalServer
        response.message = message || ErrorInternalServer.message
        return response
    }

    async ErrorTokenExpired() {
        return ErrorTokenExpired
    }

    async ErrorToken() {
        return ErrorToken
    }
}

module.exports = new Response()
