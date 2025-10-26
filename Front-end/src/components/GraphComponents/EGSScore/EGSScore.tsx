import React, {useState} from 'react'
import EGSScoreSmall from './EGSScoreSmall';
import EGSScoreLarge from './EGSScoreLarge';

interface EGSScore {
  social : number;
  environment : number;
  governance : number;
}

const EGSScore: React.FC<EGSScore> = ({social, environment, governance}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {expanded ? (
        <div onClick={toggleExpand} className="cursor-pointer">
            <EGSScoreLarge social = {social} environment = {environment} governance={governance}/>
        </div>
      ) : (
        <div onClick={toggleExpand} className="cursor-pointer">
          <EGSScoreSmall social = {social} environment = {environment} governance={governance} />
        </div>
      )}
    </div>
  );
};

export default EGSScore