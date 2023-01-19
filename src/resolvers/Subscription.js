const { GraphQLError, graphql, subscribe } = require('graphql')
const{ getUserId } = require('../utils/getUserId')

const Subscription = {
    comment: {
        subscribe: async (parent, {postId}, { prisma, pubsub }, info )=>{
            return await prisma.post.findUnique({
                where: {
                    id: postId
                }
            }).then(()=>{
                return pubsub.subscribe(`comment ${postId}`)
            }).catch((e)=>{
                return Promise.reject(new GraphQLError(e))
            })
            

            
        }
    },

    post: {
        subscribe:  async (parent, args, { db, pubsub }, info)=>{
            return await pubsub.subscribe('post')
        }
    },

    myPost: {
        subscribe: async (parent, args, { prisma, pubsub, request }, info)=>{
            const authorId = getUserId(request)
            if(authorId){
                return await pubsub.subscribe(`myPost ${authorId}`)
            }
            return Promise.reject(new GraphQLError('Not Subscribed')) 
        }
    }
}

module.exports = Subscription