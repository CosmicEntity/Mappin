import React, { useRef, useState } from "react";
import "./login.css";
import { Close, Room } from "@material-ui/icons";
import axios from "axios";

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
  const [error, setError] = useState(false);

  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post("/users/login", user);
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setError(false);
      setShowLogin(false);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <Room />
        MapPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button className="login-button">Login</button>

        {error && <span className="failure">Username or Password wrong.</span>}
      </form>
      <Close className="login-cancel" onClick={() => setShowLogin(false)} />
    </div>
  );
};

export default Login;
