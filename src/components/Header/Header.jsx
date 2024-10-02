import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import Cookies from "js-cookie";

const Header = () => {
  const [navMenu, setNavMenu] = useState({ Name: "navlinks" });
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setNavMenu({
      Name: navMenu.Name === "navlinks" ? "navlinks slideXto0" : "navlinks",
    });
  };

  const handleLogout = () => {
    Cookies.remove("jwt");
    Cookies.remove("uid");
    Cookies.remove("name");
    Cookies.remove("user");
    setUser(false);
    navigate("/login"); // Redirect to login page after logout
  };

  useEffect(() => {
    const checkUserLoggedIn = () => {
      const userCheck = Cookies.get("user");
      setUser(userCheck !== undefined);
    };

    checkUserLoggedIn();

    // Optional: Monitor changes in cookies and trigger a re-render if needed
    const intervalId = setInterval(() => {
      checkUserLoggedIn();
    }, 1000); // Check every second (adjust timing as needed)

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      <section className="header">
        <div className="logobox">
          <Link to="/">
            <img className="reflow" src="\images\logo.png" alt="ReFlow Logo" />
          </Link>
        </div>

        <img
          className="menubtn"
          src="https://img.icons8.com/ios-filled/25/menu--v1.png"
          alt="menu--v1"
          onClick={toggleMenu}
        />
        <div className={navMenu.Name}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/help-center">Help Center</Link>
          {!user ? (
            <Link to="/login">
              <button className="primary-btn">Login</button>
            </Link>
          ) : (
            <button className="primary-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default Header;
