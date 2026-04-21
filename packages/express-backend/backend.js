import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


const users = {
    users_list: [
        {id: "xyz789", name: "Charlie", job: "Janitor"},
        {id: "abc123", name: "Mac", job: "Bouncer"},
        {id: "ppp222", name: "Mac", job: "Professor"},
        {id: "yat999", name: "Dee", job: "Aspiring Actress"},
        {id: "zap555", name: "Dennis", job: "Bartender"},
        {id: "qwe123", name: "Cindy", job: "Zookeeper"}
    ]
};

const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

const findUsersByQuery = (name, job) => {
  return users.users_list.filter((user) => {
      const matchesName = name === undefined || user.name === name;
      const matchesJob = job === undefined || user.job === job;

      return matchesName && matchesJob;
  });
};

const generateId = () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let letterPart = "";

    for (let i = 0; i < 3; i++) {
        letterPart += letters[Math.floor(Math.random() * letters.length)];
    }

    const numberPart = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");

    return `${letterPart}${numberPart}`;
};

const addUser = (user) => {
    const newUser = {
        id: generateId(),
        ...user
    };

    users["users_list"].push(newUser);
    return newUser;
};

const deleteUserById = (id) => {
    const index = users.users_list.findIndex(user => user["id"] === id);

    if (index === -1) {
        return undefined;
    }

    const deletedUser = users.users_list[index];
    users.users_list.splice(index, 1);
    return deletedUser;
}

app.post("/users", (req, res) => {
   const userToAdd = req.body;
   const newUser = addUser(userToAdd);
   res.status(201).send(newUser);
});

app.delete("/users/:id", (req, res) => {
   const id = req.params.id;
   const deletedUser = deleteUserById(id);

   if (deletedUser === undefined) {
       res.status(404).send("User Not Found");
   }

   else {
       res.status(200).send(deletedUser);
   }
});

app.get("/", (req, res) => {
    res.send("Hello World, I'm cool");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    if (name !== undefined || job !== undefined) {
        const result = findUsersByQuery(name, job);
        res.send({ users_list: result });
    } else {
        res.send(users);
    }
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

app.listen(port, () => {
    console.log(
        'Example app listening at http://localhost:'+ port
    );
});
