import React from 'react'
import { NavLink } from "react-router-dom";

const LoginPage: React.FC = () => {
  return (
    <main className='max-w-7xl h-screen mx-auto px-20 py-20 space-y-6 items-center'>

      {/* login */}
      <h1 className='text-3xl font-semibold mb-2 mt-32 text-center'>
        Login
      </h1>

      <div className='w-60 bg-gray-200 rounded-md h-10 flex items-center justify-center'>
          <span className='text-gray-500'>
            [ Username Placeholder]
          </span>
      </div>

      <div className='w-60 bg-gray-200 rounded-md h-10 flex items-center justify-center'>
          <span className='text-gray-500'>
            [ Password Placeholder]
          </span>
      </div>

      <NavLink to='/profile' className='w-60 bg-gray-200 rounded-md h-10 flex items-center justify-center hover:opacity-70'>
          <span className='font-semibold text-xl'>
            Login
          </span>
      </NavLink>


    </main>
  )
}

export default LoginPage