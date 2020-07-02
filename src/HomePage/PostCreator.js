import React from "react";

class PostCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UserId: props.UserId,
      PostImage: "",
      PostTitle: "",
      PostDescription: "",
    };
    this.selectPictur = this.selectPictur.bind(this);
    this.handlePictur = this.handlePictur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendPost = this.sendPost.bind(this);
  }
  // ##########################################
  selectPictur(e) {
    let pictursContainer = document.querySelector(".picturs_container");
    e.target.style.display = "none";
    pictursContainer.style.left = "0em";
    pictursContainer.style.opacity = "1";
  }
  // ##########################################
  handlePictur(e) {
    let thePostPictur = getComputedStyle(e.target).getPropertyValue(
      "background-image"
    );
    const postImage = document.querySelector(".creat_post_image");
    postImage.style.backgroundImage = thePostPictur;
    this.setState({
      PostImage: thePostPictur,
    });
  }
  // ##########################################
  handleChange(e) {
    const theFormName = e.target.name;
    const theFormValue = e.target.value;
    this.setState({
      [theFormName]: theFormValue,
    });
  }
  // ##########################################
  sendPost() {
    console.log(this.state);
  }
  //###########################################
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

    return (
      <div className="post_creation_container">
        <div className="send_post_container">
          <div onClick={this.sendPost} className="send_post">
            Send Post
          </div>
        </div>
        <div className="creat_post">
          <div className="creat_post_header">
            <div className="post_author_pictur"></div>
            <h6 className="post_author_name">{this.props.UserName}</h6>
          </div>
          <div className="creat_post_image">
            <div onClick={this.selectPictur} className="select_pictur">
              Select pictur
            </div>
          </div>
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
        <PictursContainer
          theClassName="picturs_container"
          onPicturSelected={this.handlePictur}
        />
      </div>
    );
  }
}

function PictursContainer({ theClassName, onPicturSelected }) {
  let thePicturs = [];
  for (let i = 1; i <= 9; i++) {
    let theClassName = `default_picturs picturs${i} `;
    thePicturs.push(
      <div
        onClick={onPicturSelected}
        key={theClassName}
        className={theClassName}
      ></div>
    );
  }
  return <div className={theClassName}>{thePicturs}</div>;
}

export { PictursContainer, PostCreator };
