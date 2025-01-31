// app.js

// Selezioniamo gli elementi del DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Funzione per aggiungere un nuovo task
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Inserisci una descrizione valida!');
        return;
    }

    // Creiamo un nuovo elemento li
    const li = document.createElement('li');
    li.textContent = taskText;

    // Aggiungiamo un pulsante di eliminazione
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Elimina';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
        taskList.removeChild(li);
    });

    // Aggiungiamo la funzionalità di completamento del task
    li.addEventListener('click', function() {
        li.classList.toggle('completed');
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Puliamo il campo di input
    taskInput.value = '';
}

// Aggiungiamo un event listener al pulsante "Aggiungi"
addTaskBtn.addEventListener('click', addTask);

// Aggiungiamo anche la possibilità di premere "Enter" per aggiungere un task
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
