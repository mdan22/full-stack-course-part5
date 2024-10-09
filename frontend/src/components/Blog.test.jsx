import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogs from '../services/blogs'
import { expect, test } from 'vitest'

describe('<Blog />', () => {
  let container

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

  const testUser = {
    username: "test-user",
    name: "Test User",
    id: "66fa97az3g7334e1e242454d",
    blogs: [
      {
        title: "test-blog",
        author: "test-author",
        url: "test-url.com",
        id: "6702b73b89e26a2042e996ea"
      }
    ]
  }

  const onLike = vi.fn()
  const onRemove = vi.fn()

  let user = userEvent.setup()

  beforeEach(() => {
    render(
      <Blog blog={testBlog} onLike={onLike} onRemove={onRemove} user={testUser}/>
    )
  })

  // 5.13
  // test if children title and author are being
  // rendered at start whilst URL and likes are not
  test('renders title and author, but not URL and likes by default', () => {
    // check that title and author are visible
    // use getBy* queries if elements are expected to be in the DOM
    expect(screen.getByText(`${testBlog.title} ${testBlog.author}`)).toBeVisible()

    // Check that URL and likes are not visible
    // use queryBy* queries if elements are expected to not be present or visible.
    expect(screen.queryByText(testBlog.url)).not.toBeVisible()
    expect(screen.queryByText(`likes ${testBlog.likes}`)).not.toBeVisible()
  })
})