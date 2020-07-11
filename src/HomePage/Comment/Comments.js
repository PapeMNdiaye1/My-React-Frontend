import React from "react";

class Comments extends React.Component {
  render() {
    return (
      <div className="comments">
        <div className="the_post">
          <div className="the_post_image"></div>
          <div className="the_post_description">
            <h4 className="the_post_title">TItle</h4>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
              nisi quo quam necessitatibus molestias porro, optio
              exercitationem. Sit, illo optio. Iusto quae delectus placeat
              minima, provident aliquam repudiandae id fugiat? Lorem ipsum dolor
              sit amet consectetur, adipisicing elit. Libero et ratione odio ad,
              eaque porro aut ducimus tempore accusantium nam, mollitia nesciunt
              unde hic suscipit impedit fugiat! Velit, eius similique! Lorem
              ipsum dolor sit, amet consectetur adipisicing elit. Enim maxime,
              atque, quo veniam id nemo dicta, vero earum voluptas ratione
              laudantium. Nisi corrupti deleniti molestias vel totam officiis
              mollitia nulla? Cumque consectetur dignissimos optio debitis ea
              architecto molestiae deserunt est, corporis aperiam, facere aut
              quam excepturi laboriosam sed, velit quis tempora facilis nam?
              Facere temporibus officia, fugit itaque vel eos! Repellat, soluta
              unde dolor itaque, voluptatibus culpa necessitatibus molestias
              ipsum recusandae corrupti doloribus quia perspiciatis, maiores
              impedit! Mollitia maiores quidem recusandae. Nulla dicta
              perspiciatis delectus quam cum nostrum maiores molestias? Fugit
              vel modi est aliquam non nemo incidunt omnis, quia cumque placeat
              quibusdam molestiae necessitatibus sed quo quaerat quos labore
              accusamus architecto, totam dolore dolor laudantium? Sed ea maxime
              corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Maiores nisi quo quam necessitatibus molestias porro, optio
              exercitationem. Sit, illo optio. Iusto quae delectus placeat
              minima, provident aliquam repudiandae id fugiat? Lorem ipsum dolor
              sit amet consectetur, adipisicing elit. Libero et ratione odio ad,
              eaque porro aut ducimus tempore accusantium nam, mollitia nesciunt
              unde hic suscipit impedit fugiat! Velit, eius similique! Lorem
              ipsum dolor sit, amet consectetur adipisicing elit. Enim maxime,
              atque, quo veniam id nemo dicta, vero earum voluptas ratione
              laudantium. Nisi corrupti deleniti molestias vel totam officiis
              mollitia nulla? Cumque consectetur dignissimos optio debitis ea
              architecto molestiae deserunt est, corporis aperiam, facere aut
              quam excepturi laboriosam sed, velit quis tempora facilis nam?
              Facere temporibus officia, fugit itaque vel eos! Repellat, soluta
              unde dolor itaque, voluptatibus culpa necessitatibus molestias
              ipsum recusandae corrupti doloribus quia perspiciatis, maiores
              impedit! Mollitia maiores quidem recusandae. Nulla dicta
              perspiciatis delectus quam cum nostrum maiores molestias? Fugit
              vel modi est aliquam non nemo incidunt omnis, quia cumque placeat
              quibusdam molestiae necessitatibus sed quo quaerat quos labore
              accusamus architecto, totam dolore dolor laudantium? Sed ea maxime
              corporis.
            </p>
          </div>
        </div>
        {/* ################################################## */}
        <div className="comments_container">
          <div className="the_post_header">
            <div
              // style={{ backgroundImage: this.props.postAuthorPictur }}
              className="post_author_pictur"
            ></div>
            <h3 className="post_author_name">postAuthorName</h3>
          </div>
          <div className="responses_container"></div>
          <form action="">
            <textarea
              name="response"
              id="response"
              cols="30"
              rows="10"
              placeholder="Your response.."
              maxLength="400"
            ></textarea>
            <input type="submit" value="Publich" />
          </form>
        </div>
      </div>
    );
  }
}

export default Comments;
