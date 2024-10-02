import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Loginbox.css";
import Cookies from "js-cookie";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../firebase/firebase";

const auth = getAuth();

const Loginbox = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  document.title = "Login | ReFlow";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [LoginBtnValue, setLoginButtonValue] = useState("Login");
  const [selectedRole, setSelectedRole] = useState(""); // Role selection
  const navigate = useNavigate();
  const [imageValue, setImageValue] = useState(Math.floor(Math.random() * 11) + 1);
  const [notification, setNotification] = useState({
    Name: "notification slideXto0",
    Message: "No message",
  });

  const handelNotificationtoggle = () => {
    setNotification({
      ...notification,
      Name:
        notification.Name === "notification"
          ? "notification slideXto0"
          : "notification",
    });
  };

  const getCookie = async () => {
    try {
      const user = await Cookies.get("jwt");
      if (user !== undefined) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error while getting the user cookie:", error);
    }
  };

  React.useEffect(() => {
    getCookie();
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoginButtonValue("Logging...");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setNotification({
          Name: "notification",
          Message: "Please verify your email address",
        });
        scrollTo(0, 0);
        setLoginButtonValue("Login");
      } else {
        setCookie("user", user.email, { path: "/" });
        setCookie("name", user.email.split("@")[0], { path: "/" });
        setCookie("uid", user.uid, { path: "/" });
        setCookie("jwt", user.accessToken, { path: "/" });

        // Fetch userType and roles from the database
        const db = getDatabase(app);
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const roles = data.roles || {}; // Fetch roles
            const userType = data.userType || ""; // Fetch userType
            setCookie("userType", userType, { path: "/" }); // Set userType in cookies
            setCookie("roles", JSON.stringify(roles), { path: "/" }); // Set roles in cookies

            if((selectedRole === "user" || selectedRole === "user2" || selectedRole === "user3" || selectedRole === "admin" || selectedRole === "admin1")
            && (userType === "admin" || userType === "admin1")) 
            { navigate(`/${selectedRole}-dashboard`);}
         
            

             if (
              (selectedRole === "admin" || selectedRole === "admin1") &&
              (userType !== "admin" && userType !== "admin1")
            ) {
              setNotification({
                Name: "notification",
                Message: "You do not have access to the admin role.",
              })}

            // Check selected role against userType and roles
            if (selectedRole === "user" && userType === "user") {
              navigate("/user-dashboard");
            } else if (selectedRole === "user1" && userType === "user1") {
              navigate("/user1-dashboard");
            } else if (roles[selectedRole]) {
              navigate(`/${selectedRole}-dashboard`);
            } else {
              setNotification({
                Name: "notification",
                Message: "You do not have access to the selected role.",
              });
              scrollTo(0, 0);
            }
          }
        });

        setLoginButtonValue("Login");
      }
    } catch (error) {
      setLoginButtonValue("Login");
      if (error.code === "auth/invalid-credential") {
        window.scrollTo(0, 0);
        setNotification({
          Name: "notification",
          Message: "Invalid Credentials",
        });
      }
    }
  };

  return (
    <>
      <div className={notification.Name} onClick={handelNotificationtoggle}>
        <p>{notification.Message}</p>
      </div>

      <section className="loginbox">
        <div className="loginleftbox">
          <img src={`\\images\\${imageValue}.jpg`} alt={`Image ${imageValue}`} />
        </div>
        <div className="loginrightbox">
          <form onSubmit={loginHandler}>
            <div className="logosection">
              <img className="reflow" src="\images\trans-bg.png" alt="" />
              <img className="reflow" src="\images\New-Logo.png" alt="" />
            </div>
            <h1>Welcome back!</h1>
            <h2>
              Simplify your workflow with our <b>Dashboard</b>.
              <br />
              Get started for free
            </h2>

            <div className="inputbox">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <select
                name="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
              >
                <option value="" disabled>Select Login Option</option>
                <option value="admin">M3 Config Panel</option>
                <option value="admin1">M1 Config Panel</option>
                <option value="user">M3 Reactor-User Login</option>
                <option value="user2">M3 Pressure-User Login</option>
                <option value="user3">M1 Gas Pressure-User Login</option>
              </select>
            </div>
            <Link to="/resetpassword">Forgot Password?</Link>
            <button className="primary-btn">{LoginBtnValue}</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Loginbox;
