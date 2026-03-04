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

  return (
    <div className="login-signupMain">
      {login ? (
        <div className="login">
          <form>
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
          <form onSubmit={(e) => signUp(e)}>
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
