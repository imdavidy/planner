"use strict";
import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import './index.css'
import ContactList from "./components/ContactList.jsx";
import Calendar from "./components/Event.jsx";
import Contact from "./components/Contact.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "contacts/:id/history",
        element: <Contact />,
      },
      {
        path: "contacts/:id",
        element: <Contact />,
      },
      {
        path: "contacts",
        element: <ContactList />,
      },
      {
        path: "contact",
        element: <Contact/>,
      },
      {
        path: "events",
        element: <Calendar />,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
