import axios from 'axios'

export default axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Token': localStorage.getItem('auth_token')
  }
})
