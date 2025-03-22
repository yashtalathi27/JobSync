import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
// import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import Home from './pages/Home';
import Auth from './pages/auth/Auth.jsx';
import SignIn from './pages/auth/SignIn.jsx';
import FreelancerSignup from './pages/auth/SignupFreeLancer.jsx';
import SignInType from './pages/auth/SignInType.jsx';
import {Toaster} from 'react-hot-toast';
import FreelancerDashboard from './pages/FreeLancerdashboard/FreelancerDash.jsx';
import ProjectDetails from './pages/FreeLancerdashboard/ProjectDetails.jsx';
import OrganizerDashboard from './pages/OrgainzerDashboard/OrgainzerDashboard.jsx';
import AdminDashboard from './pages/OrgainzerDashboard/AdminDash.jsx';

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
      },
      {
        path: "/dashboard/freelancer",
        element: <FreelancerDashboard />
      },
      {
        path: "/project/free/:id",
        element: <ProjectDetails />
      },
      {
        path: "/project/org",
        element: <OrganizerDashboard />
      },
      {
        path: "/org/admin",
        element: <AdminDashboard />
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
