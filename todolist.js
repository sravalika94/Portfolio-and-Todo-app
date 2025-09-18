const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    if (filter === 'completed' && !task.completed) return;
    if (filter === 'pending' && task.completed) return;

    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const taskSpan = document.createElement('span');
    taskSpan.textContent = task.text;
    taskSpan.className = 'task-text';
    li.appendChild(taskSpan);

    // Complete button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
    completeBtn.className = 'complete-btn';
    completeBtn.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks(filter);
    });
    li.appendChild(completeBtn);

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.addEventListener('click', () => {
      const newText = prompt('Edit task:', tasks[index].text);
      if (newText !== null && newText.trim() !== '') {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks(filter);
      }
    });
    li.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks(filter);
    });
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text === '') return;
  tasks.push({ text, completed: false });
  taskInput.value = '';
  saveTasks();
  renderTasks();
});

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    renderTasks(btn.dataset.filter);
  });
});

// Initial render
renderTasks();