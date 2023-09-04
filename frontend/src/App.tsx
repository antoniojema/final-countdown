import React from 'react';

import { Header, TotalPercentage, TimeLapse } from './components'
import { pics, cities, UTCOffsets, initDate, finishDate, totalTime } from './utils/constants'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <div className="container text-center">
          <div className="row justify-content-md-center align-items-end">
            <div className="col-md-auto p-0">
              <Header url={pics.columbus} city={"Columbus"} timeInfo={UTCOffsets[cities.columbus]}></Header>
            </div>
            <div className="col-md-auto p-0">
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