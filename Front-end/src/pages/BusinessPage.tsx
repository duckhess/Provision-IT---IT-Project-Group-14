// src/pages/BusinessPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FilterBusinessPage from "../components/filterBusinessPage/FilterBusinessPage";

interface CompanyData {
  id: string;
  name: string;
  companyDescription: string;
  projectDescription : string;
  companyImageUrl : string;
}

// Move dummy data OUTSIDE component
const dummyCompanies: CompanyData[] = [
  {
    id: "1",
    name: "GreenTech Energy",
    companyDescription:
      "Pioneering renewable energy solutions for urban areas. Focused on reducing carbon footprints with smart grid technology.",
    projectDescription:
      "Developed AI-driven solar panels that increase energy efficiency by 20%.",
    companyImageUrl: "/images/greentech.jpg",
  },
  {
    id: "2",
    name: "AgroFuture",
    companyDescription:
      "Revolutionizing sustainable agriculture with AI-powered tools that optimize crop yields and minimize waste.",
    projectDescription:
      "Launched a smart irrigation system that reduces water usage by 30%.",
    companyImageUrl: "/images/agrofuture.jpg",
  },
  {
    id: "3",
    name: "HealthBridge",
    companyDescription:
      "Connecting communities with affordable healthcare services using digital platforms and local partnerships.",
    projectDescription:
      "Created a telemedicine app connecting patients to doctors in rural areas.",
    companyImageUrl: "/images/healthbridge.jpg",
  },
];

const BusinessPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<CompanyData | null>(null);

  useEffect(() => {
    // Simulate API fetch by finding from dummy data
    const fetchCompany = async () => {
      try {
        const data = dummyCompanies.find((c) => c.id === companyId);
        setCompany(data || null);
      } catch (err) {
        console.error("Error fetching company data:", err);
      }
    };

    fetchCompany();
  }, [companyId]); // only depend on companyId

  if (!company) return <p className="text-center py-12">Loading...</p>;

  return (
    <main className="max-w-4xl mx-auto py-20 px-6 text-center">

      {/* Company description */}
      <section className="py-8 px-4">
        <div className = "grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 items-start">

          {/*Left column = company info */}
          <div className="text-left">
            <p className="text-3xl mb-2">Hello, we are</p>
            <h1 className="text-4xl font-bold mb-4">{company.name}</h1>
            <p className="text-gray-800 mb-6">{company.companyDescription}</p>
            <p className="text-gray-800">{company.projectDescription}</p>

            <div className="mt-6 flex justify-center">
              <button className="bg-blue-300 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-400">Invest</button>
            </div>
          </div>

          {/*Image placeholder*/}
          <div className="flex justify-center"> 
            {company.companyImageUrl ? (
               <img src = {company.companyImageUrl} className="w-full h-auto rounded-lg shadow-md object-cover"/>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                Picture Placeholder
              </div>
            )}
          </div>
        </div>
      </section>
            
      <section className="py-8 px-4">
        <h2 className="text-3xl text-gray-600 font-bold mb-4 text-left"> Quick Look at Our Statistics</h2>
        <div>
          <FilterBusinessPage></FilterBusinessPage>
          "data Summary"
        </div>
      </section>
      
    </main>
  );
};

export default BusinessPage;
