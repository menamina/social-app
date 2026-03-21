import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import LoginSignUp from "./components/login-signup.jsx";
import Hub from "./components/HUB.jsx";
import Feed from "./components/feed.jsx";
import Search from "./components/search.jsx";
import Profile from "./components/profile.jsx";
import Settings from "./components/settings.jsx";
import Dms from "./components/dms.jsx";
import ExpandedPost from "./components/expandedPost.jsx";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginSignUp />,
      },
      {
        path: "/",
        element: <Hub />,
        children: [
          { index: true, element: <Feed /> },
          { path: "search", element: <Search /> },
          { path: "@:username", element: <Profile /> },
          { path: "@:username/post/:id", element: <ExpandedPost /> },
          { path: "settings", element: <Settings /> },
          { path: "dms", element: <Dms /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={routes}></RouterProvider>
  </React.StrictMode>,
);
