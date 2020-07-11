import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import { myGetFetcher } from "./myFetcher";
// ###############################
import SignUp from "./UsersControlor/SignUp";
import Login from "./UsersControlor/Login";
import { HomePostsContainer, Post } from "./HomePage/HomePostsContainer";
import PostCreator from "./HomePage/PostCreator";
import Comments from "./HomePage/Comment/Comments";
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
      // ######################
      GetAllMyPost: false,
      TheHomePostsContainer: (
        <Route
          exact
          path={"/home"}
          render={(props) => (
            <HomePostsContainer
              {...props}
              UserId={this.state.Id}
              SeeAllMyPost={this.state.GetAllMyPost}
            />
          )}
        />
      ),
    };
    this.handleUserLogin = this.handleUserLogin.bind(this);
    this.findUserInfos = this.findUserInfos.bind(this);
    this.toggleGetAllMyPost = this.toggleGetAllMyPost.bind(this);
  }
  // #################################################################################
  async componentDidMount() {
    let EmailInSession = await sessionStorage.getItem("Email");
    if (EmailInSession) {
      let theUserInDb = await this.findUserInfos(EmailInSession);
      try {
        if (theUserInDb.User._id) {
          this.setState({
            Name: theUserInDb.User.username,
            Id: theUserInDb.User._id,
            ProfilePictur: theUserInDb.User.profilepictur,
            IsUserLogin: true,
          });
        }
      } catch (error) {
        console.log(error);
      }
      // ###################################
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
  // ################################################################################
  toggleGetAllMyPost() {
    if (this.state.GetAllMyPost) {
      this.setState({
        GetAllMyPost: false,
        TheHomePostsContainer: (
          <Route
            exact
            path={"/home"}
            render={(props) => (
              <HomePostsContainer
                {...props}
                UserId={this.state.Id}
                SeeAllMyPost={false}
              />
            )}
          />
        ),
      });
      console.log(this.state.GetAllMyPost);
    } else {
      this.setState({
        GetAllMyPost: true,
        TheHomePostsContainer: (
          <Route
            exact
            path={"/home"}
            render={(props) => (
              <HomePostsContainer
                {...props}
                UserId={this.state.Id}
                SeeAllMyPost={true}
              />
            )}
          />
        ),
      });
      console.log(this.state.GetAllMyPost);
    }
  }
  // ##################################################################################################
  // ##################################################################################################
  render() {
    if (this.state.IsUserLogin) {
      return (
        <div id="home_page_contaier">
          <BrowserRouter>
            <Redirect to={"/home"} />
            <TopBar />
            <LeftBar
              onGetAllMyPost={this.toggleGetAllMyPost}
              UserProfilePictur={this.state.ProfilePictur}
              UserName={this.state.Name}
              UserEmail={this.state.Email}
            />
            <Switch>
              {this.state.TheHomePostsContainer}
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
    this.hadleAllMyPost = this.hadleAllMyPost.bind(this);
  }
  hadleAllMyPost() {
    this.props.onGetAllMyPost();
  }
  render() {
    return (
      <div className="Left_Bar">
        <div id="profile_cart">
          <div className="profile_pictur_container">
            <div
              className="profile_pictur"
              style={{ backgroundImage: this.props.UserProfilePictur }}
            ></div>
          </div>
          <h5 className="user_name">{this.props.UserName}</h5>
          <h6 className="user_email">{this.props.UserEmail}</h6>
        </div>
        {/* ############################################## */}
        <div id="options">
          <Link style={{ textDecoration: "none" }} to="/home">
            <div className="option goToHome">
              <h3>Home</h3>
            </div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/creat-newpost">
            <div className="option creat_new_pot">
              <h3>Creat New Post</h3>
            </div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/home">
            <div className="option" onClick={this.hadleAllMyPost}>
              <h3>See All My Posts</h3>
            </div>
          </Link>
        </div>
        {/* ############################################### */}
        <div id="params"></div>
      </div>
    );
  }
  // }
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
