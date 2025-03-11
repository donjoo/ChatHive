import React, { useEffect } from 'react'
import UserList from '../components/chat/UserList'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthData } from '../redux/auth/authSlice';

function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user)

useEffect(() =>{
  if (!user){
    const storeduserdata = localStorage.getItem('user')
    if (storeduserdata){
      try{

          console.log('jeyyy')
          const parsedUserData = JSON.parse(storeduserdata);
          dispatch(setAuthData({user : parsedUserData}));
      } catch (error){
        console.log('`Error  prasing user data: ', error)
      }
    }
  }
},[dispatch,user])


  return (
<>
<UserList />
</>  )
}

export default Home