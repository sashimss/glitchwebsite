import React from 'react'

export default function Footer() {
  return (
    <div className="text-center py-4 bg-gray-800 text-white">
      <p>&copy; {new Date().getFullYear()} Glitch Website. All rights reserved.</p>
      <p>Made with ❤️ by Lambda</p>
    </div>
  )
}