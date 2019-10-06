function saveToLocalStorage(note) {
    let keys = getKeys();
    let index = keys[keys.length - 1] + 1 || 1;
    console.log(keys, index);
    localStorage.setItem(`${index}`, JSON.stringify(note));
}

function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function findInLocalStorage(item) {

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
    itemFooterButtonDone.append('Mark as done');

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
        if(e.target === this.querySelector('.button-item-delete')) {
            this.style.display = 'none';
            localStorage.removeItem(key);
        }

        if(e.target === this.querySelector('.button-item-done')){
            this.classList.toggle('done');
            if (this.classList.contains('done')){
                e.target.innerText = 'Mark as undone';
            }else{
                e.target.innerText = 'Mark as done';
            }
        }

        if(e.target === this.querySelector('.button-item-edit')){

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
    let keys = getKeys();
    for (let i of keys) {
        let note = loadFromLocalStorage(i);
        let noteView = createNoteView(note, i);
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
    }
});

document.querySelector('form').addEventListener('submit', function () {
    document.querySelector('#modal').style.display = 'none';
    let name = document.querySelector('input[name="name"]').value;
    let description = document.querySelector('input[name="description"]').value;
    let priorityItem = document.querySelector('select[name="priority"]');
    let priority = priorityItem.options[priorityItem.selectedIndex].value;
    let deadline = document.querySelector('input[name="deadline"]').value || 'no deadline';

    let note = {
        name: name,
        description: description,
        priority: priority,
        deadline: deadline
    };
    console.log(note.name);
    saveToLocalStorage(note);

    // let noteView = createNoteView(note);
    // document.querySelector('.content').append(noteView);
});



