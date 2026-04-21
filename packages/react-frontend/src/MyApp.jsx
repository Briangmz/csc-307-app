import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function postUsers(person) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(person)
        });

        return promise;
    }

    function removeOneCharacter(id) {
        fetch(`http://localhost:8000/users/${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (res.status === 204) {
                    setCharacters((prev) =>
                        prev.filter((character) => character.id !== id)
                    );
                } else if (res.status === 404) {
                    console.log("User not found");
                } else {
                    console.log("Delete failed");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function updateList(person) {
        postUsers(person)
            .then((res) => {
                if (res.status === 201) {
                    return res.json().then((newUser) => {
                        setCharacters((prev) => [...prev, newUser]);
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="container">
            <Table
                characterData={characters}
                removeCharacter={removeOneCharacter}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;