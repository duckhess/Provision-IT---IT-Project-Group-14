import CovenanatsSummary from "../GraphComponents/CovenantsSummary/CovenantsSummary";
import EGSScore from "../GraphComponents/EGSScore/EGSScore";
import { useState, useEffect } from "react";
import axios from "axios";
import Graph from "../GraphComponents/Graph"
import type { Metric } from "../Types/Types";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";


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
  GovernanceScore : number;
}

interface CompanyDataNeeded {
  ApplicationID : number,
  SocialScore : number,
  EnvironmentalScore : number,
  GovernanceScore : number,
}

interface Company{
  companyId : number;
  companyName : string;
}

interface SearchPageGridProps {
  company : Company | null;
}

interface BackendBestMetrics {
  CompanyID : number;
  ApplicationID : number;
  Table : string;
  MetricID : number;
  MetricName : string,
  Unit : string,
  Data : {Timeline : number; Value : number}[];
}

interface BackendWCM {
  CapitalID : number;
  MetricName : string;
  Unit : Unit;
  ApplicationID : number;
  Period : number;
  Value : number;
  "Avg Historical Forecast" : number;
  "User Forecast" : number;
}

interface Dataset{
  name : string;
  data : {x:any; y:any}[];
  metric : Metric;
  unit : Unit;
}


const SearchPageGrid: React.FC<SearchPageGridProps> = ({company}) => {

  //for companyData
  const [dataNeeded,setDataNeeded] = useState<CompanyDataNeeded>();
  const [loading, setLoading] = useState(false);

  // for bestMetrics
  const [bestMetrics, setBestMetrics] = useState<Dataset[]>([]);
  const [titleBestMetrics, setTitleBestMetrics] = useState<string>("");

  // for working capital movement 
  const [workingCapitalMovement, setWorkingCapitalMovement] = useState<Dataset[]>([]);

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
            GovernanceScore : firstCompany.GovernanceScore,
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

  // for fetching best 4 metrics defined for each company
  useEffect(() => {
    if(!company?.companyId)return;

    const fetchBestMetrics = async() => {
      try {
        const response = await axios.get<BackendBestMetrics[]>(
          `/api/best_data?CompanyID=${company.companyId}`);
        const backendData = response.data;

        console.log("best 4 metrics raw response", backendData);

        if(!Array.isArray(backendData) || backendData.length === 0){
          setBestMetrics([]);
          setTitleBestMetrics("");
          return;
        }

        const chartTitle = backendData[0].Table || "";

        const dataNeeded : Dataset[] = backendData.map(metric => ({
          name : metric.MetricName,
          data : metric.Data
          .filter(d=>typeof d.Timeline==="number" && typeof d.Value==="number")
          .map(d=>({x:d.Timeline, y:d.Value})),
          metric : metric.Table as Metric,
          unit : metric.Unit as Unit,
        }));

        console.log("data needed : ", dataNeeded);

        setTitleBestMetrics(chartTitle);
        setBestMetrics(dataNeeded);
      } catch(err) {
      console.error("Failed to fecth best 4 metrics", err);
      setBestMetrics([]);
      setTitleBestMetrics("");
      }
    } ;
    fetchBestMetrics();
  }, [company?.companyId]);

  useEffect(()=>
  console.log("best metrics", bestMetrics), [bestMetrics])


  
  useEffect(()=>{
    // we only interested in the one that is $ for this search grid 
    const fetchWorkingCapital = async() =>{
      try{
        const response = await axios.get<BackendWCM[]>(
          `/api/working_capital_movements?ApplicationID=${dataNeeded?.ApplicationID}`
        );
        const backendData = response.data;

         if(!Array.isArray(backendData) || backendData.length === 0){
          setWorkingCapitalMovement([]);
          return;
        }

        const metricMap = new Map<string, BackendWCM[]>();
        backendData.forEach(item => {
          if(item.Unit !== "$"){
            console.warn(`Skipping row for metric ${item.MetricName} with unit ${item.Unit}`);
            return;
          }

          if(!metricMap.has(item.MetricName)) metricMap.set(item.MetricName, []);
          metricMap.get(item.MetricName)!.push(item);
        });

        console.log("metric map,", metricMap);

        const data : Dataset[] = Array.from(metricMap.entries()).map(
          ([metricName, items]) => ({
            name: metricName,
            data: items.map(item => ({
                  x: "Avg Historical Forecast",
                  y: item["Avg Historical Forecast"]
                })).concat(items.map(item => ({
                  x: "User Forecast",
                  y: item["User Forecast"]
                }))),
              metric: items[0].MetricName as Metric,
              unit: '$' as Unit,
          }));
        console.log("final datasets: ", data);
        setWorkingCapitalMovement(data);
      } catch (err) {
        console.error("failed to fetch working capital movement", err);
        setWorkingCapitalMovement([]);
      }
    };

    if(dataNeeded?.ApplicationID){
      fetchWorkingCapital();
    }
  }, [dataNeeded?.ApplicationID]);

  useEffect(()=>{
    console.log("working capital : ", workingCapitalMovement);
  }, [workingCapitalMovement])

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 items-stretch h-full">

    {dataNeeded ? (<>
        <div className="overflow-y-auto h-full">
          <EGSScore social = {dataNeeded.SocialScore} environment = {dataNeeded.EnvironmentalScore} governance={dataNeeded.GovernanceScore}></EGSScore>
        </div>
        <div className="overflow-y-auto h-full">
          <CovenanatsSummary applicationId = {dataNeeded.ApplicationID}></CovenanatsSummary>
        </div>
        <div className="overflow-y-auto h-full">
          <Graph datasets={bestMetrics} unit={bestMetrics[0]?.unit as Unit} title={titleBestMetrics}></Graph>
        </div>
        <div className="overflow-y-auto h-full">
          <Graph datasets={workingCapitalMovement} unit={workingCapitalMovement[0]?.unit as Unit} title={"Working Capital Movement"}></Graph>
        </div>

    </>) : (
      <p>No data available</p>
    )}
      
    </div>
  );
}

export default SearchPageGrid;