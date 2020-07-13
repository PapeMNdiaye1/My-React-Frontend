import React from "react";
import { myGetFetcher } from "../myFetcher";
import { myDeleteFetcher } from "../myFetcher";
//! ##############################################################################
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
    };
    this.getLastPosts = this.getLastPosts.bind(this);
    this.getOnlyMyPosts = this.getOnlyMyPosts.bind(this);
    this.getSomePost = this.getSomePost.bind(this);
    this.getScrollPosition = this.getScrollPosition.bind(this);
  }
  // ##############################################################################
  async componentDidMount() {
    let LastPosts = await myGetFetcher("/Post/get-last-post", "GET");
    let AllMyPost = await myGetFetcher(
      `/Post/only-my-post/${this.props.UserId}`,
      "GET"
    );
    this.getLastPosts(LastPosts);
    this.getOnlyMyPosts(AllMyPost);
  }
  // #############################################################################
  async getLastPosts(data) {
    if (
      JSON.stringify(this.state.AllPostArrayContaine) !==
      JSON.stringify(data.allposts)
    ) {
      await this.setState({
        AllExistingId: [],
      });
      await data.allposts.map((postInfos) =>
        this.setState({
          AllExistingId: [
            ...new Set([...this.state.AllExistingId, postInfos._id]),
          ],
        })
      );
      // ###################################
      let allPostArray = [];
      await data.allposts.map((postInfos) =>
        allPostArray.push(
          <Post
            key={postInfos._id}
            postImage={postInfos.postImage}
            postTitle={postInfos.postTitle}
            postDescription={postInfos.postDescription}
            postDate={postInfos.postDate}
            postAuthorName={postInfos.postAuthorName}
            postAuthorPictur={postInfos.postAuthorPictur}
            deletePost="none"
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
          postImage={postInfos.postImage}
          postImageId={postInfos.postImageId}
          postId={postInfos._id}
          postTitle={postInfos.postTitle}
          postDescription={postInfos.postDescription}
          postDate={postInfos.postDate}
          postAuthorName={postInfos.postAuthorName}
          postAuthorPictur={postInfos.postAuthorPictur}
          deletePost="flex"
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
      await this.state.LastGrabPostArrayContaine.map((post) =>
        this.setState({
          AllExistingId: [...new Set([...this.state.AllExistingId, post._id])],
        })
      );

      let somePostArray = [];
      await data.allposts.map((postInfos) => {
        if (!this.state.AllExistingId.includes(postInfos._id)) {
          console.log(!this.state.AllExistingId.includes(postInfos._id));
          return somePostArray.push(
            <Post
              key={postInfos._id}
              postImage={postInfos.postImage}
              postTitle={postInfos.postTitle}
              postDescription={postInfos.postDescription}
              postDate={postInfos.postDate}
              postAuthorName={postInfos.postAuthorName}
              postAuthorPictur={postInfos.postAuthorPictur}
              deletePost="none"
            />
          );
        }
      });
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
  // ?############################################################################
  render() {
    if (!this.props.SeeAllMyPost) {
      let Posts = [...new Set(this.state.AllPost)];
      return (
        <div onScroll={this.getScrollPosition} className="home_posts_container">
          {Posts}
        </div>
      );
    } else {
      let MyPosts = [...new Set(this.state.MyPosts)];
      return <div className="home_posts_container">{MyPosts}</div>;
    }
  }
}

//! #################################################################################
//! #################################################################################
class Post extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleDeletePost = this.handleDeletePost.bind(this);
  }
  // ################################################################################
  async handleDeletePost() {
    myDeleteFetcher(`Post/delete-one-post/${this.props.postId}`);
    if (this.props.postImage !== "") {
      myDeleteFetcher(`/files/${this.props.postImageId}`);
    }
    window.location.reload();
  }
  // ?################################################################################
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
          <div className="basice_options">
            <div className="post_option like_post">
              <i className="fas fa-heart"></i>
            </div>
            <div className="post_option comments_post">comments</div>
          </div>
          <div
            className="post_option delete_post"
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
