// contains all playwright code for e2e testing of our Blog app 
const { test, expect, describe, beforeEach } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach( async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  // 5.17: Blog List End To End Testing, step 1
  test('Login form is shown', async({ page }) => {
    // find login button by role 'button'
    const locator = await page.getByRole('button')

    // verify that button is visible and contains text login
    await expect(locator).toBeVisible()
    await expect(locator).toHaveText('login')
  })
})
