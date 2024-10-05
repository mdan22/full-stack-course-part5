import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  
  // add state for username and password
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // add state for error message and success
  const [errorMessage, setErrorMessage] = useState(null)
  const [success, setSuccess] = useState(false)

  // effect hooks should be put at beginning lol
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  // add effect hook for checking local storage of browser for user data
  // and set user to logged in state if data was found 
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // outsource logout form
  // simple - it's just a logout button
  const logoutForm = () => {
    return (
    <button className='button' onClick={handleLogout}>logout</button>
  )}

  // outsource blog list
  const blogList = () => {
    return (
      <div>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            // use handleLike handler and pass blog object to it
            onLike={() => handleLike(blog)}
          />
        )}
      </div>
    )
  }

  // handler for login
  // replaced event with username, password
  // so it works with extracted loginForm
  // we leave handleLogin in App.jsx since handleLogin
  // needs to access the errormessage and user state
  const handleLogin = async (username, password) => {    
    try {
      const user = await loginService.login({
        username, password,
      })

      // add user data to local storage of browser
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)

      // fields are reset in LoginForm component
    }
    catch (exception) {
    // display notification if exception occured
    setErrorMessage('wrong username or password')
      setSuccess(false)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log(exception)
    }
  }

  // handler sets user and token to null and
  // removes local storage data of user in browser
  const handleLogout = async (event) => {
    event.preventDefault()

    console.log('logout button clicked')
    
    window.localStorage.removeItem('loggedBlogAppUser')

    blogService.setToken(null)
    setUser(null)
  }

  // moved away handlers for changes in blogForm fields

  // handler for adding blog (is passed to BlogForm component)
  const addBlog = (blogObject) => {
    // call fct from Toggle component to toggle visibility of BlogForm
    blogFormRef.current.toggleVisibility()

    // send Object to server via blogService
    blogService
      .create(blogObject)
      .then( returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })

    // display notification if addBlog operation was successful
    setErrorMessage(`a new blog '${blogObject.title}' by '${blogObject.author}' added`)
    setSuccess(true)
    setTimeout(() => {
      setErrorMessage(null)
      setSuccess(false)
    }, 5000)
    // we could also add try catch block here
  }

  // used the ref here to toggle BlogForm once a blog is added
  const blogFormRef = useRef()
  const blogForm = () => (
    // wrap call of blogForm() with a Toggleable
    <Togglable buttonLabel={'create new blog'} ref={blogFormRef}>
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

    // handler for like button
    // is put here bc it needs to access blogs, blogService
    // and maybe error message in future
    const handleLike = async (blogToLike) => {
      console.log('\'like\' button clicked')

      if (!user) {
        console.error('User is not logged in')
        return
      }
    
      try {
        // Send only the like operation flag
        const returnedBlog = await blogService.update(blogToLike.id, { like: true })
        
        setBlogs(blogs.map(b => b.id !== returnedBlog.id ? b : returnedBlog))
        
        setErrorMessage(`You liked the blog '${returnedBlog.title}'`)
        setSuccess(true)
      } catch (error) {
        console.error('Error updating blog:', error)
        if (error.response && error.response.data.error === 'User has already liked this blog') {
          setErrorMessage('You have already liked this blog')
        } else {
          setErrorMessage('An error occurred while liking the blog')
        }
        setSuccess(false)
      }
    
      setTimeout(() => {
        setErrorMessage(null)
        setSuccess(false)
      }, 5000)
    }

  return (
    <div>
      {/* render Notification */}
      <h2>blogs</h2>
      <Notification message={errorMessage} success={success} />

      {/* render login or (logout form + blog form + blog list) conditionally */}
      {user === null
        ? <div>
            <Togglable buttonLabel={'login'}>
              <LoginForm handleLogin={handleLogin}/>
            </Togglable>
          </div>
        : <div>
            <p>{user.name} logged-in {logoutForm()}</p>
            
            {blogForm()}
          </div>
      }
      {blogList()}
    </div>
  )
}

export default App

// The 5.9 problem didn't occur so I'll move to
// exercise 5.10 without additional changes.