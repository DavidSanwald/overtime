function generateSeededRandom(baseSeed = 2) {
    let seed = baseSeed;
    return function seededRandom(max, min) {
      max = max || 1;
      min = min || 0;
  
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
  
      return min + rnd * (max - min);
    }}

const seededRandom = generateSeededRandom(9);
const totalValues = 100;

function getRandomSeriesData(total) {
  const result = [];
  let lastY = seededRandom() * 40 - 20;
  let y;
  const firstY = lastY;
  for (let i = 0; i < total; i++) {
    y = seededRandom() * firstY - firstY / 2 + lastY;
    result.push({
      x: i,
      y
    });
    lastY = y;
  }
  return result;
}
export default getRandomSeriesData