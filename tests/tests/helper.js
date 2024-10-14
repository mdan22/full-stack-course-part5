// for 5.18: Blog List End To End Testing, step 2
const loginWith = async (page, username, password)  => {
  // user toggles LoginForm using login button
  await page.getByRole('button', { name: 'log in' }).click()

  // form fields are found by their testid
  // and are filled with valid user credentials by user
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)

  // form is submitted
  await page.getByRole('button', { name: 'log in' }).click()

  // I would have loved to use waitFor here, but it doesn't work
}

// for 5.19: Blog List End To End Testing, step 3
const createBlog = async (page, title, author, url) => {
  // user clickes new note button which toggles NoteForm
  await page.getByRole('button', {name: 'new blog'}).click()

  // the newnote field is filled with a note and save button is clicked
  await page.getByTestId('newTitle').fill(title)
  await page.getByTestId('newAuthor').fill(author)
  await page.getByTestId('newUrl').fill(url)

  // submit the form
  await page.getByRole('button', {name: 'create'}).click()

  // use waitFor for efficient testing
  await page.getByText(`${title} ${author}`).waitFor()
}

// planned on using it more, but it doesn't work
const clickView = async (container) => {
  // click view button within this specific container if not already visible
  const viewButton = await container.getByRole('button', { name: 'view' })
  if (await viewButton.isVisible()) {
    await viewButton.click()
    await container.getByRole('button', { name: 'hide' }).waitFor()
  }
}

const likeBlog = async (page, title) => {
  // locate blog container by title
  const container = await page.locator('.blog', { hasText: title })

  clickView(container)

  // click like button
  await container.getByRole('button', { name: 'like' }).click()

  // I would have loved to use waitFor here, but it doesn't work
} 

const logOut = async (page) => {
  // click log out button
  await page.getByRole('button', { name: 'log out'}).click();

  // use waitFor for efficient testing
  await page.getByRole('button', { name: 'log in' }).waitFor()
}

export {
  loginWith,
  createBlog,
  logOut,
  likeBlog,
  clickView
}
