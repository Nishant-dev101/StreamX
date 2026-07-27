import api from './api'

export const register = async (data) => {
   
  console.log("entered register api")
   const { username, email, password, avatar, fullName } = data
    const formData = new FormData()
   
    formData.append('username', username)
    formData.append('fullName', fullName)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('avatar', avatar)
    console.log("formData", formData)
    console.log(formData.get('avatar'))
 
    const res = await api.post('/user/register', formData)
    return res
}

export const login = async (data) => {
  const res = await api.post('/user/login', data)
  return res
}

export const logout = async () => {
  const res = await api.post('/user/logout')
  return res  
}

export const getCurrentUser = async () => {
  const res = await api.get('/user/current-user')
  return res
}

export const refreshToken = async () => {
  const res = await api.post('/user/refreshToken')
  return res
}
