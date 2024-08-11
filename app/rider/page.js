"use client"
import { Link } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
  const router=useRouter()
  return (
    <div><ul>
      <li> <Link onClick={()=>{router.push("/rider/create")}} >New Donation</Link>  </li>
      <li> <Link onClick={()=>{router.push("/rider/myride")}} >My Donation</Link>  </li>
      </ul>  </div>
  )
}

export default page