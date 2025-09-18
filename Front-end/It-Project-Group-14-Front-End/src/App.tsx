import { useEffect, useState } from 'react'
import Summary from './components/BasicSummary.tsx'
import { Link } from "react-router-dom";
import companyData from "./data/CompanyData.json"

function App() {
  const [count, setCount] = useState(0)

  type Company = {
      id: number,
      title: string,
      category: string,
      description: string,
      funding: string,
      useOfFunds: string,
      imageUrl: string
  }

  const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
    return (
      <div>
        <Summary company = {company}/>

        {/* More Info button skeleton, to be implemented */}
        {/* <Link
          to={`/business/${company.id}`}
          className="mt-4 px-3 py-1 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 text-center"
        >
          View More
        </Link> */}
      </div>
    );
  };

  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dummy data until backend is ready
  useEffect(() => {
    const dummyData: Company[] = [
      {
        id: companyData[0].id,
        title: companyData[0].title,
        category: companyData[0].category,
        description: companyData[0].description,
        funding: companyData[0].funding,
        useOfFunds: companyData[0].useOfFunds,
        imageUrl: companyData[0].imageUrl
      },

      {
        id: companyData[1].id,
        title: companyData[1].title,
        category: companyData[1].category,
        description: companyData[1].description,
        funding: companyData[1].funding,
        useOfFunds: companyData[1].useOfFunds,
        imageUrl: companyData[1].imageUrl
      },
    ];
    setCompanies(dummyData);
  }, []);

  // Rotate cards every 10 seconds
  useEffect(() => {
    if (companies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % companies.length);
    }, 10000); // 10,000 ms = 10 seconds

    return () => clearInterval(interval);
  }, [companies]);

  console.log("Companies:", companies);
  console.log("URL", companyData[0].imageUrl);
  console.log("Title", companyData[0].title);
  return (
    <div>
      <p>{companies.length}</p>
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
    </div>
  )
}

export default App