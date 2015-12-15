import * as React from 'react'

export default class Menu extends React.Component<React.Props<any>, any> {
  public render() {
    return (
      <header className="header">
        {this.props.children}
      </header>
    )
  }
}