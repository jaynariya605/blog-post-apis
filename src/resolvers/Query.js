const { GraphQLError } = require('graphql')
const{ getUserId } = require('../utils/getUserId')

const Query = {
    users: async (parent, args, {prisma}, info)=>{
        const users = await prisma.user.findMany({
        }).catch((e)=>{
            return Promise.reject(new GraphQLError(e))
        })
        return users
    },
    posts: async (parent, {query, skip, take},{prisma}, info)=>{
        const posts = await prisma.post.findMany({
            take,
            skip,
            where:{
                
                AND:[{
                    published: true
                },{
                    OR:[{
                        title:{
                            contains:query
                        }
                    },{
                        body:{
                            contains:query
                        }
                    }]
                }]
                
            }
        }).catch((e)=>{
            throw new Error(e)
        })
        return posts
    },
    comments: async (parent, args, {prisma}, info)=> {
        const comments = await prisma.comment.findMany({
        }).catch((e)=>{
            return Promise.reject(new GraphQLError(e))
        })
        return comments
    },
    post:async (parent, {id}, {prisma, request})=>{
        const authorId = getUserId(request, false)
        const posts = await prisma.post.findUnique({
            where:{
                id,
                OR: [{
                    published:true
                },{
                    authorId
                }]
            },
        }).catch((e)=>{
            return Promise.reject(new GraphQLError(e))
        })
        
        return posts
    },
    me: async (parent, {id}, {prisma, request})=>{
        const userId = getUserId(request)
        return await prisma.user.findUnique({
            where:{
                id: userId
            }
        }).catch((e)=>{
            return Promise.reject(new GraphQLError('User Not Found!!'))
        })
    },
    myPosts: async (parent, {query}, {prisma, request, pubsub})=>{
        const authorId = getUserId(request)
        return await prisma.post.findMany({
            where:{
                AND:[{
                    authorId
                },{
                    OR:[{
                        title:{
                            contains:query
                        }
                    },{
                        body:{
                            contains:query
                        }
                    }]
                }]
            }
        }).then((post)=>{
            pubsub.publish(`myPost ${post.authorId}`,{
                myPost: post
            })
            return post
        }).catch((e)=>{
            return Promise.reject(new GraphQLError('Unable to fetch posts'))
        })
    }
}

module.exports = Query