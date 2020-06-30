import React, { Component } from "react";
import "./index.css";
import SignUp from "./UsersControlor/SignUp";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      Email: "",
      IsUserLogin: false,
    };
    this.handleUserLogin = this.handleUserLogin.bind(this);
    this.findUserInfos = this.findUserInfos.bind(this);
  }

  findUserInfos(UserEmail) {
    fetch(`/get-user-infons/${UserEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let nimp = data.User;
        console.log(nimp);
      });
  }

  async handleUserLogin(childData) {
    await this.setState({
      Name: childData.Name,
      Email: childData.Email,
      IsUserLogin: childData.TheUserIsLogin,
    });
    this.findUserInfos(this.state.Email);
  }

  render() {
    if (this.state.IsUserLogin) {
      return (
        <div>
          <h1>{this.state.Name}</h1>
          <h1>{this.state.Email}</h1>
        </div>
      );
    } else {
      return (
        <div>
          <SignUp onUserLogin={this.handleUserLogin} />
        </div>
      );
    }
  }
}

export default App;
