import React, { useState, useRef } from "react";
import { tap, prop, map, compose, pluck, chain, lensProp } from "ramda";
import * as d3 from "d3";
import useDims from "./useDims";
import useExtent from "./useExtent";
import Group from "./Group";
import { GridColumns } from "@vx/grid";
import XAxis from "./Axis/XAxis";
import YAxis from "./Axis/YAxis";
import Tooltip from "./Tooltip";
import useBrush from "./useDragBrush";
import { localPoint } from "./localPoint";
const peek = tap(x => console.log(x));
const bisectDate = d3.bisector(d => d).left;

const colors = [
  "#ffd700",
  "#ffb14e",
  "#fa8775",
  "#ea5f94",
  "#cd34b5",
  "#9d02d7",
  "#0000ff"
];
const width = 1200;
const height = 800;

const format = d3.timeParse("%Y");
const xAcc = compose(
  format,
  prop("year")
);
const yAcc = prop("count");

const Chart = ({ data: rawData }) => {
  const ttRef = useRef("");
  const eventRef = useRef("");
  const allData = chain(prop("values"), rawData);
  const color = d3
    .scaleOrdinal()
    .range(colors)
    .domain(pluck("company", allData));
  const [ttState, setTTState] = useState("");
  const plotSeries = series => {
    const circleColor = color(series.company);
    return series.values.map(value => (
      <circle
        cx={x(value)}
        cy={y(value)}
        fill={circleColor}
        r={8}
        onMouseEnter={() =>
          setTTState({
            left: x(value),
            top: y(value),
            company: series.company,
            year: value.year,
            indicator: value.indicator
          })
        }
      />
    ));
  };
  const xExtent = useExtent(xAcc, allData);
  const yExtent = useExtent(yAcc, allData);
  const { margin, innerHeight, innerWidth } = useDims(width, height);
  const xScale = d3
    .scaleTime()
    .range([0, innerWidth])
    .domain(xExtent);
  const yScale = d3
    .scaleLinear()
    .range([innerHeight, 0])
    .domain(yExtent);
  const x = compose(
    xScale,
    xAcc
  );
  const y = compose(
    yScale,
    yAcc
  );
  const lineGen = d3
    .line()
    .y(d => y(d))
    .x(d => x(d))
    .curve(d3.curveCatmullRom);
  const [state, events] = useBrush("drag");
  const { area, dragArea } = state;
  const rectArea = state.currentStatus === "dragging" ? dragArea : area;
  const { top, bottom, left, right } = rectArea;
  const years = pluck("year", rawData[0].values);
  console.log(years);
  console.log(xScale.invert(left));
  console.log(xScale.invert(right));
  const index = bisectDate(
    peek(
      years.map(
        compose(
          xScale,
          format
        )
      )
    ),
    left
  );
  const index2 = bisectDate(
    peek(
      years.map(
        compose(
          xScale,
          format
        )
      )
    ),
    right
  );
  console.log(index);

  return (
    <>
      <svg width={width} height={height}>
        <Group top={margin.top} left={margin.left}>
          {rawData.map(datum => (
            <path
              d={lineGen(datum.values)}
              fill="none"
              stroke={color(datum.company)}
              strokeWidth="2px"
            />
          ))}
          {chain(plotSeries, rawData)}
          <XAxis
            xScale={xScale}
            innerWidth={innerWidth}
            innerHeight={innerHeight}
            margin={margin}
          />
          <YAxis
            yScale={yScale}
            innerWidth={innerWidth}
            innerHeight={innerHeight}
            margin={margin}
          />
        </Group>
      </svg>
      <svg width={width} height={height / 3}>
        <Group top={margin.top} left={margin.left}>
          <rect
            pointerEvents="all"
            fill="black"
            opacity="0"
            height={innerHeight}
            width={innerWidth}
            ref={eventRef}
            onMouseMove={e =>
              events.onMouseMove(localPoint(eventRef.current, e.nativeEvent))
            }
            onMouseDown={e =>
              events.onMouseDown(localPoint(eventRef.current, e.nativeEvent))
            }
            onMouseUp={e => events.onMouseUp()}
          />
          <rect
            x={xScale(format(years[index]))}
            y={0}
            width={Math.min(
              Math.max(
                0,
                xScale(format(years[index2])) - xScale(format(years[index]))
              ),
              innerWidth
            )}
            height={84}
            pointerEvents="none"
            fill="black"
            stroke="black"
            fillOpacity={0.02}
          />
          <GridColumns scale={xScale} stroke="black" height={innerHeight / 8} />
          <XAxis
            xScale={xScale}
            innerWidth={innerWidth}
            innerHeight={innerHeight / 8}
            margin={margin}
          />
        </Group>
      </svg>
      {ttState && (
        <Tooltip
          top={ttState.top + margin.top}
          left={ttState.left + margin.left}
          ref={ttRef}
        >
          <span>{ttState.company}</span>
          <span>{ttState.indicator}</span>
          <span>{ttState.year}</span>
        </Tooltip>
      )}
    </>
  );
};
export default Chart;
