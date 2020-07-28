import React from "react";
import { myGetFetcher, myPostFetcher } from "../myFetcher";
import { OneOfMyPost } from "./ProfilePage";

//! ##########################################################################
class MyProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: "",
      UserEmail: "",
      UserProfilePicture: "",
      AllLikedPosts: [],
      MyPosts: [],
      NofFriends: 0,
      NofFollowers: 0,
    };
    this.getOnlyMyPosts = this.getOnlyMyPosts.bind(this);
    this.grabPostIdFromOneOfMyPost = this.grabPostIdFromOneOfMyPost.bind(this);
    this.closeLeftBar = this.closeLeftBar.bind(this);
  }
  // ##########################################################################
  async componentDidMount() {
    this.closeLeftBar();
    let UserInfos = await myGetFetcher(
      `/User/get-user-profile/${this.props.UserId}`,
      "GET"
    );
    await this.setState({
      UserName: UserInfos.User.username,
      UserEmail: UserInfos.User.email,
      UserProfilePicture: UserInfos.User.profilePicture,
      AllLikedPosts: [
        ...UserInfos.User.allLikedPosts.map((post) => post.postId),
      ],
    });
    let AllMyPost = await myGetFetcher(
      `/Post/only-my-post/${this.props.UserId}`,
      "GET"
    );
    this.getOnlyMyPosts(AllMyPost);
    let AllMyFriendsId = await myGetFetcher(
      `/Follow/get-all-friends-and-followers/${this.props.UserId}`,
      "GET"
    );
    this.setState({
      NofFriends: AllMyFriendsId.allFriendsId.friends.length,
      NofFollowers: AllMyFriendsId.allFriendsId.followers.length,
    });
  }
  // #########################################################################
  async getOnlyMyPosts(data) {
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
  // ?##########################################################################
  render() {
    return (
      <div className="my_profile_page_container">
        <div className="profile_container">
          <div className="profile_first_container">
            <div
              className="the_profile_picture"
              style={{ backgroundImage: this.state.UserProfilePicture }}
            ></div>
            <div className="the_user_name">
              {this.state.UserName}
              <br />
              <div className="email">{this.state.UserEmail}</div>
            </div>
          </div>
          <div className="number_of_posts_container">
            <div className="number_of_poste">
              {this.state.MyPosts.length} Post
            </div>
            <div className="number_of_like">
              {this.state.NofFriends}
              {this.state.NofFriends > 1 ? "Followings" : "Following"}
            </div>
            <div className="number_of_comments">
              {this.state.NofFollowers}
              {this.state.NofFollowers > 1 ? "Followers" : "Follower"}
            </div>
          </div>
          <div className="profile_self_description"></div>
        </div>

        {/* ############################################################ */}
        <div className="all_my_posts_container">{this.state.MyPosts}</div>
      </div>
    );
  }
}

export default MyProfilePage;
