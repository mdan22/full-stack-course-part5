import axios from 'axios'
const baseUrl = '/api/login'

// using async/await syntax instead of promises for the HTTP request
const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
