import React from 'react';

import { Header, TotalPercentage, getDays, Login  } from './components'
import { pics, cities, UTCOffsets} from './utils/constants'
import { isAuth } from './utils/api'
import { setGlobalApp } from './utils/utils';

async function checkLogin(app : App) {
  app.setState({is_auth: await isAuth()})
}

export default class App extends React.Component<{},{is_auth : boolean | undefined}> {
  constructor(props: {}) {
    super(props)
    this.state = {
      is_auth: undefined
    }
    setGlobalApp(this)
  }

  render() {
    if (this.state.is_auth === undefined) {
      checkLogin(this)
      return (<div></div>)
    }
    else if (!this.state.is_auth) {
      return (<Login app={this} />)
    } else {
      return (
        <div>
          <TotalPercentage />
          <div className="container-fluid row justify-content-md-center align-items-end flex-nowrap">
            <div className="col col-md-auto p-0">
              <Header url={pics.columbus} city={"Columbus"} timeInfo={UTCOffsets[cities.columbus]}></Header>
            </div>
            <div className="col col-md-auto p-0">
              <Header url={pics.granada} city={"Granada"} timeInfo={UTCOffsets[cities.granada]}></Header>
            </div>
          </div>
          {getDays(new Date(Date.UTC(2023, 8-1, 30)), new Date(Date.UTC(2023, 11-1, 30)))}
        </div>
      )
    }
  }
}