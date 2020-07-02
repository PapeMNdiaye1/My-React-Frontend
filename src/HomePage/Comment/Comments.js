import React from "react";

class Comments extends React.Component {
  render() {
    return (
      <div className="comments">
        <div className="the_post"></div>
        <div className="comments_container">
          <div className="the_post_author"></div>
          <div className="responses_container"></div>
          <form action="">
            <textarea
              name="comment"
              id="comment"
              cols="30"
              rows="10"
            ></textarea>
            <input type="submit" value="Publich" />
          </form>
        </div>
      </div>
    );
  }
}

export default Comments;
