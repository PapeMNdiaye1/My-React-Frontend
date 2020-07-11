import React, { Component } from "react";
import { myGetFetcher } from "../myFetcher";
import { myDeleteFetcher } from "../myFetcher";
//! ##########################################################################################################
class HomePostsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AllPost: [],
      MyPosts: [],
    };
    this.getALLPost = this.getALLPost.bind(this);
    this.getOnlyMyPosts = this.getOnlyMyPosts.bind(this);
  }
  async componentDidMount() {
    let AllPost = await myGetFetcher("/Post/all-post", "GET");
    this.getALLPost(AllPost);
    console.log("AllPost");
    // } else {
    let AllMyPost = await myGetFetcher(
      `/Post/only-my-post/${this.props.UserId}`,
      "GET"
    );
    this.getOnlyMyPosts(AllMyPost);
    console.log("MyPost");
    // }
  }

  async getALLPost(data) {
    data.allposts.map((postInfos) => {
      return this.setState({
        AllPost: [
          ...this.state.AllPost,
          <Post
            key={postInfos._id}
            postImage={postInfos.postImage}
            postTitle={postInfos.postTitle}
            postDescription={postInfos.postDescription}
            postDate={postInfos.postDate}
            postAuthorName={postInfos.postAuthorName}
            postAuthorPictur={postInfos.postAuthorPictur}
            deletePost="none"
          />,
        ],
      });
    });
  }

  async getOnlyMyPosts(data) {
    data.allposts.map((postInfos) => {
      return this.setState({
        MyPosts: [
          ...this.state.MyPosts,
          <Post
            key={postInfos._id}
            postImage={postInfos.postImage}
            postImageId={postInfos.postImageId}
            postId={postInfos._id}
            postTitle={postInfos.postTitle}
            postDescription={postInfos.postDescription}
            postDate={postInfos.postDate}
            postAuthorName={postInfos.postAuthorName}
            postAuthorPictur={postInfos.postAuthorPictur}
            deletePost="flex"
          />,
        ],
      });
    });
  }
  // ####################################################################################################
  // ####################################################################################################
  render() {
    // ##############################################
    if (!this.props.SeeAllMyPost) {
      return <div className="home_posts_container">{this.state.AllPost}</div>;
    } else {
      return <div className="home_posts_container">{this.state.MyPosts}</div>;
    }
  }
}
//! ##########################################################################################################
class Post extends Component {
  constructor(props) {
    super(props);
    this.handleDeletePost = this.handleDeletePost.bind(this);
  }
  async handleDeletePost() {
    myDeleteFetcher(`Post/delete-one-post/${this.props.postId}`);
    if (this.props.postImage !== "") {
      myDeleteFetcher(`/files/${this.props.postImageId}`);
    }
  }
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

    return (
      <div className="post">
        <div className="post_header">
          <div
            style={{ backgroundImage: this.props.postAuthorPictur }}
            className="post_author_pictur"
          ></div>
          <h3 className="post_author_name">{this.props.postAuthorName}</h3>
        </div>
        <div className="post_image">{postImage}</div>
        <div className="options_of_post">
          <div className="like_post">
            <i className="fas fa-heart"></i>
          </div>
          <div className="comments_post">comments</div>
          <div
            className="delete_post"
            style={{ display: this.props.deletePost }}
            onClick={this.handleDeletePost}
          >
            delete
          </div>
        </div>
        <div className="post_description">
          <h4 className="post_title">{this.props.postTitle}</h4>
          <p>{this.props.postDescription}</p>
          <div className="post_date">
            <h2>{this.props.postDate}</h2>
          </div>
        </div>
      </div>
    );
  }
}

export { HomePostsContainer, Post };
