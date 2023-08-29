let totalTasks = 0;
let allElements;
let nextID;
let rowsPerPage = 5;
let pagesPerContainer = 5;
let table;
let rowCount, pageCount;
let tr = [];
let th;
let pagesLoopsCounter = 1;
let pagesLoopsCount;
let pages = [];

function paging() {
  rowCount = table.rows.length;
  let tableHead = table.rows[0];
  th = tableHead ? table.rows[0].outerHTML : "";
  pageCount = Math.ceil(rowCount / rowsPerPage);

  for (i = 1, ii = 0; i < rowCount; i++, ii++) {
    tr[ii] = table.rows[i].outerHTML;
  }

  pagination = document.getElementsByClassName("pagination")[0];
  pagination.innerHTML = "<a onclick = 'prevPages()'>&laquo;</a>";

  for (let i = 1; i < pageCount; i++) {
    a = document.createElement("a");
    a.innerHTML = i;
    a.onclick = () => {
      dividePages(i);
    };
    pagination.appendChild(a);
  }
  a = document.createElement("a");
  a.innerHTML = "&raquo";
  a.addEventListener("click", nextPages);
  pagination.appendChild(a);
  pages = pagination.childNodes;
  pagesLoopsCount = Math.ceil((pages.length - 2) / pagesPerContainer);
  for (let i = pagesPerContainer + 1; i < pages.length - 1; i++) {
    pages[i].style.display = "none";
  }
}

function dividePages(pageNumber) {
  let pagination = document.getElementsByClassName("pagination")[0];
  let pagesList = pagination.childNodes;
  let pressedPage = pagesList[pageNumber];
  for (let i = 1; i < pagesList.length; i++) {
    pagesList[i].classList.remove("active");
  }
  console.log(pressedPage);
  table.innerHTML = th;
  pressedPage.className = "active";

  for (
    let i = (pageNumber - 1) * rowsPerPage;
    i < pageNumber * rowsPerPage;
    i++
  ) {
    table.innerHTML = table.innerHTML + tr[i];
  }
}

getAPI();

async function getAPI() {
  let response = await fetch("https://dummyjson.com/todos?limit=150");
  let result = await response.json();

  let todoArr = result.todos;

  let row, ID, todo, userID, status;
  let actions, actionsDiv, deleteButton, doneButton;
  table = document.getElementById("TODO-List");
  for (let TODOelement of todoArr) {
    ID = document.createElement("td");
    ID.innerHTML = TODOelement["id"];
    ID.className = "ID";

    todo = document.createElement("td");
    todo.innerHTML = TODOelement["todo"];
    todo.className = "todo";

    userID = document.createElement("td");
    userID.innerHTML = TODOelement["userId"];
    userID.className = "userID";

    status = document.createElement("td");
    status.className = "status";

    if (TODOelement["completed"] == true) {
      status.innerHTML = "";
      status.style.backgroundImage = "url('checkmark.png')";
      ID.style.textDecoration = "line-through";
      todo.style.textDecoration = "line-through";
      userID.style.textDecoration = "line-through";
    } else {
      status.innerHTML = "Pending";
    }

    row = document.createElement("tr");
    row.appendChild(ID);
    row.appendChild(todo);
    row.appendChild(userID);
    row.appendChild(status);

    actions = document.createElement("td");
    actionsDiv = document.createElement("div");
    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.className = "deleteButton";
    deleteButton.addEventListener("click", deleteTask);
    doneButton = document.createElement("button");
    if (status.innerHTML === "") {
      doneButton.innerHTML = "Undone";
    } else {
      doneButton.innerHTML = "Done";
    }
    doneButton.className = "doneButton";
    doneButton.addEventListener("click", doneUndone);

    actionsDiv.appendChild(deleteButton);
    actionsDiv.appendChild(doneButton);

    actionsDiv.className = "actions";

    actions.appendChild(actionsDiv);
    row.appendChild(actions);
    table.appendChild(row);
  }

  totalTasks = result.total;
  document.getElementById("totalTasks").innerHTML = totalTasks;
  allElements = table.innerHTML;
  nextID = totalTasks + 1;
  localStorage.setItem("tableData", allElements);
  localStorage.setItem("totalTasks", totalTasks);
  localStorage.setItem("nextID", nextID);
  paging();
  // dividePages(
  //   document.getElementsByClassName("pagination")[0].firstElementChild
  //     .nextElementSibling
  // );

  dividePages(1);
}

function getTableData() {
  allElements = localStorage.getItem("tableData");
  totalTasks = localStorage.getItem("totalTasks");
  nextID = localStorage.getItem("nextID");
  table = document.getElementById("TODO-List");
  //   console.log(allElements);
  table.innerHTML = allElements;
  document.getElementById("totalTasks").innerHTML = totalTasks;
  //   document.getElementById("addButton").addEventListener("click", addTask);
  deleteButtonsArr = document.getElementsByClassName("deleteButton");
  for (let deleteBTN of deleteButtonsArr)
    deleteBTN.addEventListener("click", deleteTask);

  doneButtonsArr = document.getElementsByClassName("doneButton");
  for (let doneBTN of doneButtonsArr)
    doneBTN.addEventListener("click", completeTask);

  paging();
  dividePages(1);
}

