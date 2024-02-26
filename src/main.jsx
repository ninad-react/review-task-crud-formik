import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import FormikContainer from './components/FormikContainer.jsx'
import UserDetails from './components/UserDetails.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/adduser",
    element: <FormikContainer title="Add New User"/>
  },
  {
    path: "/userdetail/:userid",
    element: <UserDetails />
  },
  {
    path: "/useredit/:userid",
    element: <FormikContainer title="Update the user info" />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
