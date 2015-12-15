import * as React from 'react'
import * as CSSTransitionGroup from 'react-addons-css-transition-group'
import * as classnames from 'classnames'

interface IModalProps extends __React.Props<any> {
  header?: string | React.ReactElement<any>
  footer?: string | React.ReactElement<any>
}

interface IModalState {
  isOpen: boolean
}

export default class Modal extends React.Component<IModalProps, any> {
  state: IModalState = {
    isOpen: false
  }

  show() {
    this.setState({ isOpen: true })
  }

  hide() {
    this.setState({ isOpen: false })
  }

  private onModalClick(e: React.MouseEvent) {
    if (e.target as Element == this.refs["modal"])
      this.hide()
  }

  render() {
    const { isOpen } = this.state
    const { header, footer } = this.props
    return (
      <CSSTransitionGroup component="div" transitionName="" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
        {isOpen ?
          <div ref="modal" className="modal" onClick={e => this.onModalClick(e)}>
            <div className="modal__content">
              {header? <div className="modal__header">{header}</div> : ''}
              <div className="modal__body">
                {this.props.children}
              </div>
              {footer ? <div className="modal__footer">{footer}</div> : ''}
            </div>
          </div>
          : ""}
      </CSSTransitionGroup>
    )
  }
}