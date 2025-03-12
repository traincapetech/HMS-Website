import React from "react";
import NavBar from "./components/NavBar";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";
import Footer from "./components/Footer";

function App() {
  return (
    <>
    <BrowserRouter>
      <NavBar />
      <AllRoutes />
      <Footer />
    </BrowserRouter>
    </>
  );
}

export default App;