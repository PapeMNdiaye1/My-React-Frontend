import React from "react";
import { myGetFetcher, myPostFetcher } from "../myFetcher";
import { Link } from "react-router-dom";

//! ##########################################################################
class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: "",
      UserEmail: "",
      UserProfilePicture: "",
      AllLikedPosts: [],
      MyPosts: [],
      Description: "",
      AllMyFriendsId: "",
      IsFollowed: false,
      SeePosts: true,
      SeeFriend: true,
      AllFriends: [],
      ALLFollowers: [],
      AllFriendsProfile: [],
      ALLFollowersProfile: [],
    };
    this.getAllPostsFromThisUser = this.getAllPostsFromThisUser.bind(this);
    this.grabPostIdFromOneOfMyPost = this.grabPostIdFromOneOfMyPost.bind(this);
    this.closeLeftBar = this.closeLeftBar.bind(this);
    this.getAllLikedPosts = this.getAllLikedPosts.bind(this);
    this.follow = this.follow.bind(this);
    this.unFollow = this.unFollow.bind(this);
    this.sendFollowedData = this.sendFollowedData.bind(this);
    this.changeHeadBtn = this.changeHeadBtn.bind(this);
    this.getAllFriendProfile = this.getAllFriendProfile.bind(this);
    this.getALLFollowersProfile = this.getALLFollowersProfile.bind(this);
    this.grabProfilePageIdFromPost = this.grabProfilePageIdFromPost.bind(this);
    this.start = this.start.bind(this);
  }
  // ##########################################################################
  componentDidMount() {
    this.start(this.props.UserId, this.props.AuthorId);
  }
  // ##########################################################################
  async start(MyId, AuthorId) {
    this.closeLeftBar();
    await this.getAllLikedPosts();
    // ##############################
    let UserInfos = await myGetFetcher(
      `/User/get-user-profile/${AuthorId}`,
      "GET"
    );
    await this.setState({
      UserName: UserInfos.User.username,
      UserEmail: UserInfos.User.email,
      UserProfilePicture: UserInfos.User.profilePicture,
      Description: UserInfos.User.description,
    });
    // ###################
    let AllPost = await myGetFetcher(`/Post/only-my-post/${AuthorId}`, "GET");
    this.getAllPostsFromThisUser(AllPost);
    // ###################
    let AllMyFriendsAndFollowersId = await myGetFetcher(
      `/Follow/get-all-friends-and-followers/${AuthorId}`,
      "GET"
    );
    await this.setState({
      ALLFollowers: AllMyFriendsAndFollowersId.allFriendsId.followers,
      AllFriends: AllMyFriendsAndFollowersId.allFriendsId.friends,
    });
    let allFollowersId = await [
      ...AllMyFriendsAndFollowersId.allFriendsId.followers.map(
        (follower) => follower.friendId
      ),
    ];
    if (allFollowersId.includes(MyId)) {
      this.setState({
        IsFollowed: true,
      });
    } else {
      this.setState({
        IsFollowed: false,
      });
    }
    // #############################################
    let allMyFriendsId = await myGetFetcher(
      `/Follow/get-all-friends/${MyId}`,
      "GET"
    );
    this.setState({
      AllMyFriendsId: [
        ...allMyFriendsId.allFriendsId.friends.map((user) => user.friendId),
      ],
    });
  }
  // ##########################################################################
  async getAllPostsFromThisUser(data) {
    let myPostsArray = [];
    data.allposts.map((postInfos) =>
      myPostsArray.push(
        <OneOfMyPost
          key={postInfos._id}
          postId={postInfos._id}
          postImageId={postInfos.postImageId}
          postImage={postInfos.postImage}
          postTitle={postInfos.postTitle}
          postDate={postInfos.postDate}
          nofLikes={postInfos.nofLikes}
          nofResponses={postInfos.postResponses.length}
          UserId={this.props.UserId}
          AuthorId={this.props.AuthorId}
          allLikedPosts={this.state.AllLikedPosts}
          onComment={this.grabPostIdFromOneOfMyPost}
        />
      )
    );
    this.setState({
      MyPosts: myPostsArray,
    });
  }
  // ##########################################################################
  grabPostIdFromOneOfMyPost(childDataFromPost) {
    this.props.onCommentInProfilePage(childDataFromPost);
  }
  // ##########################################################################
  closeLeftBar() {
    document
      .querySelector(".hamburger_menu")
      .children[0].classList.remove("bare_active");
    document.querySelector(".Left_Bar").classList.remove("Left_Bar_active");
  }
  // ##########################################################################
  async getAllLikedPosts() {
    let allLikedPosts = await myGetFetcher(
      `User/get-all-liked-posts/${this.props.UserId}`,
      "GET"
    );
    await this.setState({
      AllLikedPosts: [
        ...allLikedPosts.response.allLikedPosts.map((post) => post.postId),
      ],
    });
  }
  // ##########################################################################
  async follow() {
    let isUserFollowing = await myPostFetcher(
      `/Follow/follow/${this.props.UserId}`,
      {
        Id: this.props.AuthorId,
        FriendName: this.state.UserName,
        // FriendEmail: this.state.UserEmail,
        FriendProfilePicture: this.state.ProfilePicture,
      }
    );

    if (isUserFollowing.response) {
      this.setState({
        IsFollowed: true,
      });
      this.sendFollowedData(this.props.AuthorId, "follow");
    }
  }
  // ##########################################################################
  async unFollow() {
    let isUserUnFollowing = await myPostFetcher(
      `/Follow/unFollow/${this.props.UserId}`,
      {
        Id: this.props.AuthorId,
      }
    );
    if (isUserUnFollowing.response) {
      this.setState({
        IsFollowed: false,
      });
      this.sendFollowedData(this.props.AuthorId, "unFollow");
    }
  }
  // ##########################################################################
  async sendFollowedData(followerId, option) {
    if (option === "follow") {
      try {
        await myPostFetcher(`/Follow/add-follower/${followerId}`, {
          Id: this.props.UserId,
          FriendName: this.props.UserName,
          // FriendEmail: this.props.UserEmail,
          FriendProfilePicture: this.props.UserProfilePicture,
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
  // ##########################################################################
  changeHeadBtn(e) {
    let AllHeadBtn = document.querySelectorAll(".head_btn");
    AllHeadBtn.forEach((element) => {
      element.classList.remove("active");
    });
    e.target.classList.add("active");
    if (e.target === AllHeadBtn[0] && !this.state.SeePosts) {
      this.setState({
        SeePosts: true,
      });
    } else if (
      e.target === AllHeadBtn[1] &&
      (!this.state.SeeFriend || this.state.SeeFriend & this.state.SeePosts)
    ) {
      this.setState({
        SeeFriend: true,
        SeePosts: false,
      });
      this.getAllFriendProfile(this.state.AllFriends);
    } else if (
      e.target === AllHeadBtn[2] &&
      (this.state.SeeFriend || !this.state.SeeFriend & this.state.SeePosts)
    ) {
      this.setState({
        SeeFriend: false,
        SeePosts: false,
      });
      this.getALLFollowersProfile(this.state.ALLFollowers.reverse());
    }
  }
  // ##########################################################################
  getAllFriendProfile(theArray) {
    if (this.state.AllFriendsProfile.length === 0) {
      let profileArray = [];
      theArray.map((user) => {
        this.props.UserId !== user.friendId &&
          profileArray.push(
            <OneProfile
              key={user.friendId}
              UserName={user.friendName}
              UserId={user.friendId}
              ProfilePicture={user.friendProfilePicture}
              AllMyFriendsId={this.state.AllMyFriendsId}
              onOpenProfilePage={this.grabProfilePageIdFromPost}
            />
          );
      });
      this.setState({
        AllFriendsProfile: profileArray,
      });
    }
  }
  // ##########################################################################
  getALLFollowersProfile(theArray) {
    if (this.state.ALLFollowersProfile.length === 0) {
      let followersArray = [];
      theArray.map((user) => {
        this.props.UserId !== user.friendId &&
          followersArray.push(
            <OneProfile
              key={user.friendId}
              UserName={user.friendName}
              UserId={user.friendId}
              ProfilePicture={user.friendProfilePicture}
              AllMyFriendsId={this.state.AllMyFriendsId}
              onOpenProfilePage={this.grabProfilePageIdFromPost}
            />
          );
      });
      this.setState({
        ALLFollowersProfile: followersArray,
      });
    }
  }
  // #########################################################################
  async grabProfilePageIdFromPost(childDataFromPost) {
    await this.setState({
      MyPosts: [],
      SeePosts: true,
      SeeFriend: true,
      AllFriends: [],
      ALLFollowers: [],
      AllFriendsProfile: [],
      ALLFollowersProfile: [],
    });
    let AllHeadBtn = document.querySelectorAll(".head_btn");
    AllHeadBtn.forEach((element) => {
      element.classList.remove("active");
    });
    AllHeadBtn[0].classList.add("active");

    await this.start(this.props.UserId, childDataFromPost);
    this.getAllFriendProfile(this.state.AllFriends);
    this.getALLFollowersProfile(this.state.ALLFollowers.reverse());
    this.props.onOpenProfilePage(childDataFromPost);
  }
  // ?#########################################################################
  render() {
    return (
      <div className="profile_page_container">
        <div className="profile_container">
          <div className="profile_first_container">
            <div
              className="the_profile_picture"
              style={{ backgroundImage: this.state.UserProfilePicture }}
            ></div>
            <div className="the_user_name other_user_name">
              {this.state.UserName}
            </div>
          </div>
          <div className="number_of_posts_container">
            <div className="head_btn active" onClick={this.changeHeadBtn}>
              {this.state.MyPosts.length}
              {this.state.MyPosts.length > 1 ? "Posts" : "Post"}
            </div>
            <div className="head_btn" onClick={this.changeHeadBtn}>
              {this.state.AllFriends.length}
              {this.state.AllFriends.length > 1 ? "Followings" : "Following"}
            </div>
            <div className="head_btn" onClick={this.changeHeadBtn}>
              {this.state.ALLFollowers.length}
              {this.state.ALLFollowers.length > 1 ? "Followers" : "Follower"}
            </div>
          </div>
          <br />
          <div className="follow_container">
            {this.state.Description !== "" ? (
              <p className="profile_self_description">
                {this.state.Description}
              </p>
            ) : (
              <p className="profile_self_description">...</p>
            )}
            {!this.state.IsFollowed ? (
              <div className="follow_btn btn" onClick={this.follow}>
                follow
              </div>
            ) : (
              <div className="follow_btn btn" onClick={this.unFollow}>
                unFollow
              </div>
            )}
          </div>
        </div>
        {/* ############################################################ */}
        {this.state.SeePosts ? (
          <div className="all_my_posts_container">{this.state.MyPosts}</div>
        ) : (
          <React.Fragment>
            {this.state.SeeFriend ? (
              <div className="all_my_friends_and_followers_container">
                {this.state.AllFriendsProfile}
              </div>
            ) : (
              <div className="all_my_friends_and_followers_container">
                {this.state.ALLFollowersProfile}
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}
//! ##########################################################################
class OneOfMyPost extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
      NofLikes: props.nofLikes,
      PostTitle: "...",
    };
    this.like = this.like.bind(this);
    this.dislike = this.dislike.bind(this);
    this.handleComment = this.handleComment.bind(this);
  }
  // ##########################################################################
  componentDidMount() {
    if (this.props.allLikedPosts.includes(this.props.postId)) {
      this.setState({
        liked: true,
      });
    } else {
      this.setState({
        liked: false,
      });
    }
    if (this.props.postTitle.length > 13) {
      this.setState({
        PostTitle: this.props.postTitle.slice(0, 13) + "...",
      });
    } else {
      this.setState({
        PostTitle: this.props.postTitle,
      });
    }
  }
  // ##########################################################################
  like() {
    this.setState({
      liked: true,
      NofLikes: this.state.NofLikes + 1,
    });
    myPostFetcher(`/Post/like-and-dislike/${this.props.postId}`, {
      operation: "like",
      UserId: this.props.UserId,
      N: this.state.NofLikes + 1,
    });
  }
  // ##########################################################################
  dislike() {
    this.setState({
      liked: false,
      NofLikes: this.state.NofLikes - 1,
    });
    myPostFetcher(`/Post/like-and-dislike/${this.props.postId}`, {
      operation: "dislike",
      UserId: this.props.UserId,
      N: this.state.NofLikes - 1,
    });
  }
  // ##########################################################################
  handleComment(e) {
    this.props.onComment(this.props.postId);
    document.getElementById(this.props.postId).click();
  }
  // ?#########################################################################

  render() {
    let postImage;
    if (this.props.postImage !== "") {
      postImage = (
        <img
          src={`image/${this.props.postImage}`}
          alt={this.props.postTitle}
          width="100%"
        />
      );
    } else {
      postImage = null;
    }
    // ###############################
    let theHeart;
    if (this.state.liked) {
      theHeart = (
        <div className="heart_active" onClick={this.dislike}>
          <i className="fas fa-angle-double-down"></i>
        </div>
      );
    } else {
      theHeart = (
        <div className="heart" onClick={this.like}>
          <i className="fas fa-angle-double-up"></i>
        </div>
      );
    }
    // ###############################
    return (
      <div className="posts">
        <div className="post_date">{this.props.postDate}</div>
        <div className="post_image" onClick={this.handleComment}>
          <div className="post_title">
            <h3>{this.state.PostTitle}</h3>
          </div>
          {postImage}
        </div>
        <div className="likes_and_comments">
          <div className="N_like">{this.state.NofLikes}</div>
          {theHeart}
          <div className="N_com">{this.props.nofResponses}</div>
          <div className="comment" onClick={this.handleComment}>
            <Link style={{ textDecoration: "none" }} to="/container">
              <h6 style={{ display: "none" }} id={this.props.postId}>
                go to container
              </h6>
            </Link>
            <i className="fas fa-comment-alt"></i>
          </div>
        </div>
      </div>
    );
  }
}
//! ##########################################################################
class OneProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.openProfilePage = this.openProfilePage.bind(this);
  }

  openProfilePage() {
    this.props.onOpenProfilePage(this.props.UserId);
  }

  // ?##########################################################################
  render() {
    let theProfilePicture;
    if (this.props.ProfilePicture !== "") {
      theProfilePicture = { backgroundImage: this.props.ProfilePicture };
    } else {
      theProfilePicture = { background: "#000" };
    }

    return (
      <div className="one_profile">
        <div
          onClick={this.openProfilePage}
          style={theProfilePicture}
          className="profile_picture btn"
        ></div>
        <div className="user_info">
          <div className="user_name">{this.props.UserName}</div> <br />
        </div>
        <div className="follow_container">
          {this.props.AllMyFriendsId.includes(this.props.UserId) ? (
            <div className="follow btn">unFollow</div>
          ) : (
            <div className="follow btn">follow</div>
          )}
        </div>
      </div>
    );
  }
}

export { ProfilePage, OneOfMyPost };
