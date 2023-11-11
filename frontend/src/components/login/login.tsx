import React from 'react';
import './styles.css';

export default class Login extends React.Component<{app : React.Component}> {
    constructor(props: {app : React.Component}) {
        super(props)
    }

    savePassword() {
        const pass = (document.getElementById("pwd") as HTMLInputElement).value  || ''
        localStorage.setItem('pwd', pass)
        this.props.app.setState({is_auth: undefined})
    }

    render() {
        return (
            <div>
                <h1>Login to the App</h1>
                <input type="password" id="pwd"></input>
                <button onClick={() => this.savePassword()}>Login</button>
            </div>
        )
    }
}