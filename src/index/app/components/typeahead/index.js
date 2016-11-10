import React from "react"
import List from "./item-list"
import "./styles.less"

const preventKeys = ["ArrowDown", "ArrowUp"]

export default class Typeahead extends React.Component {
  state = {
    list: []
  }

  keyWord = ""

  onChange = () => {
    const word = this.refs.input.value
    let list = []
    if(word) {
      list = this.props.data.map(i => i.name).filter(i => i.toLowerCase().indexOf(word.toLowerCase()) > -1);
    }

    this.setState({ list })
    this.keyWord = word
  }

  onKeyDown = (e) => {
    const {code} = e.nativeEvent
    if(preventKeys.includes(code)) {
      e.nativeEvent.preventDefault()
    }

    const {input, list} = this.refs
    switch (code) {
      case "ArrowDown":
        list.next()
        break;
      case "ArrowUp":
        list.pre()
        break;
      case "Enter":
        this.keyWord = list.getCurrentPhrase()
        input.value = this.keyWord
        this.setState({list: []})
        break;
    }
  }

  render() {
    const {list} = this.state

    return <div className="component-typeahead">
      <input
        className="component-typeahead-input"
        ref="input" type="text" placeholder="type something..."
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
      <List ref="list" items={list} detail={this.props.data.reduce((r,i) => (r[i.name] = i, r), {})} keyWord={this.keyWord}/>
    </div>
  }
}
