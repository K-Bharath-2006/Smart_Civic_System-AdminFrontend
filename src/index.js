import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";   // 🔥 ADD THIS
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Issue from './pages/Issue';
import Addworker from './pages/Addworker';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AssignWork from "./pages/AssignWork";

const routerVariables = createBrowserRouter([
  {
    path:"/",
    element:<App />,
    children:[
      {
        path:"/",
        element:<Login />
      },
      {
        path:"/admin",
        element:<AdminDashboard />
      },
      {
        path:"/officer",
        element:<OfficerDashboard />
      },
      {
        path:"/officer/issue/:id",
        element:<Issue/>
      },
      {
        path:"/addworker",
        element:<Addworker/>
      },
      {
        path:"/superadmin",
        element:<SuperAdminDashboard />
      },
      {
        path:"/assign-work/:issueId",
        element:<AssignWork/>
      },
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>  
      <RouterProvider router={routerVariables} />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
