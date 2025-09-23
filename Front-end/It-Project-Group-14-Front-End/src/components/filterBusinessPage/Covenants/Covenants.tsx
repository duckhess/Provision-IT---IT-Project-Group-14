import React, { useState } from 'react';
import CovenantsLarge from './CovenantsLarge';
import CovenantsSmall from './CovenantsSmall';

type MetricItem = {
    name : string;
    pass : boolean;
    calc_value: number;
    abs_value: number;
}

type CovenantsProps = {
    category : string;
    metric_list : MetricItem[];
    threeYearAverageSuccess : number;
}

const Covenants: React.FC<CovenantsProps> = ({category, metric_list, threeYearAverageSuccess}) => {
  
  const [expanded, setExpanded] = useState(false);

    const passMetrics = metric_list.filter(m=>m.pass);
    const failMetrics = metric_list.filter(m=>!m.pass);

    const spotPercentageRate = metric_list.length ? (passMetrics.length / metric_list.length) * 100 : 0;

    const toggleExpand = () => setExpanded((prev)=> !prev);

    return (
       <div className = "flex align-center flex-col gap-2">
        {expanded ? (
            <div onClick = {toggleExpand} className='cursor-pointer'>

            <CovenantsLarge 
                category = {category} 
                pass_list={passMetrics} 
                fail_list={failMetrics} 
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