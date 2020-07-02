import React, { Component } from "react";
import "./index.css";
import SignUp from "./UsersControlor/SignUp";
// import Login from "./UsersControlor/Login";
import HomePage from "./HomePage/HomePage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: "",
      Name: "Pape M Ndiaye",
      Email: "Pmomar44@gmail.com",
      IsUserLogin: false,
    };
    this.handleUserLogin = this.handleUserLogin.bind(this);
    this.findUserInfos = this.findUserInfos.bind(this);
  }

  async findUserInfos(UserEmail) {
    const rawResponse = await fetch(`/User/get-user-infons/${UserEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    let UserInDb = await rawResponse.json();
    console.log(UserInDb);

    if (UserInDb.User._id) {
      this.setState({
        Id: UserInDb.User._id,
        IsUserLogin: true,
      });
    }
  }

  async handleUserLogin(childData) {
    await this.setState({
      // Name: childData.Name,
      Email: childData.Email,
    });
    if (childData.TheUserIsLogin) {
      this.findUserInfos(this.state.Email);
    }
  }

  render() {
    if (this.state.IsUserLogin) {
      return (
        <div id="home_page_contaier">
          <HomePage UserInfos={this.state} />
        </div>
      );
    } else {
      return <SignUp onUserLogin={this.handleUserLogin} />;
      // return <Login onUserLogin={this.handleUserLogin} />;
    }
  }
}

export default App;
