import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
const PeopleForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const person = { name, email, age };

        try {
            const response = await axios.post('http://localhost:4500/people', person, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                alert('Person added successfully!');
                setName('');
                setEmail('');
                setAge('');
                window.location.reload();
            } else {
                console.log(response)
                alert('Failed to add person.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the person.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add Person</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="age" className="form-label">Age</label>
                    <input
                        type="number"
                        className="form-control"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default PeopleForm;