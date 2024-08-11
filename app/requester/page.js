"use client"
import { Link } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
  const router=useRouter()
  return (
    <div><ul>
      <li> <Link onClick={()=>{router.push("/requester/create")}} >New Donation</Link>  </li>
      <li> <Link onClick={()=>{router.push("/requester/myrequest")}} >My Donation</Link>  </li>
      </ul>  </div>
  )
}

export default page