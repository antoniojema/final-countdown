import React from 'react';

import { Header, TotalPercentage, DayRow, getDays, Login  } from './components'
import { pics, cities, UTCOffsets} from './utils/constants'
import { isAuth } from './utils/api'

export default class App extends React.Component {
  render() {
    if (!isAuth()) {
      return (<Login />)
    } else {
      return (
        <div>
          <TotalPercentage />
          <div className="container text-center">
            <div className="row justify-content-md-center align-items-end">
              <div className="col-md-auto p-0">
                <Header url={pics.columbus} city={"Columbus"} timeInfo={UTCOffsets[cities.columbus]}></Header>
              </div>
              <div className="col-md-auto p-0" style={{width: "6rem"}}></div>
              <div className="col-md-auto p-0">
                <Header url={pics.granada} city={"Granada"} timeInfo={UTCOffsets[cities.granada]}></Header>
              </div>
            </div>
          </div>
          {getDays(new Date(Date.UTC(2023, 8-1, 30)), new Date(Date.UTC(2023, 11-1, 30)))}
        </div>
      ) 
    }
  }
}