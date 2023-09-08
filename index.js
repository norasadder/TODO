let nextID;
const rowsPerPage = 5;
const pagesPerContainer = 5;
let table;
let tasks;
let pagesLoopsCounter = 1;
let pagesLoopsCount;
let pages = [];
let currentPage;
const LOCAL_STORAGE_ALL_TASKS = "allTasks";
const LOCAL_STORAGE_NEXT_ID = "nextID";

function paging(tasksArr = tasks) {
  pagesLoopsCounter = 1;
  const rowCount = tasksArr.length;
  const pageCount = Math.ceil(rowCount / rowsPerPage);
  pagination = document.getElementsByClassName("pagination")[0];
  pagination.innerHTML = "<a onclick = 'prevPages()'>&laquo;</a>";

  for (let i = 1; i <= pageCount; i++) {
    a = document.createElement("a");
    a.innerHTML = i;
    a.onclick = () => {
      dividePages(i, tasksArr);
    };
    pagination.appendChild(a);
  }
  a = document.createElement("a");
  a.innerHTML = "&raquo";
  a.addEventListener("click", nextPages);
  pagination.appendChild(a);
  pages = pagination.childNodes;
  pagesLoopsCount = Math.ceil((pages.length - 2) / pagesPerContainer);
}

function dividePages(pageNumber, tasksArr = tasks) {
  currentPage = pageNumber;
  let pressedPage = pages[pageNumber];
  pagesLoopsCounter = Math.ceil(pageNumber / pagesPerContainer);
  for (let i = 1; i < pages.length - 1; i++) {
    pages[i].style.display = "none";
  }

  for (
    let i = (pagesLoopsCounter - 1) * pagesPerContainer + 1;
    i < pagesLoopsCounter * pagesPerContainer + 1 && i < pages.length - 1;
    i++
  ) {
    pages[i].style.display = "block";
  }
  for (let i = 1; i < pages.length; i++) {
    pages[i].classList.remove("active");
  }
  pressedPage.className = "active";
  updateTableData(
    tasksArr.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage)
  );
}

async function getDataFromAPI() {
  //TODO: adding a loading indicator to the list on data load is a good idea
  const response = await fetch("https://dummyjson.com/todos?limit=150");
  try {
    const result = await response.json();
    tasks = result.todos;
    nextID = result.total + 1;
    return { tasks, nextID };
  } catch (error) {
    throw error;
  }
}

function deleteTask() {
  const rowIndex = this.parentNode.parentNode.parentNode.rowIndex;
  if (confirm("are you sure you want to delete this task?") === true) {
    table.deleteRow(rowIndex);
    tasks.splice((currentPage - 1) * pagesPerContainer + rowIndex - 1, 1);
    document.getElementById("totalTasks").innerHTML = tasks.length;
    console.log(rowIndex, currentPage, pages);
    const nextDividePage =
      rowIndex === 1 && currentPage === pages.length - 2
        ? currentPage - 1
        : currentPage;
    paging();
    dividePages(nextDividePage);
    saveData({ tasks, nextID });
  }
}

function doneUndone() {
  const row = this.parentNode.parentNode.parentNode;
  const rowIndex = row.rowIndex;
  const doneButton = row.getElementsByClassName("doneButton")[0];
  if (doneButton.innerHTML === "Done") {
    completeTask(this);
    tasks[
      (currentPage - 1) * pagesPerContainer + rowIndex - 1
    ].completed = true;
  } else {
    undone(this);
    tasks[
      (currentPage - 1) * pagesPerContainer + rowIndex - 1
    ].completed = false;
  }
  saveData({ tasks, nextID });
}

function completeTask(pressedButton) {
  const row = pressedButton.parentNode.parentNode.parentNode;
  row.getElementsByClassName("ID")[0].classList.add("line-through");
  row.getElementsByClassName("todo")[0].classList.add("line-through");
  row.getElementsByClassName("userID")[0].classList.add("line-through");
  const statusCell = row.getElementsByClassName("status")[0];
  const doneButton = row.getElementsByClassName("doneButton")[0];
  doneButton.innerHTML = "Undone";
  statusCell.innerHTML = "";
  statusCell.classList.add("checkMark");
}

function addTask() {
  const taskDescription = document.getElementsByClassName("add-task")[0].value;
  if (taskDescription === "") {
    alert("empty field");
  } else {
    table.appendChild(createTaskRow(nextID, taskDescription, 33, false));
    tasks.push({
      id: nextID,
      todo: taskDescription,
      completed: false,
      userId: 33,
    });
    document.getElementById("totalTasks").innerHTML = tasks.length;
    nextID++;

    const snackbar = document.getElementById("snackbar");
    snackbar.style.display = "block";
    setTimeout(() => {
      snackbar.style.display = "none";
    }, 2000);
    paging();
    dividePages(Math.ceil(tasks.length / rowsPerPage));
    saveData({ tasks, nextID });
  }
}

