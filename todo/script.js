document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const itemsLeft = document.getElementById('itemsLeft');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('autolocked_tasks')) || [];
    let currentFilter = 'all';

    function saveTasks() {
        localStorage.setItem('autolocked_tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <label class="task-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                    <span class="task-text">${task.text}</span>
                </label>
                <button class="btn-delete" data-id="${task.id}" title="Удалить">&times;</button>
            `;

            taskList.appendChild(li);
        });

        const activeCount = tasks.filter(t => !t.completed).length;
        itemsLeft.textContent = `${activeCount} ${getWordEnding(activeCount)} осталось`;
    }

    function getWordEnding(count) {
        if (count % 10 === 1 && count % 100 !== 11) return 'задача';
        if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'задачи';
        return 'задач';
    }

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;

        tasks.push({
            id: Date.now().toString(),
            text,
            completed: false
        });

        taskInput.value = '';
        saveTasks();
        renderTasks();
    });

    taskList.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.type === 'checkbox') {
            tasks = tasks.map(t => t.id === id ? { ...t, completed: e.target.checked } : t);
            saveTasks();
            renderTasks();
        }

        if (e.target.classList.contains('btn-delete')) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    });

    renderTasks();
});