import { useState } from 'react'
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginReg from "./Components/ADMIN/Admin Login Register/LoginReg";
import ADash from "./Components/ADMIN/ADash"
import AAnalysis from "./Components/ADMIN/AAnalysis";
import AManagement from "./Components/ADMIN/AManagement";
import UDash from "./Components/USER/UDash";
import UAnalysis from "./Components/USER/UAnalysis";
import UManagement from "./Components/USER/UManagement";
import ULoginReg from "./Components/USER/User Login Register/ULoginReg";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>  
        <Route>
          <Route index element={<LoginReg/>} />
          <Route path="LoginReg" element={<LoginReg/>} />
          <Route path="ADash" element={<ADash/>} />
          <Route path="AAnalysis" element={<AAnalysis />} />
          <Route path="AManagement" element={<AManagement />} />

{/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}

          <Route path="ULoginReg" element={<ULoginReg />} />
          <Route path="UDash" element={<UDash />} />
          <Route path="UAnalysis" element={<UAnalysis/>} />
           <Route path="UManagement" element={<UManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};



export default App;