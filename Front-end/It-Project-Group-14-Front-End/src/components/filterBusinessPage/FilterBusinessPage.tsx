import React, {useState} from 'react'
import ABSBenchmarking from './ABSBenchmarkingComponent/ABSBenchmarking';
import SidebarFilter from './sideBar/SidebarFilter';
import SideBarFilterButton from './sideBar/SideBarFilterButton';
import Covenants from './Covenants/Covenants';

const mockABSMetrics = [
    { name: "Wages and Salaries/Revenue", pass: true, calc_value: 7.44, abs_value: 14, greater: false},
    { name: "Total Expenses/Total Income", pass: true, calc_value: 83.61, abs_value: 94, greater: false },
    { name: "Total Expenses/Revenue", pass: true, calc_value: 20.50, abs_value: 96, greater: false},
    { name: "Operating Profit Before Tax/Total Income", pass: true, calc_value: 4.02, abs_value: 6, greater: true},
    { name: "Net Profit/Loss (-) Margin", pass: false, calc_value: 4.02, abs_value: 6, greater: false},
    { name: "EBITDA/Net Revenue", pass: false, calc_value: 6.07, abs_value : 7, greater: false},
    { name: "Interest Cover", pass: true, calc_value: 17.20, abs_value: 7.5, greater: false},
    { name: "EBITDA Margin", pass: true, calc_value: 24.77, abs_value: 7, greater: true},
    { name: "Total Other Income/Revenue", pass: true, calc_value: 2.37, abs_value:1, greater: true},
    { name: "Total Other Income/Net Profit/Loss Before Tax", pass: true, calc_value: 58.88, abs_value: 20, greater: true},
    { name: "Depreciation and Amortisation/Net Revenue", pass: true, calc_value: 1.81, abs_value: 1, greater: true},
    { name: "Interest/Revenue", pass: false, calc_value: 0.25, abs_value: 1, greater: false}
];

const mockLiquidityMetrics = [
    {name : "current ratio", pass: false, calc_value : 1.93, abs_value : 88},
    {name : "quick ratio", pass : false, calc_value : 0.96, abs_value:1},
]

const mockSolvencyMetrics = [
    {name : "debt ratio", pass : true, calc_value : 47.52, abs_value: 40},
    {name: "equity ratio", pass: false, calc_value : 52.48, abs_value : 60},
    {name: "quasi equity ratio", pass: true, calc_value: 63.93, abs_value: 15},
    {name : "capitalisation ratio", pass: true, calc_value: 190.55, abs_value: 123},
    {name : "interest cover", pass: true, calc_value: 17.2, abs_value: 3},

]

const mockProfitabilityMetrics = [
    {name : "gross profit margin", pass: false, calc_value : 22.15, abs_value: 40},
    {name : "net profit margin", pass: false, calc_value: 4.02, abs_value: 15},
    {name : "return on total assets", pass: true, calc_value: 8.20, abs_value: 8},
    {name:  "receivables turnover", pass: true, calc_value : 8.79, abs_value : 2},
    {name : "inventory turnover", pass : false, calc_value: 0, abs_value: 2},
    {name : "creaditors turnover", pass: true, calc_value : 12.77, abs_value: 2},
    {name : "average collection period (days", pass : false, calc_value : 41.57, abs_value: 30},
]

const mockEfficiencyMetrics = [

]

type DataSet = {
    name: string;
    section: string;
}

const FilterBusinessPage= () => {

    const [selectMetrics, setSelectedMetrics] = useState<string[]>([]);
    const [selectDataSet, setSelectedDataSet] = useState<DataSet[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const metricNames = mockABSMetrics.map(m => m.name);
  return (
    <div className='flex h-screen'>
        <SideBarFilterButton onClick={()=>setSidebarOpen(!sidebarOpen)}/>
        
        {sidebarOpen && 
        <SidebarFilter 
        onClose={()=> setSidebarOpen(false)}
        metrics = {metricNames}
        selectedMetric={selectMetrics}
        setSelectedMetrics={setSelectedMetrics}/>}

        <ABSBenchmarking code = {"ABC123"} metric_list = {mockABSMetrics}/>
        <Covenants category='Liquidity' metric_list={mockLiquidityMetrics} threeYearAverageSuccess={100}/>
        <Covenants category = "Solvency (Leverage)" metric_list={mockSolvencyMetrics} threeYearAverageSuccess={50}/>
        <Covenants category = "Profitability" metric_list={mockProfitabilityMetrics} threeYearAverageSuccess={50}/>
       
    </div>
  )
}

export default FilterBusinessPage