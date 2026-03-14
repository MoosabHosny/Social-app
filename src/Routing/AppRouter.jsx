import { createBrowserRouter } from "react-router";
import Layout from "../Components/Layout/Layout";
import Post from "../Pages/Post/Post";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import NotFound from "../Pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import AuthProtectedRoute from "./AuthProtectedRoute/AuthProtectedRoute";
import PostDetails from "../Pages/PostDetails/PostDetails";
import CommentsList from "../Pages/CommentsList/CommentsList";
import Feed from "../Pages/Feed/Feed";
import Profile from "../Pages/Profile/Profile";
import Notifications from "../Pages/Notifications/Notifications";
import MyPosts from "../Pages/MyPosts/MyPosts";
import GetSavedPosts from "../Pages/GetSavedPosts/GetSavedPosts";

export const myrouter = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        ),
      },
      {
        path: "Feed",
        element: (
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        ),
      },
      {
        path: "Profile/:userId?",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "Notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "Post",
        element: (
          <ProtectedRoute>
            <Post />
          </ProtectedRoute>
        ),
      },
      {
        path: "PostDetails/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "MyPosts",
        element: (
          <ProtectedRoute>
            <MyPosts />
          </ProtectedRoute>
        ),
      },
      {
        path: "GetSavedPosts",
        element: (
          <ProtectedRoute>
            <GetSavedPosts />
          </ProtectedRoute>
        ),
      },
      {
        path: "Login",
        element: (
          <AuthProtectedRoute>
            <Login />
          </AuthProtectedRoute>
        ),
      },
      {
        path: "Register",
        element: (
          <AuthProtectedRoute>
            <Register />
          </AuthProtectedRoute>
        ),
      },
      // { path: 'CommentsList', element:<AuthProtectedRoute><CommentsList/></AuthProtectedRoute>},
      { path: "*", element: <NotFound /> },
    ],
  },
]);
