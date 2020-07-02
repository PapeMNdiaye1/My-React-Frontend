import React, { Component } from "react";
import HomePostsContainer from "./HomePostsContainer";
import Comments from "./Comment/Comments";
import { PostCreator } from "./PostCreator";
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserWantToComment: false,
    };
    // console.log(props);
  }

  // handleComente(){
  //   this.setState({
  //     UserWantToComment:
  //   })
  // }

  render() {
    return (
      <React.Fragment>
        <TopBar />

        {/* <LeftBar
          UserName={this.props.UserInfos.Name}
          UserEmail={this.props.UserInfos.Email}
        /> */}
        <PostCreator
          UserName={this.props.UserInfos.Name}
          UserId={this.props.UserInfos.Id}
        />
        {/* <Comments /> */}
        {/* <HomePostsContainer /> */}
      </React.Fragment>
    );
  }
}
// ############################################
class LeftBar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="Left_Bar">
        <div className="profile_cart">
          <div className="profile_container">
            <div className="profile_pictur"></div>
            <h5 className="user_name">{this.props.UserName}</h5>
            <h6 className="user_email">{this.props.UserEmail}</h6>
          </div>
        </div>
        <div className="options">Creat New Post</div>
        <div className="options">See All My Posts</div>
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

export default HomePage;
