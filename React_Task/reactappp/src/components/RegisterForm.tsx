import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

interface Workshop {
    id: number;
    title: string;
}

const RegisterForm: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [workshop, setWorkshop] = useState("");
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [registrations, setRegistrations] = useState<{ name: string; email: string; workshop: string }[]>([]);

    // Fetch workshop titles from api.json
    useEffect(() => {
        axios.get("/api.json")
            .then(response => {
                setWorkshops(response.data);
            })
            .catch(error => {
                console.error("Error fetching workshops:", error);
            });
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const newRegistration = { name, email, workshop };

        // Update state to store new registrations
        setRegistrations([...registrations, newRegistration]);

        // Reset form fields
        setName("");
        setEmail("");
        setWorkshop("");
    };

    return (
        <div className="container mt-4">
            <h2>Register for a Workshop</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Select Workshop</label>
                    <select className="form-control" value={workshop} onChange={(e) => setWorkshop(e.target.value)} required>
                        <option value="">Choose...</option>
                        {workshops.map((ws) => (
                            <option key={ws.id} value={ws.title}>{ws.title}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-dark">Register</button>
            </form>

            {/* Display Registered Users in a Table */}
            {registrations.length > 0 && (
                <div className="mt-4">
                    <h3>Registered Participants</h3>
                    <table className="table table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Workshop</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((reg, index) => (
                                <tr key={index}>
                                    <td>{reg.name}</td>
                                    <td>{reg.email}</td>
                                    <td>{reg.workshop}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RegisterForm;
