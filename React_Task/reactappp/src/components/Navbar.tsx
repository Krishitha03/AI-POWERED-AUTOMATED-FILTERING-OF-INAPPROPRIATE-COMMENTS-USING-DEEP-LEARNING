import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar: React.FC<{ onWorkshopClick: () => void; onRegisterClick: () => void }> = ({ onWorkshopClick, onRegisterClick }) => {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#" onClick={onWorkshopClick}>Workshop Hub</a>
                <button className="btn btn-outline-light" onClick={onRegisterClick}>Register</button>
            </div>
        </nav>
    );
};

export default Navbar;
