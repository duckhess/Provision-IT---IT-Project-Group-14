import React, { useEffect, useState } from "react";
import axios from "axios";

interface Company {
  companyId: number;
  companyName: string;
  industryId: number;
}

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get<Company[]>("/api/companies");
        setCompanies(response.data); 
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {companies.map((company) => (
        <li key={company.companyId}>
          {company.companyName} = {company.industryId}
        </li>
      ))}
    </ul>
  );
};

export default CompanyList;
