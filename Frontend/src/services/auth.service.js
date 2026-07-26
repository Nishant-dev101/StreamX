import api from './api'

export const register = (data) => {

   const { username, email, password, avatar } = data
    const formData = new FormData()
   
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('avatar', avatar)
 
    const res = api.post('/user/register', formData)
    return res
}

export const login = (credentials) => {
  const res = api.post('/user/login', credentials)
  return res
}

export const logout = () => {
  const res = api.post('/user/logout')
  return res  
}

export const getCurrentUser = () => {
  const res = api.get('/user/current-user')
  return res
}

export const refreshToken = () => {
  const res = api.post('/user/refreshToken')
  return res
}
