const express = require('express');

let totalRequests = 0
const projects = [];
const app = express();

app.use(express.json());

const idExists = (req, res, next) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => {
    return project.id === Number(id);
  });

  if (projectIndex < 0) {
    return res.status(401).send('Project does not exists');
  }

  req.projectIndex = projectIndex;
  return next();
};

const logger = (_req, _res, next) => {
  console.log(`Total requests: ${++totalRequests}`);
  return next();
};

app.use(logger)

app.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(project);
});

app.get('/projects', (_req, res) => res.json(projects));

app.put('/projects/:id', idExists, (req, res) => {
  const { title } = req.body;
  const { projectIndex } = req;

  projects[projectIndex].title = title;

  return res.json(projects[projectIndex]);
});

app.delete('/projects/:id', idExists, (req, res) => {
  const { projectIndex } = req;

  projects.splice(projectIndex, 1);

  return res.send();
});

app.post('/projects/:id/tasks', idExists, (req, res) => {
  const { title } = req.body;
  const { projectIndex } = req;

  projects[projectIndex].tasks.push(title);

  return res.send(projects[projectIndex]);
});

app.listen(3333);
