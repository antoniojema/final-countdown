import React from 'react'
import { EVENTS, createEvent, readEvents } from '../../utils/api'
import { formatUTCDate, getGlobalApp, getCityDateId } from '../../utils/utils'
import './styles.css'

import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

async function saveNewEvent(city: string, date: Date) {
  const id = getCityDateId(city, date);

  const title       = (document.getElementById(`newevent_title_${id}`      ) as HTMLInputElement).value;
  const description = (document.getElementById(`newevent_description_${id}`) as HTMLInputElement).value;

  alert(`New event ${id}\nTitle: ${title}\nDescription: ${description}`);
  await createEvent(city, formatUTCDate(date), title, description)
  await readEvents()
  getGlobalApp().forceUpdate()
}

class Footer extends React.Component<{city: string, date: Date}, {is_visible : boolean}> {
  constructor(props: {city: string, date: Date}) {
    super(props);
    this.state = {
      is_visible: false
    };
  }

  render() {
    const that = this;
    const id = getCityDateId(this.props.city, this.props.date)
    return (
      <div>
        <Collapse in={that.state.is_visible}>
          <div className="m-1">
            Title
            <input type="text" className="form-control" id={`newevent_title_${id}`}/>
            Description
            <input type="text" className="form-control" id={`newevent_description_${id}`}/>
            <Button className="btn btn-success mt-2" data-bs-dismiss="modal" onClick={() => {saveNewEvent(that.props.city, that.props.date)}}>
              Save
            </Button>
          </div>
        </Collapse>
        <div className="footerButtons">
          <Button className="btn btn-primary m-1" onClick={() => {that.setState({is_visible: !that.state.is_visible});}}>
            Create new event
          </Button>
        </div>
      </div>
    )
  }
}

export class EventsModal extends React.Component<{ city: string, date: Date }, {}> {
  constructor(props: { city: string, date: Date }) {
    super(props)
  }

  getEvents() {
    const events = EVENTS[this.props.city][formatUTCDate(this.props.date)] || []
    if (events.length === 0) {
      return (<h5>No events today!</h5>)
    }
    return <ul>{events.map(e => <li>{e.title}: {e.description}</li>)}</ul>
  }

  render() {
    const id = getCityDateId(this.props.city, this.props.date)
    const City = this.props.city.charAt(0).toUpperCase() + this.props.city.slice(1)

    return (
      <div className="modal fade" id={`modalevents_${id}`} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{City} {formatUTCDate(this.props.date)}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              {this.getEvents()}
            </div>
            <div className="withoutFlex modal-footer">
              <Footer city={this.props.city} date={this.props.date}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
