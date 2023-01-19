const { GraphQLError, graphql } = require('graphql')

const Comment = {
    author:  (parent, args, { prisma } , info)=>{
        return prisma.user.findUnique({
            where:{ id: parent.authorId },
        }).then((author)=>{
            return author
        }).catch((e)=>{
            return Promise.reject(new GraphQLError(e))
        })
        
        
    },
    post:async (parent, args, {prisma}, info)=> {
        return await prisma.post.findUnique({
            where: {
                id : parent.postId,
               published:true 
            }
        }).then((post)=>{
            return post
        }).catch((e)=>{
            return Promise.reject(new GraphQLError(e))
        })

    }
}

module.exports = Comment