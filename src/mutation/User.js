const { GraphQLError } = require('graphql')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../utils/generateToken')
const { getUserId } = require('../utils/getUserId')
const { hashPassword } = require('../utils/hashPassword')


const createUser = async (parent, {data}, { prisma }, info)=>{
    
    const password = await hashPassword(data.password)
    const user = await prisma.user.create({
        data:{
            ...data,
            password
        }
    }).catch((e)=>{
        if(e.code = 'P2002'){
            return Promise.reject(new GraphQLError(`${e.meta.target[0]} should be unique field`))
        }
        return Promise.reject(new GraphQLError(`Unknow error creating user ${e}`))
        
    })
    return {
        user,
        token: generateToken(user.id)
    }

}

const deleteUser = async (parent, args, {prisma, request})=>{
    const userId = getUserId(request)
    const deletedUser = await prisma.user.delete({
        where:{
            id: userId
        }
    }).catch((e)=>{
        return Promise.reject(new GraphQLError('User Dose Not Exists'))
    })
    return deletedUser
}


const updateUser = async (parent, {id, data}, {prisma, request}, info)=>{
    const userId = getUserId(request)

    if(typeof data.password === 'string') {
        data.password = await hashPassword(data.password)
    }

    const user = await prisma.user.update({
        where:{
            id: userId
        },
        data
    }).catch((e)=>{
        return Promise.reject(new GraphQLError("No user Found"))
    })

    return user

}

const loginUser = async(parent, {email, password},{prisma},info)=>{
    if(password.length <8){
        return Promise.reject(new GraphQLError('Password should be atleast 8 character Long'))
    }
    return await prisma.user.findUnique({
        where:{
            email
        }
    }).then(async (user)=>{
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return Promise.reject(new GraphQLError('Password'))
        }
        return {
            user,
            token: generateToken(user.id)
        }
    }).catch((e)=>{
        
        if(e.message ==='Password'){
            return Promise.reject(new GraphQLError('Password is invalid'))
        }
        return Promise.reject(new GraphQLError('User Not Found'))
    })
}



module.exports ={
    createUser,
    deleteUser,
    updateUser,
    loginUser
}