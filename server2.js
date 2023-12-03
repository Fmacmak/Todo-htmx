const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
const PORT = 3000;
const JSON_FILE = 'todos.json';

app.use(bodyParser.json());

let todos = [];

// Load todos from the JSON file
async function loadTodos() {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf-8');
    todos = JSON.parse(data);
  } catch (err) {
    console.error('Error reading todos file:', err.message);
  }
}

// Save todos to the JSON file
async function saveTodos() {
  try {
    await fs.writeFile(JSON_FILE, JSON.stringify(todos, null, 2));
  } catch (err) {
    console.error('Error writing todos file:', err.message);
  }
}

// Get all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Add a new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;
  const newTodo = {
    id: todos.length + 1,
    text,
    done: false,
  };
  todos.push(newTodo);
  await saveTodos();
  res.json(newTodo);
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, done } = req.body;
  const todoIndex = todos.findIndex((todo) => todo.id == id);

  if (todoIndex !== -1) {
    todos[todoIndex] = {
      ...todos[todoIndex],
      text: text || todos[todoIndex].text,
      done: done !== undefined ? done : todos[todoIndex].done,
    };
    await saveTodos();
    res.json(todos[todoIndex]);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  todos = todos.filter((todo) => todo.id != id);
  await saveTodos();
  res.json({ message: 'Todo deleted successfully' });
});

// Load todos when the server starts
loadTodos().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
