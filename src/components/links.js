import React from "react"
import { Link } from "gatsby"

export default () => {
  return (
    <React.Fragment>
      <h2>Links</h2>
      <ul>
        <li>
          <Link to="/json-stringify">
            <code>JSON.stringify</code>
          </Link>{" "}
          (using default Node.js memory limit). Out of memory crash.
        </li>
        <li>
          <Link to="/v8-serialize">
            <code>V8.serialize</code>
          </Link>{" "}
          (using artificially limited memory limit to 1GB). Doesn't crash
        </li>
      </ul>
    </React.Fragment>
  )
}
