const bcrypt = require('bcryptjs')

const hashPassword = async (password) => {
    if(password.length < 8){
        return Promise.reject(new GraphQLError('Password should be atleast 8 character long'))
    }
    
    return  await bcrypt.hash(password, 10)
}

module.exports = {
    hashPassword
}