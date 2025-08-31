import React, { useEffect } from 'react'
import UseAuthStore from '../AuthStore/UseAuthStore'
const ProfilePAge = () => {
  const {user,fetchUser} = UseAuthStore();
  useEffect(()=>{
fetchUser();
  },[])
  console.log("user is:",user)
  return (
    <div className='Profile_page'>
      {user?(<>
<div class="card">
{user.Profilepic?(<img src={user.Profilepic} alt='Photo'/>):(<div className='card-photo'></div>)}
    <div class="card-title">{user.Firstname} {user.Lastname} <br/>
        <span>Fullstack dev &amp; UX UI</span>
    </div>
    <div class="card-socials">
    </div>
</div></>):(
<div class="loader">
  <div class="wrapper">
    <div class="circle"></div>
    <div class="line-1"></div>
    <div class="line-2"></div>
    <div class="line-3"></div>
    <div class="line-4"></div>
  </div>
</div>)}
    </div>
  )
}

export default ProfilePAge
