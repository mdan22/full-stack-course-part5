import { useState } from 'react'

// pass blog to be liked and onlike handler are passed as props
const Blog = ({ blog, onLike, onRemove, user}) => {
  // I put the styles for both blogs and buttons
  // into the index.css which is imported by main.jsx

  // 5.7
  // add state for toggling visibility of a blog
  // which works the same way as the one in Togglable
  const [visible, setVisible] = useState(false)

  // hideWhenVisible OR showWhenVisible is rendered
  // conditionally to hide or show the blog details
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    console.log('toggle button clicked')
    setVisible(!visible)
  }

  // save visibility state of remove button in a boolean variable
  // button is visible if the blog was added by the logged in user

  // we compare USERNAMES since they are UNIQUE
  const showRemoveButton = user && blog &&  user.username === blog.user.username
  const removeButtonStyle = { display: showRemoveButton ? '' : 'none'}

  return (
    <div className='blog'>
        {blog.title} {blog.author}

        <span style={hideWhenVisible}>
          <button className='button' onClick={() => toggleVisibility()}>view</button>
        </span>

        <span style={showWhenVisible}>
          <button className='button' onClick={() => toggleVisibility()}>hide</button>
          <div>
            {blog.url}
          </div>

          <div>
            likes {blog.likes} <button className='button' onClick={onLike}>like</button>
          </div>

          <div>
            {blog.author}
          </div>

          <div style={removeButtonStyle}>
            <button className='button' onClick={onRemove}>remove</button>
          </div>
        </span>
    </div>
  )
}

export default Blog