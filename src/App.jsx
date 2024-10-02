// App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import Homepage from "./pages/Homepage";
import Layout from "./layout/Layout";
import Loginpage from "./pages/Loginpage";
import Resetpasswordpage from "./pages/Resetpasswordpage";
import Registerpage from "./pages/Registerpage";
import Admindash from "./components/Admindash/Admindash";
import Admindash1 from "./components/Admindash1/Admindash1";
import Userdash from "./components/Userdash/Userdash";
import Userdash2 from "./components/Userdash2/Userdash2";
import Userdash3 from "./components/Userdash3/Userdash3";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Homepage />,
      },
      {
        path: "/login",
        element: <Loginpage />,
      },
      {
        path: "/register",
        element: <Registerpage />,
      },
      {
        path: "/resetpassword",
        element: <Resetpasswordpage />,
      },
      {
        path: "/admin-dashboard",
        element: <Admindash />,
      },
      {
        path: "/admin1-dashboard",
        element: <Admindash1 />,
      },
      {
        path: "/user-dashboard",
        element: <Userdash />,
      },
      {
        path: "/user2-dashboard",
        element: <Userdash2 />,
      },
      {
        path: "/user3-dashboard",
        element: <Userdash3 />,
      },
      {
        path: "*",
        element: <h1>404 Not Found</h1>,
      },
    ],
  },
]);

function App() {
  return (
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
  );
}

export default App;
