import { useState, useEffect } from "react";
import { useOutletContext } from "react-dom";

function LoginSignUp() {
  const { user, setUser } = useOutletContext();

  const [wantToLogin, setWantToLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  const [usernameTaken];
  const [emailTaken];

  const [loginErrors, setLoginErrors] = useState(null);
  const [signupErrors, setSignupErrors] = useState(null);

  const [otherLoginErrors, setOtherLoginErrors] = useState(null);

  const [otherSignupErrors, setOtherSignupErrors] = useState(null);

  function toggleOption() {
    setWantToLogin((prev) => !prev);
  }

  async function login(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5555/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // if res login is successful update useState user in app
    } catch (error) {
      setOtherLoginErrors(error.errMsg);
    }
  }

  async function signup(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5555/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpName,
          username: signUpUsername,
          email: signUpEmail,
          password: signUpPassword,
          confirmPassword: signUpConfirmPassword,
        }),
      });
    } catch (error) {
      setOtherSignupErrors(error.errMsg);
    }
  }

  return (
    <div className="login-signupMain">
      {wantToLogin ? (
        <div className="login">
          {usernameTaken && <div>Email is in use</div>}
          {emailTaken && <div>Email is in use</div>}
          <form onSubmit={(e) => login(e)}>
            <div>
              <label>Email:</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div>
              <label>Password:</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div>
              <button>login</button>
            </div>
          </form>
          <div>
            <div>Need an account?</div>
            <div onClick={toggleOption}>Create new account</div>
          </div>
        </div>
      ) : (
        <div className="signup">
          <form onSubmit={(e) => signup(e)}>
            <div>
              <label>Name:</label>
              <input
                name="name"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
              ></input>
            </div>
            <div>
              <label>Username:</label>
              <input
                name="username"
                value={signUpUsername}
                onChange={(e) => setSignUpUsername(e.target.value)}
              ></input>
            </div>
            <div>
              <label>Email:</label>
              <input
                name="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
              ></input>
            </div>
            <div>
              <label>Password:</label>
              <input
                name="password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
              ></input>
            </div>
            <div>
              <label>Confirm Password:</label>
              <input
                name="confirmpassword"
                value={signUpConfirmPassword}
                onChange={(e) => setSignUpConfirmPassword(e.target.value)}
              ></input>
            </div>
            <div>
              <button>sign up</button>
            </div>
          </form>
          <div>
            <div>Already have an account?</div>
            <div onClick={toggleOption}>login</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginSignUp;