function deleteTask() {
  let rowIndex = this.parentNode.parentNode.parentNode.rowIndex;
  if (confirm("are you sure you want to delete this task?") === true) {
    table.deleteRow(rowIndex);
    totalTasks -= 1;
    document.getElementById("totalTasks").innerHTML = totalTasks;
    allElements = table.innerHTML;
    localStorage.setItem("tableData", allElements);
    localStorage.setItem("totalTasks", totalTasks);
  }
}

function doneUndone() {
  let row = this.parentNode.parentNode.parentNode;
  let doneButton = row.getElementsByClassName("doneButton")[0];
  if (doneButton.innerHTML === "Done") {
    completeTask(this);
  } else {
    undone(this);
  }
}

function completeTask(pressedButton) {
  let row = pressedButton.parentNode.parentNode.parentNode;
  let idCell = row.getElementsByClassName("ID")[0];
  let descCell = row.getElementsByClassName("todo")[0];
  let uesrIDCell = row.getElementsByClassName("userID")[0];
  let statusCell = row.getElementsByClassName("status")[0];
  let doneButton = row.getElementsByClassName("doneButton")[0];
  doneButton.innerHTML = "Undone";
  statusCell.innerHTML = "";
  idCell.style.textDecoration = "line-through";
  descCell.style.textDecoration = "line-through";
  uesrIDCell.style.textDecoration = "line-through";
  statusCell.style.backgroundImage = "url('checkmark.png')";
  allElements = table.innerHTML;
  localStorage.setItem("tableData", allElements);
  localStorage.setItem("totalTasks", totalTasks);
}

function addTask() {
  let taskDescription = document.getElementsByClassName("add-task")[0].value;
  if (taskDescription === "") {
    alert("empty field");
  } else {
    let row, ID, todo, userID, status;
    let actions, actionsDiv, deleteButton, doneButton;
    ID = document.createElement("td");
    ID.innerHTML = nextID;
    ID.className = "ID";
    nextID++;
    todo = document.createElement("td");
    todo.innerHTML = taskDescription;
    todo.className = "todo";
    userID = document.createElement("td");
    userID.innerHTML = 33;
    userID.className = "userID";
    status = document.createElement("td");
    status.className = "status";
    status.innerHTML = "Pending";
    row = document.createElement("tr");
    row.appendChild(ID);
    row.appendChild(todo);
    row.appendChild(userID);
    row.appendChild(status);

    actions = document.createElement("td");
    actionsDiv = document.createElement("div");
    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.className = "deleteButton";
    deleteButton.addEventListener("click", deleteTask);
    doneButton = document.createElement("button");
    doneButton.innerHTML = "Done";
    doneButton.className = "doneButton";
    doneButton.addEventListener("click", doneUndone);

    actionsDiv.appendChild(deleteButton);
    actionsDiv.appendChild(doneButton);

    actionsDiv.className = "actions";

    actions.appendChild(actionsDiv);
    row.appendChild(actions);
    table.appendChild(row);

    totalTasks++;
    document.getElementById("totalTasks").innerHTML = totalTasks;
    allElements = table.innerHTML;
    let snackbar = document.getElementById("snackbar");
    snackbar.style.display = "block";
    setTimeout(() => {
      snackbar.style.display = "none";
    }, 2000);
    localStorage.setItem("tableData", allElements);
    localStorage.setItem("totalTasks", totalTasks);
    localStorage.setItem("nextID", nextID);
  }
}

function searchTask() {
  table.innerHTML = allElements;
  let tasksDescription = document.getElementsByClassName("todo");
  let searchValue = document.getElementsByClassName("search-val")[0].value;
  let tableNewElements = "";
  let elementsCount = 0;
  for (let element of tasksDescription) {
    if (element.innerHTML.includes(searchValue)) {
      elementsCount++;
      let r = element.parentNode.innerHTML;
      console.log(r);
      tableNewElements = tableNewElements + "<tr>" + r + "</tr>";
    }
  }
  document.getElementById("totalTasks").innerHTML = elementsCount;

  table.innerHTML =
    "<tr class='header'><td>ID</td><td>TODO Description</td><td>User ID</td><td>Status</td><td>Actions</td></tr>";

  table.innerHTML = table.innerHTML + tableNewElements;

  paging();
  if (tableNewElements === "") {
    return;
  }
  dividePages(1);
}

function undone(pressedButton) {
  let row = pressedButton.parentNode.parentNode.parentNode;
  let idCell = row.getElementsByClassName("ID")[0];
  let descCell = row.getElementsByClassName("todo")[0];
  let uesrIDCell = row.getElementsByClassName("userID")[0];
  let statusCell = row.getElementsByClassName("status")[0];
  let doneButton = row.getElementsByClassName("doneButton")[0];
  doneButton.innerHTML = "Done";
  statusCell.innerHTML = "Pending";
  idCell.style.textDecoration = "none";
  descCell.style.textDecoration = "none";
  uesrIDCell.style.textDecoration = "none";
  statusCell.style.backgroundImage = "";
  allElements = table.innerHTML;
  localStorage.setItem("tableData", allElements);
  localStorage.setItem("totalTasks", totalTasks);
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
    i < (pagesLoopsCounter + 1) * pagesPerContainer + 1;
    i++
  ) {
    pages[i].style.display = "block";
  }
  pagesLoopsCounter++;
}

function prevPages() {
  if (pagesLoopsCounter === 0) {
    return;
  }

  for (
    let i = (pagesLoopsCounter - 1) * pagesPerContainer + 1;
    i < pagesLoopsCounter * pagesPerContainer + 1;
    i++
  ) {
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
