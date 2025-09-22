import React from 'react'
import ABSBenchmarking from './dataContainer/ABSBenchmarking/ABSBenchmarking';

const SideBarFilter = () => {

    const mockMetrics = [
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

  return (
    <div className='flex flex-col gap-2'>sideBarFilter
       <ABSBenchmarking code = {"ABC123"} metric_list = {mockMetrics}></ABSBenchmarking>
    </div>
  )
}

export default SideBarFilter