window.global ||= window

import bar from 'plotly.js/lib/bar'
import Plotly from 'plotly.js/lib/core'
import indicator from 'plotly.js/lib/indicator'
import scatter from 'plotly.js/lib/scatter'

Plotly.register([
  // Traces
  scatter,
  bar,
  indicator,
])

export default Plotly
