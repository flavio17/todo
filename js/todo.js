//variables
let todoItems = [];
let todoInput = document.querySelector(".todo-input");
const completedTodosDiv = document.querySelector(".completed-todos");
const uncompletedTodosDiv = document.querySelector(".uncompleted-todos");
const audio = new Audio("sound.mp3");

//get todo list on first boot
window.onload = () => {
  let storageTodoItems = localStorage.getItem("todoItems");
  if (storageTodoItems !== null) {
    todoItems = JSON.parse(storageTodoItems);
  }
  render();
};

//get the content type into the input
todoInput.onkeyup = (e) => {
  let value = e.target.value.replace(/^\s+/, "");
  if (value && e.keyCode === 13) {
    addTodo(value);
    todoInput.value = "";
    todoInput.focus();
  }
};

//add todos
function addTodo(text) {
  todoItems.push({
    id: Date.now(),
    text,
    completed: false,
  });
  saveAndRender();
}

//remove todos
function removeTodos(id) {
  todoItems = todoItems.filter((todo) => todo.id !== Number(id));
  saveAndRender();
}

//mark as completed
function markAsCompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = true;
    }
    return todo;
  });
  // audio.play();
  saveAndRender();
}

//mark as uncompleted
function markAsUncompleted(id) {
  todoItems = todoItems.filter((todo) => {
    if (todo.id === Number(id)) {
      todo.completed = false;
    }
    return todo;
  });
  saveAndRender();
}

//save in localStorage
function save() {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

//render
function render() {
  let unCompletedTodos = todoItems.filter((item) => !item.completed);
  let completedTodos = todoItems.filter((item) => item.completed);
  completedTodosDiv.innerHTML = "";
  uncompletedTodosDiv.innerHTML = "";

  if (unCompletedTodos.length > 0) {
    unCompletedTodos.forEach((todo) => {
      uncompletedTodosDiv.append(createTodoElement(todo));
    });
  } else {
    uncompletedTodosDiv.innerHTML = `<div class="empty">Sem tarefas pendentes</div>`;
  }
  if (completedTodos.length > 0) {
    completedTodosDiv.innerHTML = `<div class="completed-title">Completos (${completedTodos.length} / ${todoItems.length})</div>`;
  }
  completedTodos.forEach((todo) => {
    completedTodosDiv.append(createTodoElement(todo));
  });
}

//save and render
function saveAndRender() {
  save();
  render();
}

//create todo list item
function createTodoElement(todo) {
  //create todo list container
  const todoDiv = document.createElement("div");
  todoDiv.setAttribute("data-id", todo.id);
  todoDiv.className = "todo-item";
  //create todo item text
  const todoTextSpan = document.createElement("span");
  todoTextSpan.innerHTML = todo.text;
  //checkbox for list
  const todoInputCheckbox = document.createElement("input");
  todoInputCheckbox.type = "checkbox";
  todoInputCheckbox.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    e.target.checked ? markAsCompleted(id) : markAsUncompleted(id);
  };

  //delete button for list
  const todoRemoveBtn = document.createElement("a");
  todoRemoveBtn.href = "#";
  todoRemoveBtn.innerHTML = `<i class='bx bx-x'></i>`;
  todoRemoveBtn.onclick = (e) => {
    let id = e.target.closest(".todo-item").dataset.id;
    removeTodos(id);
  };
  todoTextSpan.prepend(todoInputCheckbox);
  todoDiv.appendChild(todoTextSpan);
  todoDiv.appendChild(todoRemoveBtn);
  return todoDiv;
}
