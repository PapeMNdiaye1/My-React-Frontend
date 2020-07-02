import React, { Component } from "react";
import { PictursContainer } from "../HomePage/PostCreator";

const myFetcher = async (theUrl, theType, data) => {
  var dataToSend = await data;
  const rawResponse = await fetch(theUrl, {
    method: theType,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(dataToSend),
  });
  let response = await rawResponse.json();
  return response.UserLogin;
};
//! ##########################################################################################################
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      Email: "",
      Password: "",
      TheUserIsLogin: false,
      EmailState: "",
      IsInLogin: true,
    };
    this.handleSignup = this.handleSignup.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handIsInLogin = this.handIsInLogin.bind(this);
  }
  // #################################################################################
  // Switch Between Signup and Login
  handIsInLogin() {
    if (this.state.IsInLogin) {
      this.setState({
        IsInLogin: false,
      });
    } else {
      this.setState({
        IsInLogin: true,
      });
    }
  }
  // #################################################################################
  // Handle All Form Change
  handleChange(e) {
    const theFormName = e.target.name;
    const theFormValue = e.target.value;
    this.setState({
      [theFormName]: theFormValue,
    });
  }
  // #################################################################################
  // Send Signup Data
  async handleSignup(e) {
    e.preventDefault();
    let Data = await {
      Name: this.state.Name,
      Email: this.state.Email,
      Password: this.state.Password,
    };
    let isUserLogin = await myFetcher("/User/signup", "post", Data);
    if (isUserLogin === true) {
      this.setState({
        TheUserIsLogin: isUserLogin,
      });
      this.props.onUserLogin(this.state);
    } else if (isUserLogin === "Email Olredy Existed") {
      this.setState({
        EmailState: "Email Olredy Existed",
      });
    }
  }
  // ##################################################################################
  // Send Login Data
  async handleLogin(e) {
    e.preventDefault();
    let Data = await {
      Email: this.state.Email,
      Password: this.state.Password,
    };
    let isUserLogin = await myFetcher("/User/login", "post", Data);
    if (isUserLogin === true) {
      this.setState({
        TheUserIsLogin: isUserLogin,
      });
      this.props.onUserLogin(this.state);
    } else if (isUserLogin === "Email Olredy Existed") {
      this.setState({
        EmailState: "Email Olredy Existed",
      });
    }
  }
  // ############################################
  // ############################################
  render() {
    let theForm;
    if (!this.state.IsInLogin) {
      theForm = (
        <form onSubmit={this.handleSignup}>
          <Form type="text" name="Name" onchange={this.handleChange} />
          <Form type="email" name="Email" onchange={this.handleChange} />
          {this.state.EmailState}
          <Form type="password" name="Password" onchange={this.handleChange} />
          <button type="submit" className="btn btn-primary">
            SEND
          </button>
        </form>
      );
    } else {
      theForm = (
        <form onSubmit={this.handleLogin}>
          <Form type="email" name="Email" onchange={this.handleChange} />
          {this.state.EmailState}
          <Form type="password" name="Password" onchange={this.handleChange} />
          <button type="submit" className="btn btn-primary">
            SEND
          </button>
        </form>
      );
    }
    let theTitle = this.state.IsInLogin ? "Login" : "Signup";
    let theNoTitle = this.state.IsInLogin ? "Signup" : "Login";
    return (
      <div>
        <div className="container">
          <h1 className="Signup">{theTitle}</h1>
          {theForm}
          <button
            type="submit"
            className="btn btn-warning mt-1"
            onClick={this.handIsInLogin}
          >
            {`Go To ${theNoTitle}`}
          </button>
          {theNoTitle === "Login" && (
            <PictursContainer theClassName="picturs_container0" />
          )}
          {/* <div className="creat_profile_pictur"></div> */}
        </div>
      </div>
    );
  }
}

// !##########################################################################################

const Form = ({ type, name, onchange }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{name}</label>
      <input
        required
        type={type}
        name={name}
        id={name}
        className="form-control"
        onChange={onchange}
      />
    </div>
  );
};

export default SignUp;
