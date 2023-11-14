/* eslint-disable */
import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { setPersistence, getAuth, inMemoryPersistence } from "firebase/auth";
import {
  useLogin,
  LoadingScreen,
  AuthProvider,
  Header, // Assuming Header is exported from @hex-labs/core
  Footer, // Assuming Footer is exported from @hex-labs/core
} from "@hex-labs/core";

import UserData from './components/UserData';

// Initialized the Firebase app through the credentials provided
export const app = initializeApp({
  apiKey: "AIzaSyCsukUZtMkI5FD_etGfefO4Sr7fHkZM7Rg",
  authDomain: "auth.hexlabs.org",
});

// Sets the Firebase persistence to in memory since we use cookies for session
// management. These cookies are set by the backend on login/logout.
setPersistence(getAuth(app), inMemoryPersistence);

// By default sends axios requests with user session cookies so that the backend
// can verify the user's identity.
axios.defaults.withCredentials = true;

export const App = () => {
  const [loading, loggedIn] = useLogin(app);
  if (loading) {
    return <LoadingScreen />;
  }
  if (!loggedIn) {
    window.location.href = `https://login.hexlabs.org?redirect=${window.location.href}`;
    return <LoadingScreen />;
  }
  // Sets up the AuthProvider so that any part of the application can use the
  // useAuth hook to retrieve the user's login details.
  return (
    <AuthProvider app={app}>
      <Header children={undefined}/> {/* Header component added */}
      {/* Setting up our React Router to route to all the different pages we may have */}
      <Routes>
        <Route path="/" element={<UserData />} />
        {/* Define more routes as needed */}
      </Routes>
      <Footer /> {/* Footer component added */}
    </AuthProvider>
  );
};

export default App;
