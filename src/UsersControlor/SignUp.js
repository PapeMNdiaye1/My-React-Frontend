import React, { Component } from "react";
// import "./customers.css";

const myFetcher = async (theUrl, theType, data) => {
  var dataToSend = await data;
  const rawResponse = await fetch(theUrl, {
    method: theType,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(dataToSend),
  });
  let response = await rawResponse.json();
  return response.UserLogin;
};
// ##########################################################################################################
// ##########################################################################################################
// ##########################################################################################################
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      Email: "",
      Password: "",
      TheUserIsLogin: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  // componentDidMount() {
  // myFetcher("/signup", "post", this.state);
  // }

  handleChange(e) {
    const theFormName = e.target.name;
    const theFormValue = e.target.value;
    this.setState({
      [theFormName]: theFormValue,
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    let Data = await {
      Name: this.state.Name,
      Email: this.state.Email,
      Password: this.state.Password,
    };
    let isUserLogin = await myFetcher("/signup", "post", Data);
    if (isUserLogin === true) {
      this.setState({
        TheUserIsLogin: isUserLogin,
      });
      this.props.onUserLogin(this.state);
    } else if (isUserLogin === "Email Olredy Existed") {
      console.log("Email Olredy Existed");
    }
  }
  // ############################################
  render() {
    return (
      <div>
        <div className="container">
          <h1 className="Signup">Signup</h1>
          {/* <div> {JSON.stringify(this.state)}</div> */}
          <form onSubmit={this.handleSubmit}>
            <Form type="text" name="Name" onchange={this.handleChange} />
            <Form type="email" name="Email" onchange={this.handleChange} />
            <Form
              type="password"
              name="Password"
              onchange={this.handleChange}
            />
            <button type="submit" className="btn btn-primary">
              Signup
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const Form = ({ type, name, onchange }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{name}</label>
      <input
        required
        type={type}
        name={name}
        id={name}
        className="form-control"
        onChange={onchange}
      />
    </div>
  );
};

export default SignUp;
