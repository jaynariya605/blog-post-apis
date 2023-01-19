const { getUserId } = require('../utils/getUserId')

const User = {
    email:(parent, args, {request}, info)=>{
        const userId = getUserId(request, false)
        if(userId && userId === parent.id){
            return parent.email
        } else {
            return null
        }
    },
    posts: async (parent, args, {prisma, request}, info)=>{
        const userId = getUserId(request, false)
        return await prisma.post.findMany({
            where:{
                authorId: parent.id,
                OR: [{
                    published: true
                },{
                    authorId: userId
                }]
            }
        }).catch((e)=>{
            return Promise.reject(new Error('Erroe in fetching posts of post'))
        })
    },
    comments: async (parent, args, {prisma}, info)=>{
        return await prisma.comment.findMany({
            where:{authorId: parent.id}
        }).catch((e)=>{
            return Promise.reject(new Error('Erroe in fetching comments of post'))
        })
    }
}

module.exports = User