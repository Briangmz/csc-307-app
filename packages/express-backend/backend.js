import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {
    getUsers,
    getUsersByNameAndJob,
    createUser,
    getUserById,
    deleteUser
} from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
    .connect(MONGO_CONNECTION_STRING + "users")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Mongo error:", error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World, I'm cool");
});

app.get("/users", (req, res) => {
    const { name, job } = req.query;

    const formatUsers = (users) => {
        return users.map(u => ({
            id: u._id,
            name: u.name,
            job: u.job
        }));
    };

    if (name !== undefined && job !== undefined) {
        getUsersByNameAndJob(name, job)
            .then((result) => res.send({ users_list: formatUsers(result) }))
            .catch((error) => res.status(500).send(error));
    }

    else {
        getUsers()
            .then((result) => res.send({ users_list: formatUsers(result) }))
            .catch((error) => res.status(500).send(error));
    }
});

app.get("/users/:id", (req, res) => {
    getUserById(req.params.id)
        .then((result) => {
            if (result === null) {
                res.status(404).send("Resource not found.");
            }

            else {
                res.send({
                    id: result._id,
                    name: result.name,
                    job: result.job
                });
            }
        })
        .catch((error) => res.status(500).send(error));
});

app.post("/users", (req, res) => {
    createUser(req.body)
        .then((newUser) =>
            res.status(201).send({
                id: newUser._id,
                name: newUser.name,
                job: newUser.job
            })
        )
        .catch((error) => res.status(500).send(error));
});

app.delete("/users/:id", (req, res) => {
    deleteUser(req.params.id)
        .then((deletedUser) => {
            if (deletedUser === null) {
                res.status(404).send("User Not Found");
            }

            else {
                res.status(204).send();
            }
        })
        .catch((error) => res.status(500).send(error));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});