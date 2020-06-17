const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
  try {
    // Return all repos
    return response.json(repositories);
  } catch (e) {
    console.error(`Can't list all repos. Cause: ${e.message}`);
    return response.status(500).send();
  }
});

app.post("/repositories", (request, response) => {
  try {
    // Get title, url and techs from body
    const { title, url, techs } = request.body;
    // Check if the params are valid
    if (!title || !url || !techs) return response.status(400).send();
    // Create the new repo
    const repositorie = {
      id    : uuid(),
      title,
      url,
      techs,
      likes : 0
    };
    // Add the repo to array
    repositories.push(repositorie);
    // Send response
    return response.json(repositorie);
  } catch (e) {
    console.error(`Can't create a new repo. Cause: ${e.message}`);
    return response.status(500).send();
  }
});

app.put("/repositories/:id", (request, response) => {
  try {
    // Get the id from params
    const { id } = request.params;
    // Get title, url and techs from body
    const { title, url, techs } = request.body;
    
    // Check the id
    if (!isUuid(id)) return response.status(400).send();
    // Search for the repo
    const repositorie = repositories.find(repo => repo.id === id);
    // Check if repo exists
    if (!repositories) return response.status(400).send();
    // Update repo information
    repositorie.title = title || repositorie.title;
    repositorie.url   = url   || repositorie.url;
    repositorie.techs = techs || repositorie.techs;
    // Send response
    return response.json(repositorie);
  } catch (e) {
    console.error(`Can't update the repo. Cause: ${e.message}`);
    return response.status(500).send();
  }
});

app.delete("/repositories/:id", (request, response) => {
  try {
    // Get the id from params
    const { id } = request.params;
    // Check the id
    if (!isUuid(id)) return response.status(400).send();
    // Search for the repo
    repositories = repositories.filter(repo => repo.id !== id);
    // Send response
    return response.status(204).send();
  } catch (e) {
    console.error(`Can't delete the repo. Cause: ${e.message}`);
    return response.status(500);
  }
});

app.post("/repositories/:id/like", (request, response) => {
  try {
    // Get the id from params
    const { id } = request.params;
    // Check the id
    if (!isUuid(id)) return response.status(400).send();
    // Search for the repo
    const repositorie = repositories.find(repo => repo.id === id);
    // Check if repo exists
    if (!repositories) return response.status(400).send();
    // Add a new like
    repositorie.likes += 1;
    // send response
    return response.json(repositorie);
  } catch (e) {
    console.error(`Can't add a new like. Cause: ${e.message}`);
    return response.status(500).send();
  }
});

module.exports = app;
