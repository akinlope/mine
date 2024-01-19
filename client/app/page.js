import React from 'react'
import Home from "./home/Home"
import { Toaster } from 'react-hot-toast'


export default function page() {
  return (
    <div >
      <Home />     
      <Toaster />
    </div>
  )
}
