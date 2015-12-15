import * as React from 'react'
import * as CSSTransitionGroup from 'react-addons-css-transition-group'

interface ICardSlideProps extends React.Props<any> {
  type?: string
  isVisible: boolean
}

interface ICardSlideState {
  isVisible: boolean
}

export default class CardSlide extends React.Component<ICardSlideProps, ICardSlideState> {
  public render() {
    const { children, isVisible } = this.props

    return (
      <CSSTransitionGroup component="div" transitionName="" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
        {isVisible ? <div className="card-slide">{children}</div> : ''}
      </CSSTransitionGroup>
    )
  }
}