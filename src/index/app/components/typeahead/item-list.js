import React from "react"
import Popover from "antd/lib/popover"
import "antd/lib/popover/style/index.less"

export default class Typeahead extends React.Component {
  state = {
    current: 0
  }

  componentWillReceiveProps() {
    this.state.current = 0
  }

  next() {
    let current = this.state.current + 1
    if(current >= this.props.items.length)
      current = 0

    this.setState({current})
  }

  pre() {
    let current = this.state.current - 1
    if(current < 0)
      current = this.props.items.length - 1

    this.setState({current})
  }

  getCurrentPhrase() {
    const {items} = this.props
    return items ? items[this.state.current] : ""
  }

  render() {
    const {items, keyWord, detail} = this.props
    const {current} = this.state
    const length = keyWord.length

    return <div>
      <ul className="component-typeahead-list">
        {
          items.map((i, k) => {
            const index = i.toLowerCase().indexOf(keyWord.toLowerCase())
            return (
              <li key={k} className={`component-typeahead-list-item ${k == current ? "on" : ""}`}>
                {
                  k == current
                    ?<Popover title={detail[i].type} content={detail[i].url} visible>
                      <div>{`${i.substr(0, index)}`}<span>{i.substr(index, length)}</span>{`${i.substr(index + length)}`}</div>
                    </Popover>
                    : <div>{`${i.substr(0, index)}`}<span>{i.substr(index, length)}</span>{`${i.substr(index + length)}`}</div>
                }

              </li>
            )
          })
        }
      </ul>

    </div>
  }
}
