// contains all playwright code for e2e testing of our Blog app 
const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, createBlog, logOut, likeBlog } = require('./helper');
const { title } = require('process');

describe('Blog app', () => {

  // for 5.19 - 5.22:
  // define title, author, and url
  // to be used when creating a blog
  const title = 'React patterns';
  const author = 'Michael Chan';
  const url = 'https://reactpatterns.com/';

  beforeEach( async ({ page, request }) => {
    // empty db and post user before each test
    // by making HTTP requests with request.post to the backend
    await request.post('/api/testing/reset')

    // create a first user 'mdan22'
    await request.post('/api/users', {
      data: {
        name: 'Mdan22',
        username: 'mdan22',
        password: 'salainen'
      }}
    )

    // create a second user 'secondUser'
    await request.post('/api/users', {
      data: {
        name: 'Second User',
        username: 'secondUser',
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

      // 5.22: Blog List End To End Testing, step 6
      test('a blog\'s delete button can only be seen by the user who added it', async ({page}) => {
        // click view button of the 1 existing blog
        await page.getByRole('button', { name: 'view' }).click();

        // cexpect the remove button to be visible at start
        // since user who created it is still logged in
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible();
        
        // log out
        await logOut(page)

        // the blog details are still in view mode after clicking log out
        // so we don't need to click the view button again

        // expect the remove button to no longer be visible at end
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible();
      })
    })

  })

  // for 5.23:  
  /*
    strategy:
    
    add 2 users
    add a few blogs (3) (it doesn't matter who creates them)
    like 1st blog 1 time
    like 2nd blog 2 times
    don't like 3rd blog

    expected order: Second blog, First blog, Zero blog
  */
  describe('when 3 blogs are created with different amount of likes', () => {
    beforeEach(async ({ page }) => {
      // log in with first user 'mdan22'
      await loginWith(page, 'mdan22', 'salainen')
      // this somehow works without timeout for the first login
      // await page.waitForTimeout(250)

      // Create three blogs
      await createBlog(page, 'Zero Blog', 'Author 0', 'https://blog0.com');
      await createBlog(page, 'First Blog', 'Author 1', 'https://blog1.com');
      await createBlog(page, 'Second Blog', 'Author 2', 'https://blog2.com');

      // like 'First Blog'
      await likeBlog(page, 'First Blog')
      await page.waitForTimeout(250)

      // like 'Second Blog'
      await likeBlog(page, 'Second Blog')
      await page.waitForTimeout(250)

      // 'Zero Blog' gets no likes

      await logOut(page)
      // used waitFor in the helper function
      // so no need to wait here

      // log in with second user 'secondUser'
      await loginWith(page, 'secondUser', 'salainen')
      await page.waitForTimeout(250)

      // like the 'Second Blog' again
      // something goes wrong here
      // or at least liking doesn't happen fast enough I think
      await likeBlog(page, 'Second Blog')
      await page.waitForTimeout(250)
      /*
      result:

      First Blog:   1 likes
      Second Blog:  2 likes
      Zero Blog:   0 likes
      */
    })

    // I would have loved to use waitFor more in the
    // LoginWith and likeBlog Function.
    // But since it didn't work as expected I used
    // waitForTimeout in the beforeEach function.
    // 5.23: Blog List End To End Testing, step 7
    test('blogs are arranged in descending order according to the likes', async ({ page }) => {
      // Wait for all blog elements to be visible
      await page.waitForSelector('.blog');

      // Get all blog elements
      const blogElements = await page.$$('.blog');

      // Expected order of blog titles
      const expectedOrder = ['Second Blog', 'First Blog', 'Zero Blog'];

      // Check if the blogs are in the correct order
      for (let i = 0; i < expectedOrder.length; i++) {
        const blogText = await blogElements[i].innerText();
        await expect(blogText).toContain(expectedOrder[i]);
      }
    })
  })
})
