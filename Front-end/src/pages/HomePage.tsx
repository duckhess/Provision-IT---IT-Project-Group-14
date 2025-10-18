import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import companyData from "../data/CompanyData.json"
import Summary from "../components/BasicSummary"
import SearchBarComponent from "../components/searchBar/SearchBarComponent";
import axios from "axios";

  type CompanyInfo = {
      id: number,
      title: string,
      category: string,
      description: string,
      funding: string,
      useOfFunds: string,
      imageUrl: string
  }

  interface Company {
    companyId: number;
    companyName: string;
  }

  const CompanyCard: React.FC<{ company: CompanyInfo }> = ({ company }) => {
    return (
      <div className="h-full w-full  rounded-md flex items-center justify-center">
        <Summary company = {company}/>
      </div>
    );
  };


const HomePage: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyInfo[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company []>([]);
  const [suggestedCompanies, setSuggestedCompanies] = useState <Company[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleSearchClick = (input : string) => {
    navigate(`/search?query=${encodeURIComponent(input)}`);
  };

// Dummy data until backend is ready
  useEffect(() => {
    const dummyData: CompanyInfo[] = [
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

  // fetch all possible companies : search bar
  useEffect (() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get<Company[]> (
          "http://localhost:7000/companies"
        );
        setAllCompanies(response.data);
      } catch (err){
        console.error("error fetching companies data",err);
      } 
    };
    fetchCompanies();
  }, []);

  // Rotate cards every 10 seconds : carousel
  useEffect(() => {
    if (companies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % companies.length);
    }, 60000); // 10,000 ms = 10 seconds

    return () => clearInterval(interval);
  }, [companies]);

  return (
    <main className="max-w-7xl mx-auto px-20 py-20 space-y-16">
      {/* Welcome section including search bar */}
      <section className="items-center">
        <h1 className="text-2xl font-semibold mb-4 text-center">Welcome</h1>

        <div className="w-full flex items-center justify-center">
            <SearchBarComponent 
              allCompanies={allCompanies} 
              setSearchResults={() => {}}
              handleSearchClick = {handleSearchClick}></SearchBarComponent>
          {/* <span className="text-gray-500">[ Search Bar Placeholder ]</span> */}
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
        <div className="h-full min-h-[328px] max-h-[329px] w-full bg-gray-300 rounded-md flex items-center 
          justify-center">
          [ Static Image Placeholder ]
        </div>
      </section>

      {/* Investment highlight section with rotating cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2">
          {companies.length > 0 && (
            <CompanyCard company={companies[currentIndex]} />
          )}
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
