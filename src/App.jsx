import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// ❌ WRONG → import checkAuth from "./store/auth/authSlice";
// ✔ FIX → import the named thunk
import { checkAuth } from "./store/auth/authSlice";

import AuthLayout from "./components/auth/layout";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";

import BettingLayout from "./components/Betting/bettinglayout";
import Betting from "./pages/Betting/bettingpage";

import CheckAuth from "./components/common/CheckAuth";

import NotFound from "./pages/Not-found/notfound";

import { Skeleton } from "@/components/ui/skeleton";

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

 useEffect(() => {
  const tokenString = sessionStorage.getItem("token");

  if (!tokenString) {
    // Prevent blank screen by stopping auth loading
    dispatch({ type: "auth/checkAuth/rejected" });
    return;
  }

  let token;
  try {
    token = JSON.parse(tokenString);
  } catch (err) {
    console.error("Invalid token in storage", err);
    dispatch({ type: "auth/checkAuth/rejected" });
    return;
  }

  dispatch(checkAuth(token));
}, []);



  return (
    <div className="bg-white min-h-screen">
      <Toaster />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        {/* HOME PAGE (Protected) */}
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <div className="text-center text-lg font-semibold p-10">
                Welcome to the Betting App 🎯
              </div>
            </CheckAuth>
          }
        />
        {/* BETTING PAGE (Protected) */}
        <Route
          path="/betting"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <BettingLayout />
            </CheckAuth>
          }
        >
          <Route index element={<Betting />} />
        </Route>
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
