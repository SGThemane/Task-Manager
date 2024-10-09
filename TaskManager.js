// API base URL
const apiUrl = 'https://example.com/api/tasks';

// Load tasks from API
document.addEventListener('DOMContentLoaded', loadTasks);

addTaskBtn.addEventListener('click', addTask);

async function loadTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    tasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    });
}

async function addTask() {
    const taskText = taskInput.value.trim();
    const description = descriptionInput.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText) {
        const newTask = { taskText, description, dueDate };
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        });
       
        const task = await response.json();
        const li = createTaskElement(task);
        taskList.appendChild(li);
        clearInputs();
    } else {
        alert('Please enter a task.');
    }
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id); // Set data attribute for task ID

    const taskTitle = document.createElement('span');
    taskTitle.textContent = task.taskText;
    li.appendChild(taskTitle);

    const taskDescription = document.createElement('div');
    taskDescription.className = 'task-info';
    taskDescription.textContent = `Description: ${task.description}`;
    li.appendChild(taskDescription);

    const taskDueDate = document.createElement('div');
    taskDueDate.className = 'task-info';
    taskDueDate.textContent = `Due Date: ${task.dueDate}`;
    li.appendChild(taskDueDate);

    // Edit button
    const editBtn = document.createElement('span');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => editTask(li, task);

    // Delete button
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => deleteTask(li, task.id);

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    // Toggle completed status
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        updateTaskStatus(task.id, li.classList.contains('completed'));
    });

    return li;
}

async function editTask(li, task) {
    const newTaskText = prompt('Edit task:', task.taskText);
    const newDescription = prompt('Edit description:', task.description);
    const newDueDate = prompt('Edit due date:', task.dueDate);

    if (newTaskText) {
        task.taskText = newTaskText;
        li.firstChild.textContent = newTaskText;
    }
    if (newDescription) {
        task.description = newDescription;
        li.querySelector('.task-info').textContent = `Description: ${newDescription}`;
    }
    if (newDueDate) {
        task.dueDate = newDueDate;
        li.childNodes[2].textContent = `Due Date: ${newDueDate}`;
    }

    await fetch(`${apiUrl}/${task.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
}

async function deleteTask(li, taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        await fetch(`${apiUrl}/${taskId}`, {
            method: 'DELETE',
        });
        taskList.removeChild(li);
    }
}

async function updateTaskStatus(taskId, isCompleted) {
    await fetch(`${apiUrl}/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: isCompleted }),
    });
}

function clearInputs(){
    taskInput.value='';
    descriptionInput.value='';
    dueDateInput='';
}