function searchTask() {
  const searchValue = document.getElementsByClassName("search-val")[0].value;
  if (searchValue === "") {
    updateTableData(tasks);
    paging();
    dividePages(1);
    return;
  }
  let tempTasks = [];
  let elementsCount = 0;
  for (let task of tasks) {
    if (task.todo.includes(searchValue)) {
      tempTasks.push(task);
      elementsCount++;
    }
  }
  updateTableData(tempTasks);
  document.getElementById("totalTasks").innerHTML = elementsCount;

  paging(tempTasks);
  if (tempTasks === null) {
    return;
  }

  dividePages(1, tempTasks);
}

function undone(pressedButton) {
  const row = pressedButton.parentNode.parentNode.parentNode;
  row.getElementsByClassName("ID")[0].classList.remove("line-through");
  row.getElementsByClassName("todo")[0].classList.remove("line-through");
  row.getElementsByClassName("userID")[0].classList.remove("line-through");
  const statusCell = row.getElementsByClassName("status")[0];
  const doneButton = row.getElementsByClassName("doneButton")[0];
  doneButton.innerHTML = "Done";
  statusCell.innerHTML = "Pending";
  statusCell.classList.remove("checkMark");
}

function nextPages() {
  if (pagesLoopsCounter === pagesLoopsCount) {
    return;
  }
  for (
    let i = (pagesLoopsCounter - 1) * pagesPerContainer + 1;
    i < pagesLoopsCounter * pagesPerContainer + 1;
    i++
  ) {
    pages[i].style.display = "none";
  }
  for (
    let i = pagesLoopsCounter * pagesPerContainer + 1;
    i < (pagesLoopsCounter + 1) * pagesPerContainer + 1 && i < pages.length - 1;
    i++
  ) {
    pages[i].style.display = "block";
  }
  pagesLoopsCounter++;
}

function prevPages() {
  if (pagesLoopsCounter === 1) {
    return;
  }

  for (
    let i = (pagesLoopsCounter - 1) * pagesPerContainer + 1;
    i < pagesLoopsCounter * pagesPerContainer + 1 && i < pages.length - 1;
    i++
  ) {
    console.log(i);
    pages[i].style.display = "none";
  }
  pagesLoopsCounter--;
  for (
    let i = (pagesLoopsCounter - 1) * pagesPerContainer + 1;
    i < pagesLoopsCounter * pagesPerContainer + 1;
    i++
  ) {
    pages[i].style.display = "block";
  }
}

async function loadData() {
  // localStorage.clear();
  let result;
  document.getElementsByClassName("loader-container")[0].style.display = "flex";
  if (
    localStorage.getItem("allTasks") !== null &&
    localStorage.getItem("nextID") !== null
  ) {
    tasks = JSON.parse(localStorage.getItem("allTasks"));
    nextID = localStorage.getItem("nextID");
    result = { tasks, nextID };
  } else {
    result = await getDataFromAPI();
    saveData(result);
  }

  document.getElementsByClassName("loader-container")[0].style.display = "none";

  return result;
}

function saveData(data) {
  localStorage.setItem(LOCAL_STORAGE_ALL_TASKS, JSON.stringify(data.tasks));
  localStorage.setItem(LOCAL_STORAGE_NEXT_ID, data.nextID);
}

function createTaskRow(...values) {
  const ID = document.createElement("td");
  ID.innerHTML = values[0];
  ID.className = "ID";

  const todo = document.createElement("td");
  todo.innerHTML = values[1];
  todo.className = "todo";

  const userID = document.createElement("td");
  userID.innerHTML = values[2];
  userID.className = "userID";

  const status = document.createElement("td");
  status.className = "status";

  const row = document.createElement("tr");

  const actions = document.createElement("td");
  const actionsDiv = document.createElement("div");
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.className = "deleteButton";
  deleteButton.addEventListener("click", deleteTask);
  const doneButton = document.createElement("button");

  doneButton.className = "doneButton";
  doneButton.addEventListener("click", doneUndone);

  row.appendChild(ID);
  row.appendChild(todo);
  row.appendChild(userID);
  row.appendChild(status);
  actionsDiv.appendChild(deleteButton);
  actionsDiv.appendChild(doneButton);

  actionsDiv.className = "actions";

  actions.appendChild(actionsDiv);
  row.appendChild(actions);
  values[3] === true ? completeTask(doneButton) : undone(doneButton);
  // table.appendChild(row);
  return row;
}

function updateTableData(tasksList) {
  table.innerHTML =
    "<tr class='header'><td>ID</td><td>TODO Description</td><td>User ID</td><td>Status</td><td>Actions</td></tr>";
  for (let taskElement of tasksList) {
    table.appendChild(
      createTaskRow(
        taskElement["id"],
        taskElement["todo"],
        taskElement["userId"],
        taskElement["completed"]
      )
    );
  }
}

async function startupFunction() {
  const data = await loadData();
  tasks = data.tasks;
  table = document.getElementById("TODO-List");
  updateTableData(tasks);
  document.getElementById("totalTasks").innerHTML = tasks.length;
  paging();
  dividePages(1);
}
