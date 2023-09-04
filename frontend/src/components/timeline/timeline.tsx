import React from 'react'
import {totalTime, initDate} from '../../utils/constants'

export class Day extends React.Component<{date : Date}, {}> {
  getDate() {
    let day = this.props.date.getUTCDate().toString().padStart(2,"0")
    let month = (this.props.date.getMonth()+1).toString().padStart(2,"0")
    let year = this.props.date.getFullYear()
    return `${day}/${month}/${year}`
  }

  render() {
    return <div> {this.getDate()} </div>
  }
}

export class TimeLapse extends React.Component<{init:Date, finish:Date}> {
  getDays() : React.JSX.Element[] {
    let days_list : React.JSX.Element[] = []
    for (var d = new Date(this.props.init.getTime()); d <= this.props.finish; d.setDate(d.getDate() + 1)) {
      days_list.push(<Day date={new Date(d.getTime())}/>)
    }
    return days_list
  }

  render() {
    return (
      <div>
        {this.getDays()}
      </div>
    )
  }
}

// export class Month extends React.Component<{year:number, month:number},{}> {
// }

// export class TimeLineMerge extends React.Component {}

// export class Header extends React.Component {}



export class TotalPercentage extends React.Component<{},{passedPercentage:string}> {
  interval : NodeJS.Timeout | null

  constructor(props : {}) {
    super(props)
    this.state = {
      passedPercentage: this.getPercentage()
    }
    this.interval = null
  }

  getPercentage() {
    const passedTime = new Date().getTime() - initDate.getTime()
    return (passedTime/totalTime * 100).toFixed(5)
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ passedPercentage: this.getPercentage() }), 10);
  }

  componentWillUnmount() {
    if (this.interval !== null) clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <h1>Total percentage passed</h1>
        <div>{this.state.passedPercentage}%</div>
        <div className="progress" role="progressbar" aria-label="Success example">
          <div className="progress-bar bg-success" style={{width: `${this.state.passedPercentage}%`}}>{this.state.passedPercentage}%</div>
        </div>
      </div>
    )
  }
}