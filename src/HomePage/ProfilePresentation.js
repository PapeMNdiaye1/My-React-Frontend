import React from "react";
import { myGetFetcher, myPostFetcher } from "../myFetcher";
import { Link } from "react-router-dom";

class ProfilesPresentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AllProfile: [],
    };
    this.getSomeUsers = this.getSomeUsers.bind(this);
    // this.openProfilePage = this.openProfilePage.bind(this);
    this.grabProfilePageIdFromPost = this.grabProfilePageIdFromPost.bind(this);
  }
  // ############################################################################
  async componentDidMount() {
    let LastUser = await myGetFetcher("/User/get-all-users", "GET");
    // console.table(LastUser.User);
    this.getSomeUsers(LastUser);
  }
  // ############################################################################
  async getSomeUsers(data) {
    let userArray = [];
    await data.User.map((user) => {
      user._id !== this.props.UserId &&
        userArray.push(
          <OneProfile
            key={user._id}
            UserId={user._id}
            MyId={this.props.UserId}
            UserName={user.username}
            Profilepictur={user.profilepictur}
            onOpenProfilePage={this.grabProfilePageIdFromPost}
          />
        );
    });
    this.setState({
      AllProfile: userArray,
    });
  }
  // ###########################################################################
  grabProfilePageIdFromPost(childDatafromPost) {
    this.props.onOpenProfilePage(childDatafromPost);
  }
  // ?###########################################################################
  render() {
    return <div className="profiles_presentation">{this.state.AllProfile}</div>;
  }
}
// !###########################################################################
class OneProfile extends React.Component {
  constructor(props) {
    super(props);
    this.openProfilePage = this.openProfilePage.bind(this);
  }
  // ###########################################################################
  openProfilePage() {
    this.props.onOpenProfilePage(this.props.UserId);
  }
  // ?###########################################################################
  render() {
    let theprofilePictur;
    if (this.props.Profilepictur !== "") {
      theprofilePictur = { backgroundImage: this.props.Profilepictur };
    } else {
      theprofilePictur = { background: "#000" };
    }

    return (
      <div className="one_profile">
        <Link style={{ textDecoration: "none" }} to="/profile-page">
          <div
            onClick={this.openProfilePage}
            style={theprofilePictur}
            className="profile_pictur"
          ></div>
        </Link>
        <div className="user_info">
          <div className="ures_name">{this.props.UserName}</div> <br />
          <div className="ures_followers">200 follower</div>
        </div>
        <div className="follow_container">
          <div className="follow">follow</div>
        </div>
      </div>
    );
  }
}

export default ProfilesPresentation;
