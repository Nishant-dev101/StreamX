import { createContext, useContext, useEffect, useState } from 'react'
import {getCurrentUser, register, login ,logout, refreshToken}from '../services/auth.service'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
 
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      setLoading(true)
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser()
        console.log(res);
        
        setUser(res.data)
      } catch (err) {
        console.log(err);
        
        setUser(null)
      } finally {
       setLoading(false)
      }
    }
    fetchUser()
   
  }, [])

  
    
   return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
