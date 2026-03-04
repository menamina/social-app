import LoginSignUp from "../components/login-signup";

function Welcome() {
  return (
    <div className="welcomeMain">
      <div className="social-info">
        <div></div>
      </div>
      <div className="loginSignup">
        <LoginSignUp />
      </div>
    </div>
  );
}

export default Welcome;
