


import Navbar from '../components/navbar'
import SearchBar from '../components/searchBar'
import { PALETTE, TYPOGRAPHY } from '../utils/styles'
import { Outlet, useLocation } from 'react-router-dom'

const MainLayout = () => {
    const { pathname } = useLocation()
    const isVideoPlaying = pathname.startsWith('/video/videoPlayerPage/')
  
    return (

        <main
            className="flex min-h-screen"
            style={{
                background: `radial-gradient(circle at 10% 6%, ${PALETTE.accent}22 0%, transparent 30%), linear-gradient(135deg, ${PALETTE.page} 0%, #0b0b0b 100%)`,
                fontFamily: TYPOGRAPHY.font,
            }}
        >
            <Navbar />
            <div className={`flex-1 ${isVideoPlaying ? 'px-2 pt-3 pb-2 sm:px-3' : 'px-6 py-6'}`}>
                
                {!isVideoPlaying && (
                    <div className="sticky top-4 z-10">
                        <SearchBar />
                    </div>
                )}

                <Outlet />
            </div>



        </main> 

         
        
  )
}

export default MainLayout