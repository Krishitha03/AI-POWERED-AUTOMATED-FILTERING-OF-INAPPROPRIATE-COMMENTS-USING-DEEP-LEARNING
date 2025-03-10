import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface Workshop {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
}

const WorkshopList: React.FC = () => {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);

    useEffect(() => {
        axios.get("/api.json")
            .then((response) => {
                setWorkshops(response.data);
            })
            .catch((error) => {
                console.error("Error fetching workshops:", error);
            });
    }, []);

    return (
        <div className="container">
            <h2>Upcoming Workshops</h2>
            <div className="row">
                {workshops.map((workshop) => (
                    <div key={workshop.id} className="col-md-4">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{workshop.title}</h5>
                                <p className="card-text">{workshop.description}</p>
                                <p><strong>Date:</strong> {workshop.date}</p>
                                <p><strong>Location:</strong> {workshop.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkshopList;
