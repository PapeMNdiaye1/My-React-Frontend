import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import { myGetFetcher } from "./myFetcher";
// ###############################
import SignUp from "./UsersControlor/SignUp";
import Login from "./UsersControlor/Login";
import { HomePostsContainer } from "./HomePage/HomePostsContainer";
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
      GrabPostToCommentId: "",
      TheHomePostsContainer: (
        <Route
          exact
          path={"/home"}
          render={(props) => (
            <HomePostsContainer
              {...props}
              UserId={this.state.Id}
              onCommentInHomePostsContainer={
                this.grabPostIdFromHomePostsContainer
              }
              SeeAllMyPost={this.state.GetAllMyPost}
            />
          )}
        />
      ),
    };
    this.handleUserLogin = this.handleUserLogin.bind(this);
    this.findUserInfos = this.findUserInfos.bind(this);
    this.toggleToGetAllMyPost = this.toggleToGetAllMyPost.bind(this);
    this.toggleToGetHome = this.toggleToGetHome.bind(this);
    this.grabPostIdFromHomePostsContainer = this.grabPostIdFromHomePostsContainer.bind(
      this
    );
  }
  // ##################################################################################
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
  // ##################################################################################
  toggleToGetHome() {
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
              onCommentInHomePostsContainer={
                this.grabPostIdFromHomePostsContainer
              }
              SeeAllMyPost={false}
            />
          )}
        />
      ),
    });
  }
  // ##################################################################################
  toggleToGetAllMyPost() {
    this.setState({
      GetAllMyPost: true,
      TheHomePostsContainer: (
        <Route
          exact
          path={"/only-my-posts"}
          render={(props) => (
            <HomePostsContainer
              {...props}
              UserId={this.state.Id}
              onCommentInHomePostsContainer={
                this.grabPostIdFromHomePostsContainer
              }
              SeeAllMyPost={true}
            />
          )}
        />
      ),
    });
  }
  // ##################################################################################
  async grabPostIdFromHomePostsContainer(childDataFromPostsContainer) {
    await this.setState({
      GrabPostToCommentId: childDataFromPostsContainer,
    });
  }
  // ?##########################################################################################
  render() {
    if (this.state.IsUserLogin) {
      return (
        <div id="home_page_contaier">
          <BrowserRouter>
            <Redirect to={"/home"} />
            <TopBar />
            <LeftBar
              onGetHome={this.toggleToGetHome}
              onGetAllMyPost={this.toggleToGetAllMyPost}
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
                render={(props) => (
                  <Comments
                    {...props}
                    PostId={this.state.GrabPostToCommentId}
                    UserName={this.state.Name}
                    UserId={this.state.Id}
                    UserProfilePictur={this.state.ProfilePictur}
                  />
                )}
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

//! ##################################################################################
class LeftBar extends Component {
  constructor(props) {
    super(props);
    this.handleAllMyPost = this.handleAllMyPost.bind(this);
    this.handleHome = this.handleHome.bind(this);
  }
  // #################################################################################
  handleAllMyPost() {
    this.props.onGetAllMyPost();
  }
  // #################################################################################
  handleHome() {
    this.props.onGetHome();
  }
  // ?################################################################################
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
            <div className="option" onClick={this.handleHome}>
              <h3>Home</h3>
            </div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/creat-newpost">
            <div className="option creat_new_pot">
              <h3>Creat New Post</h3>
            </div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/only-my-posts">
            <div className="option" onClick={this.handleAllMyPost}>
              <h3>See All My Posts</h3>
            </div>
          </Link>
        </div>
        {/* ############################################# */}
        <div id="params">
          <div className="option Logout">
            <h3>Logout</h3>
          </div>
          <div className="option signout">
            <h3>Signout</h3>
          </div>
          <div className="option parameters">
            <h3>Parameters</h3>
          </div>
        </div>
      </div>
    );
  }
}

//! ##########################################################################################################
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
