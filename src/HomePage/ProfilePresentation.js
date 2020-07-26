import React from "react";
import { myGetFetcher, myPostFetcher } from "../myFetcher";
import { Link } from "react-router-dom";

class ProfilesPresentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AllProfile: [],
      NumberOfUsers: 0,
      AllExistingId: [],
      AllFrindesId: [],
    };
    this.randomize = this.randomize.bind(this);
    this.getLastUsers = this.getLastUsers.bind(this);
    this.getSomeUsers = this.getSomeUsers.bind(this);
    this.grabProfilePageIdFromPost = this.grabProfilePageIdFromPost.bind(this);
    this.grabMoreUsers = this.grabMoreUsers.bind(this);
    this.sendFollowedData = this.sendFollowedData.bind(this);
  }
  // ############################################################################
  randomize(tab) {
    var i, j, tmp;
    for (i = tab.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      tmp = tab[i];
      tab[i] = tab[j];
      tab[j] = tmp;
    }
    return tab;
  }
  // ############################################################################
  async componentDidMount() {
    let AllMyFrindesId = await myGetFetcher(
      `/Follow/get-all-frindes/${this.props.UserId}`,
      "GET"
    );
    this.setState({
      AllFrindesId: [
        ...AllMyFrindesId.allFrindesId.frindes.map((frinde) => frinde.frindeId),
      ],
    });
    let LastUser = await myGetFetcher("/User/get-last-users", "GET");
    this.getLastUsers(LastUser);
  }
  // ############################################################################
  async getLastUsers(data) {
    let userArray = [];
    await data.User.map((user) => {
      user._id !== this.props.UserId &&
        userArray.push(
          <OneProfile
            key={user._id}
            UserId={user._id}
            UserEmail={user.email}
            MyId={this.props.UserId}
            UserName={user.username}
            Profilepictur={user.profilepictur}
            onOpenProfilePage={this.grabProfilePageIdFromPost}
            AllFrindesId={this.state.AllFrindesId}
            onSendFollowedData={this.sendFollowedData}
          />
        );
    });
    await this.setState({
      AllProfile: [...this.randomize(userArray)],
      NumberOfUsers: userArray.length,
      LastGrabPostArrayContaine: [...data.User],
      AllExistingId: [
        ...new Set([
          ...this.state.AllExistingId,
          ...data.User.map((user) => user._id),
        ]),
      ],
    });
  }
  // ###########################################################################
  async getSomeUsers(data) {
    if (
      JSON.stringify(this.state.LastGrabPostArrayContaine) !==
      JSON.stringify(data.User)
    ) {
      let someArray = [];
      await this.setState({
        AllExistingId: [
          ...new Set([
            ...this.state.AllExistingId,
            ...this.state.LastGrabPostArrayContaine.map((user) => user._id),
          ]),
        ],
      });
      console.log(this.state.AllExistingId);
      await data.User.map(
        (user) =>
          (this.props.UserId !== this.props.MyId) &
            !this.state.AllExistingId.includes(user._id) &&
          someArray.push(
            <OneProfile
              key={user._id}
              UserId={user._id}
              UserEmail={user.email}
              MyId={this.props.UserId}
              UserName={user.username}
              Profilepictur={user.profilepictur}
              onOpenProfilePage={this.grabProfilePageIdFromPost}
              AllFrindesId={this.state.AllFrindesId}
              onSendFollowedData={this.sendFollowedData}
            />
          )
      );
      this.setState({
        AllProfile: [...this.state.AllProfile, ...this.randomize(someArray)],
        LastGrabPostArrayContaine: [...data.User],
        NumberOfUsers: this.state.NumberOfUsers + someArray.length,
      });
    } else {
      document.querySelector("#refetch_users").style.display = "none";
    }
  }
  // ###########################################################################
  grabProfilePageIdFromPost(childDatafromPost) {
    this.props.onOpenProfilePage(childDatafromPost);
  }
  // ###########################################################################
  async grabMoreUsers() {
    let SomeUser = await myGetFetcher(
      `/User/get-some-users/${this.state.NumberOfUsers}`,
      "GET"
    );
    if (SomeUser.User.length > 0) {
      this.getSomeUsers(SomeUser);
    }
  }
  // ###########################################################################
  async sendFollowedData(followerId, option) {
    if (option === "follow") {
      try {
        await myPostFetcher(`/Follow/add-follower/${followerId}`, {
          Id: this.props.UserId,
          FrindeName: this.props.UserName,
          FrindeEmail: this.props.UserEmail,
          FrindeProfilepictur: this.props.ProfilePictur,
        });
      } catch (error) {
        console.log(error);
      }
    } else if (option === "unfollow") {
      try {
        await myPostFetcher(`/Follow/remove-follower/${followerId}`, {
          Id: this.props.UserId,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
  // ?##########################################################################
  render() {
    return (
      <div className="profiles_presentation">
        {this.state.AllProfile}
        <div id="refetch_users">
          <button className="btn" onClick={this.grabMoreUsers}>
            See More...
          </button>
        </div>
      </div>
    );
  }
}
// !###########################################################################
class OneProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      IsFollowed: false,
    };
    this.openProfilePage = this.openProfilePage.bind(this);
    this.follow = this.follow.bind(this);
    this.unFollow = this.unFollow.bind(this);
  }
  // ###########################################################################
  componentDidMount() {
    if (this.props.AllFrindesId.includes(this.props.UserId)) {
      console.log(this.props.AllFrindesId.includes(this.UserId));
      this.setState({
        IsFollowed: true,
      });
    }
  }
  // ###########################################################################
  openProfilePage() {
    this.props.onOpenProfilePage(this.props.UserId);
  }
  // ###########################################################################
  async follow() {
    let isUserFollowing = await myPostFetcher(
      `/Follow/follow/${this.props.MyId}`,
      {
        Id: this.props.UserId,
        FrindeName: this.props.UserName,
        FrindeEmail: this.props.UserEmail,
        FrindeProfilepictur: this.props.Profilepictur,
      }
    );

    if (isUserFollowing.response) {
      this.setState({
        IsFollowed: true,
      });
      this.props.onSendFollowedData(this.props.UserId, "follow");
    }
  }
  // ###########################################################################
  async unFollow() {
    let isUserUnFollowing = await myPostFetcher(
      `/Follow/unFollow/${this.props.MyId}`,
      {
        Id: this.props.UserId,
      }
    );
    if (isUserUnFollowing.response) {
      this.setState({
        IsFollowed: false,
      });
      this.props.onSendFollowedData(this.props.UserId, "unfollow");
    }
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
            className="profile_pictur btn"
          ></div>
        </Link>
        <div className="user_info">
          <div className="ures_name">{this.props.UserName}</div> <br />
          <div className="ures_followers">200 follower</div>
        </div>
        <div className="follow_container">
          {this.state.IsFollowed ? (
            <div className="follow btn" onClick={this.unFollow}>
              Unfollow
            </div>
          ) : (
            <div className="follow btn" onClick={this.follow}>
              follow
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ProfilesPresentation;
