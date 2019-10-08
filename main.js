function saveToLocalStorage(note, key) {
    if (key) {
        localStorage.setItem(key, JSON.stringify(note))
    } else {
        let keys = getKeys();
        let index = keys[keys.length - 1] + 1 || 1;
        localStorage.setItem(`${index}`, JSON.stringify(note));
    }

}

function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function createNoteView(note, key) {
    let div = document.createElement('div');
    div.className = 'todo-item';

    let title = document.createElement('h3');
    title.className = 'todo-item-title';
    title.append(`${note.name}`);
    div.append(title);

    if (note.description) {
        let description = document.createElement('p');
        description.className = 'todo-item-description';
        description.append(`${note.description}`);
        div.append(description);
    }

    let priority = document.createElement('div');
    priority.className = 'todo-item-priority';
    priority.append(`Priority: `);
    let color = '';
    switch (note.priority) {
        case "low":
            color = 'blue';
            break;
        case "middle":
            color = 'yellow';
            break;
        case "high":
            color = 'red';
            break;
    }
    let span = document.createElement('span');
    span.append(`${note.priority}`);
    span.style.color = color;
    priority.append(span);
    div.append(priority);

    let deadline = document.createElement('div');
    deadline.className = 'todo-item-deadline';
    deadline.append(`Deadline: ${note.deadline}`);
    div.append(deadline);


    let itemFooter = document.createElement('div');
    itemFooter.className = 'todo-item-footer';

    let itemFooterButtonDone = document.createElement('button');
    itemFooterButtonDone.className = 'btn button-item-done';
    if (note.done) {
        itemFooterButtonDone.append(`Mark as undone`);
        div.classList.add('done');
    } else {
        itemFooterButtonDone.append(`Mark as done`);
    }

    let itemFooterButtonEdit = document.createElement('button');
    itemFooterButtonEdit.className = 'btn button-item-edit';
    itemFooterButtonEdit.append('Edit');

    let itemFooterButtonDelete = document.createElement('button');
    itemFooterButtonDelete.className = 'btn button-item-delete';
    itemFooterButtonDelete.append('Delete');

    itemFooter.append(itemFooterButtonDelete);
    itemFooter.append(itemFooterButtonEdit);
    itemFooter.append(itemFooterButtonDone);

    div.addEventListener('click', function (e) {
        if (e.target === this.querySelector('.button-item-delete')) {
            this.style.display = 'none';
            localStorage.removeItem(key);
        }

        if (e.target === this.querySelector('.button-item-done')) {
            this.classList.toggle('done');
            if (this.classList.contains('done')) {
                e.target.innerText = 'Mark as undone';
                note.done = true;
            } else {
                note.done = false;
                e.target.innerText = 'Mark as done';
            }
            saveToLocalStorage(note, key);
        }

        if (e.target === this.querySelector('.button-item-edit')) {
            document.querySelector('#modal').style.display = 'block';
            let form = document.querySelector('form');
            form.setAttribute('key', key);
            form.name.value = note.name;
            form.description.value = note.description;
            form.priority.value = note.priority;
            form.deadline.value = note.deadline;
            document.querySelector('.modal-title h3').textContent = 'Edit to-do item';
            document.querySelector('.button-form-add').value = 'Edit';
        }
    });

    div.append(itemFooter);

    return div;
}

function getKeys() {
    let keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        keys.push(Number(localStorage.key(i)));
    }
    return keys.sort((a, b) => a - b);
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('form').reset();
    document.querySelector('.search').value = '';
    let keys = getKeys();
    let notesMap = new Map();
    for (let key of keys) {
        let note = loadFromLocalStorage(key);
        notesMap.set(key, note);
    }
    let notesArray = [...notesMap.entries()].sort((a, b) => {
        if (a[1].done && !b[1].done) return 1;
        if (a[1].done && b[1].done || !a[1].done && !b[1].done) return 0;
        if (!a[1].done && b[1].done) return -1;
    });
    let notes = new Map(notesArray);
    for (let note of notes) {
        let noteView = createNoteView(note[1], note[0]);
        document.querySelector('.content').append(noteView);
    }
});

document.querySelector('#button-add').addEventListener('click', function () {
    document.querySelector('#modal').style.display = 'block';
});

document.querySelector('#modal').addEventListener('click', function (e) {
    if (e.target === this ||
        e.target === document.querySelector('.button-form-cancel') ||
        e.target === document.querySelector(".modal-title span")) {
        this.style.display = 'none';
        document.querySelector('form').reset();
        document.querySelector('form').removeAttribute('key');
        document.querySelector('.modal-title h3').textContent = 'Add to-do item';
        document.querySelector('.button-form-add').value = 'Add';
    }
});

document.querySelector('form').addEventListener('submit', function (e) {
    document.querySelector('#modal').style.display = 'none';
    let name = this.name.value;
    let description = this.description.value;
    let priorityItem = this.priority;
    let priority = priorityItem.options[priorityItem.selectedIndex].value;
    let deadline = this.deadline.value || 'no deadline';

    let note = {
        name: name,
        description: description,
        priority: priority,
        deadline: deadline,
        done: false
    };

    let key = this.getAttribute('key');
    if (key) {
        console.log('save with key');
        saveToLocalStorage(note, key);
        document.querySelector('form').removeAttribute('key');
    } else {
        saveToLocalStorage(note);
    }
});

document.querySelector('.button-sort').addEventListener('click', function () {
    let toDoItems = document.querySelectorAll('.todo-item');
    for (let item of toDoItems) {
        if (item.querySelector('.todo-item-priority span').textContent === 'middle') {
            item.parentElement.append(item);
        }
    }
    for (let item of toDoItems) {
        if (item.querySelector('.todo-item-priority span').textContent === 'low') {
            item.parentElement.append(item);
        }
    }
});

document.querySelector('.search').addEventListener('input', function () {
    let toDoItems = document.querySelectorAll('.todo-item');
    let regExp = new RegExp(`${this.value}`, 'gmi');
    for (let item of toDoItems) {
        let title = item.querySelector('.todo-item-title').innerText;
        let description = item.querySelector('.todo-item-description');
        if(description) description = description.innerText;
        //console.log(title, description);
        if (regExp.test(title) || regExp.test(description)) {
            item.style.display = 'block';
        }else{
            item.style.display = 'none';
        }

    }
});



