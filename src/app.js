const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const id = uuid();

  let repository = {}

  if (isUuid(id)){
    repository = {id, title, url, techs, likes: 0};
  }

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const { title, url, techs } = request.body;


  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  
  if (repositoryIndex === -1){
    return response.status(400).json({error: 'Repository does not exists'});
  }

  const newRepository = {
    id, 
    title, 
    url, 
    techs, 
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = newRepository;
  
  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  
  if (repositoryIndex === -1) {
    return response.status(400).json({error: "Should not be able to delete this repository."})
  } 

  repositories.splice(repositoryIndex, 1);
  
  return response.status(204).send();
  
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  
  if (repositoryIndex === -1){
    return response.status(400).json({error: 'Repository does not exists'});
  }

  repositories[repositoryIndex].likes += 1;
  
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
