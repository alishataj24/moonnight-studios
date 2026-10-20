import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
// One family, five weights. 300 carries the display and the standfirst,
// 700 is reserved for the pivot word in a headline — Manrope has no
// italic, so weight is what marks the word the sentence turns on.
import "@fontsource/manrope/latin-300.css"
import "@fontsource/manrope/latin-400.css"
import "@fontsource/manrope/latin-500.css"
import "@fontsource/manrope/latin-600.css"
import "@fontsource/manrope/latin-700.css"
import "./index.css"
import { App } from "./App"

const root = document.getElementById("root")
if (!root) throw new Error("Root element missing")

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
