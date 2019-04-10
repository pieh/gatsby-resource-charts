import React from "react"
import { Link } from "gatsby"

export default () => {
  return (
    <React.Fragment>
      <h2>Links</h2>
      <ul>
        <li>
          <Link to="/json-stringify">JSON.stringify</Link>
        </li>
        <li>
          <Link to="/v8-serialize">V8.serialize</Link>
        </li>
      </ul>
    </React.Fragment>
  )
}
