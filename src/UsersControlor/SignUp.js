import React, { Component } from "react";
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
      ProfilePicturToDelete: "0000000000000",
      TheUserIsLogin: false,
      EmailState: "",
    };
    this.handleSignup = this.handleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getfile = this.getfile.bind(this);
    this.getvalue = this.getvalue.bind(this);
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
  // ###############################################
  getfile() {
    document.getElementById("hiddenfile").click();
    fetch(`/files/${this.state.ProfilePicturToDelete}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
  // ######
  async getvalue() {
    const allFileInfos = document.getElementById("hiddenfile").files;
    const formData = new FormData();
    formData.append("file", allFileInfos[0]);
    // #######################
    let resposse = await fetch("/upload", {
      method: "POST",
      body: formData,
    });
    let picturInServer = await resposse.json();
    console.log(picturInServer.file);
    const profilePictur = document.querySelector(".my_profile_pictur");
    profilePictur.style.backgroundImage = `url(image/${picturInServer.file.filename})`;
    this.setState({
      ProfilePictur: `url(image/${picturInServer.file.filename})`,
      ProfilePicturToDelete: picturInServer.file.id,
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
            <div onClick={this.getfile} className="my_profile_pictur"></div>
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
              <button type="submit">SEND</button>
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
        <form className="fileInput" method="POST" encType="multipart/form-data">
          <input
            type="file"
            id="hiddenfile"
            name="file"
            onChange={this.getvalue}
          />
        </form>
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
