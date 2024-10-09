import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { test } from 'vitest'

describe('<Blog />', () => {
  const testBlog = {
    title: "test-blog",
    author: "test-author",
    url: "test-url.com",
    likes: 0,
    user: {
      username: "test-user",
      name: "Test User",
      id: "66fa97az3g7334e1e242454d"
    },
    id: "6702b73b89e26a2042e996ea"
  }

  const createBlog = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    render(<BlogForm createBlog={createBlog} />)
  })

  // 5.16
  // test if event handler createBlog is called with the right details
  test('<BlogForm /> calls event handler createBlog with right details', async () => {
    // use getByAllRole() to access input fields
    const inputs = screen.getAllByRole('textbox')

    // use getByText to find create button
    const createButton = screen.getByText('create')
  
    // simulate user filling out the forms and clicking create button
    await user.type(inputs[0], testBlog.title)
    await user.type(inputs[1], testBlog.author)
    await user.type(inputs[2], testBlog.url)
    await user.click(createButton)
  
    // check if handler was called once  
    expect(createBlog.mock.calls).toHaveLength(1)

    // check if the correct details were passed in the handler call
    expect(createBlog.mock.calls[0][0].title).toBe('test-blog')
    expect(createBlog.mock.calls[0][0].author).toBe('test-author')
    expect(createBlog.mock.calls[0][0].url).toBe('test-url.com')
  })
})