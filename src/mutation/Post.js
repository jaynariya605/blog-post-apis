const { GraphQLError } = require('graphql')
const{ getUserId } = require('../utils/getUserId')


const createPost = async (parent,{ data }, {prisma, pubsub, request}, info)=>{
    const authorId = getUserId(request)
    return await prisma.post.create({
        data:{
            ...data,
            authorId
        },
        include:{
            author:true,
            comments:true
        }
    }).then((post)=>{
        if(data.published){
            pubsub.publish('post',{ 
                post: {
                    mutation:'CREATED',
                    data: post
                }
             })
        }
        return post
    }).catch((e)=>{
        if(e.code = 'P2003'){
            return Promise.reject(new GraphQLError(`${e.meta.field_name} User Not exists `))
        }
        return Promise.reject(new GraphQLError(`Unknown Error creating post ${e}`))
    })
    
    
}

const updatePost = async (parent, { id, data }, {prisma, pubsub, request})=>{
    const authorId = getUserId(request)

    const originalPost = await prisma.post.findUnique({
        where:{
            id,
            authorId
        }
    }).catch((e)=>{
        return Promise.reject(new GraphQLError('Post Does not exists'))
    })
    
   const post =  await prisma.post.update({
        where:{
            id,
            authorId
        },
        data
    }).then((post)=>{
        if(originalPost.published && !post.published) {
            
            pubsub.publish('post',{
                post:{
                    mutation: 'DELETED',
                    data: originalPost
                }
            })
        }else if (!originalPost.published && post.published){
            pubsub.publish('post',{
                post:{
                    mutation: 'CREATED',
                    data: post
                }
    
            })
            
        }else if(post.published){
            pubsub.publish('post',{
                post:{
                mutation:'UPDATED',
                data: post
            }
            })
        }
        

        return post
    }).catch((e)=>{
        return Promise.reject(new GraphQLError('Post Does not exists'))
    })

    if(originalPost.published && !post.published){
        await prisma.comment.deleteMany({
            where:{
                postId:post.id
            }
    })}

    return post

    
    
  

}

const deletePost = async (parent, {id}, {prisma, pubsub, request})=>{
    const authorId = getUserId(request)
    const deletedPost = await prisma.post.delete({
        where:{
            id,
            authorId
        }
    }).catch((e)=>{
        return Promise.reject(new GraphQLError(e.meta.cause || 'Unable to delete post'))
    })


    if(deletedPost.published){
        pubsub.publish('post',{ 
            post: {
                mutation:'DELETED',
                data: deletedPost
            }
         })
    }

    return deletedPost

}

module.exports =  {
    createPost,
    updatePost,
    deletePost
}