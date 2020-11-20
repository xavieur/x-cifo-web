const express = require('express')

require('../db/mongoose')
const Blog = require('../models/blog') // optional
const blogRouter = require('../routers/blog')

const port = process.env.PORT

// express app
const app = express()

// listen for requests
app.listen(port, () => {
  console.log(`Server listening to port ${port}`)
})

// register view engine
app.set('view engine', 'ejs')

// middleware & static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// web server
app.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({})
        res.render('index', { title: 'Blog', blogs });
    } catch (error) {
        res.render('index', {title: 'Blog', blogs: []})
    }
})

app.get('/blog-create', (req, res) => {
  res.render('blog-create', { title: 'Blog' });
});

// api's
app.use(express.json())
app.use('/api', blogRouter)

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' })
})