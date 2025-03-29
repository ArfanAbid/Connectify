import React from 'react'

async function ProfilePage({params}:{params:{username:string}}) {
  await new Promise((resolve) => setTimeout(resolve, 3000));// wait three second and then render the loading part
    return (
    <div>ProfilePage</div>
  )
}

export default ProfilePage