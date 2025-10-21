import CovenanatsSummary from "./CovenantsSummary/CovenantsSummary.tsx";
import EGSScore from "./EGSScore/EGSScore.tsx";
import Graph from "./Graph";
import ABSBenchmarking from "./GraphComponents/ABSBenchmarkingComponent/ABSBenchmarking";
import type { Metric } from "./Types/Types.tsx";
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

    case "EGS":
      const egsDataset = datasets.find(d => d.name === "EGS Score");
      return (
        <div className="flex flex-col">
            <EGSScore
              environment={egsDataset?.data.find(d => d.x === "Environmental")?.y}
              social={egsDataset?.data.find(d => d.x === "Social")?.y}
            />
            <br/>
        </div>
      );

    case "Covenant Summary":
      console.log(datasets[0].data[0]);
      return (
        <div className="flex flex-col">
            <CovenanatsSummary applicationId={datasets[0].data[0]}/>
            <br/>
        </div>
      );

    default:
      return null;
  }
}

export default DataBox;