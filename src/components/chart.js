import React, { useEffect, useState } from "react"
import flatten from "lodash/flatten"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Brush,
  XAxis,
  YAxis,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
} from "recharts"

const _1MB = 1024 * 1024

const memoryFormatter = value => {
  return `${Math.round(value / _1MB)} MB`
}

const cpuFormatter = value => {
  return `${Math.round(value)}%`
}

const timeFormatter = value => `${parseFloat(value).toFixed(2)}s`

const predefinedColors = {
  "-1": "rgba(0, 192, 0, 1)",
  "-2": "rgba(0, 255, 255, 1)",
  "-3": "rgba(255, 0, 255, 1)",
}

const getActivityColor = activity => {
  if (activity.index < 0) {
    return predefinedColors[activity.index]
  } else {
    return activity.index % 2
      ? "rgba(68, 170, 213, .2)"
      : "rgba(170, 68, 213, .2)"
  }
}

const size = 3

const getReferenceAreaProps = activity => {
  const common = {
    fill: getActivityColor(activity),
  }

  if (activity.index < 0) {
    const y1 = 100 + activity.index * size
    return {
      ...common,
      y1,
      y2: y1 + size,

      fillOpacity: 1,
    }
  } else {
    return {
      ...common,
      label: {
        value: activity.name,
        angle: -90,
      },
    }
  }
}

const TooltipValueRow = ({ label, value, fill, stroke }) => {
  return (
    <div style={{ display: `flex`, justifyContent: `space-between` }}>
      <div>
        <div
          style={{
            display: `inline-block`,
            verticalAlign: `middle`,
            marginRight: `0.5em`,
            width: `1em`,
            height: `1em`,
            position: `relative`,
            background: fill || `inherit`,
          }}
        >
          {stroke && (
            <div
              style={{
                position: `absolute`,
                left: 0,
                top: `50%`,
                right: 0,
                borderTop: `2px solid ${stroke}`,
              }}
            />
          )}
        </div>
        {label}
      </div>
      {value && <code style={{ marginLeft: `1em` }}>{value}</code>}
    </div>
  )
}

const CustomTooltip = ({
  active,
  label: frame,
  payload,
  activities,
  chartData,
}) => {
  if (!active || !payload) {
    return null
  }
  const currentActivities = activities.filter(activity => {
    const isAfterStart = frame >= activity.start
    const isBeforeEnd = activity.end === null || frame <= activity.end

    return isAfterStart && isBeforeEnd
  })

  return (
    <div
      style={{
        background: `white`,
        padding: `1em`,
        border: `1px solid gray`,
        lineHeight: 1.4,
      }}
    >
      <TooltipValueRow
        label="Time"
        value={timeFormatter(payload[0].payload[0])}
      />
      <hr />
      <TooltipValueRow
        stroke={payload[0].stroke}
        label="CPU usage"
        value={cpuFormatter(payload[0].value)}
      />
      <TooltipValueRow
        stroke={payload[1].stroke}
        label="Memory usage"
        value={memoryFormatter(payload[1].value)}
      />
      <hr />
      {currentActivities.map((activity, i) => {
        const duration =
          activity.end !== null
            ? timeFormatter(
                chartData[activity.end][0] - chartData[activity.start][0]
              )
            : `-`

        return (
          <TooltipValueRow
            key={i}
            fill={getActivityColor(activity)}
            label={activity.name}
            value={duration}
          />
        )
      })}
    </div>
  )
}

export default ({ chartData, activities }) => {
  const [range, setRange] = useState({
    startIndex: null,
    endIndex: null,
  })

  const rangeEnd = range.endIndex || chartData.length - 1
  const rangeStart = range.startIndex || 0

  return (
    <div style={{ height: `80vh` }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          syncId="anyId"
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey={0}
            label="time"
            tickFormatter={index => {
              return chartData[index][0]
            }}
          />
          <YAxis
            yAxisId="left"
            domain={[0, dataMax => Math.max(100, dataMax * 1.2)]}
            tickFormatter={cpuFormatter}
          />

          <YAxis yAxisId="area" domain={[0, 100]} hide={true} />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={memoryFormatter}
            domain={[0, dataMax => Math.max(100000000, dataMax * 1.2)]}
          />
          <Tooltip
            isAnimationActive={false}
            content={
              <CustomTooltip activities={activities} chartData={chartData} />
            }
          />

          {flatten(
            activities
              .map(activity => {
                const activityEnd = activity.end || rangeEnd

                if (activity.start > rangeEnd || activityEnd < rangeStart) {
                  return null
                }

                const actualStart = Math.max(activity.start - rangeStart, 0)
                const actualEnd = Math.min(
                  activityEnd - rangeStart,
                  rangeEnd - rangeStart
                )

                if (actualEnd === actualStart) {
                  return null
                }

                const retval = {
                  ...activity,
                  startOnGraph: actualStart,
                  endOnGraph: actualEnd,
                  isStartInGraph: activity.start - rangeStart >= 0,
                  isEndInGraph: activity.end ? activityEnd <= rangeEnd : false,
                }

                return retval
              })
              .filter(Boolean)
              .map((activity, index) => {
                const children = []

                const area = (
                  <ReferenceArea
                    key={index}
                    {...getReferenceAreaProps(activity)}
                    x1={activity.startOnGraph}
                    x2={activity.endOnGraph}
                    yAxisId="area"
                    ifOverflow="visible"
                  />
                )

                if (activity.index < 0) {
                  if (activity.isStartInGraph) {
                    children.push(
                      <ReferenceLine
                        key={`s_${index}`}
                        yAxisId="area"
                        x={activity.startOnGraph}
                        stroke={getActivityColor(activity)}
                        strokeDasharray="3 3"
                      />
                    )
                  }
                  if (activity.isEndInGraph) {
                    children.push(
                      <ReferenceLine
                        key={`e_${index}`}
                        yAxisId="area"
                        x={activity.endOnGraph}
                        stroke={getActivityColor(activity)}
                        strokeDasharray="3 3"
                      />
                    )
                  }
                }

                children.push(area)

                return children
              })
          )}
          <Line
            yAxisId="left"
            isAnimationActive={false}
            dot={false}
            dataKey={1}
            stroke="#8884d8"
            fill="#8884d8"
          />

          <Line
            yAxisId="right"
            isAnimationActive={false}
            dot={false}
            dataKey={2}
            stroke="#ff0000"
            fill="#ff0000"
          />
          <Brush
            endIndex={
              range.endIndex === chartData.length ? null : range.endIndex
            }
            startIndex={range.startIndex}
            tickFormatter={index => {
              return chartData[index][0]
            }}
            onChange={vals => {
              setRange(vals)
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
