import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import LikeService from "./services/like.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import Review from "./components/Review";
import MyReviewList from "./components/MyReviewList";
import NotFound from "./components/NotFound";
import AdminPannel from "./components/AdminPannel";

import jwt_decode from "jwt-decode";

import { Outlet, Navigate } from "react-router-dom";

const App = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [userLikes, setUserLikes] = useState(0);

  const [isAdmin, setIsAdmin] = useState("");

  useEffect(() => {
    const token = AuthService.getCurrentUser();

    const getUserRating = async (email) => {
      const response = await LikeService.getAllUserLikes(email);
      setUserLikes(response.data);
    };

    if (token) {
      let tokenInfo = jwt_decode(token);
      let tokenString = JSON.stringify(tokenInfo);

      let user = JSON.parse(tokenString);

      setCurrentUser(
        user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      );

      getUserRating(
        user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      );

      if (
        user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ===
        "Admin"
      ) {
        setIsAdmin(
          user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        );
      }
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  const settings = () => {};

  const RequireAuth = () => {
    let user = AuthService.getCurrentUser();
    if (user === "" || !user) {
      return <Navigate to="/" />;
    }
    return <Outlet />;
  };

  const RequireAdmin = () => {
    let token = AuthService.getCurrentUser();
    let tokenInfo = jwt_decode(token);
    let tokenString = JSON.stringify(tokenInfo);

    let role = JSON.parse(tokenString);

    if (
      role["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] !==
      "Admin"
    ) {
      return <Navigate to="/" />;
    }
    return <Outlet />;
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-light bg-light navigation">
        <div className="navigation-pannel">
          <div className="userPages">
            <div className="logo">
              <Link to={"/"} className="navbar-brand">
                Reviewer
              </Link>
            </div>
            <div className="navbar-nav mr-auto pages">
              <li className="nav-item">
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>
              </li>

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/myreviewlist"} className="nav-link">
                    My Review List
                  </Link>
                </li>
              )}

              {isAdmin && (
                <li className="nav-item">
                  <Link to={"/admin"} className="nav-link">
                    Admin Pannel
                  </Link>
                </li>
              )}
            </div>
          </div>

          <div className="userLogin">
            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <div className="nav-link">Total score:&nbsp;{userLikes}</div>
                </li>
                <li className="nav-item">
                  <a href="/settings" className="nav-link" onClick={settings}>
                    Settings
                  </a>
                </li>
                <li className="nav-item">
                  <div className="nav-link">{currentUser}</div>
                </li>
                <li className="nav-item">
                  <a href="/" className="nav-link" onClick={logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route element={<RequireAuth />}>
            <Route path="/settings" element={<Profile />} />
            <Route path="/myreviewlist" element={<MyReviewList />} />
            <Route path="/review/:id" element={<Review />} />
          </Route>
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminPannel />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
