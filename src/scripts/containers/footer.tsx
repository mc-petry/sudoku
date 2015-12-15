import * as React from 'react'
import { connect } from 'react-redux'

@connect(() => new Object())
export default class Footer extends React.Component<React.Props<any>, any> {
  render() {
    const { children } = this.props
    return (
      <footer className='footer'>
        {children}
      </footer>
    )
  }
}