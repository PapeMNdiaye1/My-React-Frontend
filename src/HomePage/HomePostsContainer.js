import React, { Component } from "react";

class HomePostsContainer extends Component {
  render() {
    return (
      <div className="home_posts_container">
        <Post />
        <Post />
      </div>
    );
  }
}

class Post extends Component {
  render() {
    return (
      <div className="post">
        <div className="post_header">
          <div className="post_author_pictur"></div>
          <h6 className="post_author_name">Pape Ndiaye</h6>
        </div>
        <div className="post_image"></div>
        <div className="post_description">
          <h4 className="post_title">Post Title</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus
            exercitationem at provident officia odit neque dolorum veniam
            veritatis optio corporis minus cum excepturi magnam, enim,
            praesentium est consequatur ipsa reiciendis. Lorem ipsum dolor sit
            amet, consectetur adipisicing elit. Temporibus exercitationem at
            provident officia odit neque dolorum veniam veritatis optio corporis
            minus cum excepturi magnam, enim, praesentium est consequatur ipsa
            reiciendis. Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Temporibus exercitationem at provident officia odit neque
            dolorum veniam veritatis optio corporis minus cum excepturi magnam,
            enim, praesentium est consequatur ipsa reiciendis.
          </p>
          <div className="post_infos">
            <div className="comments">comments</div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePostsContainer;
