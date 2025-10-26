import React from "react";
import { Link } from "react-router-dom";



const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#e5e7eb] py-6 mt-12 px-20">
        <div className="max-w-7xl mx-auto  px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-800">

            {/* left column*/}
            <div className="space-y-1 items-start">
                <p>Email: info@defying.com</p>
                <p>Phone: 0420-911-696</p>
                <p>Fax: 0420-911-696</p>
            </div>

            {/* middle column*/}
            <div className="flex flex-col space-y-1 items-center">
                <Link to = "/">Home Page</Link>
                <Link to = "/search">Search Page</Link>
                <Link to = "/compare">Compare Page</Link>
            </div>

            {/* right column*/}
            <div className="flex flex-col space-y-1 items-end">
                <Link to = "/profile">Profile Page</Link>
                <Link to = "/login">Login Page</Link>
                <a href="#" onClick={(e) => e.preventDefault()}>About Page</a>
            </div>

        </div>
    </footer>
  )
}

export default Footer