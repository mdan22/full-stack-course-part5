// moved the states (username + password) related to the
// loginForm into its own component
// even though it wasn't required

import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // when login form is submitted, the handleLogin fct is called
  const onSubmit = async (event) => {
    event.preventDefault()

    console.log('login button clicked')

    const success = await handleLogin(username, password)

    // we reset the fields if login was successful
    // not rlly needed since the form is hidden
    if (success) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={onSubmit}>
        <div>
         username
          <input
            data-testid='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
         password
          <input
            data-testid='password'
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">log in</button>
      </form>
    </div>
  )
}

// define PropTypes of LoginForm component
LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm