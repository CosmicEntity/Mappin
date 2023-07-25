import React, { useRef, useState } from "react";
import "./register.css";
import { Close, Room } from "@material-ui/icons";
import axios from "axios";

const Register = ({ setShowRegister }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      await axios.post("/users/register", newUser);
      setSuccess(true);
      setError(false);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="register-container">
      <div className="register-logo">
        <Room />
        MapPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="email" placeholder="Email" ref={emailRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button className="register-button">Register</button>
        {success && (
          <span className="success">
            Succesfully Registered! You can login now.
          </span>
        )}
        {error && <span className="failure">Error! Something went wrong.</span>}
      </form>
      <Close
        className="register-cancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
};

export default Register;
