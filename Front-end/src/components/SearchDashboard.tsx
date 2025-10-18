import React, { useState, useEffect} from 'react';
import CompanyCard from '../components/CompanyCard';
import Summary from '../components/BasicSummary';
import SearchPageGrid from './SearchPageGrid.tsx';
import axios from "axios";

interface receivedCompaniesProps {
  companies: { companyId: number; companyName: string }[];
}

// type Company = {
//     id: number,
//     title: string,
//     category: string,
//     description: string,
//     funding: string,
//     useOfFunds: string,
//     imageUrl: string,
//     projectShortDescription : string,
//     estDate : string;
// };

// type Company = {
//   companyID : number;
//   companyName : string;
// }

// type Unit = "%" | "$" | "days" | "Benchmark";
// type Metric = "Ratio" | "Revenue" | "Duration" | "Forecast" | "ABS Benchmark";
// type Section = "Ratio" | "ABS Benchmarking" | "Statement of Cashflow" | "Forecast";

// interface Dataset {
//   name: string; // label
//   data: any[];
//   metric: Metric;
//   unit: Unit;
//   section: Section;
// }

// interface DataItem {
//   id: number;
//   text: string;
//   summary: Company;
//   datasets: Dataset[];
// }

// Fake mock data
// const mockData: DataItem[] = [
//   {
//     id: 1,
//     text: 'Startup A',
//     projectShortDescription: 'Revolutionizing digital banking for the modern era.',
//     estDate: '2025',
//     summary: {
//       id: 1,
//       title: 'Startup A',
//       category: 'Fintech',
//       description: 'Revolutionizing banking...',
//       funding: '$2M',
//       useOfFunds: 'Product development, marketing',
//       imageUrl: 'Test_Image/Organic.jpg',
//       estDate: '2025'
//     },
//     datasets: [
//       {
//         name: 'Revenue Growth',
//         data: [{ x: 1, y: 2000 }, { x: 2, y: 3000 }],
//         metric: 'Revenue',
//         unit: '$',
//         section: 'Statement of Cashflow',
//       },
//       {
//         name: 'Burn Ratio',
//         data: [{ x: 1, y: 0.5 }, { x: 2, y: 0.6 }],
//         metric: 'Ratio',
//         unit: '%',
//         section: 'Ratio',
//       },
//     ],
//   },
//   {
//     id: 2,
//     text: 'Startup B',
//     projectShortDescription: 'Delivering fresh, fast, and sustainable food solutions.',
//     estDate: '2025',
//     summary: {
//       id: 2,
//       title: 'Startup B',
//       category: 'Food',
//       description: 'FoodYummy',
//       funding: '$1.8M',
//       useOfFunds: 'SecuringFood',
//       imageUrl: 'Test_Image/RandomLogo.png',
//       estDate: '2025',
//     },
//     datasets: [
//       {
//         name: 'Revenue Growth',
//         data: [{ x: 1, y: 1250 }, { x: 2, y: 2192 }],
//         metric: 'Revenue',
//         unit: '$',
//         section: 'Statement of Cashflow',
//       },
//       {
//         name: 'Burn Ratio',
//         data: [{ x: 1, y: 0.2 }, { x: 2, y: 0.4 }],
//         metric: 'Ratio',
//         unit: '%',
//         section: 'Ratio',
//       },
//       {
//         name: 'Benchmark A',
//         data: [
//           { name: 'Wages and Salaries/Revenue', pass: true, calc_value: 7.44, abs_value: 14, greater: false },
//           { name: 'Total Expenses/Total Income', pass: true, calc_value: 83.61, abs_value: 94, greater: false },
//           { name: 'Total Expenses/Revenue', pass: true, calc_value: 20.5, abs_value: 96, greater: false },
//           { name: 'Operating Profit Before Tax/Total Income', pass: true, calc_value: 4.02, abs_value: 6, greater: true },
//           { name: 'Net Profit/Loss (-) Margin', pass: false, calc_value: 4.02, abs_value: 6, greater: false },
//           { name: 'EBITDA/Net Revenue', pass: false, calc_value: 6.07, abs_value: 7, greater: false },
//           { name: 'Interest Cover', pass: true, calc_value: 17.2, abs_value: 7.5, greater: false },
//           { name: 'EBITDA Margin', pass: true, calc_value: 24.77, abs_value: 7, greater: true },
//           { name: 'Total Other Income/Revenue', pass: true, calc_value: 2.37, abs_value: 1, greater: true },
//           { name: 'Total Other Income/Net Profit/Loss Before Tax', pass: true, calc_value: 58.88, abs_value: 20, greater: true },
//           { name: 'Depreciation and Amortisation/Net Revenue', pass: true, calc_value: 1.81, abs_value: 1, greater: true },
//           { name: 'Interest/Revenue', pass: false, calc_value: 0.25, abs_value: 1, greater: false },
//         ],
//         metric: 'ABS Benchmark',
//         unit: 'Benchmark',
//         section: 'ABS Benchmarking',
//       },
//       {
//         name: 'Descending Dark',
//         data: [{ x: 1, y: 220 }, { x: 2, y: 200 }, { x: 3, y: 450 }],
//         metric: 'Ratio',
//         unit: 'days',
//         section: 'Ratio',
//       },
//     ],
//   },
// ];

const SearchDashboard: React.FC<receivedCompaniesProps> = ({companies}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // const [companyDetails, setCompanyDetails] = useState<Company | null>(null);
  // const [loading, setLoading] = useState(false);


  if (!companies || companies.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No companies to display. Start typing to search.
      </div>
    );
  }

  const selectedItem = companies.find((c) => c.companyId === selectedId) || null;

  // useEffect (() => {
  //   if(!selectedId) {
  //     setCompanyDetails(null);
  //     return;
  //   }

  //  const fetchCompanyDetails = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get<Company>(`http://localhost:3000/companies/${selectedId}`);
        
  //       // console.log("Axios reponse", response);
  //       // console.log("reponse data:", response.data);
        
  //       setCompanyDetails(response.data);
  //     } catch (err) {
  //       console.error("Error fetching company details:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCompanyDetails();
  // }, [selectedId]);


  // const selectedItem = mockData.find(item => item.id === selectedId) || null;

  

  return (
    <div className="flex h-full p-6">

        <div className="w-1/4 pr-4 border-r overflow-y-auto">
        
        {companies && companies.length > 0 ? (
          
          companies.map((company) => (
            <CompanyCard
              key={company.companyId}
              id={company.companyId}
              companyName={company.companyName}
              onClick={setSelectedId}
              isActive={company.companyId === selectedId}
            />
          ))
        ) : (
          <p className="p-4 text-gray-500">No companies to display</p>
        )}
      </div>
    
    

      {/* Left panel */}
      {/* <div className="w-1/4 pr-4 border-r">
        {mockData.map(item => (
        <CompanyCard
          key={item.id}
          id={item.id} 
          companyName={item.text}
          projectShortDescription={item.projectShortDescription}
          estDate={item.estDate} 
          onClick={() => setSelectedId(item.id)}
          isActive={item.id === selectedId}
        />
        ))}
      </div> */}

      {/* Right panel */}
      <div className = "h-[1500px] w-3/4 pl-6 border-r pr-4">
        <div className="grid grid-rows-[500px_1000px]">
          {selectedItem ? (
            <>
              <Summary company={selectedItem} />
              {/* { <div className="overflow-y-auto">
                <SearchPageGrid selectedDatasets={selectedItem} />
              </div>} */}
              <div className='overflow-y-auto'>
                <SearchPageGrid company={selectedItem} />
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center mt-20">Select a startup to see summary and metrics.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDashboard;