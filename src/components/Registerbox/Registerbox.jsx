import "./Registerbox.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../../firebase/firebase";

const Registerbox = () => {
  document.title = "Malladi/Reflow | Register";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // Dropdown for userType (user or admin)
  const [roles, setRoles] = useState({ user: false, user2: false, user3: false }); // Dropdown for roles

  const [RegisterBtnValue, setRegisterButtonValue] = useState("Register");
  const [notification, setNotification] = useState({
    Name: "notification slideXto0",
    Message: "Internal Error",
  });

  const handelNotificationtoggle = (event) => {
    setNotification({
      ...notification,
      Name:
        notification.Name === "notification"
          ? "notification slideXto0"
          : "notification",
    });
  };

  const handleRoleChange = (role) => {
    setRoles((prevRoles) => ({
      ...prevRoles,
      [role]: !prevRoles[role], // Toggle the selected role's boolean value
    }));
  };

  const registerNewUser = async (e) => {
    e.preventDefault();

    try {
      setRegisterButtonValue("Registering...");

      const auth = getAuth(app);
      const database = getDatabase(app);

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get the user's UID
      const uid = userCredential.user.uid;

      // Set the user type and roles in the database
      const userRef = ref(database, `users/${uid}`);
      await set(userRef, {
        userType: userType,
        roles: roles,
        email: email,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      setRegisterButtonValue("Registered!");
      setNotification({
        Name: "notification",
        Message: "Successfully registered!",
      });

      // Optionally, navigate the user to a different page after successful registration
      // navigate('/dashboard');
    } catch (error) {
      // Handle registration errors
      setNotification({
        Name: "notification",
        Message: error.message || "Internal Error",
      });
      setRegisterButtonValue("Register");
    }
  };

  return (
    <>
      <div className={notification.Name} onClick={handelNotificationtoggle}>
        <p>{notification.Message}</p>
      </div>

      <section className="register">
        <div className="registerbox">
          <form onSubmit={registerNewUser}>
            <div className="logosection">
              <img className="reflow" src="\images\trans-bg.png" alt="" />
              <img className="reflow" src="\images\New-Logo.png" alt="" />
            </div>
            <h1>Register!</h1>
            <h2>
              Give us some of <b>Your</b> information
              <br />
              Let's begin the <b>journey</b>
            </h2>

            <div className="inputbox">
              {/* Dropdown for userType */}
              <select
                name="usertype"
                id="usertype"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select User Type
                </option>
                <option value="user">User</option>
              </select>
              <p className="para">Select Roles</p>

              {/* Dropdown for roles */}
              <div className="roles-dropdown">
                <label>
                  <input
                    type="checkbox"
                    checked={roles.user}
                    onChange={() => handleRoleChange("user")}
                  />
                  M3-Reactor
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={roles.user2}
                    onChange={() => handleRoleChange("user2")}
                  />
                  M3-Pressure
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={roles.user3}
                    onChange={() => handleRoleChange("user3")}
                  />
                  M1-Flow
                </label>
              </div>

              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            <Link to="/login">Back to Login!</Link>
            <button className="primary-btn">{RegisterBtnValue}</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Registerbox;
