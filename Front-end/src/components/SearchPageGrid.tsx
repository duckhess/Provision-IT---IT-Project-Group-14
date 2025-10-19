import CovenanatsSummary from "./CovenantsSummary/CovenantsSummary";
import DataBox from "./DataBox";
import EGSScore from "./EGSScore/EGSScore";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";
type Metric = "Ratio" | "Revenue" | "Duration" | "ABS Benchmark" | "Forecast";
type Section = "Ratio" | "ABS Benchmarking" | "Statement of Cashflow" | "Forecast";

interface Dataset {
  name: string; // label
  data: any[];
  metric: Metric;
  unit: Unit;
  section: Section;
}

interface GraphContainerProps {
  selectedDatasets: Dataset[];
}

function SearchPageGrid({ selectedDatasets }: GraphContainerProps) {

  const mockCategoryData =  [
        {
            name: "Technology",
            averageSuccess: 75,
            spotPercentageSuccess: 80
        },
        {
            name: "Health",
            averageSuccess: 65,
            spotPercentageSuccess: 70
        },
        {
            name: "Finance",
            averageSuccess: 85,
            spotPercentageSuccess: 90
        },
        {
            name: "Education",
            averageSuccess: 70,
            spotPercentageSuccess: 68
        },
        {
            name: "Entertainment",
            averageSuccess: 60,
            spotPercentageSuccess: 55
        }
      ]
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 items-stretch h-full">
      {selectedDatasets.map((dataset, i) => (
        <div className="overflow-y-auto h-full">
        {/* <DataBox
          key={i}
          datasets={[dataset]} // array of 1 element
          unit={dataset.unit}
          section={dataset.section}
        /> */}
        
        </div>
        
      ))}
      {/* <div className="overflow-y-auto h-full">
        <EGSScore social =  {70} environment={80}></EGSScore>
      </div>
      <div className="overflow-y-auto h-full">
        <CovenanatsSummary datasets={mockCategoryData}></CovenanatsSummary>
      </div> */}
    
      
    </div>
  );
}

export default SearchPageGrid;