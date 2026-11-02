const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = 'todos.json';

function readTodos() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data || '[]');
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

app.get('/api/todos', (req, res) => {
  res.json(readTodos());
});

app.post('/api/todos', (req, res) => {
  const todos = readTodos();
  const newTodo = { id: Date.now(), text: req.body.text, completed: false };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let todos = readTodos();
  todos = todos.filter(todo => todo.id !== id);
  writeTodos(todos);
  res.json({ message: "Задача удалена" });
});

app.listen(PORT, () => {
  console.log(`Сервер с сохранением запущен на http://localhost:${PORT}`);
});
