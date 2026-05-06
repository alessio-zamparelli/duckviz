import { PlotParams } from 'react-plotly.js'
import factory from 'react-plotly.js/factory'
import { type ComponentType } from "react";

export const createPlotlyComponent = (
  factory as unknown as {
    default: (plotly: object) => ComponentType<PlotParams>
  }
).default
