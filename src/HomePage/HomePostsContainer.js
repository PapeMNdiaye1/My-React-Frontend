import React, { Component } from "react";
import { myGetFetcher } from "../myFetcher";

class HomePostsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AllPost: [],
      MyPosts: [],
      isSeeAllMyPost: props.SeeAllMyPost,
    };
    console.log(props.SeeAllMyPost);
    console.log(this.state.isSeeAllMyPost);
  }

  async componentDidMount() {
    let response = await myGetFetcher("/Post/all-post", "GET");
    response.allposts.map((postInfos, index) => {
      this.setState(() =>
        this.state.AllPost.push(
          <Post
            key={index}
            postImage={postInfos.postImage}
            postTitle={postInfos.postTitle}
            postDescription={postInfos.postDescription}
            postDate={postInfos.postDate}
            postAuthorName={postInfos.postAuthorName}
            postAuthorPictur={postInfos.postAuthorPictur}
          />
        )
      );
      if (postInfos.postAuthorId === this.props.UserId) {
        this.setState(() =>
          this.state.MyPosts.push(
            <Post
              key={index}
              postImage={postInfos.postImage}
              postTitle={postInfos.postTitle}
              postDescription={postInfos.postDescription}
              postDate={postInfos.postDate}
              postAuthorName={postInfos.postAuthorName}
              postAuthorPictur={postInfos.postAuthorPictur}
            />
          )
        );
      }
    });
  }
  // ################################################
  render() {
    if (!this.props.SeeAllMyPost) {
      return <div className="home_posts_container">{this.state.AllPost}</div>;
    } else {
      return <div className="home_posts_container">{this.state.MyPosts}</div>;
    }
  }
}

class Post extends Component {
  constructor(props) {
    super(props);
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
