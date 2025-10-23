import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import Summary from "../components/Carousel/BasicSummary"
import SearchBarComponent from "../components/searchBar/SearchBarComponent";
import axios from "axios";

  interface Company {
    companyId: number;
    companyName: string;
  }

  const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
    return (
      <div className="h-full w-full  rounded-md flex items-center justify-center">
        <Summary company = {company}/>
      </div>
    );
  };


const HomePage: React.FC = () => {
  // const [companies, setCompanies] = useState<CompanyInfo[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company []>([]);
  // const [suggestedCompanies, setSuggestedCompanies] = useState <Company[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleSearchClick = (input : string) => {
    navigate(`/search?query=${encodeURIComponent(input)}`);
  };


  useEffect (() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get<Company[]> (
          "/api/companies"
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
    if (allCompanies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allCompanies.length);
    }, 60000); // 10,000 ms = 10 seconds

    return () => clearInterval(interval);
  }, [allCompanies]);

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

        <div className="h-[500px] w-full bg-gray-300 rounded-lg flex items-center 
          justify-center">
         <img src='homePage.jpg' className="h-full w-full object-cover rounded-lg"></img>
        </div>
      </section>

      {/* Investment highlight section with rotating cards (showing all available companies for now)*/}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2">
          {allCompanies.length > 0 && (
            <CompanyCard company={allCompanies[currentIndex]} />
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
