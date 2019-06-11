import { useMemo } from "react";
import { map, apply, juxt, compose } from "ramda";

const extent = apply(juxt([Math.min, Math.max]));

const useExtent = (acc, data) =>
  useMemo(() => {
    const computedExtent = compose(
      extent,
      map(acc)
    )(data);
    return computedExtent;
  }, [acc, data]);

export default useExtent;
