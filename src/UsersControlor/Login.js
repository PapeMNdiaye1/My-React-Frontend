import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
// import { myFetcher } from "../App";
// ###############################
import { myFetcher } from "../myFetcher";
import { Form } from "./SignUp";

//! ##########################################################################################################
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      Email: "",
      Password: "",
      TheUserIsLogin: false,
      EmailState: "",
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
      sessionStorage.setItem("Email", this.state.Email);
      this.props.onUserLogin(this.state);
    }
  }
  // ############################################
  // ############################################
  render() {
    if (this.state.TheUserIsLogin) {
      return <Redirect to={"/home"} />;
    }
    return (
      <div className="login_body">
        <h1 className="signup_and_login_title">Login</h1>
        <div className="forms_container">
          <form onSubmit={this.handleLogin}>
            <Form type="email" name="Email" onchange={this.handleChange} />
            <Form
              type="password"
              name="Password"
              onchange={this.handleChange}
            />
            <br />
            <div className="btn_container">
              <button type="submit" className="btn btn-primary">
                SEND
              </button>
            </div>
          </form>
          <div className="switch">
            <Link to="/SignUp">
              <button type="submit" className="btn btn-warning mt-1">
                Go To Signup
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

// !##########################################################################################

export default Login;
