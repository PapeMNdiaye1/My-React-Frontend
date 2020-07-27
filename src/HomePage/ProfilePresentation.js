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
      AllFriendsId: [],
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
    let AllMyFriendsId = await myGetFetcher(
      `/Follow/get-all-friends/${this.props.UserId}`,
      "GET"
    );
    this.setState({
      AllFriendsId: [
        ...AllMyFriendsId.allFriendsId.friends.map((friend) => friend.friendId),
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
            ProfilePicture={user.profilePicture}
            onOpenProfilePage={this.grabProfilePageIdFromPost}
            AllFriendsId={this.state.AllFriendsId}
            onSendFollowedData={this.sendFollowedData}
          />
        );
    });
    await this.setState({
      AllProfile: [...this.randomize(userArray)],
      NumberOfUsers: userArray.length,
      LastGrabbedPostsContainer: [...data.User],
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
      JSON.stringify(this.state.LastGrabbedPostsContainer) !==
      JSON.stringify(data.User)
    ) {
      let someArray = [];
      await this.setState({
        AllExistingId: [
          ...new Set([
            ...this.state.AllExistingId,
            ...this.state.LastGrabbedPostsContainer.map((user) => user._id),
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
              ProfilePicture={user.profilePicture}
              onOpenProfilePage={this.grabProfilePageIdFromPost}
              AllFriendsId={this.state.AllFriendsId}
              onSendFollowedData={this.sendFollowedData}
            />
          )
      );
      this.setState({
        AllProfile: [...this.state.AllProfile, ...this.randomize(someArray)],
        LastGrabbedPostsContainer: [...data.User],
        NumberOfUsers: this.state.NumberOfUsers + someArray.length,
      });
    } else {
      document.querySelector("#refetch_users").style.display = "none";
    }
  }
  // ###########################################################################
  grabProfilePageIdFromPost(childDataFromPost) {
    this.props.onOpenProfilePage(childDataFromPost);
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
          FriendName: this.props.UserName,
          FriendEmail: this.props.UserEmail,
          FriendProfilePicture: this.props.ProfilePicture,
        });
      } catch (error) {
        console.log(error);
      }
    } else if (option === "unFollow") {
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
      <React.Fragment>
        <div className="profiles_presentation">
          {this.state.AllProfile}
          <div id="refetch_users">
            <button className="btn" onClick={this.grabMoreUsers}>
              See More...
            </button>
          </div>
        </div>
      </React.Fragment>
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
    if (this.props.AllFriendsId.includes(this.props.UserId)) {
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
        FriendName: this.props.UserName,
        FriendEmail: this.props.UserEmail,
        FriendProfilePicture: this.props.ProfilePicture,
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
      this.props.onSendFollowedData(this.props.UserId, "unFollow");
    }
  }
  // ?###########################################################################
  render() {
    let theProfilePicture;
    if (this.props.ProfilePicture !== "") {
      theProfilePicture = { backgroundImage: this.props.ProfilePicture };
    } else {
      theProfilePicture = { background: "#000" };
    }

    return (
      <div className="one_profile">
        <Link style={{ textDecoration: "none" }} to="/profile-page">
          <div
            onClick={this.openProfilePage}
            style={theProfilePicture}
            className="profile_picture btn"
          ></div>
        </Link>
        <div className="user_info">
          <div className="user_name">{this.props.UserName}</div> <br />
          <div className="user_followers">200 follower</div>
        </div>
        <div className="follow_container">
          {this.state.IsFollowed ? (
            <div className="follow btn" onClick={this.unFollow}>
              UnFollow
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
