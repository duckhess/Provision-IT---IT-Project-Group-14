import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Company = {
  id: number;
  name: string;
  description: string;
};

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full h-full flex flex-col justify-between">
      <div>
        <h4 className="text-lg font-semibold mb-2">{company.name}</h4>
        <p className="text-gray-600 text-sm">{company.description}</p>
      </div>
      <Link
        to={`/business/${company.id}`}
        className="mt-4 px-3 py-1 bg-gray-800 !text-white rounded-md text-sm hover:bg-gray-700 text-center"
      >
        View More
      </Link>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dummy data until backend is ready
  useEffect(() => {
    const dummyData: Company[] = [
      {
        id: 1,
        name: "GreenTech Energy",
        description: "Pioneering renewable energy solutions for urban areas.",
      },
      {
        id: 2,
        name: "AgroFuture",
        description: "Revolutionizing sustainable agriculture with AI-powered tools.",
      },
      {
        id: 3,
        name: "HealthBridge",
        description: "Connecting communities with affordable healthcare services.",
      },
    ];
    setCompanies(dummyData);
  }, []);

  // Rotate cards every minute
  useEffect(() => {
    if (companies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % companies.length);
    }, 60000); // 60,000 ms = 1 minute

    return () => clearInterval(interval);
  }, [companies]);

  return (
    <main className="max-w-7xl mx-auto px-20 py-20 space-y-16">
      {/* Welcome section including search bar */}
      <section className="items-center">
        <h1 className="text-2xl font-semibold mb-4 text-center">Welcome</h1>

        <div className="w-full bg-gray-200 rounded-md h-10 flex items-center justify-center">
          <span className="text-gray-500">[ Search Bar Placeholder ]</span>
        </div>
      </section>

      {/* Hero Section with static image */}
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
            toward succesful direct transparent investing.
          </p>
        </div>
        <div className="w-full bg-gray-300 h-60 rounded-md flex items-center justify-center">
          [ Static Image Placeholder ]
        </div>
      </section>

      {/* Investment highlight section with rotating cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="w-full h-48 rounded-md flex items-center justify-center">
          {companies.length > 0 && (
            <CompanyCard company={companies[currentIndex]} />
          )}
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
      </section>
    </main>
  );
};

export default HomePage;
