let todo = JSON.parse(localStorage.getItem("todo")) || [];
let draggedIndex = null;  

const doneCount = document.getElementById("doneCount");
const progressFill = document.getElementById("progressFill");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
const TRASH_ICON = `
<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <polyline points="3 6 5 6 21 6"/>
 <path d="M19 61-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2 2L5 6"/>
 <path d="M10 11v6M14 11v6"/>
 <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
 </svg>`;

// Initialize 

document.addEventListener("DOMContentLoaded", () => {
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
    if (newTask === "") return;
        todo.push({
            text: newTask,
            disabled: false,
        });
        saveToLocalStorage();
        todoInput.value = "";
        displayTasks();
    }

function displayTasks() {
    todoList.innerHTML = "";

        if (todo.length === 0) {
            todoList.innerHTML = `<p class="empty">Nothing here yet!</p>`;
            updateCounter();
        return; 
    };

    todo.forEach((item, index) => {
        const li= document.createElement("li");
        li.className= "todo-item" + (item.disabled ? "done" : "");
        li.draggable= true;

        li.innerHTML= `
        <span class="handle">::</span>
        <input type="checkbox" class="todo-checkbox" ${item.disabled ? "checked" : ""}>
        <span class="todo-text" id="todo-${index}">${item.text}</span>
        <button class="delete-btn" title="Delete">${TRASH_ICON}</button>
        `;

        li.querySelector(".todo-checkbox").addEventListener("click", () => toggleTask(index));
        li.querySelector(".todo-text").addEventListener("click", () => editTask(index));
        li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(index));

        li.addEventListener("dragstart", () => {
            draggedIndex = index;
            li.classList.add("dragging");
        });

        li.addEventListener("dragend", () => {
            li.classList.remove("dragging");
            document.querySelectorAll(".drag-over").forEach(el => el.classList.remove("drag-over"));
        });

        li.addEventListener("dragover", (e) => {
            e.preventDefault();
            li.classList.add("drag-over");
        });

        li.addEventListener("dragleave", () => li.classList.remove("drag-over"));

        li.addEventListener("drop", (e) => {
            e.preventDefault();
            const[moved] = todo.splice(draggedIndex, 1);
            todo.splice(index, 0, moved);
            draggedIndex = null; 
            saveToLocalStorage();
            displayTasks();
        });

        todoList.appendChild(li);
    }); 

    updateCounter();

}

function deleteTask(index) {
    todo.splice(index, 1);
    saveToLocalStorage();
    displayTasks();
}

function updateCounter() {
    const done = todo.filter(t => t.disabled).length;
    doneCount.textContent = done;
    todoCount.textContent = todo.length;
    progressFill.style.width = todo.length ? (done / todo.length) * 100 + "%" : "0%";
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
        