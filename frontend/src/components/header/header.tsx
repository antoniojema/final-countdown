import React from 'react';
import './styles.css';
import {getLocalDate, getLocalTime} from '../../utils/utils'
import { TimeInfo } from '../../utils/types';

export default class Header extends React.Component<{url: string, city: string, timeInfo: TimeInfo}> {

    interval?: NodeJS.Timeout

    constructor(props: {url: string, city: string, timeInfo: TimeInfo}) {
        super(props)
    }

    componentDidMount() {
        this.interval = setInterval(() => this.forceUpdate(), 10);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="card" style={{width: "18rem"}}>
            <img src={this.props.url} className="card-img-top" style={{height:"12rem", objectFit: "cover"}}/>
            <div className="card-body">
                <h5 className="card-title">{this.props.city}</h5>
                <h5>{getLocalDate(this.props.timeInfo)}</h5>
                <h5>{getLocalTime(this.props.timeInfo)}</h5>
            </div>
            </div>
        )
    }
}
