import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import { myGetFetcher, myDeleteFetcher } from "./myFetcher";
// ###############################
import SignUp from "./UsersControlor/SignUp";
import Login from "./UsersControlor/Login";
import { HomePostsContainer } from "./HomePage/HomePostsContainer";
import { ProfilePage } from "./HomePage/ProfilePage";
import MyProfilePage from "./HomePage/MyProfilePage";
import PostCreator from "./HomePage/PostCreator";
import Comments from "./HomePage/Comment/Comments";
//! ###################################################################################
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: "",
      Name: "Pape M Ndiaye",
      Email: "",
      AllLikedPosts: [],
      ProfilePictur: "",
      IsUserLogin: false,
      GetAllMyPost: false,
      ShowHoverla: false,
      GrabPostToCommentId: "",
      TheHomePostsContainer: (
        <Route
          exact
          path={"/home"}
          render={(props) => (
            <HomePostsContainer
              {...props}
              UserId={this.state.Id}
              AllLikedPosts={this.state.AllLikedPosts}
              onCommentInHomePostsContainer={
                this.grabPostIdFromHomePostsContainer
              }
              SeeAllMyPost={this.state.GetAllMyPost}
              onOpenProfilePage={this.GoToProfilePage}
            />
          )}
        />
      ),
      IdToPassInProfilePage: "",
    };
    this.handleUserLogin = this.handleUserLogin.bind(this);
    this.findUserInfos = this.findUserInfos.bind(this);
    this.toggleToGetAllMyPost = this.toggleToGetAllMyPost.bind(this);
    this.toggleToGetHome = this.toggleToGetHome.bind(this);
    this.grabPostIdFromHomePostsContainer = this.grabPostIdFromHomePostsContainer.bind(
      this
    );
    this.toggleHoverla = this.toggleHoverla.bind(this);
    this.LogOut = this.LogOut.bind(this);
    this.SignOut = this.SignOut.bind(this);
    this.GoToProfilePage = this.GoToProfilePage.bind(this);
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
            AllLikedPosts: [
              ...theUserInDb.User.allLikedPosts.map((post) => post.postId),
            ],
            IsUserLogin: true,
            Email: theUserInDb.User.email,
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
          AllLikedPosts: [
            ...theUserInDb.User.allLikedPosts.map((post) => post.postId),
          ],
          IsUserLogin: true,
        });
      }
    }
    console.log(childData);
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
              AllLikedPosts={this.state.AllLikedPosts}
              onCommentInHomePostsContainer={
                this.grabPostIdFromHomePostsContainer
              }
              SeeAllMyPost={false}
              onOpenProfilePage={this.GoToProfilePage}
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
              AllLikedPosts={this.state.AllLikedPosts}
              onCommentInHomePostsContainer={
                this.grabPostIdFromHomePostsContainer
              }
              SeeAllMyPost={true}
              onOpenProfilePage={this.GoToProfilePage}
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
    console.log(this.state.GrabPostToCommentId);
  }
  //###################################################################################
  toggleHoverla(theOption) {
    this.setState({
      ShowHoverla: theOption,
    });
  }
  //###################################################################################
  LogOut() {
    sessionStorage.removeItem("Email");
    this.setState({
      IsUserLogin: false,
      ShowHoverla: false,
    });
  }
  //###################################################################################
  SignOut() {
    sessionStorage.removeItem("Email");
    this.setState({
      IsUserLogin: false,
      ShowHoverla: false,
    });
    console.log("signout");
    //################################
    let DeletedUser = myDeleteFetcher(`User/delete-one-user/${this.state.Id}`);
    console.log(DeletedUser);
  }
  //###################################################################################
  GoToProfilePage(theId) {
    this.setState({
      IdToPassInProfilePage: theId,
    });
  }
  // ?#################################################################################
  render() {
    let theHoverla;
    if (
      this.state.ShowHoverla === "logout" ||
      this.state.ShowHoverla === "signout"
    ) {
      theHoverla = (
        <Hoverla
          onCloseHoverla={this.toggleHoverla}
          onLogOut={this.LogOut}
          onSignOut={this.SignOut}
          carte={this.state.ShowHoverla}
        />
      );
    }
    // ##################################################################
    if (this.state.IsUserLogin) {
      return (
        <div id="home_page_contaier">
          <BrowserRouter>
            <TopBar />
            <LeftBar
              onGetHome={this.toggleToGetHome}
              onGetAllMyPost={this.toggleToGetAllMyPost}
              onOpenHoverla={this.toggleHoverla}
              UserProfilePictur={this.state.ProfilePictur}
              UserName={this.state.Name}
              UserId={this.state.Id}
              UserEmail={this.state.Email}
            />
            {theHoverla}
            {/* ################################################################### */}
            <Redirect to={"/home"} />
            {/* <Redirect to={"/my-profile-page"} /> */}
            <Switch>
              {this.state.TheHomePostsContainer}
              <Route
                exact
                path={"/my-profile-page"}
                render={(props) => (
                  <MyProfilePage
                    {...props}
                    UserId={this.state.Id}
                    onCommentInProfilePage={
                      this.grabPostIdFromHomePostsContainer
                    }
                  />
                )}
              />
              <Route
                exact
                path={"/profile-page"}
                render={(props) => (
                  <ProfilePage
                    {...props}
                    UserId={this.state.Id}
                    AuthorId={this.state.IdToPassInProfilePage}
                    onCommentInProfilePage={
                      this.grabPostIdFromHomePostsContainer
                    }
                  />
                )}
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
                render={(props) => (
                  <Comments
                    {...props}
                    PostId={this.state.GrabPostToCommentId}
                    UserName={this.state.Name}
                    UserId={this.state.Id}
                    UserProfilePictur={this.state.ProfilePictur}
                    onOpenProfilePage={this.GoToProfilePage}
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
//! ###################################################################################
class LeftBar extends Component {
  constructor(props) {
    super(props);
    this.handleAllMyPost = this.handleAllMyPost.bind(this);
    this.handleHome = this.handleHome.bind(this);
    this.openLogout = this.openLogout.bind(this);
    // this.closeleftBar = this.closeleftBar.bind(this);
  }
  // #################################################################################
  handleAllMyPost() {
    this.props.onGetAllMyPost();
  }
  // #################################################################################
  handleHome() {
    this.props.onGetHome();
  }
  //##################################################################################
  openLogout(e) {
    let theOption = e.target.classList[1];
    this.props.onOpenHoverla(theOption);
  }
  // #################################################################################

  // ?################################################################################
  render() {
    return (
      <div className="Left_Bar">
        <div id="profile_cart">
          <div className="profile_pictur_container">
            <Link style={{ textDecoration: "none" }} to="/my-profile-page">
              <div
                className="profile_pictur"
                style={{ backgroundImage: this.props.UserProfilePictur }}
              ></div>
            </Link>
          </div>
          <Link style={{ textDecoration: "none" }} to="/my-profile-page">
            <h5 className="user_name">{this.props.UserName}</h5>
          </Link>

          <h6 className="user_email">{this.props.UserEmail}</h6>
        </div>
        {/* ############################################## */}
        <div id="options">
          <Link style={{ textDecoration: "none" }} to="/home">
            <div className="option home" onClick={this.handleHome}>
              <h3>Home</h3>
            </div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/creat-newpost">
            <div className="option creat_new_pot">
              <h3>Creat New Post</h3>
            </div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/only-my-posts">
            <div
              className="option only_my_posts"
              onClick={this.handleAllMyPost}
            >
              <h3>See All My Posts</h3>
            </div>
          </Link>
        </div>
        {/* ############################################## */}
        <div id="params">
          <div onClick={this.openLogout} className="option logout">
            <h3 onClick={this.openLogout}>Logout</h3>
          </div>
          <div onClick={this.openLogout} className="option signout">
            <h3 onClick={this.openLogout}>Signout</h3>
          </div>
          <div className="option parameters">
            <h3>Parameters</h3>
          </div>
        </div>
      </div>
    );
  }
}
//! ###################################################################################
class TopBar extends Component {
  constructor(props) {
    super(props);
    this.toggleftBar = this.toggleftBar.bind(this);
  }
  toggleftBar() {
    document
      .querySelector(".hamburger_menu")
      .children[0].classList.toggle("bare_active");
    document.querySelector(".Left_Bar").classList.toggle("Left_Bar_active");
  }
  render() {
    return (
      <div className="top_Bar">
        <div onClick={this.toggleftBar} className="hamburger_menu">
          <div className="bare "></div>
        </div>
        <h1 className="top_Title">Geek Blog</h1>
      </div>
    );
  }
}
//! ###################################################################################
class Hoverla extends Component {
  constructor(props) {
    super(props);
    this.closeHoverla = this.closeHoverla.bind(this);
    this.LogOut = this.LogOut.bind(this);
    this.SignOut = this.SignOut.bind(this);
  }
  // #################################################################################
  closeHoverla() {
    this.props.onCloseHoverla(false);
  }
  // #################################################################################
  LogOut() {
    this.props.onLogOut();
  }
  // #################################################################################
  SignOut() {
    this.props.onSignOut();
  }
  // ?################################################################################
  render() {
    const cart = (a, b, c, d) => {
      return (
        <div className={a}>
          <h3>{b}</h3>
          <div className="hoverla_btn_container">
            <div className="hoverla_btn" onClick={this.closeHoverla}>
              Classe
            </div>
            <div className="hoverla_btn" onClick={d}>
              {c}
            </div>
          </div>
        </div>
      );
    };
    return (
      <div className="hoverla">
        {this.props.carte === "logout" &&
          cart("logout_cart", "You Wanna Logout", "Logout", this.LogOut)}
        {/* ################################################### */}
        {this.props.carte === "signout" &&
          cart("signout_cart", "You Wanna Signout", "Signout", this.SignOut)}
      </div>
    );
  }
}

export default App;
