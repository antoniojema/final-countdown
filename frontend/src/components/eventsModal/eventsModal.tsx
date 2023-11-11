import React from 'react'
import { EVENTS, createEvent, readEvents, updateEvent, deleteEvent } from '../../utils/api'
import { formatUTCDate, getGlobalApp, getCityDateId } from '../../utils/utils'
import './styles.css'

import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';


class Footer extends React.Component<{city: string, date: Date}, {is_visible : boolean}> {
  constructor(props: {city: string, date: Date}) {
    super(props);
    this.state = {
      is_visible: false
    };
  }

  async saveNewEvent() {
    const city = this.props.city;
    const date = this.props.date;
    const id = getCityDateId(city, date);
  
    const input_title       = document.getElementById(`newevent_title_${id}`      ) as HTMLInputElement
    const input_description = document.getElementById(`newevent_description_${id}`) as HTMLInputElement

    const title       = input_title      .value;
    const description = input_description.value;
  
    if (!await createEvent(city, formatUTCDate(date), title, description)) {
      alert("Error creating event")
      return
    }
    await readEvents()

    this.setState({is_visible: false})
    input_title      .value = ""
    input_description.value = ""
    
    getGlobalApp().forceUpdate()
  }

  render() {
    const that = this;
    const id = getCityDateId(this.props.city, this.props.date)
    return (
      <div>
        <Collapse in={that.state.is_visible}>
          <Form className="m-1">
            <Form.Group className="mb-2" controlId={`newevent_title_${id}`}>
              <Form.Label>Title</Form.Label>
              <Form.Control/>
            </Form.Group>
            <Form.Group className="mb-2" controlId={`newevent_description_${id}`}>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3}/>
            </Form.Group>
            <Button className="btn btn-success" onClick={() => {that.saveNewEvent()}}>
              Save
            </Button>
          </Form>
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


class EventCard extends React.Component<{title : string, description : string, id : number},{edit_mode : boolean}> {
  constructor(props: {title : string, description : string, id : number}) {
    super(props)
    this.state = {
      edit_mode: false
    }
  }

  toggleMode() {
    this.setState({edit_mode: !this.state.edit_mode})
  }

  async confirmEdit() {
    const title = (document.getElementById(`edit_title_${this.props.id}`) as HTMLInputElement).value
    const description = (document.getElementById(`edit_description_${this.props.id}`) as HTMLInputElement).value
    const id = this.props.id

    if (!await updateEvent(id, title, description)) {
      alert("Error deleting event")
      return
    }
    await readEvents()

    this.toggleMode()
    getGlobalApp().forceUpdate()

  }

  async deleteEvent() {
    if (!await deleteEvent(this.props.id)) {
      alert("Error deleting event")
      return
    }
    await readEvents()
    
    getGlobalApp().forceUpdate()
  }

  render() {
    const that = this;
    if (this.state.edit_mode) {
      return (
        <Card className="m-1">
          <Card.Body>
            <Form>
              <Form.Group className="mb-3" controlId={`edit_title_${this.props.id}`}>
                <Form.Label>Title</Form.Label>
                <Form.Control value={this.props.title} />
              </Form.Group>
              <Form.Group className="mb-3" controlId={`edit_description_${this.props.id}`}>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={this.props.title}/>
              </Form.Group>
              <Button variant="secondary" onClick={() => {that.toggleMode()}}>Cancel</Button> <Button variant="success">Save</Button>
            </Form>
          </Card.Body>
        </Card>
      )
    }
    else {
      return (
        <Card className="m-1">
          <Card.Body>
            <Card.Title>{this.props.title}</Card.Title>
            <Card.Text>{this.props.description}</Card.Text>
            <Button variant="secondary" onClick={() => {that.toggleMode()}}>Edit</Button> <Button variant="danger" onClick={() => {that.deleteEvent()}}>Delete</Button>
          </Card.Body>
        </Card>
      )
    }
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
    return (
      <div>
        {events.map(e => <EventCard title={e.title} description={e.description} id={e.id}/>)}
      </div>
    );
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
