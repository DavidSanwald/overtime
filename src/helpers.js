import {
  compose,
  prop,
  applySpec,
  evolve,
  useWith,
  lte,
  map,
  where,
  ifElse,
  gte,
  gt,
  tap,
  propSatisfies,
  both,
  curry,
  sort
} from "ramda";
const isInside = curry((area, point) => {
  const { top, left, right, bottom } = area;
  const { x, y } = point;
  const xRange = sort((a, b) => a - b, [left, right]);
  const yRange = sort((a, b) => a - b, [top, bottom]);

  const isInsideX = xRange[0] < x && x < xRange[1] + 0.00001;
  const isInsideY = yRange[0] < y && y < yRange[1] + 0.00001;
  return !isInsideX || !isInsideY;
});
export { isInside };
