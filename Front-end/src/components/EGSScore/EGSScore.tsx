import React, {useState} from 'react'
import EGSScoreSmall from './EGSScoreSmall';
import EGSScoreLarge from './EGSScoreLarge';

interface EGSScore {
  social : number;
  environment : number;
}

const EGSScore: React.FC<EGSScore> = ({social, environment}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {expanded ? (
        <div onClick={toggleExpand} className="cursor-pointer">
            <EGSScoreLarge social = {social} environment = {environment}/>
        </div>
      ) : (
        <div onClick={toggleExpand} className="cursor-pointer">
          <EGSScoreSmall social = {social} environment = {environment}/>
        </div>
      )}
    </div>
  );
};

export default EGSScore