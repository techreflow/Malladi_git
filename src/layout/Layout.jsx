import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
