import Graph from "./Graph";
import ABSBenchmarking from "./GraphComponents/ABSBenchmarkingComponent/ABSBenchmarking";

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

interface GraphProps {
  datasets: Dataset[]; // up to 4 datasets
  unit: Unit;
  section: Section;
}

function DataBox({ datasets, unit, section}: GraphProps) {

  switch (section) {
    case "Ratio":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={section}/>
        </div>
      );

    case "ABS Benchmarking":
      return (
        <div className="flex flex-col">
            <ABSBenchmarking code = {"ABC123"} metric_list = {datasets[0].data}></ABSBenchmarking>
        </div>
      );

    case "Statement of Cashflow":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={section}/>
            <br/>
        </div>
      );
    
    case "Forecast":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={section}/>
            <br/>
        </div>
      );

    default:
      return null;
  }
}

export default DataBox;