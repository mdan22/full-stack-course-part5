// contains all playwright code for e2e testing of our Blog app 
const { test, expect, describe, beforeEach, afterEach } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');
const { title } = require('process');

describe('Blog app', () => {

  // for 5.19 - 5.22
  // define title, author, and url
  // to be used when creating a blog
  const title = 'React patterns';
  const author = 'Michael Chan';
  const url = 'https://reactpatterns.com/';

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

    // verify that button is visible and contains text log in
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
      // user toggles LoginForm using log in button
      await page.getByRole('button', {name: 'log in'}).click()
  
      // call helperfunction with valid username but wrong password
      await loginWith(page, 'mdan22', 'wrong')
  
      // check for error message and styles...

      // find element by the specififc className
      const errorDiv = await page.locator('.error')

      // and expect it to contain the specific notification text 'wrong credentials'
      await expect(errorDiv).toContainText('wrong credentials')

      // as well as borderstyle: 'solid'
      await expect(errorDiv).toHaveCSS('border-style', 'solid')

      // and color red, which is 'rgb(255, 0, 0)'
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  
      // expect the phrase 'Mdan22 logged in'
      // (which would imply a successful login)
      // not to be rendered
      await expect(await page.getByText('Mdan22 logged in')).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mdan22', 'salainen')
    })
  
    // 5.19: Blog List End To End Testing, step 3
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, title, author, url)

      // check if the new blog is visible
      await expect(page.getByText(`${title} ${author}`)).toBeVisible();

      // optional: verify url in hidden details as well
      // user clicks view button to view the blog
      await page.getByRole('button', {name: 'view'}).click()

      // verify that url is shown in details
      await expect(page.getByText(`${url}`)).toBeVisible()
    })

    describe('and after a blog was created', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, title, author, url)
      })

      // 5.20: Blog List End To End Testing, step 4
      test('a blog can be liked', async ({ page }) => {

        // click view button of the 1 existing blog
        await page.getByRole('button', { name: 'view' }).click();

        // expect likes value to be 0 at start
        await expect(page.getByText('likes 0')).toBeVisible()

        // click like button of the blog
        await page.getByRole('button', { name: 'like' }).click();
  
        // check for success message and styles...
  
        // find element by the specififc className
        const successDiv = await page.locator('.success')
  
        // and expect it to contain the specific notification text `You liked the blog \'${title}\'`
        await expect(successDiv).toContainText(`You liked the blog \'${title}\'`)
  
        // as well as borderstyle: 'solid'
        await expect(successDiv).toHaveCSS('border-style', 'solid')
  
        // and color green, which is 'rgb(0, 128, 0)
        await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
  
        // expect likes value to be 1 at end
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      // 5.21: Blog List End To End Testing, step 5
      test('a blog can be deleted by the user that created it', async ({page}) => {
        // click view button of the 1 existing blog
        await page.getByRole('button', { name: 'view' }).click();

        // Set up dialog handler to accept the confirmation
        // it automatically accepts the next confirmation dialog that pops up
        page.once('dialog', dialog => dialog.accept());

        // click remove button in the details of the 1 existing blog
        await page.getByRole('button', { name: 'remove' }).click();

        // check if the new blog is no longer visible
        await expect(page.getByText(`${title} ${author}`)).not.toBeVisible();
      })

      // 5.21: Blog List End To End Testing, step 5
      test('a blog\'s delete button can only be seen by the user who added it', async ({page}) => {
        // click view button of the 1 existing blog
        await page.getByRole('button', { name: 'view' }).click();

        // cexpect the remove button to be visible at start
        // since user who created it is still logged in
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible();

        // click log out button
        await page.getByRole('button', { name: 'log out'}).click();

        // the blog details are still in view mode after clicking log out
        // so we don't need to click the view button again

        // expect the remove button to no longer be visible at end
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible();
      })
    })
  })
})
