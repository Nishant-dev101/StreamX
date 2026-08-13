

import React from 'react'
import VideoTray from '../components/videoTray'
import { PALETTE} from '../utils/styles'
import { useEffect, useState } from 'react'
import { getVideos } from '../services/videos.service'
import Loading from '../components/loading'
import Error from '../components/error'
import { useAuth } from '../contexts/AuthContext'




const Home = () => {



    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        const fetchVideos = async () => {
       
            try {
                setLoading(true);
                const res = await getVideos();
                setVideos(res?.data?.data);
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "An error occurred while fetching videos.";
                setError(errorMessage);
            }finally {
                setLoading(false);
            }
        }

        fetchVideos();
    }, [])

   


    if (loading) return  <Loading/>

    if (error) return <Error error={error} />
       

                


  return (
     <section className="mt-6 w-full">
        <h2 className="mb-4 text-lg font-semibold" style={{ color: PALETTE.ink }}>
        Trending
      </h2>

        <VideoTray videos={videos} />
     </section>
  )
}

export default Home