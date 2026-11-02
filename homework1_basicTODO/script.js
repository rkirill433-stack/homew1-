// Получаем элементы HTML
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Текущий фильтр
let currentFilter = "all";

// Загружаем задачи из localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Сохраняем задачи
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Показываем задачи на странице
function renderTasks() {
    taskList.innerHTML = "";

    // Фильтруем задачи
    const filteredTasks = tasks.filter(function(task) {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "done") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(function(task) {
        const li = document.createElement("li");

        // Текст задачи
        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.style.textDecoration = "line-through";
        }

        // Кнопка выполнения
        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed
            ? "Вернуть"
            : "Выполнено";

        completeButton.addEventListener("click", function() {
            task.completed = !task.completed;

            saveTasks();
            renderTasks();
        });

        // Кнопка удаления
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";

        deleteButton.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        li.append(span, completeButton, deleteButton);
        taskList.appendChild(li);
    });
}

// Добавление новой задачи
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Введите название задачи!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
});

// Обработка фильтров
document.querySelector(".filters").addEventListener("click", function(event) {
    if (event.target.dataset.filter) {
        currentFilter = event.target.dataset.filter;
        renderTasks();
    }
});

// Первый показ задач
renderTasks();