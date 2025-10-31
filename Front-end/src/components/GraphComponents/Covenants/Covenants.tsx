import React, { useState } from 'react';
import CovenantsLarge from './CovenantsLarge';
import CovenantsSmall from './CovenantsSmall';

type MetricItem = {
    name : string;
    pass : boolean;
    calcValue: number;
    absValue: number;
}

type CovenantsProps = {
    category : string;
    metricList : MetricItem[];
    threeYearAverageSuccess : number;
}

const Covenants: React.FC<CovenantsProps> = ({category, metricList, threeYearAverageSuccess}) => {
  
  const [expanded, setExpanded] = useState(false);

    const passMetrics = metricList.filter(m=>m.pass);
    const failMetrics = metricList.filter(m=>!m.pass);

    const spotPercentageRate = metricList.length ? (passMetrics.length / metricList.length) * 100 : 0;

    const toggleExpand = () => setExpanded((prev)=> !prev);

    return (
       <div className = "flex align-center flex-col gap-2">
        {expanded ? (
            <div onClick = {toggleExpand} className='cursor-pointer'>

            <CovenantsLarge 
                category = {category} 
                passList={passMetrics} 
                failList={failMetrics} 
                spotPercentageRate={spotPercentageRate}
                threeYearAverageSuccess = {threeYearAverageSuccess}>            
            </CovenantsLarge> 
        </div> ) : (
            <div onClick = {toggleExpand} className='cursor-pointer'>
            <CovenantsSmall 
                category = {category} 
                passNum = {passMetrics.length} 
                failNum = {failMetrics.length} 
                spotPercentageRate={spotPercentageRate}>            

            </CovenantsSmall> 
            </div>
        )}
       
        
    </div>
  )
}

export default Covenants