const jwt = require('jsonwebtoken')

const generateToken= (id) => {
    return jwt.sign({userId: id}, process.env.SECRATE, { expiresIn: '7 days' })
}
module.exports = { 
    generateToken
}