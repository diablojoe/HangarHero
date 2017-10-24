import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {inject, observer} from 'mobx-react';
import Button from "./ui/Button";

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
@inject("store")
@observer
export default class ModalLogin extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.store.appState;
  }

  login(e) {
    if (e)
      e.preventDefault();
    console.log("CLICKED BUTTON");
    this.store.login();
  }

  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {

    const {authenticated, authenticating} = this.store;

    const actions = [ < FlatButton label = "Cancel" primary = {
        true
      }
      onClick = {
        this.handleClose
      } />, < FlatButton label = "Submit" primary = {
        true
      }
      onClick = {
        this.login.bind(this)
      } />
    ];

    return (
      <div>
      <Button
        onClick={this.handleOpen}
        title={authenticated ? "Log in" : "Log out"}
      />


        <Dialog title="Log In" actions={actions} modal={true} open={this.state.open}>
          <div>
            <TextField hintText="Email"/><br/>
            <TextField hintText="Password" floatingLabelText="Password" type="password"/><br/>
          </div>
        </Dialog>
      </div>
    );
  }
}

//<RaisedButton label="Modal Dialog" onClick={this.handleOpen}/>
