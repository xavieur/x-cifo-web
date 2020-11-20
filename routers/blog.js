const express = require('express')
const router = new express.Router()
const Blog = require('../models/blog')

router.post('/blogs', async (req, res) => {
    const blog = new Blog(req.body)

    try {
        await blog.save()
        res.redirect('/')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find({})
        res.send(blogs)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/blogs/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const blog = await Blog.findById(_id)

        if (!blog) {
            return res.status(404).send()
        }

        res.send(blog)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/blogs/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'snippet', 'body']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!blog) {
            return res.status(404).send()
        }

        res.send(blog)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id)

        if (!blog) {
            res.status(404).send()
        }

        res.send(blog)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router