
const users = [{
    id:'1',
    name:'Jay',
    email:'jaynariya@example.com',
    age: 24
},{
    id:'2',
    name:'sarah',
    email:'sarah@example.com'
},{
    id:'3',
    name:'Anna',
    email:'anna@example.com'
 }]

 const posts = [{
    id:'1',
    title: 'POst1',
    body: 'post2 body',
    published: true,
    author: '2'
 },{
    id:'2',
    title: 'POst2',
    body: 'post3 body',
    published: true,
    author:'1'
 },{
    id:'3',
    title: 'POst3',
    body: 'post1 body',
    published: false,
    author: '1'
 }]

 const comments = [{
    id:'1',
    text: 'There it is man',
    author: '1',
    post:'1'
 },{
    id:'2',
    text: 'Yeah',
    author:'2',
    post:'1'
 },{
    id:'3',
    text:'I adde new post',
    author:'1',
    post:'2'
 },{
    id:'4',
    text:'There you go buddy',
    author:'2',
    post:'2'
 }]

 const db = {
    users,
    posts,
    comments
 }

 module.exports = db