import Graph from "./Graph";
import ABSBenchmarking from "./GraphComponents/ABSBenchmarkingComponent/ABSBenchmarking";
import type { Metric } from "./Types/Types.tsx";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

// type Section = "Ratio" | "ABS Benchmarking" | "Statement of Cashflow" | "Forecast";

interface Dataset {
  name: string; // label
  data: any[];
  metric: Metric;
  unit: Unit;
  // section: Section;
}

interface GraphProps {
  datasets: Dataset[]; // up to 4 datasets
  unit: Unit;
  // section: Section;
  metric: Metric;
}

// function DataBox({ datasets, unit, section}: GraphProps) {

//   switch (section) {
//     case "Ratio":
//       return (
//         <div className="flex flex-col">
//             <Graph datasets={datasets} unit={unit} title={section}/>
//         </div>
//       );

//     case "ABS Benchmarking":
//       return (
//         <div className="flex flex-col">
//             <ABSBenchmarking code = {"ABC123"} metric_list = {datasets[0].data}></ABSBenchmarking>
//         </div>
//       );

//     case "Statement of Cashflow":
//       return (
//         <div className="flex flex-col">
//             <Graph datasets={datasets} unit={unit} title={section}/>
//             <br/>
//         </div>
//       );
    
//     case "Forecast":
//       return (
//         <div className="flex flex-col">
//             <Graph datasets={datasets} unit={unit} title={section}/>
//             <br/>
//         </div>
//       );

//     default:
//       return null;
//   }
// }

function DataBox({ datasets, unit, metric}: GraphProps) {
  // console.log(metric);
  switch (metric) {
    case "Ratio":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={metric}/>
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
            <Graph datasets={datasets} unit={unit} title={metric}/>
            <br/>
        </div>
      );
    
    case "Forecast":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={metric}/>
            <br/>
        </div>
      );

    case "Duration":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={metric}/>
            <br/>
        </div>
      );
    case "equities":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={metric}/>
            <br/>
        </div>
      );
    case "financial_statements":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={metric}/>
            <br/>
        </div>
      );
    case "income_statements":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={metric}/>
            <br/>
        </div>
      );
    case "key_ratios":
      console.log(datasets);
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={metric}/>
            <br/>
        </div>
      );
    case "liabilities":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={metric}/>
            <br/>
        </div>
      );

    case "working_capital_movements":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={metric}/>
            <br/>
        </div>
      );

    default:
      return null;
  }
}

export default DataBox;