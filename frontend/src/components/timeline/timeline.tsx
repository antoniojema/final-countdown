import React from 'react'
import {totalTime, initDate, cities} from '../../utils/constants'
import './styles.css'
import { formatUTCDate, getDayEvents, setDayEvent } from '../../utils/utils'
import { DayEvent } from '../../utils/types'
import { EventsModal } from '../eventsModal/eventsModal'
import { getCityDateId } from '../../utils/utils'


export default class EventTag extends React.Component {

  interval?: NodeJS.Timeout

  constructor(props: {}) {
      super(props)
  }

  render() {
      return (
          <div>hola soy un evento</div>
      )
  }
}


export class DayEvents extends React.Component<{city: string, date: Date}> {

  constructor(props: {city: string, date: Date}) {
    super(props)
  }

  render() {
    const dayEvents = getDayEvents(this.props.city, this.props.date)
    const modal_id = getCityDateId(this.props.city, this.props.date)
    return (
      <button type="button" className={(dayEvents.length > 0 ? "dot eventAssigned" : "dot") + " btn btn-primary"} data-bs-toggle="modal" data-bs-target={`#modalevents_${modal_id}`}/>
    )
  }
}

export class DayLine extends React.Component<{city: string, date : Date}, {}> {
  render() {
    return (
      <div className="d-flex justify-content-center m-auto" style={{width:"25px", position:"relative"}}>
        <div className="vertical"/>
        <DayEvents city={this.props.city} date={this.props.date}/>
        <EventsModal city={this.props.city} date={this.props.date}/>
      </div>
    // <div className='d-flex justify-content-center'>
    //   <div className="vertical"><DayEvents/></div>
    // </div>
    )
  }
}

export class Day extends React.Component<{date : Date}, {}> {
  getDate() {
    let day = this.props.date.getUTCDate().toString().padStart(2,"0")
    let month = (this.props.date.getUTCMonth()+1).toString().padStart(2,"0")
    let year = this.props.date.getUTCFullYear()
    return `${day}/${month}/${year}`
  }

  render() {
    return <div>{this.getDate()}</div>
  }
}

export class TimeLapse extends React.Component<{city: string, init:Date, finish:Date}> {
  getDays() : React.JSX.Element[] {
    let days_list : React.JSX.Element[] = []
    for (var d = new Date(this.props.init.getTime()); d <= this.props.finish; d.setDate(d.getDate() + 1)) {
      days_list.push(<DayLine city={this.props.city} date={new Date(d.getTime())}/>)
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

export class DayRow extends React.Component<{date:Date},{}> {
  render() {
    return (
      <div className="row justify-content-md-center align-items-end">
        <div className="col-md-auto p-0 align-self-center" style={{width: "18rem"}}>
            <DayLine city={cities.columbus} date={this.props.date}/>
        </div>
        <div className="col-md-auto p-0 align-self-center" style={{width: "6rem"}}>
          <Day date={this.props.date}/>
        </div>
        <div className="col-md-auto p-0 align-self-center" style={{width: "18rem"}}>
            <DayLine  city={cities.granada} date={this.props.date}/>
        </div>
      </div>
    )
  }
}


export function getDays(init : Date, finish : Date) : React.JSX.Element[] {
  let days_list : React.JSX.Element[] = []
  for (var d = new Date(init); d <= finish; d.setUTCDate(d.getUTCDate() + 1)) {
    days_list.push(<DayRow date={new Date(d)}/>)
  }
  return days_list
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