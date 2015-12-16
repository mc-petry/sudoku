import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as CSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import CellSelector from '../../components/cell-selector'
import { setCellValue, setCellMark, ICell } from '../../redux/modules/board'
import * as classnames from 'classnames'

interface ICellComponentProps extends React.Props<any> {
  data: ICell
  x: number
  y: number
  dispatch?: Redux.Dispatch
  errorClasses: string[]
}

interface ICellComponentState {
  showSelector: boolean
}

@connect()
export default class CellComponent extends React.Component<ICellComponentProps, ICellComponentState> {
  private onDocumentClick = (e: MouseEvent) => {
    if (!this.state.showSelector)
      return;

    let isOutside = !ReactDOM.findDOMNode<HTMLElement>(this.refs['cell']).contains(e.target as HTMLElement)
    if (!isOutside)
      return;

    this.setState({ showSelector: false })
  }

  constructor() {
    super()

    this.state = {
      showSelector: false
    }
  }

  componentWillMount() {
    document.addEventListener('click', this.onDocumentClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick, false)
  }

  render() {
    const { value, locked, marks } = this.props.data
    const { x, y, errorClasses } = this.props


    return (
      <div ref='cell' className={classnames('cell', { 'cell--src': locked, '-has-value': value ? true : false }, errorClasses)} onClick={e => this.onCellClicked(e) }>
        <div className='cell__shadow' />
        <div className='cell__border' />
        <CSSTransitionGroup transitionName='' transitionEnterTimeout={200} transitionLeaveTimeout={200}>
          {this.state.showSelector ? <CellSelector onClick={v => this.setCellValue(v) } /> : null}
        </CSSTransitionGroup>
        <CSSTransitionGroup transitionName='' transitionAppear={true} transitionAppearTimeout={600 + 300 + (y * 9 + x) * 10} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
          {value ? <div className='cell__value'>{value}</div> : <div />}
        </CSSTransitionGroup>
        <div className='cell__marks'>
          {_.range(1, 10).map(i =>
            <div
              key={i}
              className={classnames('cell__mark', { '-filled': _(marks).includes(i) })}
              onClick={e => this.onMarkClicked(e, i)}>
              <div className='cell__mark-label'>
                {_(marks).includes(i) ? i : ''}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  private onCellClicked(e: React.MouseEvent) {
    if (this.state.showSelector || this.props.data.locked)
      return;

    this.setState({ showSelector: true })
  }

  private setCellValue(value: number) {
    this.setState({ showSelector: false })
    this.props.dispatch(setCellValue({ x: this.props.x, y: this.props.y }, value))
  }

  private onMarkClicked(e: React.MouseEvent, value: number) {
    if (!e.ctrlKey)
      return;

    e.stopPropagation()
    this.props.dispatch(setCellMark({ x: this.props.x, y: this.props.y }, value))
  }
}