import React from "react";
import { myGetFetcher, myPostFetcher } from "../../myFetcher";
// !#####################################################################################

class Comments extends React.Component {
  constructor(props) {
    super(props);
    let dt = new Date();

    this.state = {
      // UserName: props.UserName,
      // UserId: props.UserId,
      // UserProfilePictur: props.UserProfilePictur,
      AllResponses: [],
      // #########################
      PostAuthorId: "",
      PostAuthorName: "",
      PostAuthorPictur: "",
      PostDate: "",
      PostDescription: "",
      PostImage: "",
      PostImageId: "",
      PostResponses: [],
      PostTitle: "",
      Response: "",
      ResponseDate: `${(dt.getMonth() + 1)
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
    this.sendResponse = this.sendResponse.bind(this);
    this.getAllResponses = this.getAllResponses.bind(this);
  }
  // #####################################################################################
  async componentDidMount() {
    let rawResponse = myGetFetcher(
      `/Post/one-post/${this.props.PostId}`,
      "GET"
    );
    let response = await rawResponse;
    this.setState({
      PostAuthorId: response.Post.postAuthorId,
      PostAuthorName: response.Post.postAuthorName,
      PostAuthorPictur: response.Post.postAuthorPictur,
      PostDate: response.Post.postDate,
      PostDescription: response.Post.postDescription,
      PostImage: response.Post.postImage,
      PostImageId: response.Post.postImageId,
      PostResponses: response.Post.postResponses,
      PostTitle: response.Post.postTitle,
    });
    this.getAllResponses(this.state.PostResponses.reverse());
  }
  // #####################################################################################
  handleChange(e) {
    const theFormName = e.target.name;
    const theFormValue = e.target.value;
    this.setState({
      [theFormName]: theFormValue.replace(/(\n)+/g, "\n"),
    });
  }
  // #####################################################################################
  async sendResponse(e) {
    e.preventDefault();

    let ResponseData = await {
      AuthorId: this.props.UserId,
      ResponseAuthorName: this.props.UserName,
      ResponseAuthorPictur: this.props.UserProfilePictur,
      Response: this.state.Response,
      ResponseDate: this.state.ResponseDate,
    };
    // #####################
    let isResponseSendede = await myPostFetcher(
      `/Post/add-response/${this.props.PostId}`,
      ResponseData
    );
    // #####################
    this.setState({
      Response: "",
    });
    document.querySelector("#creat_response").value = "";
    // #####################
    if (isResponseSendede.response) {
      let rawResponse = myGetFetcher(
        `/Post/get-all-response/${this.props.PostId}`,
        "GET"
      );
      let response = await rawResponse;
      console.log(response.allresponse.postResponses);
      this.getAllResponses(response.allresponse.postResponses.reverse());
    }
  }
  // #####################################################################################
  async getAllResponses(data) {
    let allResponsesArray = [];
    await data.map((response) =>
      allResponsesArray.push(
        <Response
          key={response._id}
          authorId={response.authorId}
          responseAuthorName={response.responseAuthorName}
          responseAuthorPictur={response.responseAuthorPictur}
          response={response.response}
          responseDate={response.responseDate}
        />
      )
    );
    await this.setState({
      AllResponses: allResponsesArray,
    });
    console.log(this.state.AllResponses);
  }
  // ?#####################################################################################
  render() {
    let postAuthorPictur;
    if (this.state.PostAuthorPictur !== "") {
      postAuthorPictur = (
        <div
          style={{ backgroundImage: this.state.PostAuthorPictur }}
          className="post_author_pictur"
        ></div>
      );
    } else {
      postAuthorPictur = <div className="post_author_pictur"></div>;
    }
    // ####################################################
    let postImage;
    if (this.state.PostImage !== "") {
      postImage = (
        <div
          style={{ backgroundImage: `url(image/${this.state.PostImage})` }}
          className="the_post_image"
        ></div>
      );
    } else {
      postImage = <div className="the_post_image"></div>;
    }
    return (
      <div className="comments">
        <div className="the_post">
          {postImage}
          <div className="the_post_description">
            <h4 className="the_post_title">{this.state.PostTitle}</h4>
            <p>{this.state.PostDescription}</p>
          </div>
        </div>
        {/* ################################################## */}
        <div className="comments_container">
          <div className="the_post_header">
            {postAuthorPictur}
            <h3 className="post_author_name">{this.state.PostAuthorName}</h3>
          </div>
          <div className="responses_container">{this.state.AllResponses}</div>
          <form method="POST">
            <textarea
              name="Response"
              id="creat_response"
              cols="30"
              rows="10"
              placeholder="Your response.."
              maxLength="400"
              onChange={this.handleChange}
            ></textarea>
            <div onClick={this.sendResponse}>ffffffff</div>
          </form>
        </div>
      </div>
    );
  }
}
// !#####################################################################################
class Response extends React.PureComponent {
  render() {
    let responseAuthorPictur;
    if (this.props.responseAuthorPictur !== "") {
      responseAuthorPictur = (
        <div
          style={{ backgroundImage: this.props.responseAuthorPictur }}
          className="response_author_pictur"
        ></div>
      );
    } else {
      responseAuthorPictur = <div className="response_author_pictur"></div>;
    }
    return (
      <div className="response">
        <div className="response_header">
          {responseAuthorPictur}
          {/* <h3 className="response_author_name">
            {this.props.responseAuthorName}
          </h3> */}
        </div>
        <div className="response_body">
          <p>{this.props.response}</p>
        </div>
      </div>
    );
  }
}

export default Comments;
