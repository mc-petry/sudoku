import * as React from 'react'
import * as _ from 'lodash'

interface ICellSelectorComponentProps {
  onClick: (value: number) => void
}

export default class CellSelectorComponent extends React.Component<ICellSelectorComponentProps, any> {
  render() {
    return (
      <div className='cell-selector'>
        {_.range(9).map((x, i) =>
          <div
            key={i}
            className='cell-selector__item'
            onClick={e => this.setCellValue(i + 1)}>
              {i + 1}
            </div>
        )}
        <div className='cell-selector__clear' onClick={e => this.setCellValue(null)}>Clear</div>
      </div>
    )
  }

  private setCellValue(i: number) {
    this.props.onClick(i)
  }
}