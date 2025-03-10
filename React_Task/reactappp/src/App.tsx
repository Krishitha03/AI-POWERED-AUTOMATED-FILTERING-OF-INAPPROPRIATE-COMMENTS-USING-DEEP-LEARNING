import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import WorkshopList from "./components/WorkshopList";
import RegisterForm from "./components/RegisterForm";

const App: React.FC = () => {
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div>
            <Navbar 
                onWorkshopClick={() => setShowRegister(false)} 
                onRegisterClick={() => setShowRegister(true)} 
            />
            <div className="container mt-4">
                {showRegister ? <RegisterForm /> : <WorkshopList />}
            </div>
        </div>
    );
};

export default App;
