import React from "react";
import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider,} from "react-router-dom";
import RootLayout from "./Layouts/RootLayout.jsx";
import ProblemLayout from "./Layouts/ProblemLayout.jsx";
import LoginLayout from "./Layouts/LoginLayout.jsx";
import HomePage from "./Pages/HomePage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import ContestsPage from "./Pages/ContestsPage.jsx";
import LeaderboardPage from "./Pages/LeaderboardPage.jsx";
import ExplorePage from "./Pages/ExplorePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import ProblemSetPage from "./Pages/ProblemSetPage.jsx";
import ProblemPage, { ProblemLoader } from "./Pages/ProblemPage.jsx";
import { problemSetLoader } from "./Loaders/problemSetLoader.js";
import AdminAddProblemPage from "./Pages/Admin/AdminAddProblemPage.jsx";
import RequireAdmin from "./Middleware/RequireAdmin.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import AdminAuthLayout from "./Layouts/AdminAuthLayout.jsx";
import AdminDashboardPage from "./Pages/Admin/AdminDashboardPage.jsx";
import AdminProblemsPage from "./Pages/Admin/AdminProblemsPage.jsx";
import AdminLoginPage from "./Pages/Admin/AdminLoginPage.jsx";
import AdminRegisterPage from "./Pages/Admin/AdminRegisterPage.jsx";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="contests" element={<ContestsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="explore" element={<ExplorePage />} />

        </Route>

        <Route element={<ProblemLayout />}>
          <Route
            path="/problems"
            element={<ProblemSetPage />}
            loader={problemSetLoader}
          />
          <Route
            path="/problems/:problemId"
            element={<ProblemPage />}
            loader={ProblemLoader}
          />
        </Route>

        <Route element={<LoginLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<AdminAuthLayout />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />
        </Route>

        <Route path="/admin" element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="problems" element={<AdminProblemsPage />} />
            <Route path="problems/new" element={<AdminAddProblemPage />} />
          </Route>
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
