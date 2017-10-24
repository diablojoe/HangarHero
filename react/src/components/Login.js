import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";
import ModalLogin from "./ModalLogin"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


@inject("store")
@observer
export default class Login extends Component {
	render() {
		return (
			<div className="page login">
			<MuiThemeProvider>
				<ModalLogin />
				</MuiThemeProvider>
				Your login form here...
				{this.props.store.authenticated &&
					!this.props.store.authenticating &&
					<Redirect to="/" />}
			</div>
		);
	}
}
