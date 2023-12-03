const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let todos = [];

// Get all todos
app.get('/todos', (req, res) => {
  console.log(todos)
  // Create HTML string
let htmlResponse = [];
todos.forEach(task => {
  htmlResponse += `<li id="${task.id}" class="${task.done ? 'done' : ''}">${task.task}</li>`;
});

// Display the HTML
//  console.log(htmlResponse);
  res.send(htmlResponse);
});

// Add a new todo
app.post('/todos', (req, res) => {
    console.log(req.body)
  const { task } = req.body;
  const newTodo = {
    id: todos.length + 1,
    task: task,
    done: false,
  };
  todos.push(newTodo);
  const htmlResponse = `<li id="${newTodo.id}" class="${newTodo.done ? 'done' : ''}">${newTodo.task}</li>`;
  res.send(htmlResponse);
});

// Update a todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, done } = req.body;
  const todoIndex = todos.findIndex((todo) => todo.id == id);

  if (todoIndex !== -1) {
    todos[todoIndex] = {
      ...todos[todoIndex],
      text: text || todos[todoIndex].text,
      done: done !== undefined ? done : todos[todoIndex].done,
    };
    res.json(todos[todoIndex]);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter((todo) => todo.id != id);
  res.json({ message: 'Todo deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
