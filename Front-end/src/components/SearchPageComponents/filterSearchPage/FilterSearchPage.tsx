import React, { useState, useEffect } from 'react'
import FilterButton from './FilterButton'
import Overlay from './Overlay'
import axios from "axios"
// import { data } from 'react-router-dom';

interface Company {
  companyId: number;
  companyName: string;
}

interface FilterSearchPageProps {
    allCompanies : Company[];
    setSearchResults : React.Dispatch<React.SetStateAction<Company[]>>;
};

interface DataNeeded {
    companyID : number, 
    companyName : string
    amountOfFundNeeded : string,
    amountValue:number,
    industry : string,
    industryID : number,
    location : string,
}

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

type AmountRange = "low" | "medium" | "high" | "";

const FilterSearchPage : React.FC<FilterSearchPageProps> = ({allCompanies,setSearchResults}) => {

    const [showOverlay, setShowOverlay] = useState(false);

    const [filters, setFilters] = useState({
        amountRange : "" as AmountRange,
        industry : "",
        location: "",
    });

    const [companyData, setCompanyData] = useState<DataNeeded[]>([])
    const [_, setLoading] = useState<Boolean>(false);

    useEffect(()=>{
        const fetchCompanyData = async() => {
            setLoading(true);
            try{
                const allData : DataNeeded[] = await Promise.all(
                    allCompanies.map(async(company) => {
                        try {
                            const res = await  axios.get<BackendCompanyData[]>(`/api/company_data?CompanyID=${company.companyId}`)
                            const backend = res.data;

                            if(!backend || backend.length === 0){
                                return {
                                    companyID : company.companyId,
                                    companyName : company.companyName,
                                    industry: "",
                                    industryID : -1,
                                    location:'',
                                    amountOfFundNeeded:'',
                                    amountValue:0,
                                }
                            }

                            const firstCompay = backend[0]

                            console.log("All data", backend);

                            console.log("BackendAmoutn", firstCompay.Amount);

                            const amountNumeric = Number(
                                firstCompay.Amount.replace(/[^0-9.-]+/g, "")
                            );

                            const mapped : DataNeeded = {
                                companyID: firstCompay.CompanyID,
                                companyName : firstCompay.CompanyName,
                                industry : firstCompay.Industry,
                                industryID : firstCompay.IndustryID,
                                location : firstCompay.Location, 
                                amountOfFundNeeded:firstCompay.Amount,
                                amountValue : amountNumeric,
                            }

                            return mapped
                        } catch(err) {
                            console.error(`Error fetching company ${company.companyName}:`, err)
                            return {
                                companyID : company.companyId,
                                companyName : company.companyName,
                                industry: "",
                                industryID : -1,
                                location:'',
                                amountOfFundNeeded:'',
                                amountValue:0,
                            }
                        }
                    })
                )
                setCompanyData(allData)
                setSearchResults(allData.map(c => ({
                    companyId: c.companyID,
                    companyName: c.companyName,
                })));
            } catch (err) {
                console.error('Error fetching all company data', err)
            } finally {
                setLoading(false)
            }
        }

        if (allCompanies && Array.isArray(allCompanies) && allCompanies.length > 0) {
            fetchCompanyData();
        }
    }, [allCompanies, setSearchResults])


    const industryOptions = Array.from(new Set(companyData.map(c=>c.industry).filter(Boolean)));
     const locationOptions = Array.from(new Set(companyData.map(c=>c.location).filter(Boolean)));
    
    const applyFilters = () => {
        let filtered = companyData

        if(filters.industry) {
            filtered = filtered.filter((c)=>c.industry === filters.industry)
        }

        if(filters.location){
            filtered = filtered.filter((c) => c.location === filters.location)
        }

        console.log("Filtering amountRange:", filters.amountRange);
        console.log("Company amounts:", companyData.map(c => ({name: c.companyName, amountValue: c.amountValue})));

        if(filters.amountRange) {
            filtered = filtered.filter((c) => 
            {
                const val = c.amountValue;
                if(filters.amountRange === "low") return val < 1500000;
                if(filters.amountRange === "medium") return val >= 1500000 && val <= 3000000;
                if(filters.amountRange === "high") return val > 3000000;
                return true;
            });
        }

        console.log("Filtered Results", filtered);

        setSearchResults(filtered.map(c=>({
            companyId : c.companyID,
            companyName : c.companyName,
        })));
    }

    return (
        <div>
            <FilterButton data-testid="filterButton" onClick={()=>setShowOverlay(true)}></FilterButton>
            {showOverlay && 
            <Overlay 
            data-testid="overlay"
            onClose={()=>setShowOverlay(false)}
            filters = {filters}
            setFilters = {setFilters}
            industryOptions={industryOptions}
            locationOptions={locationOptions}
            onApplyFilters={()=>{
                applyFilters();
                setShowOverlay(false);
              }}>
            </Overlay>}
        </div>
    )
}

export default FilterSearchPage