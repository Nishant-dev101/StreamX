

import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/videoPlayer'
import CommentBox from '../components/CommentBox'
import UpnextVideos from '../components/UpnextVideos'
import { PALETTE } from '../utils/styles'

const VideoPlayPage = () => {
 

  const { id } = useParams()

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background: `radial-gradient(circle at 10% 6%, ${PALETTE.accent}22 0%, transparent 28%), linear-gradient(135deg, ${PALETTE.page} 0%, #070707 100%)`,
      }}
    >
      <div className="w-full">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-3">
            <VideoPlayer videoId={id}/>
           
            <CommentBox videoId={id} />
          </section>

          <aside>
            <div className="sticky top-0">
              <div className="rounded-md border border-white/10 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.24)]" style={{ backgroundColor: PALETTE.surface }}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold" style={{ color: PALETTE.ink }}>
                    Up next
                  </h2>
                  <span className="text-sm" style={{ color: PALETTE.muted }}>Similar videos</span>
                </div>
                <UpnextVideos videoId={id} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default VideoPlayPage