import { useMemo } from 'react'

const defaultMargin = {
  top: 64,
  bottom: 64,
  left: 64,
  right: 64
}

const useDims = (width, height, partialMargin = {}) =>
  useMemo(() => {
    const margin = {
      ...defaultMargin,
      ...partialMargin
    }
    return {
      margin,
      innerWidth: width - margin.left - margin.right,
      innerHeight: height - margin.top - margin.bottom,
      outerWidth: width,
      outerHeight: height
    }
  }, [
    width,
    height,
    partialMargin.top,
    partialMargin.right,
    partialMargin.bottom,
    partialMargin.left
  ])
export default useDims