import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
// import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import Home from './pages/Home';
import Auth from './pages/Auth.jsx';
import SignIn from './pages/SignIn.jsx';
import FreelancerSignup from './pages/SignupFreeLancer.jsx';
import SignInType from './pages/SignInType.jsx';
import {Toaster} from 'react-hot-toast';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Auth />
      },
      {
        path: "/signup",
        element: <SignIn />
      },
      {
        path: "/signup/type",
        element: <SignInType />
      },
      {
        path: "/signup/freelancer",
        element: <FreelancerSignup />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Provider store={store}> */}
    <Toaster/>
    <RouterProvider router={router}/>
    {/* </Provider> */}
  </StrictMode>,
);
