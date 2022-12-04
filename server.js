// Import packages
const fs = require("fs");
const express = require('express');
const path = require("path");
const uuidv1 = require('uuid/v1');

// Setting up our Express server
const app = express();
const PORT = process.env.PORT || 3001;

// Express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for '/notes' endpoint
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// GET Request in '/notes' endpoint
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

// GET Route is defaulted to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// POST Request to retrieve data
app.post("/api/notes", (req, res) => {
    let createNote = req.body;
    createNote.id = uuidv1();
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes.push(createNote);
        fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.status(200).end();
        });
    });
});

// DELETE Requests
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        const CreateNewArray = JSON.parse(data).filter(note => note.id != req.params.id)
        fs.writeFile("./db/db.json", JSON.stringify(CreateNewArray), (err) => {
            if (err) throw err;
            res.status(200).end();
        });
    });
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));