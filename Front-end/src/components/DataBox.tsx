// import Graph from "./Graph";
// import ABSBenchmarking from "./GraphComponents/ABSBenchmarkingComponent/ABSBenchmarking";
// import { Metric } from "../Types/Types";

// type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

// // type Section = "Ratio" | "ABS Benchmarking" | "Statement of Cashflow" | "Forecast";

// interface Dataset {
//   name: string; // label
//   data: any[];
//   metric: Metric;
//   unit: Unit;
//   // section: Section;
// }

// interface GraphProps {
//   datasets: Dataset[]; // up to 4 datasets
//   unit: Unit;
//   // section: Section;
//   metric: Metric;
// }

// // function DataBox({ datasets, unit, section}: GraphProps) {

// //   switch (section) {
// //     case "Ratio":
// //       return (
// //         <div className="flex flex-col">
// //             <Graph datasets={datasets} unit={unit} title={section}/>
// //         </div>
// //       );

// //     case "ABS Benchmarking":
// //       return (
// //         <div className="flex flex-col">
// //             <ABSBenchmarking code = {"ABC123"} metric_list = {datasets[0].data}></ABSBenchmarking>
// //         </div>
// //       );

// //     case "Statement of Cashflow":
// //       return (
// //         <div className="flex flex-col">
// //             <Graph datasets={datasets} unit={unit} title={section}/>
// //             <br/>
// //         </div>
// //       );
    
// //     case "Forecast":
// //       return (
// //         <div className="flex flex-col">
// //             <Graph datasets={datasets} unit={unit} title={section}/>
// //             <br/>
// //         </div>
// //       );

// //     default:
// //       return null;
// //   }
// // }

// function DataBox({ datasets, unit, metric}: GraphProps) {

//   switch (metric) {
//     case "Ratio":
//       return (
//         <div className="flex flex-col">
//             <Graph datasets={datasets} unit={unit} title={metric}/>
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
//             <Graph datasets={datasets} unit={unit} title={metric}/>
//             <br/>
//         </div>
//       );
    
//     case "Forecast":
//       return (
//         <div className="flex flex-col">
//             <Graph datasets={datasets} unit={unit} title={metric}/>
//             <br/>
//         </div>
//       );

//     default:
//       return null;
//   }
// }

// export default DataBox;

import Graph from "./Graph";
import ABSBenchmarking from "./GraphComponents/ABSBenchmarkingComponent/ABSBenchmarking";
import type { Metric } from "../Types/Types";
import Covenants from "./filterBusinessPage/Covenants/Covenants.tsx";

type Unit = "%" | "$" | "days" | "Benchmark" | "Times" | "Ratio";

interface Dataset {
  // label
  name: string;
   
  data: any[];
  metric: Metric;
  unit: Unit;
  metadata?: Record<string, any>;
}

interface GraphProps {
  datasets: Dataset[]; // up to 4 datasets
  unit: Unit;
  // section: Section;
  metric: Metric;
}

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
            <ABSBenchmarking code = {datasets[0].metadata?.ANZICCode} metric_list = {datasets[0].data}></ABSBenchmarking>
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

    case "cash_equivalences":
      return (
        <div className="flex flex-col">
            <Graph datasets={datasets} unit={unit} title={metric}/>
            <br/>
        </div>
      );

    case "covenants":
      console.log("Name: " + datasets[0].name);
      console.log("Metrics: " + JSON.stringify(datasets[0].data, null, 2));
      console.log("3 Yr: " + datasets[0].metadata?.threeYearAvgSuccess);
      return (
        <div className="flex flex-col">
            <Covenants category={datasets[0].name} metric_list={datasets[0].data[0]} threeYearAverageSuccess={datasets[0].metadata?.threeYearAvgSuccess} />
            <br/>
        </div>
      );

    case "assets":
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