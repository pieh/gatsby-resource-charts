import React from "react"
// import Links from "../components/links"
import Chart from "../components/chart"

import JSONStringify from "../../processed/cHVibGlzaC1yZXByby9ob3VzZWNhbGwtZ3Jvd3RoLXNpdGU_/1554906798928.json"
import V8Serialize from "../../processed/cHVibGlzaC1yZXByby9ob3VzZWNhbGwtZ3Jvd3RoLXNpdGU_/1554905050425.json"

export default () => {
  return (
    <React.Fragment>
      <h2>
        <code>JSON.stringify</code> (current) / (using default Node.js memory
        limit ~1.4GB) / <span style={{ color: "red" }}>crash</span>
      </h2>
      <p>
        Notice how memory is flatlining at ~84s - this is when process crashes
        because of out of memory error.
      </p>
      <Chart
        id="JSONStringify"
        activities={JSONStringify.activities}
        chartData={JSONStringify.bufferedLines}
      />

      <h2>
        <code>V8.serialize</code> (proposed changes) / (using artificially
        limited memory limit to 1GB) /{" "}
        <span style={{ color: "green" }}>works</span>
      </h2>
      <Chart
        id="V8Serialize"
        activities={V8Serialize.activities}
        chartData={V8Serialize.bufferedLines}
      />
    </React.Fragment>
  )
}
