window.onload = function () {
    loadTasks();
    updateProgress();
};

function addTask() {

    var input = document.getElementById("taskInput");
    var task = input.value;

    if (task === "") {
        alert("Please enter a task");
        return;
    }

    createTaskElement(task, false);
    updateLocalStorage();
    updateProgress();

    input.value = "";
}

function createTaskElement(taskText, completed) {

    var li = document.createElement("li");

    var span = document.createElement("span");
    span.innerText = taskText;

    if (completed) {
        span.classList.add("completed");
    }

    span.onclick = function () {

        span.classList.toggle("completed");

        if (span.classList.contains("completed")) {
            document.getElementById("completeSound").play();
        }

        updateLocalStorage();
        updateProgress();
    };

    var editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.onclick = function () {
        var newTask = prompt("Edit your task:", span.innerText);
        if (newTask !== null && newTask !== "") {
            span.innerText = newTask;
            updateLocalStorage();
            updateProgress();
        }
    };

    var deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = function () {
        li.remove();
        updateLocalStorage();
        updateProgress();
    };

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    document.getElementById("taskList").appendChild(li);
}

function loadTasks() {

    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function (task) {
        createTaskElement(task.text, task.done);
    });
}

function updateLocalStorage() {

    var listItems = document.querySelectorAll("#taskList li");
    var tasks = [];

    listItems.forEach(function (li) {

        var text = li.querySelector("span").innerText;
        var done = li.querySelector("span").classList.contains("completed");

        tasks.push({ text: text, done: done });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateProgress() {

    var tasks = document.querySelectorAll("#taskList li");
    var total = tasks.length;
    var completed = 0;

    tasks.forEach(function (li) {
        if (li.querySelector("span").classList.contains("completed")) {
            completed++;
        }
    });

    var percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    var circle = document.querySelector(".circle");
    var text = document.getElementById("progressText");
    var motivation = document.getElementById("motivation");

    text.innerText = percent + "%";

    var color = "#f44336";

    if (percent >= 70) {
        color = "#4caf50";
        motivation.innerText = "Excellent Work! 🔥";
    } else if (percent >= 40) {
        color = "#ff9800";
        motivation.innerText = "Keep Going! 💪";
    } else if (percent > 0) {
        color = "#2196f3";
        motivation.innerText = "Nice Start! 👍";
    } else {
        motivation.innerText = "Let's start! 🚀";
    }

    circle.style.background =
        "conic-gradient(" + color + " " + percent + "%, #ddd " + percent + "%)";

    // Confetti when 100%
    if (percent === 100 && total > 0) {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
        });
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
