// show the text colour based on the treshold
const getScoreColour = (score : number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
};

export default getScoreColour;