// contains all playwright code for e2e testing of our Blog app 
const { test, expect, describe, beforeEach, afterEach } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

describe('Blog app', () => {
  beforeEach( async ({ page, request }) => {
    // empty db and post user before each test
    // by making HTTP requests with request.post to the backend
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Mdan22',
        username: 'mdan22',
        password: 'salainen'
      }}
    )

    // navigate to app
    await page.goto('/')
  })

  // 5.17: Blog List End To End Testing, step 1
  test('Login form is shown', async({ page }) => {
    // find login button by role 'button'
    const locator = await page.getByRole('button', { name: 'log in' })

    // verify that button is visible and contains text login
    await expect(locator).toBeVisible()
    await expect(locator).toHaveText('log in')
  })

  describe('Login', () => {
    // 5.18: Blog List End To End Testing, step 2
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mdan22', 'salainen')

      await expect(await page.getByText('Mdan22 logged in')).toBeVisible()
    })

    // 5.18: Blog List End To End Testing, step 2
    test('fails with wrong credentials', async ({ page }) => {
      // user toggles LoginForm using login button
      await page.getByRole('button', {name: 'log in'}).click()
  
      // call helperfunction with valid username but wrong password
      await loginWith(page, 'mdan22', 'wrong')
  
      // check for error message and styles...

      // find element by the specififc className
      const errorDiv = await page.locator('.error')

      // and expect it to contain the specific error text 'wrong credentials'
      await expect(errorDiv).toContainText('wrong credentials')

      // as well as borderstyle: 'solid'
      await expect(errorDiv).toHaveCSS('border-style', 'solid')

      // and color: 'rgb(255, 0, 0)'
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  
      // expect the phrase 'Mdan22 logged in'
      // (which would imply a successful login)
      // not to be rendered
      await expect(await page.getByText('Mdan22 logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mdan22', 'salainen')
    })
  
    // 5.19: Blog List End To End Testing, step 3
    test('a new blog can be created', async ({ page }) => {
      // define title, author, and url
      const title = 'React patterns';
      const author = 'Michael Chan';
      const url = 'https://reactpatterns.com/';
      
      await createBlog(page, title, author, url)

      // check if the new blog is visible
      await expect(page.getByText(`${title} ${author}`)).toBeVisible();

      // optional: verify url in hidden details as well
      // user clicks view button to view the blog
      await page.getByRole('button', {name: 'view'}).click()

      // verify that url is shown in details
      await expect(page.getByText(`${url}`)).toBeVisible()
    })
  })
})
