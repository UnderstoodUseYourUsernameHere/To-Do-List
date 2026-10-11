// Retrieve todo from local storage or initialize an empty array 

let todo = JSON.parse(localStorage.getItem("todo")) || [];
let draggedIndex = null;  

const done = todo.filter(t => t.disabled.length);
    doneCount.textContent= done;
    todoCount.textContent = todo.length;
    progressFill.style.width = todo.length ? (done / todo.length) * 100 + "%" : "0%";

const todoInput = document.getElementById("todoInput");

const todoList = document.getElementById("todoList");

const todoCount = document.getElementById("todoCount");

const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

// Initialize 

document.addEventListener("DOMContentLoaded", function () {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTask();
        }
    });
    deleteButton.addEventListener("click", deleteAllTasks);
    displayTasks();
});

function addTask() {
    const newTask = todoInput.value.trim();
    if (newTask !== "") {
        todo.push({
            text: newTask,
            disabled: false,
        });
        saveToLocalStorage();
        todoInput.value = "";
        displayTasks();
    }
}

function displayTasks() {
    if (todo.length === 0) {
        return `<p class="empty">Nothing here yet!</p>`
    };
    todoList.innerHTML = "";
    todo.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "todo-item";
        li.addEventListener("dragstart", (e) => {
            draggedIndex = index;
            e.dataTransfer.setData("text/plain", index);
            li.classList.add("dragging");
        })
        li.addEventListener("dragend", () => li.classList.remove("dragging"));
        li.addEventListener("dragover", (e) => {
            e.preventDefault();
            li.classList.add("drag-over");
        })
        li.addEventListener("drop", () => {
            const[moved] = todo.splice(draggedIndex, 1);
            todo.splice(index, 0, moved);
            saveToLocalStorage();
            displayTasks();
        });
        li.draggable = true;
        li.innerHTML = `
        <span class="handle">::</span>
        <input type="checkbox" class="todo-checkbox" ${item.disabled ? "checked" : ""}>
        <p id="todo-${index}" class="todo-checkbox" ${item.disabled ? "checked" : ""}>
        <p id="todo-${index}" class="todo-checkbox" ${item.disabled ? "disabled" : ""}"
        li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(index));
        onclick="editTask(${index})">$(item.text)
        todo.splice(index, 1);
        localStorage.setItem("todo", JSON.stringify(todo));
        render();</p>
        <button class="delete-btn" title="Delete">X</Button>
        `;
        li.querySelector(".todo-checkbox").addEventListener("change", () => {
            toggleTask(index);
        });
        todoList.appendChild(li);
    });
    todoCount.textContent = todo.length;
}

function editTask(index) {
    const todoItem = document.getElementById(`todo-${index}`);
    const existingText = todo[index].text;
    const inputElement = document.createElement("input");

    inputElement.value = existingText;
    todoItem.replaceWith(inputElement);
    inputElement.focus();

    inputElement.addEventListener("blur", function () {
        const updatedText = inputElement.value.trim();
        if (updatedText) {
            todo[index].text = updatedText;
            saveToLocalStorage();
        }
        displayTasks();
    });
}

function toggleTask(index) {
    todo[index].disabled = !todo[index].disabled;
    saveToLocalStorage();
    displayTasks();
}

function deleteAllTasks() {
    if (!confirm("Delete all goals?")) return;
    todo = [];
    saveToLocalStorage();
    displayTasks();
}

function saveToLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(todo));
}
        