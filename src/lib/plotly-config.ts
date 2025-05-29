import * as itIt from "plotly.js/lib/locales/it"

export const defConfig: Partial<Plotly.Config> = {
  responsive: !import.meta.env.DEV,
  displaylogo: false,
  locales: { itIt: itIt },
  locale: "itIt",
}
export const defLayout: Partial<Plotly.Layout> = {
  showlegend: true,
  title: { font: { family: '"Raleway", sans-serif', color: "#1f1f1f", size: 22 } },
  legend: { orientation: "h", x: 0.5, xanchor: "center" },
  yaxis2: {
    side: "right",
    overlaying: "y",
  },
}
