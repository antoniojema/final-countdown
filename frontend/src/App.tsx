import React from 'react';

import { Header } from './components'

// Time in Spain: 5:00 (UTC + 2)
const initDate = new Date(Date.UTC(2023, 7, 30, 3, 0))
// Time in Orlando when arriving: 19:00 (UTC - 3 due to daylight savings)
const finishDate = new Date(Date.UTC(2023, 11, 1, 22, 0))
// Total time in milliseconds from the previous dates
const totalTime = finishDate.getTime() - initDate.getTime()

const cities = {
  columbus: 'columbus',
  granada: 'granada',
  orlando: 'orlando'
}

const pics = {
  [cities.columbus]: "https://media.istockphoto.com/id/1169151392/es/foto/columbus-ohio-ee-uu-horizonte-en-el-r%C3%ADo.jpg?s=612x612&w=0&k=20&c=xqsjuRnFuGxsuh8B0xp9JV0ZLxlowA3Yn2pu_X6bubc=",
  [cities.granada]: "https://escuelasierranevada.com/wp-content/uploads/2012/11/g_sierra_nevada6.jpg",
  [cities.orlando]: ""
}

const UTCOffsets = {
  [cities.columbus]: {
    UTCSummerOffset: -4,
    summerToWinter: new Date(Date.UTC(2023, 11 - 1, 5, 6, 0)),
  },
  [cities.granada]: {
    UTCSummerOffset: 2,
    summerToWinter: new Date(Date.UTC(2023, 10 - 1, 29, 1, 0)),
  },
  [cities.orlando]: {
    UTCSummerOffset: -4,
    summerToWinter: new Date(Date.UTC(2023, 11 - 1, 5, 6, 0)),
  },
}

class Day extends React.Component<{date : Date}, {}> {
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

class TimeLapse extends React.Component<{init:Date, finish:Date}> {
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

// class Month extends React.Component<{year:number, month:number},{}> {
// }

// class TimeLineMerge extends React.Component {}

// class Header extends React.Component {}



class TotalPercentage extends React.Component<{},{passedPercentage:string}> {
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

export default class App extends React.Component {
  render() {
    return (
      <div>
        <div className="container text-center">
          <div className="row">
            <div className="col">
              <Header url={pics.columbus} city={"Columbus"} timeInfo={UTCOffsets[cities.columbus]}></Header>
            </div>
            <div className="col">
              <Header url={pics.granada} city={"Granada"} timeInfo={UTCOffsets[cities.granada]}></Header>
            </div>
          </div>
        </div>
        <TotalPercentage />
        <TimeLapse init={new Date(Date.UTC(2023,8-1,30))} finish={new Date(Date.UTC(2023,12-1,1))}/>
      </div>
    )
  }
}