const router = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../utils/middleware').userExtractor

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    .populate('likedBy', { username: 1, name: 1 }) // added populate for likedBy field


  response.json(blogs)
})

router.post('/', userExtractor, async (request, response) => {
  const blog = new Blog(request.body)

  const user = request.user

  if (!user ) {
    return response.status(403).json({ error: 'user missing' })
  }

  if (!blog.title || !blog.url ) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  blog.likes = blog.likes | 0
  blog.user = user
  user.blogs = user.blogs.concat(blog._id)

  await user.save()

  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

router.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(204).end()
  }

  if ( user.id.toString() !== blog.user.toString() ) {
    return response.status(403).json({ error: 'user not authorized' })
  }

  await blog.deleteOne()

  user.blogs = user.blogs.filter(b => b._id.toString() !== blog._id.toString())

  await user.save()

  response.status(204).end()
})

// updated this for the like button functionality to work
// also added a check to ensure a blog can only be liked once by a user
router.put('/:id', userExtractor, async (request, response) => {
  const { id } = request.params // blog id
  const user = request.user
  const updatedFields = request.body

  // use Blog.findById and Blog.save instead of
  // Blog.findByIdAndUpdate bc it's more flexible
  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  // if this is a like request we need to...
  // add user to the likedBy list of the blog
  // and add blog to likedBlogs list of user
  if (request.body.likes === blog.likes + 1) {
    if (blog.likedBy.includes(user.id)) {
      return response.status(400).json({ error: 'User has already liked this blog' })
    }

    // we could increment blog.likes here but we don't
    // so a put request can change more attributes besides likes

    blog.likedBy.push(user.id)
    user.likedBlogs.push(blog._id)

    await user.save()
  }

  // only update the fields that are in the request body
  // user and likedBy arrays can't be modified directly,
  // only indirectly by creating or liking a blog
  // so they are skipped in the for each loop
  Object.keys(updatedFields).forEach(key => {
    if (key !== 'user' && key !== 'likedBy') {
      blog[key] = updatedFields[key]
    }
  })

  // save updated blog to backend
  const updatedBlog = await blog.save()

  // updatedBlog object in response
  response.json(updatedBlog)
})

module.exports = router