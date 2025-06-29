import React from 'react'

export default function Navbar(){
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-white text-lg font-bold">Glitch Website</a>
        <div>
          <a href="/about" className="text-gray-300 hover:text-white px-3">About</a>
          <a href="/contact" className="text-gray-300 hover:text-white px-3">Contact</a>
        </div>
      </div>
    </nav>
  )
}