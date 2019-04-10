import React from "react"
import Chart from "../components/chart"
import Links from "../components/links"

import data from "../../processed/cHVibGlzaC1yZXByby9ob3VzZWNhbGwtZ3Jvd3RoLXNpdGU_/1554906798928.json"

export default () => {
  return (
    <React.Fragment>
      <h1>
        <code>JSON.stringify</code>
      </h1>
      <Chart activities={data.activities} chartData={data.bufferedLines} />
      <p>
        Notice how memory is flatlining at ~84s - this is when process crashes
        because of out of memory error.
      </p>
      <Links />
    </React.Fragment>
  )
}
