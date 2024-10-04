import { useState } from 'react'

const Blog = ({ blog }) => {
  // I put the styles for both blogs and buttons
  // into the index.css which is imported by main.jsx

  // add state for toggling visibility of a blog
  // which works the same way as the one in Togglable
  const [visible, setVisible] = useState(false)

  // hideWhenVisible OR showWhenVisible is rendered
  // conditionally to hide or show the blog details
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // we'll implement this later
  const handleLike = (event) => {
    console.log('button clicked')
  }

  return (
    <div className='blog'>
      <p>
        {blog.title} {blog.author}&nbsp;

        <span style={hideWhenVisible}>
          <button className='button' onClick={() => toggleVisibility()}>view</button>
        </span>

        <span style={showWhenVisible}>
          <button className='button' onClick={() => toggleVisibility()}>hide</button>
          <div>
            {blog.url}
          </div>

          <div>
            likes {blog.likes} <button className='button' onClick={handleLike()}>like</button>
          </div>

          <div>
            {blog.author}
          </div>
        </span>
      </p>
    </div>
  )
}

export default Blog