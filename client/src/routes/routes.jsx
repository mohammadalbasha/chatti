import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/landing-page/landing-page";
import { ChatPage } from "../pages/chat/chat";
import { ErrorPage } from "../pages/error/error";
import React from "react";
import Main from "../pages/main/main";
import { Authenticated } from "./protected-routes/authenticated";
import { SigninPage } from "../pages/signin/signin";

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    element: <Main />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },

      {
        path: "/chat",
        element: (
          <Authenticated>
            <ChatPage />
          </Authenticated>
        ),
      },

      // {
      //   path: '/profile/employees',
      //   element: (
      //     <Authorized action="manage" subject="centralUser">
      //       <Employees />
      //     </Authorized>
      //   )
      //   // errorElement: <CreatePost.ErrorBoundary />,
      // },

      {
        path: "/signin",
        element: <SigninPage />,
        // errorElement: <CreatePost.ErrorBoundary />,
      },
      //   {
      //     path: "/post/:postId",
      //     element: <SinglePost />,
      //     loader: SinglePost.loader,
      //   },
    ],
  },
]);
