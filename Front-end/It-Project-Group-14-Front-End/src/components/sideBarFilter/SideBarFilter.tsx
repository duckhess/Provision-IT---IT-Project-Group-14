import React from 'react'
import ABSBenchmarking from './dataContainer/ABSBenchmarking/ABSBenchmarking';

const SideBarFilter = () => {

    const mockMetrics = [
    { name: "Speed", pass: true, calc_value: 98, abs_value: 100 },
    { name: "Accuracy", pass: false, calc_value: 70, abs_value: 85 },
    { name: "Efficiency", pass: true, calc_value: 92, abs_value: 95 },
    { name: "Safety", pass: false, calc_value: 60, abs_value: 90 },
    { name: "random", pass: false, calc_value:50, abs_value:60},
    { name: "ChickenNuggies", pass: false, calc_value:50, abs_value:60},
    { name: "Borgar", pass: false, calc_value:50, abs_value:60},
    { name: "IT WORKS LESGOOOOOO", pass: false, calc_value:50, abs_value:60},
  ];

  return (
    <div className='flex flex-col gap-2'>sideBarFilter

       <ABSBenchmarking code = {"ABC123"} metric_list = {mockMetrics}></ABSBenchmarking>
    </div>
  )
}

export default SideBarFilter