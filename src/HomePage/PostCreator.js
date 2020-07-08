import React from "react";
import { myPostFetcher } from "../myFetcher";
// import { Link } from "react-router-dom";
// ###############################
//! #############################################################################
class PostCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UserId: props.UserId,
      PostImage: "",
      PostTitle: "",
      PostDescription: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendPost = this.sendPost.bind(this);
    this.getfile = this.getfile.bind(this);
  }
  // ###########################################
  handleChange(e) {
    const theFormName = e.target.name;
    const theFormValue = e.target.value;
    this.setState({
      [theFormName]: theFormValue,
    });
  }
  // ##########################################
  // Send Created Post
  async sendPost(e) {
    e.preventDefault();
    let Data = await {
      UserId: this.state.UserId,
      PostImage: this.state.PostImage,
      PostTitle: this.state.PostTitle,
      PostDescription: this.state.PostDescription,
    };
    // #####################
    const rawResponse = await fetch("/Post/creat-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(Data),
    });
    let response = await rawResponse.json();
    // ######################
    if (response.NewPostid) {
      let isPostCreated = myPostFetcher("/User/add-new-post", {
        UserId: this.state.UserId,
        PsotId: response.NewPostid,
      });
      isPostCreated.then((res) => {
        console.log(res.postsCreated);
      });
    }
    // #####################
    this.setState({
      PostImage: "",
      PostTitle: "",
      PostDescription: "",
    });
  }
  // ###############################################################################
  getfile() {
    document.getElementById("hiddenfile2").click();
  }
  // ###############################################################################
  // ###############################################################################
  render() {
    // ####################
    let dt = new Date();
    let postDate = `${(dt.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dt
      .getDate()
      .toString()
      .padStart(2, "0")}/${dt
      .getFullYear()
      .toString()
      .padStart(4, "0")} ${dt
      .getHours()
      .toString()
      .padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`;

    let postSendingBtn;
    if (this.state.PostTitle && this.state.PostDescription) {
      postSendingBtn = (
        <div onClick={this.sendPost} className="send_post">
          Send Post
        </div>
      );
    } else {
      postSendingBtn = <div className="send_post2">Send Post</div>;
    }
    return (
      <div className="post_creation_container">
        <div className="send_post_container">{postSendingBtn}</div>
        <div className="creat_post">
          <div className="creat_post_header">
            <div
              className="post_author_pictur"
              style={{ backgroundImage: this.props.UserProfilePictur }}
            ></div>
            <h6 className="post_author_name">{this.props.UserName}</h6>
          </div>
          <div className="creat_post_image">
            <div onClick={this.getfile} className="select_pictur">
              Select pictur
            </div>
          </div>
          <form
            className="fileInput"
            method="POST"
            encType="multipart/form-data"
          >
            <input
              type="file"
              id="hiddenfile2"
              name="file"
              onChange={this.getvalue}
            />
          </form>
          <div className="post_description">
            <h5 className="creat_post_title">
              <input
                id="creat_title"
                type="text"
                name="PostTitle"
                placeholder="Your post title..."
                onChange={this.handleChange}
              />
            </h5>
            <textarea
              name="PostDescription"
              id="creat_description"
              cols="30"
              rows="10"
              placeholder="Your post..."
              onChange={this.handleChange}
            ></textarea>
          </div>
          <h6 className="post_date">{postDate}</h6>
        </div>
      </div>
    );
  }
}

export default PostCreator;
