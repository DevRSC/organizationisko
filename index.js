const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const scholarships = require("./scholarships.json");

app.get("/", (req, res) => {
  res.send("ISKO NI JUAN API SERVER");
});

app.get("/scholarships", (req, res) => {
  res.json(scholarships);
});

app.post("/scholarships", (req, res) => {
  const newScholarship = req.body;
  const maxId = Math.max(...scholarships.map((s) => s.id));
  newScholarship.id = maxId + 1;

  scholarships.push(newScholarship);

  // Save the updated scholarship data to the JSON file
  fs.writeFileSync("scholarships.json", JSON.stringify(scholarships, null, 2));

  res.status(201).json(newScholarship);
});

app.put("/scholarships/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const scholarshipIndex = scholarships.findIndex((s) => s.id === id);

  if (scholarshipIndex === -1) {
    return res.status(404).json({ message: "Scholarship not found" });
  }

  const updatedScholarship = { ...scholarships[scholarshipIndex], ...req.body };
  scholarships[scholarshipIndex] = updatedScholarship;

  // Save the updated scholarship data to the JSON file
  fs.writeFileSync("scholarships.json", JSON.stringify(scholarships, null, 2));

  res.json(updatedScholarship);
});

app.delete("/scholarships/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const scholarshipIndex = scholarships.findIndex((s) => s.id === id);

  if (scholarshipIndex === -1) {
    return res.status(404).json({ message: "Scholarship not found" });
  }

  scholarships.splice(scholarshipIndex, 1);

  // Save the updated scholarship data to the JSON file
  fs.writeFileSync("scholarships.json", JSON.stringify(scholarships, null, 2));

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
