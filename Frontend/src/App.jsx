
import { BrowserRouter, Routes, Route, Link, RouterProvider } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { router } from './routes/app.routes'





function App() {
  return (
  
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
   
  )
}

export default App
