import React from "react";
import { myGetFetcher } from "../myFetcher";
import { myDeleteFetcher, myPostFetcher } from "../myFetcher";
import { Link } from "react-router-dom";
import Comments from "./Comment/Comments";

//! ##############################################################################
class HomePostsContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      AllPost: [],
      AllPostArrayContaine: "",
      LastGrabPostArrayContaine: [],
      MyPosts: [],
      AllExistingId: [],
      // ###########################
      NumberOfPost: null,
      AllLikedPosts: this.props.AllLikedPosts,
      PostToComment: "",
      OpenComment: false,
    };
    this.getLastPosts = this.getLastPosts.bind(this);
    this.getOnlyMyPosts = this.getOnlyMyPosts.bind(this);
    this.getSomePost = this.getSomePost.bind(this);
    this.getScrollPosition = this.getScrollPosition.bind(this);
    this.grabPostIdFromPost = this.grabPostIdFromPost.bind(this);
    this.grabProfilePageIdFromPost = this.grabProfilePageIdFromPost.bind(this);
    this.getAllLikedPosts = this.getAllLikedPosts.bind(this);
    this.closeComment = this.closeComment.bind(this);
  }
  // ##############################################################################
  async componentDidMount() {
    document.querySelector(".profiles_presentation").style.display = "block";
    this.getAllLikedPosts();
    let LastPosts = await myGetFetcher("/Post/get-last-post", "GET");
    let AllMyPost = await myGetFetcher(
      `/Post/only-my-post/${this.props.UserId}`,
      "GET"
    );
    await this.getLastPosts(LastPosts);
    await this.getOnlyMyPosts(AllMyPost);
    document.querySelector(".close_comment").click();
  }
  // #############################################################################
  async getLastPosts(data) {
    if (
      JSON.stringify(this.state.AllPostArrayContaine) !==
      JSON.stringify(data.allposts)
    ) {
      await this.setState({
        AllExistingId: [
          ...new Set([
            ...this.state.AllExistingId,
            ...data.allposts.map((postInfos) => postInfos._id),
          ]),
        ],
      });
      // ###################################
      let allPostArray = [];
      await data.allposts.map((postInfos) =>
        allPostArray.push(
          <Post
            key={postInfos._id}
            NofLike={postInfos.nofLikes}
            NofResponse={postInfos.postResponses.length}
            postImage={postInfos.postImage}
            postId={postInfos._id}
            postTitle={postInfos.postTitle}
            postDescription={postInfos.postDescription}
            postDate={postInfos.postDate}
            postAuthorId={postInfos.postAuthorId}
            postAuthorName={postInfos.postAuthorName}
            postAuthorPictur={postInfos.postAuthorPictur}
            deletePost="none"
            onComment={this.grabPostIdFromPost}
            onOpenProfilePage={this.grabProfilePageIdFromPost}
            UserId={this.props.UserId}
            allLikedPosts={this.state.AllLikedPosts}
          />
        )
      );
      await this.setState({
        AllPostArrayContaine: [...data.allposts],
        AllPost: allPostArray,
        NumberOfPost: allPostArray.length,
      });
    }
  }
  // #############################################################################
  async getOnlyMyPosts(data) {
    let myPostsArray = [];
    data.allposts.map((postInfos) => {
      return myPostsArray.push(
        <Post
          key={postInfos._id}
          NofLike={postInfos.nofLikes}
          NofResponse={postInfos.postResponses.length}
          postImage={postInfos.postImage}
          postImageId={postInfos.postImageId}
          postId={postInfos._id}
          postTitle={postInfos.postTitle}
          postDescription={postInfos.postDescription}
          postDate={postInfos.postDate}
          postAuthorId={postInfos.postAuthorId}
          postAuthorName={postInfos.postAuthorName}
          postAuthorPictur={postInfos.postAuthorPictur}
          deletePost="flex"
          onComment={this.grabPostIdFromPost}
          onOpenProfilePage={this.grabProfilePageIdFromPost}
          UserId={this.props.UserId}
          allLikedPosts={this.state.AllLikedPosts}
        />
      );
    });
    this.setState({
      MyPosts: myPostsArray,
    });
  }
  // #############################################################################
  async getSomePost(data) {
    if (
      JSON.stringify(this.state.LastGrabPostArrayContaine) !==
      JSON.stringify(data.allposts)
    ) {
      await this.setState({
        AllExistingId: [
          ...new Set([
            ...this.state.AllExistingId,
            ...this.state.LastGrabPostArrayContaine.map((post) => post._id),
          ]),
        ],
      });

      let somePostArray = [];
      await data.allposts.map(
        (postInfos) =>
          !this.state.AllExistingId.includes(postInfos._id) &&
          somePostArray.push(
            <Post
              key={postInfos._id}
              NofLike={postInfos.nofLikes}
              NofResponse={postInfos.postResponses.length}
              postImage={postInfos.postImage}
              postTitle={postInfos.postTitle}
              postId={postInfos._id}
              postDescription={postInfos.postDescription}
              postDate={postInfos.postDate}
              postAuthorId={postInfos.postAuthorId}
              postAuthorName={postInfos.postAuthorName}
              postAuthorPictur={postInfos.postAuthorPictur}
              deletePost="none"
              onComment={this.grabPostIdFromPost}
              onOpenProfilePage={this.grabProfilePageIdFromPost}
              UserId={this.props.UserId}
              allLikedPosts={this.state.AllLikedPosts}
            />
          )
      );
      await this.setState({
        NumberOfPost: this.state.NumberOfPost + somePostArray.length,
        LastGrabPostArrayContaine: [...data.allposts],
        AllPost: [...this.state.AllPost, ...somePostArray],
      });
    }
  }
  // #############################################################################
  async getScrollPosition() {
    const homePostsContainer = document.querySelector(".home_posts_container");
    let sroll = await Math.floor(
      (homePostsContainer.scrollTop /
        (homePostsContainer.scrollHeight - homePostsContainer.clientHeight)) *
        100
    );
    // ###################################
    if (sroll < 1) {
      let LastPosts = await myGetFetcher("/Post/get-last-post", "GET");
      if (LastPosts.allposts.length > 0) {
        await this.getLastPosts(LastPosts);
      }
    } else if (sroll >= 99) {
      let AllPost = await myGetFetcher(
        `/Post/get-some-post/${this.state.NumberOfPost}`,
        "GET"
      );
      if (AllPost.allposts.length > 0) {
        await this.getSomePost(AllPost);
      }
    }
  }
  // ############################################################################
  async grabPostIdFromPost(childDatafromPost) {
    await this.setState({
      PostToComment: childDatafromPost,
      OpenComment: true,
    });
  }
  closeComment() {
    this.setState({
      OpenComment: false,
    });
  }
  // ############################################################################
  grabProfilePageIdFromPost(childDatafromPost) {
    this.props.onOpenProfilePage(childDatafromPost);
  }
  // ###########################################################################
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
  // ?###########################################################################
  render() {
    if (!this.props.SeeAllMyPost) {
      // let Posts = [...new Set(this.state.AllPost)];
      return (
        <React.Fragment>
          <div className="close_comment" onClick={this.closeComment}>
            close
          </div>
          {this.state.OpenComment && (
            <div className="the_comment_container">
              <Comments
                PostId={this.state.PostToComment}
                UserName={this.props.UserName}
                UserId={this.props.UserId}
                UserProfilePicture={this.props.UserProfilePicture}
                onOpenProfilePage={this.grabProfilePageIdFromPost}
              />
            </div>
          )}

          <div
            onScroll={this.getScrollPosition}
            className="home_posts_container"
          >
            {this.state.AllPost}
          </div>
        </React.Fragment>
      );
    } else {
      // let MyPosts = [...new Set(this.state.MyPosts)];
      return (
        <React.Fragment>
          <div className="close_comment" onClick={this.closeComment}>
            close
          </div>
          {this.state.OpenComment && (
            <div className="the_comment_container">
              <Comments
                PostId={this.state.PostToComment}
                UserName={this.props.UserName}
                UserId={this.props.UserId}
                UserProfilePicture={this.props.UserProfilePicture}
                onOpenProfilePage={this.grabProfilePageIdFromPost}
              />
            </div>
          )}
          <div className="home_posts_container">{this.state.MyPosts}</div>
        </React.Fragment>
      );
    }
  }
}
//! #############################################################################
class Post extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
      NofLike: props.NofLike,
      PostDescription: <p>...</p>,
    };
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.like = this.like.bind(this);
    this.dislike = this.dislike.bind(this);
    this.openProfilePage = this.openProfilePage.bind(this);
    this.sowAlldescription = this.sowAlldescription.bind(this);
    this.showDeleteHoverla = this.showDeleteHoverla.bind(this);
    this.closeDeleteHoverla = this.closeDeleteHoverla.bind(this);
  }
  async componentDidMount() {
    if (this.props.allLikedPosts.includes(this.props.postId)) {
      await this.setState({
        liked: true,
      });
    } else {
      this.setState({
        liked: false,
      });
    }
    // ###############################
    if (this.props.postDescription.length > 113) {
      this.setState({
        PostDescription: (
          <p>
            {this.props.postDescription.slice(0, 113) + "... "}
            <samp onClick={this.sowAlldescription}>Ride-More</samp>
          </p>
        ),
      });
    } else {
      this.setState({
        PostDescription: <p>{this.props.postDescription}</p>,
      });
    }
  }
  // ################################################################################
  async handleDeletePost() {
    myDeleteFetcher(`Post/delete-one-post/${this.props.postId}`);
    if (this.props.postImage !== "") {
      myDeleteFetcher(`/files/${this.props.postImageId}`);
    }
    document.getElementById(this.props.postId).style.display = "none";
    // window.location.reload();
  }
  // ################################################################################
  handleComment(e) {
    this.props.onComment(this.props.postId);
    console.log(this.props.postId);
  }
  // ################################################################################
  like() {
    this.setState({
      liked: true,
      NofLike: this.state.NofLike + 1,
    });
    myPostFetcher(`/Post/like-and-dislike/${this.props.postId}`, {
      operation: "like",
      UserId: this.props.UserId,
      N: this.state.NofLike + 1,
    });
  }
  // ################################################################################
  dislike() {
    this.setState({
      liked: false,
      NofLike: this.state.NofLike - 1,
    });
    myPostFetcher(`/Post/like-and-dislike/${this.props.postId}`, {
      operation: "dislike",
      UserId: this.props.UserId,
      N: this.state.NofLike - 1,
    });
  }
  // ################################################################################
  openProfilePage() {
    this.props.onOpenProfilePage(this.props.postAuthorId);
  }
  // ################################################################################
  sowAlldescription() {
    this.setState({
      PostDescription: <p>{this.props.postDescription}</p>,
    });
  }
  // ################################################################################
  showDeleteHoverla() {
    document.getElementById(`hoverla${this.props.postId}`).style.display =
      "flex";
  }
  // ################################################################################
  closeDeleteHoverla() {
    document.getElementById(`hoverla${this.props.postId}`).style.display =
      "none";
  }
  // ?################################################################################
  render() {
    let theHeart;
    if (this.state.liked) {
      theHeart = (
        <div className="post_option heart_active" onClick={this.dislike}>
          <i className="fas fa-angle-double-down"></i>
        </div>
      );
    } else {
      theHeart = (
        <div className="post_option heart" onClick={this.like}>
          <i className="fas fa-angle-double-up"></i>
        </div>
      );
    }
    // ####################################
    let postImage;
    if (this.props.postImage !== "") {
      postImage = (
        <img
          onClick={this.handleComment}
          src={`image/${this.props.postImage}`}
          alt={this.props.postTitle}
          width="100%"
        />
      );
    } else {
      postImage = null;
    }
    // ####################################
    let theProfilePicture;
    if (this.props.postAuthorPictur !== "") {
      theProfilePicture = { backgroundImage: this.props.postAuthorPictur };
    } else {
      theProfilePicture = { background: "#000" };
    }

    let ProfilePicture;
    if (this.props.UserId === this.props.postAuthorId) {
      ProfilePicture = (
        <Link style={{ textDecoration: "none" }} to="/my-profile-page">
          <div
            style={theProfilePicture}
            className="post_author_pictur btn"
          ></div>
        </Link>
      );
    } else {
      ProfilePicture = (
        <Link style={{ textDecoration: "none" }} to="/profile-page">
          <div
            onClick={this.openProfilePage}
            style={theProfilePicture}
            className="post_author_pictur btn"
          ></div>
        </Link>
      );
    }

    return (
      <div className="post" id={this.props.postId}>
        <div className="post_header">
          {ProfilePicture}
          <h3 className="post_author_name">{this.props.postAuthorName}</h3>
        </div>
        <div className="post_image">
          {postImage}
          <div className="delete_hoverla" id={`hoverla${this.props.postId}`}>
            <h3>You wanna delet this post</h3>
            <div className="btn_container">
              <div className="btn classe" onClick={this.closeDeleteHoverla}>
                Classe
              </div>
              <div className="btn delete" onClick={this.handleDeletePost}>
                Delete
              </div>
            </div>
          </div>
        </div>
        <div className="options_of_post">
          <div className="basice_options">
            {theHeart}
            <div
              onClick={this.handleComment}
              className="post_option comments_post"
            >
              <i className="fas fa-comment-alt"></i>
              {/* <Link style={{ textDecoration: "none" }} to="/container"> */}
              <h6
                style={{ display: "none" }}
                id={`container${this.props.postId}`}
              >
                go to container
              </h6>
              {/* </Link> */}
            </div>
          </div>
          <div
            className="post_option delete_post"
            style={{ display: this.props.deletePost }}
            onClick={this.showDeleteHoverla}
          >
            <i className="fas fa-trash"></i>
          </div>
        </div>
        <div className="show_NLike_NComment">
          <div>
            {this.state.NofLike}
            {this.state.NofLike > 1 ? " Likes" : " Like"}
          </div>
          <div>
            {this.props.NofResponse}
            {this.props.NofResponse > 1 ? " Responses" : " Response"}
          </div>
        </div>
        <div
          className="post_description"
          id={`post_description${this.props.postId}`}
        >
          <h4 className="post_title">{this.props.postTitle}</h4>
          {this.state.PostDescription}
          <div className="post_date">
            <h2>{this.props.postDate}</h2>
          </div>
        </div>
      </div>
    );
  }
}

export { HomePostsContainer, Post };
/*
  // async componentWillMount() {
  //   let nimp = JSON.parse(localStorage.getItem("allpost"));
  //   let LastPosts = {
  //     allposts: [...nimp],
  //   };
  //   if (LastPosts.allposts.length > 0) {
  //     this.getLastPosts(LastPosts);
  //     console.log("locale");
  //   } else {
  //     let LastPosts = await myGetFetcher("/Post/get-last-post", "GET");
  //     this.getLastPosts(LastPosts);
  //     console.log("fetching");
  //   }
  // }
  // componentWillUpdate(nextProps, nextState) {
  //   localStorage.setItem(
  //     "allpost",
  //     JSON.stringify(nextState.AllPostArrayContaine)
  //   );
  // }
*/
