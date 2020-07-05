import React, { Component } from "react";
import { PictursContainer } from "../HomePage/PostCreator";
import { Redirect, Link } from "react-router-dom";
import { myFetcher } from "../myFetcher";

//! ##########################################################################################################
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      Email: "",
      Password: "",
      ProfilePictur: "",
      TheUserIsLogin: false,
      EmailState: "",
    };
    this.handleSignup = this.handleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleProfilePictur = this.handleProfilePictur.bind(this);
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
      ProfilePictur: this.state.ProfilePictur,
    };
    let isUserLogin = await myFetcher("/User/signup", "post", Data);
    console.log(isUserLogin);

    if (isUserLogin === true) {
      this.setState({
        TheUserIsLogin: isUserLogin,
      });
      sessionStorage.setItem("Email", this.state.Email);
      this.props.onUserLogin(this.state);
    } else if (isUserLogin === "Email Olredy Existed") {
      this.setState({
        EmailState: "Email Olredy Existed",
      });
    }
  }
  // ###############################################################################
  // Selection Of Profil Pictur
  handleProfilePictur(e) {
    let theProfilePictur = getComputedStyle(e.target).getPropertyValue(
      "background-image"
    );
    const profilePictur = document.querySelector(".my_profile_pictur");
    profilePictur.style.backgroundImage = theProfilePictur;
    this.setState({
      ProfilePictur: theProfilePictur,
    });
  }
  // ############################################
  // ############################################
  render() {
    if (this.state.TheUserIsLogin) {
      return <Redirect to={"/home"} />;
    }
    return (
      <div className="signup_body">
        <h1 className="signup_and_login_title">Signup</h1>
        <div className="forms_container">
          <div className="creat_profile_pictur">
            <div className="my_profile_pictur"></div>
          </div>
          <form onSubmit={this.handleSignup}>
            <Form type="text" name="Name" onchange={this.handleChange} />
            <Form type="email" name="Email" onchange={this.handleChange} />
            {this.state.EmailState}
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
            <Link to="/login">
              <button type="submit" className="btn btn-warning mt-1">
                Go To Login
              </button>
            </Link>
          </div>
        </div>
        <div className="picturs_container_part">
          <PictursContainer
            theClassName="picturs_container0"
            onPicturSelected={this.handleProfilePictur}
          />
        </div>
      </div>
    );
  }
}

// !##########################################################################################
export const Form = ({ type, name, onchange }) => {
  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <br />
      <input
        required
        type={type}
        name={name}
        id={name}
        className="forms"
        onChange={onchange}
      />
    </div>
  );
};

export default SignUp;
