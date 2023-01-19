const Post= {
    author: async (parent, args, {prisma}, info)=>{
        return await prisma.user.findUnique({
            where: {id: parent.authorId}
        }).catch((e)=>{
            return Promise.reject(new Error('Error in fetching user'))
        })
    },
    comments: async (parent, args, {prisma}, info)=>{
        return await prisma.comment.findMany({
            where:{
                postId: parent.id
            }
        }).catch((e)=>{
            return Promise.reject(new Error('Error in fetching comments of post'))
        })
    }
}

module.exports = Post