import React from "react";

class Signin extends React.Component {
  constructor(props) {
    super();
    this.state = {
      signInEmail: "",
      signInPassword: "",
    };
  }
  onEnterPress = (event) => {
    if (event.keyCode === 13 && this.state.signInEmail !== "") {
      this.onSubmitSignin();
    }
  };
  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };
  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  saveAuthToken = (token) => {
    window.localStorage.setItem("token", token);
  };

  onSubmitSignin = (event) => {
    fetch("http://localhost:8081/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.userId && data.success === true) {
          console.log(data);
          this.saveAuthToken(data.token);

          fetch(`http://localhost:3000/profile/${data.id}`, {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: data.token,
            },
          })
            .then((resp) => resp.json())
            .then((user) => {
              if (user && user.email) {
                this.props.childrenloadUser(user);
                this.props.onRouteChange("home");
              }
            });
        }
      });
    this.props.onRouteChange("home");
  };

  render() {
    const { onRouteChange } = this.props;
    return (
      <article
        style={{ background: "teal" }}
        className="br3 ba  b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center"
      >
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  onChange={this.onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  onChange={this.onPasswordChange}
                  onKeyDown={this.onEnterPress}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignin}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("register")}
                className="f6 link dim black db pointer"
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Signin;
