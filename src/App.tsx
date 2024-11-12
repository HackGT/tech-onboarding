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
  Header,
  Footer 
} from "@hex-labs/core";
import { ChakraProvider, Flex, Box } from "@chakra-ui/react";

import UserData from './components/UserData';

export const app = initializeApp({
  apiKey: "AIzaSyCsukUZtMkI5FD_etGfefO4Sr7fHkZM7Rg",
  authDomain: "auth.hexlabs.org",
});

setPersistence(getAuth(app), inMemoryPersistence);
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

  return (
    <ChakraProvider>
      <AuthProvider app={app}>
        <Flex direction="column" minHeight="100vh">
          <Header>
            header.Original
          </Header>
          <Box flex="1">
            <Routes>
              <Route path="/" element={<UserData />} />
            </Routes>
          </Box>
          <Footer/>
        </Flex>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;