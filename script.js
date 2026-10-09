// Retrieve todo from local storage or initialize an empty array 

let todo = JSON.parse(localStorage.getItem("todo")) || [];  
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
    //some logic
}

function deleteAllTasks() {
    //more logic
}

function displayTasks() {
    //even more logic
}