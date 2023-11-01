// HTML Elements
let body = document.body
let modal = document.getElementById("modal")
let newTaskBtn = document.getElementById("newTaskBtn")
let addingTaskBtn = document.getElementById("addingTaskBtn")
let taskStatus = document.getElementById("taskStatus")
let taskCategory = document.getElementById("taskCategory")
let taskTitle = document.getElementById("taskTitle")
let taskDescription = document.getElementById("taskDescription")
let toDoContainer = document.getElementById("toDoContainer")
let inProgressContainer = document.getElementById("inProgressContainer")
let doneContainer = document.getElementById("doneContainer")
let searchInput = document.getElementById("searchInput")
let nextUpCountElement = document.getElementById("nextUpCountElement")
let inProgressCountElement = document.getElementById("inProgressCountElement")
let doneCountElement = document.getElementById("doneCountElement")
let grid = document.getElementById("grid")
let bars = document.getElementById("bars")
let sections = document.querySelectorAll("section")
let divsWithTaskClass = document.querySelectorAll(".tasks")
// JS Variables
let taskContainer = []
let cartona = ``
let updateIndex;
let nextUpCounter = 0
let inProgressCounter = 0
let doneCounter = 0

if (localStorage.getItem("tasks") != null) {
    taskContainer = JSON.parse(localStorage.getItem("tasks"))
    for (let i = 0; i < taskContainer.length; i++) {
        displayTasks(i)
    }
}
/////////////////////////////
function showModal() {
    modal.classList.replace("d-none", "d-flex");
    preventScrolling()
}
function hideModal() {
    modal.classList.replace("d-flex", "d-none")
    resetScrolling()
}

function addTask() {
    if (addingTaskBtn.innerHTML.trim() == "Add New Task") {
        let taskData = {
            title: taskTitle.value,
            description: taskDescription.value,
            statu: taskStatus.value,
            category: taskCategory.value
        }
        taskContainer.push(taskData)
        saveTasksToLocalStorage()
        displayTasks(taskContainer.length - 1)
        resetInputs()
        hideModal()
    } else if (addingTaskBtn.innerHTML.trim() == "Update Task") {
        updateTask(updateIndex)
    }

}
function displayTasks(i) {
    cartona = `
        <div class="task text-color" data-index="0">
            <h3 class="text-capitalize">${taskContainer[i].title}</h3>
            <p class="description text-capitalize">${taskContainer[i].description}</p>
            <h4 class="category bg-${taskContainer[i].category} text-capitalize">${taskContainer[i].category}</h4>
            <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
                <li><i class="fas fa-pen" onclick="getTaskInfo(${i})"></i></li>
                <li><i class="fas fa-trash-can" onclick="deleteTask(${i})"></i></li>
                <li><i class="fas fa-palette" onclick="changeColor(event)"></i></li>
            </ul>
        </div>
        `
    setHTMLLocation(taskContainer[i].statu)
}
function setHTMLLocation(s) {
    switch (s) {
        case "nextUp":
            toDoContainer.innerHTML += cartona
            nextUpCounter++
            nextUpCountElement.innerHTML = nextUpCounter
            break;
        case "inProgress":
            inProgressContainer.innerHTML += cartona
            inProgressCounter++
            inProgressCountElement.innerHTML = inProgressCounter
            break;
        case "done":
            doneContainer.innerHTML += cartona
            doneCounter++
            doneCountElement.innerHTML = doneCounter
            break;
    }
}
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(taskContainer))
}
function resetInputs() {
    taskTitle.value = ""
    taskDescription.value = ""
    taskStatus.value = ""
    taskCategory.value = ""
}
function deleteTask(i) {
    taskContainer.splice(i, 1)
    saveTasksToLocalStorage()
    resetContainers()
    resetCounters()
    for (let i = 0; i < taskContainer.length; i++) {
        displayTasks(i)
    }
}
function getTaskInfo(i) {
    showModal()
    modal.addEventListener("click", function (e) {
        if (e.target.id === "modal") {
            hideModal()
            resetInputs()
        }
    })
    document.addEventListener("keyup",function (e) {
        if (e.key == "Escape") {
            hideModal()
            resetInputs()
        }
    })
    taskTitle.value = taskContainer[i].title
    taskDescription.value = taskContainer[i].description
    taskStatus.value = taskContainer[i].statu
    taskCategory.value = taskContainer[i].category
    addingTaskBtn.innerHTML = "Update Task";
    addingTaskBtn.classList.replace("btn-outline-info", "btn-warning")
    updateIndex = i;
}
function updateTask(i) {
    taskContainer[i].title = taskTitle.value
    taskContainer[i].description = taskDescription.value
    taskContainer[i].statu = taskStatus.value
    taskContainer[i].category = taskCategory.value
    saveTasksToLocalStorage()
    resetContainers()
    resetCounters()
    for (let i = 0; i < taskContainer.length; i++) {
        displayTasks(i)
    }
    addingTaskBtn.innerHTML = "Add New Task"
    addingTaskBtn.classList.replace("btn-warning", "btn-outline-info")
    resetInputs()
    hideModal()
}
function resetContainers() {
    toDoContainer.innerHTML = ""
    inProgressContainer.innerHTML = ""
    doneContainer.innerHTML = ""
}
function searchTasks() {
    resetContainers()
    resetCounters()
    let searchKey = searchInput.value;
    for (let i = 0; i < taskContainer.length; i++) {
        if (taskContainer[i].title.toLowerCase().includes(searchKey.toLowerCase()) ||
            taskContainer[i].category.toLowerCase().includes(searchKey.toLowerCase())) {
            displayTasks(i)
        }
    }
}
function resetCounters() {
    nextUpCounter = 0
    nextUpCountElement.innerHTML = nextUpCounter
    inProgressCounter = 0
    inProgressCountElement.innerHTML = inProgressCounter
    doneCounter = 0
    doneCountElement.innerHTML = doneCounter
}
function generateColor() {
    let color = "#"
    let char = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"]
    for (let i = 1; i <= 6; i++) {
        let randomIndex = Math.trunc(Math.random() * 16)
        color += char[randomIndex]
    }
    return color + "55";
}
function changeColor(e) {
    let taskElement = e.target.parentElement.parentElement.parentElement
    taskElement.style.backgroundColor = generateColor();
}
function changeToBars() {
    grid.classList.remove("active")
    bars.classList.add("active")
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove("col-md-6", "col-lg-4")
    }
    for (let j = 0; j < divsWithTaskClass.length; j++) {
        divsWithTaskClass[j].setAttribute("data-view", "bars");
    }
}
function changeToGrid() {
    grid.classList.add("active")
    bars.classList.remove("active")
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.add("col-md-6", "col-lg-4")
    }
    for (let j = 0; j < divsWithTaskClass.length; j++) {
        divsWithTaskClass[j].removeAttribute("data-view");
    }
}
function preventScrolling() {
    body.style.overflow = "hidden"
    scroll(0,0)
}
function resetScrolling() {
    body.style.overflow = "auto"
}
// Events
addingTaskBtn.addEventListener("click", addTask)
newTaskBtn.addEventListener("click", showModal)
modal.addEventListener("click", function (e) {
    if (e.target.id === "modal") {
        hideModal()
    }
})
document.addEventListener("keyup",function (e) {
    if (e.key == "Escape") {
        hideModal()
    }
})
searchInput.addEventListener("input", searchTasks)
grid.addEventListener("click",changeToGrid)
bars.addEventListener("click",changeToBars)