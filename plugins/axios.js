import axios from 'axios'

let options = {
  baseURL: process.env.baseUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Token': localStorage.getItem('auth_token') || false
  }
}

export default axios.create(options)
