const form = document.querySelector('form');
const input = document.querySelector('input');
const ul = document.querySelector('ul');
const filterButtons = document.querySelectorAll('.filters button');

let currentFilter = 'all';
let todos = [];

// Загрузка задач с сервера
async function loadTodos() {
  const res = await fetch('/api/todos');
  todos = await res.json();
  render();
}

// Отрисовка списка
function render() {
  ul.innerHTML = '';
  
  let filteredTodos = todos;
  if (currentFilter === 'active') filteredTodos = todos.filter(t => !t.completed);
  if (currentFilter === 'completed') filteredTodos = todos.filter(t => t.completed);

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    
    li.innerHTML = `
      <span>${todo.text}</span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">Удалить</button>
    `;
    ul.appendChild(li);
  });
}

// Добавление задачи
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!input.value.trim()) return;
  
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input.value.trim() })
  });
  
  input.value = '';
  loadTodos();
});

// Удаление задачи
window.deleteTodo = async (id) => {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  loadTodos();
};

// Фильтры
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Инициализация
loadTodos();
