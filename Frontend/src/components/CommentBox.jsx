


import React, { useEffect, useState } from 'react'
import { deleteComment, getAllComments } from '../services/comment.service'
import { PALETTE } from '../utils/styles'
import { useAuth } from '../contexts/AuthContext'
import { AddComment } from '../services/comment.service'
import { Trash } from 'lucide-react'


  
const formatVideoDate = (createdAt) => {
  if (!createdAt) return ''
  const date = new Date(createdAt)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}


const CommentBox = ({ videoId }) => {

  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [toastVariant, setToastVariant] = useState('')
  const { user } = useAuth()

  const fetchComments = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getAllComments(videoId)

        console.log(res?.data?.data)
        
        setComments(res?.data?.data ?? [])
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }


  const showToast = (message, variant) => {
    setToastMessage(message)
    setToastVariant(variant)
    window.setTimeout(() => setToastMessage(''), 3000)
  }

  const handleNewComment = async (e) => {
      e.preventDefault()
    if (!newComment?.trim()) return

    try {
      const res = await AddComment(videoId, newComment.trim())
      const createdComment = res?.data?.data
      if (createdComment) {
        fetchComments()
        setNewComment('')
        showToast('Comment added successfully', 'success')
      } 
    } catch (err) {
      console.error(err)
      showToast('Failed to add comment', 'error')
    }
  }

  const handleDeleteComment = async (commentId) => {

    try {
      const res = await deleteComment(commentId)
      showToast('Successfully deleted comment', 'success')
      console.log(res)
      fetchComments()
    } catch (error) {
      console.log(error)
      showToast('Something went wrong')

    }

  }    

  useEffect(() => {
    console.log('CommentBox useEffect', videoId)
    
    // call on mount / when videoId changes
    fetchComments()
  }, [videoId])


  // if(!videoId) return <p className='text-white'> please wait</p>


  


  

  return (
    <div className="rounded-sm border border-white/10 p-5 bg-[#111111]/95 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: PALETTE.ink }}>
            Comments
          </h2>
          <p className="text-sm" style={{ color: PALETTE.muted}}>
               {comments.length} {comments.length > 1 ? "comments": "comment"} 
          </p>
        </div>

      </div>
      {user &&
        <div className="rounded-2xl">
          <div className="flex">
            <div className="shrink-0 rounded-full bg-accent" />
            <div className="flex-1">
            <form onSubmit={ handleNewComment } >
              <input
                type='text'
                placeholder="Add a public comment..."
                className="w-full resize-none rounded-2xl px-4 py-3 text-sm leading-6 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                style={{ color: PALETTE.ink, backgroundColor: PALETTE.page, fontFamily: 'Inter, sans-serif' }}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}

              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200"
                  style={{ backgroundColor: PALETTE.accent, color: PALETTE.ink }}
                 
                >
                  Comment
                </button>
              </div>
            </form>
              
            </div>
          </div>
        </div>
      }

      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-opacity duration-300 ${
            toastVariant === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {toastMessage}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="rounded-xl border border-white/10 p-4" style={{ backgroundColor: PALETTE.page }}>
            <div className="flex justify-between">
              <div className='flex gap-2'>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                {comment?.owner?.[0]?.avatar ? (
                  <img
                    src={comment.owner[0].avatar}
                    alt={comment.owner[0].userName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                    {comment?.owner?.[0]?.userName?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: PALETTE.ink }}>
                  {comment?.owner[0].userName}
                </p>
                <p className="text-xs" style={{ color: PALETTE.muted }}>
                  {formatVideoDate(comment?.createdAt)}
                </p>
              </div>
                </div>
              
               { comment?.owner[0]?._id == user?._id && 
                 <div className='cursor-pointer'
                  onClick={ ()=> { handleDeleteComment(comment?._id) }}
                 >
                
                 < Trash size={18} className='hover:text-red-600 text-white transition-colors'/>
               </div>
               }
             
              
            </div>
            <p className="mt-3 text-sm leading-7" style={{ color: PALETTE.muted }}>
              {comment?.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentBox