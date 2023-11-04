import React from 'react'
import { EVENTS } from '../../utils/api'
import { formatUTCDate, getModalId } from '../../utils/utils'

export class EventsModal extends React.Component<{ city: string, date: Date }, {}> {
  constructor(props: { city: string, date: Date }) {
    super(props)
  }

  getEvents() {
    const events = EVENTS[this.props.city][formatUTCDate(this.props.date)] || []
    return <ul>{events.map(e => <li>{e.title}: {e.description}</li>)}</ul>
  }

  render() {
    const id = getModalId(this.props.city, this.props.date)
    const City = this.props.city.charAt(0).toUpperCase() + this.props.city.slice(1)

    return (
      <div className="modal fade" id={id} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
            <div className="modal-footer">
              <p>
              <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                Button with data-bs-target
              </button>
              </p>
              <div className="collapse" id="collapseExample">
                <div className="card card-body">
                  Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
                </div>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">$</span>
                <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                <span className="input-group-text">.00</span>
              </div>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Create new event</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
