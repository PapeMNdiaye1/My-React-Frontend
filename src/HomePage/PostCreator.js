import React from "react";
import { Link } from "react-router-dom";

//! #############################################################################
class PostCreator extends React.Component {
  constructor(props) {
    super(props);
    let dt = new Date();
    this.state = {
      PostImage: "",
      PostTitle: "",
      PostDescription: "",
      ProfilePictureToDelete: "0000000000",
      PostDate: `${(dt.getMonth() + 1)
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
        .padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`,
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendPost = this.sendPost.bind(this);
    this.getfile = this.getfile.bind(this);
    this.getvalue = this.getvalue.bind(this);
    this.closeLeftBar = this.closeLeftBar.bind(this);
  }
  // ###############################################################################
  componentDidMount() {
    this.closeLeftBar();
  }
  // ###############################################################################
  handleChange(e) {
    const theFormName = e.target.name;
    const theFormValue = e.target.value.trim();
    this.setState({
      [theFormName]: theFormValue.replace(/(\n)+/g, "\n"),
    });
  }
  // ###############################################################################
  async sendPost(e) {
    e.preventDefault();
    let Data = await {
      UserId: this.props.UserId,
      UserName: this.props.UserName,
      UserProfilePicture: this.props.UserProfilePicture,
      PostImage: this.state.PostImage,
      PostImageId: this.state.ProfilePictureToDelete,
      PostTitle: this.state.PostTitle,
      PostDescription: this.state.PostDescription,
      PostDate: this.state.PostDate,
    };
    // #####################
    await fetch("/Post/creat-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(Data),
    });
    // #####################
    this.setState({
      PostImage: "",
      PostTitle: "",
      PostDescription: "",
    });
    document.querySelector("#creat_title").value = "";
    document.querySelector("#creat_description").value = "";
    document.querySelector(".goToHome").click();
  }
  // ###############################################################################
  getfile() {
    this.setState({
      PostImage: "",
    });
    document.getElementById("hidden_file2").click();
    fetch(`/files/${this.state.ProfilePictureToDelete}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
  // ###############################################################################
  async getvalue() {
    const allFileInfos = document.getElementById("hidden_file2").files;
    const formData = new FormData();
    formData.append("file", allFileInfos[0]);
    // #######################
    try {
      let resposse = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      let picturInServer = await resposse.json();
      console.log(picturInServer.file);
      this.setState({
        PostImage: picturInServer.file.filename,
        ProfilePictureToDelete: picturInServer.file.id,
      });
    } catch (error) {
      console.log(error);
    }
  }
  // ###############################################################################
  closeLeftBar() {
    document.querySelector(".profiles_presentation").style.display = "none";
    document
      .querySelector(".hamburger_menu")
      .children[0].classList.remove("bare_active");
    document.querySelector(".Left_Bar").classList.remove("Left_Bar_active");
  }
  // ###############################################################################
  render() {
    let postImage;
    if (this.state.PostImage !== "") {
      postImage = (
        <img src={`image/${this.state.PostImage}`} alt="" width="100%" />
      );
    } else {
      postImage = null;
    }
    // ####################
    let postSendingBtn;
    if (this.state.PostTitle && this.state.PostDescription) {
      postSendingBtn = (
        <div onClick={this.sendPost} className="send_post btn">
          Send Post
        </div>
      );
    } else {
      postSendingBtn = <div className="send_post2 btn">Send Post</div>;
    }

    return (
      <div className="post_creation_container">
        <div className="send_post_container">
          {postSendingBtn}
          <Link style={{ textDecoration: "none" }} to="/home">
            <h3 style={{ opacity: "0" }} className="goToHome">
              goToHome
            </h3>
          </Link>
        </div>

        <div className="creat_post">
          <div className="creat_post_header">
            <Link style={{ textDecoration: "none" }} to="/my-profile-page">
              <div
                className="post_author_picture"
                style={{
                  backgroundImage: this.props.UserProfilePicture,
                }}
              ></div>
            </Link>

            <h6 className="post_author_name">{this.props.UserName}</h6>
          </div>
          <div className="creat_post_image">
            {postImage}
            <div className="select_picture_container">
              <div onClick={this.getfile} className="select_picture btn">
                Select pictur
              </div>
            </div>
          </div>
          <form
            className="fileInput"
            method="POST"
            encType="multipart/form-data"
          >
            <input
              type="file"
              id="hidden_file2"
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
                maxLength="65"
              />
            </h5>
            <textarea
              name="PostDescription"
              id="creat_description"
              cols="10"
              rows="10"
              placeholder="Your post..."
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="post_date">{this.state.PostDate}</div>
        </div>
      </div>
    );
  }
}

export default PostCreator;
