import React from "react"
import Typeahead from "./components/typeahead"
import data from "products"

export default class App extends React.Component {
  render() {
    return <div>
      <Typeahead data={data.products}/>
    </div>
  }
}
