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
import ProblemSetPage, { problemSetLoader } from "./Pages/ProblemSetPage.jsx";
import ProblemPage, { ProblemLoader } from "./Pages/ProblemPage.jsx";
import AdminAddProblemPage from "./Pages/Admin/AdminAddProblemPage.jsx";
import RequireAdmin from "./Middleware/RequireAdmin.jsx";

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

          <Route element={<RequireAdmin />}>
            <Route path="admin/add-problem" element={<AdminAddProblemPage />} />
          </Route>
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
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
