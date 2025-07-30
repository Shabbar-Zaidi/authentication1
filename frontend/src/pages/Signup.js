import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    // useState is used to manage state in functional components
    // signupInfo is an object that holds the user's name, email, and password
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target; // destructuring to get name and value from the event target
    console.log(name, value);
    const copySignupInfo = { ...signupInfo }; // create a copy of signupInfo
    // to avoid direct mutation of state
    copySignupInfo[name] = value; // update the specific field in the copy
    setSignupInfo(copySignupInfo); // set the state with the updated copy
  };
  console.log("Signup info: ", signupInfo);

  const handleSignup = async (e) => {
    e.preventDefault(); // for preventing refresh page
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      // Client Side Validation
      return handleError("name, email and password are required");
    }
    try {
      // const url = `https://deploy-mern-app-1-api.vercel.app/auth/signup`;
      const url =
        "https://vercel.com/shabbar-zaidis-projects/authentication1/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo), //
      });
      const result = await response.json();
      console.log(result);
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };
  return (
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            autoFocus
            placeholder="Enter your name..."
            value={signupInfo.name}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter your email..."
            value={signupInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password..."
            value={signupInfo.password}
          />
        </div>
        <button type="submit">Signup</button>
        <span>
          Already have an account ?<Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Signup;
