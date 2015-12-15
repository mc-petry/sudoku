import * as React from 'react'

interface ICellSelectorComponentProps {
  onClick: (value: number) => void
}

export default class CellSelectorComponent extends React.Component<ICellSelectorComponentProps, any> {

  private setCellValue(e: React.MouseEvent) {
    const value = parseInt((e.target as HTMLElement).dataset['value'])
    this.props.onClick(value)
  }

  render() {
    let numbers: JSX.Element[] = []

    for (let i = 1; i < 10; i++)
      numbers.push(<div key={i} className="cell-selector__item" data-value={i} onClick={e => this.setCellValue(e) }>{i}</div>)

    return <div className="cell-selector">{numbers}</div>
  }
}