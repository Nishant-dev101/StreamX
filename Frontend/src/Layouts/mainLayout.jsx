


import React from 'react'
import Navbar from '../components/navbar'
import SearchBar from '../components/searchBar'
import { PALETTE, TYPOGRAPHY } from '../utils/styles'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  
  
    return (

        <main
            className="flex min-h-screen"
            style={{
                background: `radial-gradient(circle at 10% 6%, ${PALETTE.accent}22 0%, transparent 30%), linear-gradient(135deg, ${PALETTE.page} 0%, #0b0b0b 100%)`,
                fontFamily: TYPOGRAPHY.font,
            }}
        >
            <Navbar />
            <div className="flex-1 px-6 py-6">
                
                <div className="sticky top-4 z-10">
                    <SearchBar />
                </div>

                <Outlet />
            </div>



        </main> 

         
        
  )
}

export default MainLayout