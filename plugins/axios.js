import axios from 'axios'

let options = {
  baseURL: process.env.baseUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Token': localStorage.getItem('auth_token') || false
  }
}

const Axios = axios.create(options)

// Add a 500 response interceptor
Axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response.status === 500) {
    console.error(error.response)
  } else {
    return Promise.reject(error)
  }
})

export default Axios
