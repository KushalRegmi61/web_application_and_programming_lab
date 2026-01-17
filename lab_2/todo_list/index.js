let tasks = [];

document
  .getElementById("add-task-button")
  .addEventListener("click", function () {
    const task = {
      id: Date.now(),
      text: document.getElementById("task-input").value,
      task_status:
        document.getElementById("task-status").value === "completed"
          ? true
          : false,
    };
    console.log(document.getElementById("task-status").value);
    tasks.push(task);
    renderTasks();
    filterTasks();
  });

function renderTasks(filter = null) {
  const taskList = document.getElementById("tasks-ul");
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (filter === "Completed") {
    filteredTasks = tasks.filter((task) => task.task_status === true);
  } else if (filter === "Pending") {
    filteredTasks = tasks.filter((task) => task.task_status === false);
  }

  filteredTasks.forEach((task) => {
    const taskItem = document.createElement("li");

    taskItem.textContent = `${task.text} - `;

    const taskStatusButton = document.createElement("button");
    taskStatusButton.textContent = task.task_status ? "Completed" : "Pending";

    taskStatusButton.addEventListener("click", function () {
      task.task_status = !task.task_status;
      taskStatusButton.textContent = task.task_status ? "Completed" : "Pending";
      renderTasks();
    });

    // Delete Task Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      tasks = tasks.filter((t) => t.id !== task.id);
      renderTasks();
    });

    taskItem.appendChild(taskStatusButton);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
    // Clear input field after adding task
    document.getElementById("task-input").value = "";
  });
}

// Filter Buttton Event Listener
function filterTasks() {
  const filterButton = document.getElementById("task-filter");

  // unhide the filter button
  if (tasks.length > 0) {
    filterButton.style.display = "inline-block";
  }

  filterButton.addEventListener("change", function () {
    renderTasks(filterButton.value);
  });
}
