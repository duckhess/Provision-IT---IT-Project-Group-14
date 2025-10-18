import CovenanatsSummary from "./CovenantsSummary/CovenantsSummary";
import DataBox from "./DataBox";
import EGSScore from "./EGSScore/EGSScore";
import { useState, useEffect } from "react";
import axios from "axios";
import { data } from "react-router-dom";

// type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";
// type Metric = "Ratio" | "Revenue" | "Duration" | "ABS Benchmark" | "Forecast";
// type Section = "Ratio" | "ABS Benchmarking" | "Statement of Cashflow" | "Forecast";

// interface Dataset {
//   name: string; // label
//   data: any[];
//   metric: Metric;
//   unit: Unit;
//   section: Section;
// }

// interface GraphContainerProps {
//   selectedDatasets: Dataset[];
// }

interface BackendCompanyData {
  CompanyID: number;
  CompanyName: string;
  Industry: string;
  IndustryID: number;
  ApplicationID: number;
  YearEstablished: string;
  Location: string;
  UsageOfFunds: string;
  Amount: string;
  EnvironmentalScore: number;
  SocialScore: number;
  ShortGeneralDescription: string;
  LongGeneralDescription: string;
  ShortApplicationDescription: string;
  LongApplicationDescription: string;
}

interface DataNeeded {
  ApplicationID : number,
  SocialScore : number,
  EnvironmentalScore : number,
}

interface Company{
  companyId : number;
  companyName : string;
}

interface SearchPageGridProps {
  company : Company | null;
}

const SearchPageGrid: React.FC<SearchPageGridProps> = ({company}) => {

  const [dataNeeded,setDataNeeded] = useState<DataNeeded>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!company) return;

    const fetchScore = async() => {
      try {
        setLoading(true);
        
        // data is parsed as an array
        const response = await axios.get<BackendCompanyData[]>(
          `/api/company_data?CompanyID=${company.companyId}`
        );

        if(response.data.length > 0){
          const firstCompany = response.data[0];
          setDataNeeded({
            ApplicationID : firstCompany.ApplicationID,
            SocialScore : firstCompany.SocialScore,
            EnvironmentalScore : firstCompany.EnvironmentalScore,
          });
        } else {
          console.warn("data needed in search page grid not available");
        }

        console.log("fetched data needed:", response.data);
      } catch (err){
        console.error("error fetching data needed in search page grid", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, [company]);

  useEffect(() => {
    console.log("data updated:" , dataNeeded);
  }, [dataNeeded]);



  // const mockCategoryData =  [
  //       {
  //           name: "Technology",
  //           averageSuccess: 75,
  //           spotPercentageSuccess: 80
  //       },
  //       {
  //           name: "Health",
  //           averageSuccess: 65,
  //           spotPercentageSuccess: 70
  //       },
  //       {
  //           name: "Finance",
  //           averageSuccess: 85,
  //           spotPercentageSuccess: 90
  //       },
  //       {
  //           name: "Education",
  //           averageSuccess: 70,
  //           spotPercentageSuccess: 68
  //       },
  //       {
  //           name: "Entertainment",
  //           averageSuccess: 60,
  //           spotPercentageSuccess: 55
  //       }
  //     ]
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 items-stretch h-full">
      {/* {selectedDatasets.map((dataset, i) => (
        <div className="overflow-y-auto h-full">
        <DataBox
          key={i}
          datasets={[dataset]} // array of 1 element
          unit={dataset.unit}
          section={dataset.section}
        />
        
        </div>
        
      ))} */}

    {dataNeeded ? (<>
        <div className="overflow-y-auto h-full">
          <EGSScore social = {dataNeeded.SocialScore} environment = {dataNeeded.EnvironmentalScore} ></EGSScore>
        </div>
        <div className="overflow-y-auto h-full">
          <CovenanatsSummary applicationId = {dataNeeded.ApplicationID}></CovenanatsSummary>
        </div>
    </>) : (
      <p>No data available</p>
    )}
      
    </div>
  );
}

export default SearchPageGrid;