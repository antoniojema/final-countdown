import React from 'react';

// Time in Spain: 5:00 (UTC + 2)
const initDate = new Date(2023, 7, 30, 3, 0)
// Time in Orlando when arriving: 19:00 (UTC - 3 due to daylight savings)
const finishDate = new Date(2023, 11, 1, 22, 0)
// Total time in milliseconds from the previous dates
const totalTime = finishDate.getTime() - initDate.getTime()

export default class TotalPercentage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      passedPercentage: this.getPercentage()
    }
  }

  getPercentage() {
    const passedTime = new Date().getTime() - initDate.getTime()
    return (passedTime/totalTime * 100).toFixed(4)
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ passedPercentage: this.getPercentage() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <h1>Total percentage passed</h1>
        <div>{this.state.passedPercentage}%</div>
      </div>
    )
  }
}