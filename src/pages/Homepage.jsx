// Homepage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../firebase/firebase";

const Homepage = () => {
  const [userType, setUserType] = useState("");
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const jwt = Cookies.get("jwt");
      const uid = Cookies.get("uid");
      if (!jwt || !uid) {
        navigate("/login");
        return;
      }
      
      const db = getDatabase(app);
      const userRef = ref(db, `users/${uid}`);
      
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserType(data.userType || "");
          setRoles(data.roles || {});
          setLoading(false);
        }
      });
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!loading) {
      if (userType === "admin" && roles.user) {
        navigate("/admin-dashboard");
      } else if (roles.user2) {
        navigate("/user2-dashboard");
      } else if (roles.user) {
        navigate("/user-dashboard");
      } else if (roles.admin1) {
        navigate("/admin1-dashboard");
      }
      else if (roles.user3) {
        navigate("/user3-dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [loading, userType, roles, navigate]);

  return (
    <div className="loader">
      <h1>Loading...!</h1>
    </div>
  );
};

export default Homepage;
