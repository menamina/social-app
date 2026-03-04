import { useState, useEffect } from "react";

function LoginSignUp() {
  const [wantToLogin, setWantToLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

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
          <form onSubmit={(e) => login(e)}>
            <div>
              <label></label>
              <input></input>
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
              <label></label>
              <input></input>
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
