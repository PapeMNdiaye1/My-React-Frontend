import React from "react";
import { myGetFetcher, myPostFetcher } from "../myFetcher";
import { Link } from "react-router-dom";

//! ##########################################################################
class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // #############################
      UserId: this.props.UserId,
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
      `/User/get-user-profile/${this.state.UserId}`,
      "GET"
    );
    this.setState({
      UserName: UserInfos.User.username,
      UserEmail: UserInfos.User.email,
      UserProfilePictur: UserInfos.User.profilepictur,
      AllLikedPosts: [...UserInfos.User.allLikedPosts.map((post) => post._id)],
    });
    let AllMyPost = await myGetFetcher(
      `/Post/only-my-post/${this.state.UserId}`,
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
            UserId={this.state.UserId}
            allLikedPosts={this.state.AllLikedPosts}
            onComment={this.grabPostIdFromOneOfMyPost}
          />
        ),
        (myAllLikes += postInfos.nofLikes),
        (myAllComments += postInfos.postResponses.length),
      ];
    });
    // console.log(myAllLike);
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
    document
      .querySelector(".hamburger_menu")
      .children[0].classList.remove("bare_active");
    document.querySelector(".Left_Bar").classList.remove("Left_Bar_active");
  }
  // ?##########################################################################
  render() {
    return (
      <div className="profile_page_container">
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
          <div className="nomber_of_posts_container">
            <div className="nomber_of_poste">
              {this.state.MyPosts.length} Post
            </div>
            <div className="nomber_of_like">{this.state.MyAllLikes} Likes</div>
            <div className="nomber_of_coments">
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
  // ?##########################################################################

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
          <i className="fas fa-heart"></i>
        </div>
      );
    } else {
      theHeart = (
        <div className="heart" onClick={this.like}>
          <i className="fas fa-heart"></i>
        </div>
      );
    }
    // ###############################
    return (
      <div className="posts">
        <div className="post_date">{this.props.postDate}</div>
        <div className="post_image">
          <div className="post_title">
            <h3>{this.state.PostTitle}</h3>
          </div>
          {postImage}
        </div>
        <div className="likes_and_coments">
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

export { ProfilePage, OneOfMyPost };
