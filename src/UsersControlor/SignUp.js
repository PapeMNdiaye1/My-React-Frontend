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
      ProfilePicture: "",
      ProfilePictureToDelete: "0000000000000",
      TheUserIsLogin: false,
      ErrorMessage: false,
    };
    this.handleSignup = this.handleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getFile = this.getFile.bind(this);
    this.getValue = this.getValue.bind(this);
    this.validationBorder = this.validationBorder.bind(this);
  }
  // #################################################################################
  // Handle All Form Change
  handleChange(e) {
    this.validationBorder("1px #FFF solid");
    this.setState({
      ErrorMessage: false,
    });
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
      ProfilePicture: this.state.ProfilePicture,
    };
    let isUserLogin = await myFetcher("/User/signup", "post", Data);

    if (isUserLogin === true) {
      this.setState({
        TheUserIsLogin: isUserLogin,
      });
      sessionStorage.setItem("Email", this.state.Email);
      this.props.onUserLogin(this.state);
    } else if (isUserLogin === "Email Olredy Existed") {
      this.validationBorder("1px red solid");
      this.setState({
        ErrorMessage: true,
      });
    }
  }
  // ###############################################
  getFile() {
    document.querySelector(".my_profile_pictur").style.backgroundImage = "";
    document.getElementById("hidden_file").click();
    fetch(`/files/${this.state.ProfilePictureToDelete}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
  // ######
  async getValue() {
    const allFileInfos = document.getElementById("hidden_file").files;
    const formData = new FormData();
    formData.append("file", allFileInfos[0]);
    // #######################
    let resposse = await fetch("/upload", {
      method: "POST",
      body: formData,
    });
    let picturInServer = await resposse.json();
    console.log(picturInServer.file);
    document.querySelector(
      ".my_profile_pictur"
    ).style.backgroundImage = `url(image/${picturInServer.file.filename})`;
    this.setState({
      ProfilePicture: `url(image/${picturInServer.file.filename})`,
      ProfilePictureToDelete: picturInServer.file.id,
    });
  }
  // ############################################
  validationBorder(border) {
    document.querySelectorAll(".forms")[1].style.border = border;
  }
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
            <div onClick={this.getFile} className="my_profile_pictur btn"></div>
          </div>
          <form onSubmit={this.handleSignup}>
            <Form type="text" name="Name" onchange={this.handleChange} />
            <Form type="email" name="Email" onchange={this.handleChange} />
            {this.state.ErrorMessage && (
              <div className="user_not_fund">Email Olredy Existed</div>
            )}
            <Form
              type="password"
              name="Password"
              onchange={this.handleChange}
            />
            <br />
            <div className="btn_container">
              <button type="submit" className="btn">
                Send
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
        <form className="fileInput" method="POST" encType="multipart/form-data">
          <input
            type="file"
            id="hidden_file"
            name="file"
            onChange={this.getValue}
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
