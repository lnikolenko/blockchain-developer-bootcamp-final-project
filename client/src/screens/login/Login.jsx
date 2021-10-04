import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../auth";
import { AuthButton } from "../../components/auth";

export default function Login() {
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    auth.signin(() => {
      history.replace(from);
    });
  };

  return (
    <div>
      <p>Login!</p>
      <AuthButton />
      <button onClick={login}>Log in</button>
    </div>
  );
}
