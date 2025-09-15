import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-20 py-20 space-y-12">

      {/* welcome section including space bar*/}
      <section className="items-center">
        <h1 className="text-2xl font-semibold mb-4 text-center">Welcome</h1>

        <div className="w-full bg-gray-200 rounded-md h-10 flex items-center justify-center">
          {/* Search bar placeholder - look into making it span the page */}
          <span className="text-gray-500">
            [ Search Bar Placeholder ]
          </span>
        </div>
      </section>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            The future of decentralised investing is here
          </h2>
          <p className="text-gray-700">
            We present a unique way for investors to back businesses while
            business owners can raise capital.
          </p>
          <p className="text-gray-700">
            By providing a consistent and easy method, we empower both parties
            toward succesful diresct transparent investing
          </p>
        </div>
        <div className="w-full bg-gray-300 h-60 rounded-md flex items-center justify-center">
          [ Image Placeholder]
        </div>
      </section>

      {/* Investment highlight section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="w-full bg-gray-300 h-48 rounded-md flex items-center justify-center">
          [ Image Placeholder ]
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold">
            See where people are investing today
          </h3>
          <p className="text-gray-700">
            Curious about what's hot right now? Browse through our highlighted 
            investments and get inspired by the latest investment trends. 
          </p>
        </div>
        <Link to='/business' className="px-4 py-2 bg-gray-200 rounded-md text-gray-700">
            More Info
        </Link>
      </section>
    </main>
  );
};

export default HomePage;
