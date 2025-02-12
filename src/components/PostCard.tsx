import { Post } from '@prisma/client'
import React from 'react'

const PostCard = ({post,dbUserId}:{post:Post,dbUserId:string | null} ) => {
  return (
    <div>PostCard</div>
  )
}

export default PostCard