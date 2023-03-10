const todos = [];
const RENDER_EVENT = 'render-todo';
document.addEventListener('DOMContentLoaded',function () {
    const submitForm = document.getElementById ('form');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addTodo();
    });
});
 //untuk mendefinisikan custom event
//sebagai patokan dasar jika data ada perubahan

function addTodo (){
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;
    const generateID = generateId();
    const todoObject = generateTodoObject(generateID,textTodo,timestamp, false);
    todos.push(todoObject);
    document.dispatchEvent (new Event(RENDER_EVENT));
}
//generateObject=untuk membuat object baru
//push = metode untuk menambahkan object baru dan disimpan pada array
//render Event// dispatchEvent() //method= untuk render data yang telah disimpan pada array todos

function generateId() {
    return + new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted){
    return {
        id,
        task,
        timestamp,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedTODOlist = document.getElementById('todos');
    uncompletedTODOlist.innerHTML ='';

    const completedTodoList = document.getElementById('completed-todos');
    completedTodoList.innerHTML='';

    for (const todoItem of todos){
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted)
            uncompletedTODOlist.append(todoElement);
        else 
            completedTodoList.append(todoElement);
    }
});

function makeTodo(todoObject){
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;
    
    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(todoObject.id);
        });
    
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(todoObject.id);
        });
        function removeTaskFromCompleted(todoId){
            const todoTarget = findTodoIndex(todoId);

            if(todoTarget === -1) return;
            todos.splice(todoTarget, 1);
            document.dispatchEvent (new Event(RENDER_EVENT));
        }
        function undoTaskFromCompleted(todoId){
            const todoTarget = findTodo(todoId);

            if (todoTarget == null) return;
            todoTarget.isCompleted = false;
            document.dispatchEvent(new Event(RENDER_EVENT));
        }

        container.append(undoButton, trashButton);

    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function (){
            addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }

    return container;

}
function addTaskToCompleted (todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodo(todoId){
    for (const todoItem of todos){
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

function findTodoIndex(todoId){
    for (const index in todos){
        if (todos[index].id === todoId){
            return index;
        }    
    }
    return -1;
}


