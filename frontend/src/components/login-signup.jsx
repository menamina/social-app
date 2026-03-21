import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login-signup.css";

function LoginSignUp() {
  const navigate = useNavigate();

  const [wantToLogin, setWantToLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  const [usernameTaken, setUsernameTaken] = useState(null);
  const [emailTaken, setEmailTaken] = useState(null);

  const [loginErrors, setLoginErrors] = useState(null);

  const [otherLoginErrors, setOtherLoginErrors] = useState(null);
  const [otherSignupErrors, setOtherSignupErrors] = useState(null);

  function toggleOption() {
    setWantToLogin((prev) => !prev);
  }

  async function login(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5555/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.message === "invalid email") {
        setLoginErrors("No user is accociated with that email");
      } else if (data.message === "invalid password") {
        setLoginErrors("Password incorrect");
      } else {
        setLoginErrors(null);
        navigate("/", { replace: true });
      }
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

      const data = await res.json();

      if (data.usernameTaken) {
        setUsernameTaken(true);
        return;
      } else if (data.emailTaken) {
        setEmailTaken(true);
        return;
      } else {
        setUsernameTaken(false);
        setEmailTaken(false);
        setWantToLogin(true);
      }
    } catch (error) {
      setOtherSignupErrors(error.errMsg);
      setUsernameTaken(false);
      setEmailTaken(false);
    }
  }

  return (
    <div className="login-signupMain">
      {otherLoginErrors && <div>{otherLoginErrors}</div>}
      {wantToLogin ? (
        <div className="login">
          {loginErrors && <div>{loginErrors}</div>}
          <form className="login-signup-form" onSubmit={(e) => login(e)}>
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
            <div className="loginBTN">
              <button>LOGIN</button>
            </div>
          </form>
          <div>
            <div>Need an account?</div>
            <div onClick={toggleOption}>Create new account</div>
          </div>
        </div>
      ) : (
        <div className="signup">
          {otherSignupErrors && <div>{otherSignupErrors}</div>}
          {usernameTaken && (
            <div className="signupTaken">Username is taken</div>
          )}
          {emailTaken && <div className="signupTaken">Email is taken</div>}

          <form className="login-signup-form" onSubmit={(e) => signup(e)}>
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
