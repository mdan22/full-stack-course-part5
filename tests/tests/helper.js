const loginWith = async (page, username, password)  => {
  // user toggles LoginForm using login button
  await page.getByRole('button', { name: 'log in' }).click()

  // form fields are found by their testid
  // and are filled with valid user credentials by user
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)

  // form is submitted
  await page.getByRole('button', { name: 'log in' }).click()
}

export {
  loginWith
}
