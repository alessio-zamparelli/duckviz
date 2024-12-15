"use strict"

window.global ||= window

import Plotly from "plotly.js/lib/core"
// import Plotly from "plotly.js/lib/core"
import { register } from "plotly.js/src/core"

import scatter from "plotly.js/lib/scatter"
import indicator from "plotly.js/lib/indicator"
import bar from "plotly.js/lib/bar"

register([
  // Traces
  scatter,
  bar,
  indicator,
])

export default Plotly

// var Plotly = require("plotly.js/lib/core")

// Plotly.register([
//   // traces
//   require("plotly.js/lib/scatter"),
//   require("plotly.js/lib/indicator"),
//   require("plotly.js/lib/bar"),

//   // components
// ])

// module.exports = Plotly
