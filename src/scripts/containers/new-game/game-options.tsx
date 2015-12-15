import * as React from 'react'

interface IMenuState {
  level?: string
  seed?: string
}

export default class GameOptions extends React.Component<any, IMenuState> {
  state: IMenuState = {
    level: 'easy'
  }

  componentWillMount() {
    this.setState({ seed: Math.floor(Math.random() * 10000000).toString() })
  }

  render() {
    const { level, seed } = this.state

    return (
      <div>
        <div className='input-group'>
          <div className='input-group__title'>Level difficulty</div>

          <input onChange={e => this.onDifficultyChanged(e)} checked={level === 'easy'} id='level-easy' type='radio' name='level' value='easy' />
          <label htmlFor='level-easy'>Easy</label>

          <input onChange={e => this.onDifficultyChanged(e)} checked={level === 'normal'} id='level-normal' type='radio' name='level' value='normal' />
          <label htmlFor='level-normal'>Normal</label>

          <input onChange={e => this.onDifficultyChanged(e)} checked={level === 'hard'} id='level-hard' type='radio' name='level' value='hard' />
          <label htmlFor='level-hard'>Hard</label>

          <input onChange={e => this.onDifficultyChanged(e)} checked={level === 'evil'} id='level-evil' type='radio' name='level' value='evil' />
          <label htmlFor='level-evil'>Extreme</label>
        </div>
        <div className='input-group'>
          <div className='input-group__title'>Level seed</div>
          <input type='text' value={seed} onChange={e => this.onSeedChanged(e)} />
        </div>
      </div>
    )
  }

  private onDifficultyChanged(e: React.FormEvent) {
    this.setState({ level: (e.target as HTMLInputElement).value })
  }

  private onSeedChanged(e: React.FormEvent) {
    this.setState({ seed: (e.target as HTMLInputElement).value })
  }
}