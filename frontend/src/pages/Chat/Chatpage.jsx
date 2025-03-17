import React from 'react'
import { useSelector } from 'react-redux'

function Chatpage() {
    const currentUser = useSelector((state) => state.auth.user)


    console.log(currentUser)
  return (
    <p>{currentUser}</p>
  )
}

export default Chatpage