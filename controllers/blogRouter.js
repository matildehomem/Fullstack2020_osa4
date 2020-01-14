const blogRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')

// Base url is set to /api/blogs
blogRouter.get('/', async (req, res) => {
    const blogs = await Blog
        .find({}).populate('user')
    res.json(blogs.map(b => b.toJSON()))
})

blogRouter.put('/:id', async (req, res, next) => {
    // TODO Update
    const body = req.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.userId
    }
    try {
        updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {new:true})
        res.json(updatedBlog.toJSON())

    } catch (exception) {
        next(exception)
    }
})

blogRouter.post('/', async (req, res, next) => {
    const body = req.body
    const user = await User.findById(body.userId)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    if(blog.likes === undefined) {
        blog.likes = 0
    }

    if(blog.title === undefined || blog.url === undefined) {
        res.status(400).end()
    }

    try {
        savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        res.json(savedBlog.toJSON())

    } catch (exception) {
        next(exception)
    }
})

blogRouter.delete('/:id', async (req, res, next) => {
    try {
        // TODO ADD USER CHECK 4.21
        await Blog.findByIdAndRemove(req.params.id)
        res.status(204).end()

    } catch (exception) {
        next(exception)
    }
})

module.exports = blogRouter