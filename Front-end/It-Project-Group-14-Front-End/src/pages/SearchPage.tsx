import React from 'react'

const SearchPage: React.FC = () => {
  return (
    <main className="w-full mx-auto px-20 py-20 space-y-12">
      {/* search bar */}
      <section>
        
        {/* Top line */}
        <div className='w-full'>
          <hr className="my-4 border-t border-gray-600"/>
        </div>

        {/* Search bar */}
        <div className="w-full bg-gray-200 rounded-md h-10 flex items-center justify-center">
          <span className="text-gray-500">[ Search Bar Placeholder ]</span>
        </div>

        {/* Bottom line */}
        <div className='w-full'>
          <hr className="my-4 border-t border-gray-600 w-full"/>
        </div>

      </section>
    </main>
  )
}

export default SearchPage