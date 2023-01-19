const { createUser, deleteUser, updateUser,loginUser } = require('../mutation/User')
const { createPost, updatePost, deletePost } = require('../mutation/Post');
const { createComment, deleteComment } = require('../mutation/Comment')

const Mutation = {
    createUser ,
    deleteUser,
    updateUser ,
    loginUser,
    createPost ,
    updatePost ,
    deletePost ,
    createComment ,
    deleteComment
}

module.exports = Mutation