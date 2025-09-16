// src/pages/BusinessPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface CompanyData {
  id: string;
  name: string;
  description: string;
  industry: string;
}

// ✅ Move dummy data OUTSIDE component
const dummyCompanies: CompanyData[] = [
  {
    id: "1",
    name: "GreenTech Energy",
    description:
      "Pioneering renewable energy solutions for urban areas. Focused on reducing carbon footprints with smart grid technology.",
    industry: "Renewable Energy",
  },
  {
    id: "2",
    name: "AgroFuture",
    description:
      "Revolutionizing sustainable agriculture with AI-powered tools that optimize crop yields and minimize waste.",
    industry: "AgriTech",
  },
  {
    id: "3",
    name: "HealthBridge",
    description:
      "Connecting communities with affordable healthcare services using digital platforms and local partnerships.",
    industry: "Healthcare",
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
  }, [companyId]); // ✅ only depend on companyId

  if (!company) return <p className="text-center py-12">Loading...</p>;

  return (
    <main className="max-w-4xl mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
      <p className="text-gray-600 mb-6">{company.industry}</p>
      <p className="text-gray-800">{company.description}</p>
    </main>
  );
};

export default BusinessPage;
