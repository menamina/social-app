import { useState, useEffect } from "react";

function LoginSignUp() {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmai, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  function toggleOption() {
    setLogin((prev) => !prev);
  }

  function login(e) {
    e.preventDefault();
  }

  function signup(e) {
    e.preventDefault();
  }

  return (
    <div className="login-signupMain">
      {login ? (
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
