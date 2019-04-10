import React from "react"
import Chart from "../components/chart"
import Links from "../components/links"

import data from "../../processed/cHVibGlzaC1yZXByby9ob3VzZWNhbGwtZ3Jvd3RoLXNpdGU_/1554905050425.json"

export default () => {
  return (
    <React.Fragment>
      <Chart activities={data.activities} chartData={data.bufferedLines} />
      <Links />
    </React.Fragment>
  )
}
