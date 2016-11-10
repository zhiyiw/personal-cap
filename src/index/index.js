import "normalize.css"
import "babel-polyfill"

import React from "react"
import ReactDOM from "react-dom"
import App from "app"

function init() {

  ReactDOM.render(
    <App />,
    document.getElementById("root")
  )
}

init()
