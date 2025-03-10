import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './people.css'

export const People = () => {
    const [people, setPeople] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4500/people')
            .then(response => {
                setPeople(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the people data!', error);
            });
    }, []);

    return (
        <div>
            <h1>People</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {people.map(person => (
                        <tr key={person.id}>
                            <td>{person.id}</td>
                            <td>{person.name}</td>
                            <td>{person.age}</td>
                            <td>{person.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default People;