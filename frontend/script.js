// ==================================================
// BACKEND URL
// ==================================================

const API_URL = "http://localhost:8000";


// ==================================================
// LOAD ALL TASKS
// ==================================================

async function loadTasks() {

    const taskList =
        document.getElementById("taskList");


    try {

        taskList.innerHTML =
            '<p class="loading">Loading tasks...</p>';


        const response = await fetch(
            `${API_URL}/tasks`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load tasks"
            );
        }


        const tasks = await response.json();


        displayTasks(tasks);

    }

    catch (error) {

        console.error(error);

        taskList.innerHTML =
            '<p class="error">Failed to load tasks.</p>';
    }
}


// ==================================================
// DISPLAY TASKS
// ==================================================

function displayTasks(tasks) {

    const taskList =
        document.getElementById("taskList");


    taskList.innerHTML = "";


    // No tasks
    if (tasks.length === 0) {

        taskList.innerHTML =
            '<p class="no-tasks">No tasks found.</p>';

        return;
    }


    // Display every task
    tasks.forEach(task => {

        const taskCard =
            document.createElement("div");


        taskCard.className =
            "task-card";


        taskCard.innerHTML = `

            <h3>
                ${escapeHtml(task.name)}
            </h3>


            <p class="task-description">
                ${escapeHtml(
                    task.description || "No description"
                )}
            </p>


            <p class="task-info">
                <strong>Owner:</strong>
                ${escapeHtml(task.owner)}
            </p>


            <p class="task-info">
                <strong>Due Date:</strong>
                ${formatDate(task.due_date)}
            </p>


            <p class="task-info">

                <strong>Status:</strong>

                <span
                    class="status status-${task.status}"
                >
                    ${formatStatus(task.status)}
                </span>

            </p>


            <div class="task-actions">

                <button
                    class="edit-button"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>


                <button
                    class="delete-button"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>
        `;


        taskList.appendChild(taskCard);
    });
}


// ==================================================
// CREATE TASK
// ==================================================

document
    .getElementById("taskForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // Get form values
            const name =
                document.getElementById("name").value;


            const description =
                document.getElementById("description").value;


            const owner =
                document.getElementById("owner").value;


            const dueDate =
                document.getElementById("due_date").value;


            const status =
                document.getElementById("status").value;


            // Create JavaScript object
            const task = {

                name: name,

                description: description,

                owner: owner,

                due_date: dueDate,

                status: status
            };


            try {

                const response = await fetch(
                    `${API_URL}/tasks`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(task)
                    }
                );


                if (!response.ok) {

                    const error =
                        await response.json();

                    console.error(error);

                    alert(
                        "Failed to create task"
                    );

                    return;
                }


                alert(
                    "Task created successfully!"
                );


                // Clear form
                document
                    .getElementById("taskForm")
                    .reset();


                // Reload tasks
                loadTasks();

            }

            catch (error) {

                console.error(error);

                alert(
                    "Could not connect to backend."
                );
            }

        }
    );


// ==================================================
// DELETE TASK
// ==================================================

async function deleteTask(taskId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/tasks/${taskId}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to delete task"
            );
        }


        alert(
            "Task deleted successfully!"
        );


        loadTasks();

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to delete task."
        );
    }
}


// ==================================================
// EDIT TASK
// ==================================================

async function editTask(taskId) {

    try {

        // First get the existing task
        const response = await fetch(
            `${API_URL}/tasks/${taskId}`
        );


        if (!response.ok) {

            throw new Error(
                "Failed to get task"
            );
        }


        const task =
            await response.json();


        // Ask user for new values
        const newName =
            prompt(
                "Task name:",
                task.name
            );


        if (newName === null) {

            return;
        }


        const newDescription =
            prompt(
                "Description:",
                task.description || ""
            );


        if (newDescription === null) {

            return;
        }


        const newOwner =
            prompt(
                "Owner:",
                task.owner
            );


        if (newOwner === null) {

            return;
        }


        const newStatus =
            prompt(
                "Status: pending, in_progress, completed",
                task.status
            );


        if (newStatus === null) {

            return;
        }


        // Update object
        const updatedTask = {

            name: newName,

            description: newDescription,

            owner: newOwner,

            due_date: task.due_date,

            status: newStatus
        };


        // Send PUT request
        const updateResponse =
            await fetch(
                `${API_URL}/tasks/${taskId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(updatedTask)
                }
            );


        if (!updateResponse.ok) {

            throw new Error(
                "Failed to update task"
            );
        }


        alert(
            "Task updated successfully!"
        );


        loadTasks();

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to update task."
        );
    }
}


// ==================================================
// FORMAT STATUS
// ==================================================

function formatStatus(status) {

    if (status === "pending") {

        return "Pending";
    }


    if (status === "in_progress") {

        return "In Progress";
    }


    if (status === "completed") {

        return "Completed";
    }


    return status;
}


// ==================================================
// FORMAT DATE
// ==================================================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleString();
}


// ==================================================
// BASIC HTML ESCAPING
// ==================================================

function escapeHtml(value) {

    const div =
        document.createElement("div");


    div.textContent = value;


    return div.innerHTML;
}


// ==================================================
// LOAD TASKS WHEN PAGE OPENS
// ==================================================

loadTasks();