import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import { myGetFetcher } from "./myFetcher";
// ###############################
import SignUp from "./UsersControlor/SignUp";
import Login from "./UsersControlor/Login";
import HomePostsContainer from "./HomePage/HomePostsContainer";
import PostCreator from "./HomePage/PostCreator";
import Comments from "./HomePage/Comment/Comments";
// ##############################
//! ##########################################################################################################
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: "",
      Name: "Pape M Ndiaye",
      Email: "Pmomar44@gmail.com",
      ProfilePictur: "",
      IsUserLogin: false,
    };
    this.handleUserLogin = this.handleUserLogin.bind(this);
    this.findUserInfos = this.findUserInfos.bind(this);
  }
  // #################################################################################
  async componentDidMount() {
    let EmailInSession = await sessionStorage.getItem("Email");
    if (EmailInSession) {
      let theUserInDb = await this.findUserInfos(EmailInSession);
      if (theUserInDb.User._id) {
        this.setState({
          Name: theUserInDb.User.username,
          Id: theUserInDb.User._id,
          ProfilePictur: theUserInDb.User.profilepictur,
          IsUserLogin: true,
        });
      }
    } else {
      console.log("no Session");
    }
  }
  // ##################################################################################
  async findUserInfos(UserEmail) {
    let UserInDb = await myGetFetcher(
      `/User/get-user-infons/${UserEmail}`,
      "GET"
    );
    return UserInDb;
  }
  // ##################################################################################
  async handleUserLogin(childData) {
    await this.setState({
      Email: childData.Email,
    });
    if (childData.TheUserIsLogin) {
      let theUserInDb = await this.findUserInfos(this.state.Email);
      if (theUserInDb.User._id) {
        this.setState({
          Name: theUserInDb.User.username,
          Id: theUserInDb.User._id,
          ProfilePictur: theUserInDb.User.profilepictur,
          IsUserLogin: true,
        });
      }
    }
  }
  // #################################################################################
  render() {
    if (this.state.IsUserLogin) {
      return (
        <div id="home_page_contaier">
          <BrowserRouter>
            <Redirect to={"/home"} />
            <TopBar />
            <LeftBar UserName={this.state.Name} UserEmail={this.state.Email} />
            <Switch>
              <Route
                exact
                path={"/home"}
                render={(props) => <HomePostsContainer {...props} />}
              />
              <Route
                exact
                path={"/creat-newpost"}
                render={(props) => (
                  <PostCreator
                    {...props}
                    UserName={this.state.Name}
                    UserId={this.state.Id}
                    UserProfilePictur={this.state.ProfilePictur}
                  />
                )}
              />
              <Route
                exact
                path={"/container"}
                render={(props) => <Comments {...props} />}
              />
              {/* <Route
                  for error
                  <component/>
            /> */}
            </Switch>
          </BrowserRouter>
        </div>
      );
    } else {
      return (
        <BrowserRouter>
          <Redirect to={"/SignUp"} />
          <Switch>
            <Route
              exact
              path={"/login"}
              render={(props) => (
                <Login {...props} onUserLogin={this.handleUserLogin} />
              )}
            />
            <Route
              exact
              path={"/SignUp"}
              render={(props) => (
                <SignUp {...props} onUserLogin={this.handleUserLogin} />
              )}
            />
          </Switch>
        </BrowserRouter>
      );
    }
  }
}

// ############################################
class LeftBar extends Component {
  constructor(props) {
    super(props);
    // this.hadelNewPostcreation = this.hadelNewPostcreation.bind(this);
  }

  // hadelNewPostcreation() {
  //   // const leftBar = document.querySelector(".Left_Bar");
  //   // leftBar.style.left = "-30%";
  // }

  render() {
    return (
      <div className="Left_Bar">
        <div id="profile_cart">
          <div className="profile_pictur_container">
            <div className="profile_pictur"></div>
          </div>
          <h5 className="user_name">{this.props.UserName}</h5>
          <h6 className="user_email">{this.props.UserEmail}</h6>
        </div>
        {/* ############################################## */}
        <div id="options">
          <Link style={{ textDecoration: "none" }} to="/home">
            <div className="option">
              <h3>Home</h3>
            </div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/creat-newpost">
            <div
              onClick={this.hadelNewPostcreation}
              className="option creat_new_pot"
            >
              <h3>Creat New Post</h3>
            </div>
          </Link>
          <div className="option">
            <h3>See All My Posts</h3>
          </div>
        </div>
        {/* ############################################### */}
        <div id="params"></div>
      </div>
    );
  }
}
// ############################################
class TopBar extends Component {
  render() {
    return (
      <div className="top_Bar">
        <h1 className="top_Title">Geek Blog</h1>
      </div>
    );
  }
}

export default App;
