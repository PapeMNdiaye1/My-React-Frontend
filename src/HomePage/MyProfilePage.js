import React from "react";
import { myGetFetcher, myPostFetcher } from "../myFetcher";
import { OneOfMyPost } from "./ProfilePage";

import { Link } from "react-router-dom";

//! ##########################################################################
class MyProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: "",
      UserEmail: "",
      UserProfilePictur: "",
      AllLikedPosts: [],
      MyPosts: [],
      MyAllLikes: 0,
      MyAllComments: 0,
    };
    this.getOnlyMyPosts = this.getOnlyMyPosts.bind(this);
    this.grabPostIdFromOneOfMyPost = this.grabPostIdFromOneOfMyPost.bind(this);
    this.closeleftBar = this.closeleftBar.bind(this);
  }
  // ##########################################################################
  async componentDidMount() {
    this.closeleftBar();
    let UserInfos = await myGetFetcher(
      `/User/get-user-profile/${this.props.UserId}`,
      "GET"
    );
    await this.setState({
      UserName: UserInfos.User.username,
      UserEmail: UserInfos.User.email,
      UserProfilePictur: UserInfos.User.profilepictur,
      AllLikedPosts: [
        ...UserInfos.User.allLikedPosts.map((post) => post.postId),
      ],
    });
    let AllMyPost = await myGetFetcher(
      `/Post/only-my-post/${this.props.UserId}`,
      "GET"
    );
    this.getOnlyMyPosts(AllMyPost);
  }
  // #########################################################################
  async getOnlyMyPosts(data) {
    let myPostsArray = [];
    let myAllLikes = 0;
    let myAllComments = 0;
    data.allposts.map((postInfos) => {
      return [
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
        ),
        (myAllLikes += postInfos.nofLikes),
        (myAllComments += postInfos.postResponses.length),
      ];
    });
    this.setState({
      MyPosts: myPostsArray,
      MyAllLikes: myAllLikes,
      MyAllComments: myAllComments,
    });
  }
  // ##########################################################################
  grabPostIdFromOneOfMyPost(childDatafromPost) {
    this.props.onCommentInProfilePage(childDatafromPost);
  }
  // ##########################################################################
  closeleftBar() {
    document.querySelector(".profiles_presentation").style.display = "none";
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
              className="the_profile_pictur"
              style={{ backgroundImage: this.state.UserProfilePictur }}
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
            <div className="number_of_like">{this.state.MyAllLikes} Likes</div>
            <div className="number_of_coments">
              {this.state.MyAllComments} Coments
            </div>
          </div>
        </div>

        {/* ############################################################ */}
        <div className="all_my_posts_container">{this.state.MyPosts}</div>
      </div>
    );
  }
}

export default MyProfilePage;
