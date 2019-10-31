import * as React from 'react';
import {Typography, Button, Grid, TextField} from '@material-ui/core';
import {RouteComponentProps, withRouter, Redirect} from 'react-router';
import {Link} from 'react-router-dom'
import {StoreState} from '../types/store';
import {selectCurrentHour, selectRoomData, selectTimeCount} from '../store/selectors/rooms';
import {connect} from 'react-redux';
import {getPrettyHour, sanitiseTime} from '../lib/dateFuncs';
import postReq from '../client/postReq';
import SnackBar, {SnackBarVariant} from '../components/SnackBar';
import {GridProps} from '@material-ui/core/Grid';
import {selectIsLoggedIn} from '../store/selectors/user';
import CardComponent from '../components/CardComponent';
import {RefObject} from "react";

interface ResponseObject {
  header: string
  bookMsg: string
  success: boolean,
  day: number,
  room: string,
  roomNum: string,
  free: any,
  pic: string,
  roomid: number,
  prettyDay: string,
  description: string,
  times: Array<number>
}

interface State {
  currentHour: number;
  response: Array<ResponseObject>;
  alert: any;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  confPassword: string;
  password: string;
  errors: { [key: string]: boolean };
}

// @ts-ignore
interface Props extends RouteComponentProps<Props> {
  currentHour: number;
  isLoggedIn: boolean;
}

class Signup extends React.Component<Props, State> {
  emailRef: RefObject<HTMLInputElement> = React.createRef();
  firstNameRef: RefObject<HTMLInputElement> = React.createRef();
  lastNameRef: RefObject<HTMLInputElement> = React.createRef();
  phoneRef: RefObject<HTMLInputElement> = React.createRef();
  passwordRef: RefObject<HTMLInputElement> = React.createRef();
  confPasswordRef: RefObject<HTMLInputElement> = React.createRef();

  constructor(props) {
    super(props);

    const sanitisedHour = sanitiseTime(this.props.currentHour);

    this.state = {
      alert: null,
      currentHour: sanitisedHour,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      confPassword: "",
      password: "",
      response: [],
      errors: {}
    };
  }

  componentDidMount() {
    console.log('logged in?: ', this.props.isLoggedIn);
  }

  sendPostReq = async () => {
    const {email, firstName, lastName, phoneNumber, confPassword, password} = this.state;

    const serverResponse: ResponseObject = await postReq('/signup', { email, firstName, lastName, phone: phoneNumber, passwordConf: confPassword, password }) as ResponseObject;
    console.log('serverResponse: ', serverResponse);

    if (serverResponse.success) {
      this.setState({
        response: this.state.response.concat(serverResponse)
      });
    } else {
      this.setState({
        alert: serverResponse
      });
    }
  };

  handleFormChange = (field) => {
    console.log(field);
    if (field) {
      let value = event.target.value.toString();
      console.log(this, value);

      if (field === 'email' && !value.endsWith("@queensu.ca")) {
        value = '';
      }

      if (field === 'confPassword' && value !== this.state.password) {
        value = "";
      }

      // @ts-ignore
      this.setState({
        errors: {[field]: !!value},
        [field]: !!value ? value : this.state[field]
      });
    }
  };

  handleSubmitClick = async () => {
    const {email, firstName, lastName, errors, phoneNumber, confPassword, password} = this.state;

    if (!email || !firstName || !lastName || phoneNumber || confPassword !== password) {
      return;
    }

    // await this.sendPostReq();
  };

  renderAlert() {
    const {alert} = this.state;
    console.log('At renderAlert.  State: ', this.state);

    if (!alert)
      return (null);

    console.log('rendering alert!');
    return (
      <SnackBar type={SnackBarVariant.Error} className='quick__error-alert' message={alert.bookMsg}/>
    );
  }

  renderSignupCard(gridWidth: GridProps = {xs: 12, sm: 10, md: 9, lg: 7, xl: 5}) {

    const cardHeaderText = "Sign Up";

    const cardDescription = (
      <form action="/signup" id="signup_form" method="post">
        <Grid item container direction="row" spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              autoComplete="given-name"
              label="First Name"
              id="first-name"
              margin="normal"
              name="firstName"
              inputRef={this.firstNameRef}
              onChange={this.handleFormChange.bind(this, 'firstName')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              autoComplete="family-name"
              label="Last Name"
              id="last-name"
              name="lastName"
              margin="normal"
              fullWidth
              inputRef={this.lastNameRef}
              onChange={this.handleFormChange.bind(this, 'lastName')}
            />
          </Grid>
        </Grid>

        <Grid item container direction="row" spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              autoComplete="email"
              label="Email"
              id="email"
              type="email"
              name="email"
              pattern=".+@queensu.ca"
              margin="normal"
              fullWidth
              inputRef={this.emailRef}
              onChange={this.handleFormChange.bind(this, 'email')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="phone"
              label="Phone (123-456-7890)"
              id="phone"
              name="phone"
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              margin="normal"
              fullWidth
              inputRef={this.phoneRef}
              onChange={this.handleFormChange.bind(this, 'phone')}
            />
          </Grid>

        </Grid>

        <Grid item container direction="row" spacing={2} className="row--add-margin">

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Password"
              id="password"
              type="password"
              name="password"
              pattern=".{6,}" maxLength="56"
              title="Passwords must be at least 6 characters long."
              margin="normal"
              inputRef={this.passwordRef}
              onChange={this.handleFormChange.bind(this, 'password')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Confirm Password"
              id="confirm-password"
              name="passwordConf"
              type="password"
              margin="normal"
              error={this.state.errors && !this.state.errors.confPassword}
              inputRef={this.confPasswordRef}
              onChange={this.handleFormChange.bind(this, 'confPassword')}
            />
          </Grid>
        </Grid>

        <Grid item className="row--add-margin-top">
          <Button type="submit" id="submit-button" variant="contained" color="primary" fullWidth
                  onClick={this.handleSubmitClick.bind(this)}>Submit</Button>
        </Grid>
      </form>
    );

    return (
      <CardComponent key={cardHeaderText.trim()} baseClass="signup" cardDescription={cardDescription}
                     cardHeaderText={cardHeaderText} cardImageTitle="ILC"
                     gridWidth={gridWidth} cardImg={null}/>
    );

  }

  renderSignupForm() {
    const {currentHour, response} = this.state;
    const isSuccess = response && response.length && response[response.length - 1].success;

    return (
      <div className="justify-content-center signup__card-container">
        <Grid container spacing={2} className="justify-content-center remove-spacing">
          {this.renderSignupCard()}
        </Grid>
      </div>
    );
  }

  render() {
    if (this.props.isLoggedIn) {
      return <Redirect to={{pathname: '/account', state: {redirect: '/account'}}}/>
    }

    return (
      <div className="content__wrapper">
        {this.renderAlert()}
        {this.renderSignupForm()}
      </div>
    );
  }
}

function mapStateToProps(state: StoreState) {
  return {
    roomData: selectRoomData(state),
    currentHour: selectCurrentHour(state),
    timeCount: selectTimeCount(state),
    isLoggedIn: selectIsLoggedIn(state)
  };
}

export default connect(mapStateToProps)(Signup);
