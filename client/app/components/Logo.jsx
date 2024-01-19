import React from 'react'
// logo import
import Image from 'next/image'

export default function Logo() {
  return (
    <div>
        <Image 
        className=''
        src={"/ifix_logo.png"}
        width={50}
        height={50}
        alt='ifix logo'
        />
    </div>
  )
}
