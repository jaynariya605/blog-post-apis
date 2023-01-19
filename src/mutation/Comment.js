const { GraphQLError } = require('graphql')
const{ getUserId } = require('../utils/getUserId')

const createComment = async (paren,{data}, {prisma, pubsub, request}, info)=>{
    const authorId = getUserId(request)
    await prisma.post.findUnique({
        where:{
            id:data.postId
        }
    }).then((post)=>{
        if(!post.published){
            return Promise.reject(new GraphQLError('Post is not Found'))
        }
       
    })
   
    return await prisma.comment.create({
        data:{
            ...data,
            authorId
        }
    }).then((comment)=>{
        pubsub.publish(`comment ${data.postId}`, { 
            comment:{
                mutation:'CREATED',
                data: comment
            } 
        })
        return comment
    }).catch((e)=>{
        if(e.code = 'P2003'){
            return Promise.reject(new GraphQLError(`Post or User not exists `))
        }
        return Promise.reject(new GraphQLError(e))
    })
   
    
}

const deleteComment = async (parent, { id }, {prisma, pubsub, request})=>{
    const authorId = getUserId(request)
    return await prisma.comment.delete({
        where:{
            id,
            authorId
        }
    }).then((comment)=>{
        pubsub.publish(`comment ${comment.postId}`, { 
            comment:{
                mutation:'DELETED',
                data: comment
            } 
        })
        return comment
    }).catch((e)=>{
        return Promise.reject(new GraphQLError(e.meta.cause || 'unable to delete comment'))
    })

}


module.exports = {
    createComment,
    deleteComment
}