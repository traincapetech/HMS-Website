import React from "react";
import NavBar from "./components/NavBar";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";
import Footer from "./components/Footer";
import BranchedChatbox from "./components/Chatbox/Chatbox";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <AllRoutes />
        <Footer />
        <BranchedChatbox />
      </BrowserRouter>
    </>
  );
}

export default App;