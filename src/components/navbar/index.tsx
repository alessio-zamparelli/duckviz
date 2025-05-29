import { GithubIcon } from "../../lib/github"
import { ModeToggle } from "../theme-toggle"

export function NavBar() {
  return (
    <div className="flex gap-2 px-2 py-1 shadow-sm justify-between">
      <div className="flex items-center gap-2">
        <img src="/DuckVIZ-logo.png" alt="DuckViz logo" className="h-8 w-8" />
        <h1 className="font-bold">DuckViz</h1>
      </div>

      <div className="flex gap-2">
        <a href="https://github.com/alessio-zamparelli/duckviz" className="h-8 w-8 p-1">
          <GithubIcon />
        </a>
        <ModeToggle />
      </div>
    </div>
  )
}
