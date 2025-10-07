import Graph from "./Graph";
import ABSBenchmarking from "./ABSBenchmarking";

type Unit = "%" | "$" | "days";
type Metric = "Ratio" | "Revenue" | "Duration" | "Forecast";
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
            <Graph datasets={datasets} unit={unit} />
            <p>Section: Ratio</p>
        </div>
      );

    case "ABS Benchmarking":
      return (
        <div className="flex flex-col">
            <ABSBenchmarking code = {"ABC123"} metric_list = {datasets[0].data}></ABSBenchmarking>
            <p>ABS</p>
        </div>
      );

    case "Statement of Cashflow":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} />
            <br/>
            <p>Section: Statement of Cashflow</p>
        </div>
      );
    
    case "Forecast":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} />
            <br/>
            <p>Section: Forecast</p>
        </div>
      );

    default:
      return null;
  }
}

export default DataBox;