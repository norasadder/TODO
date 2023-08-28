let totalTasks = 0;
let allElements;
let nextID;
// getAPI();

async function getAPI() {
  let response = await fetch("https://dummyjson.com/todos");
  let result = await response.json();

  let todoArr = result.todos;

  let table, row, ID, todo, userID, status;
  let actions, actionsDiv, deleteButton, doneButton;
  table = document.getElementById("TODO-List");

  for (let TODOelement of todoArr) {
    ID = document.createElement("td");
    ID.innerHTML = TODOelement["id"];

    todo = document.createElement("td");
    todo.innerHTML = TODOelement["todo"];
    todo.className = "todo";

    userID = document.createElement("td");
    userID.innerHTML = TODOelement["userId"];

    status = document.createElement("td");
    status.className = "status";

    if (TODOelement["completed"] == true) {
      status.innerHTML = "";
      status.style.backgroundImage = "url('checkmark.png')";
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
    doneButton.innerHTML = "Done";
    doneButton.className = "doneButton";
    doneButton.addEventListener("click", completeTask);

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
}

function getTableData() {
  let table = document.getElementById("TODO-List");
  allElements = localStorage.getItem("tableData");
  totalTasks = localStorage.getItem("totalTasks");
  nextID = localStorage.getItem("nextID");
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
}

function deleteTask() {
  let rowIndex = this.parentNode.parentNode.parentNode.rowIndex;
  let table = document.getElementById("TODO-List");
  if (confirm("are you sure you want to delete this task?") === true) {
    table.deleteRow(rowIndex);
    totalTasks -= 1;
    document.getElementById("totalTasks").innerHTML = totalTasks;
    allElements = table.innerHTML;
    localStorage.setItem("tableData", allElements);
    localStorage.setItem("totalTasks", totalTasks);
  }
}

function completeTask() {
  let table = document.getElementById("TODO-List");
  let row = this.parentNode.parentNode.parentNode;
  let statusCell = row.getElementsByClassName("status")[0];
  statusCell.innerHTML = "";
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
    let table, row, ID, todo, userID, status;
    let actions, actionsDiv, deleteButton, doneButton;
    table = document.getElementById("TODO-List");
    ID = document.createElement("td");
    ID.innerHTML = nextID;
    nextID++;
    // alert(typeof nextID);
    todo = document.createElement("td");
    todo.innerHTML = taskDescription;
    todo.className = "todo";
    userID = document.createElement("td");
    userID.innerHTML = 33;
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
    doneButton.addEventListener("click", completeTask);

    actionsDiv.appendChild(deleteButton);
    actionsDiv.appendChild(doneButton);

    actionsDiv.className = "actions";

    actions.appendChild(actionsDiv);
    row.appendChild(actions);
    table.appendChild(row);

    totalTasks++;
    document.getElementById("totalTasks").innerHTML = totalTasks;
    allElements = table.innerHTML;
    localStorage.setItem("tableData", allElements);
    localStorage.setItem("totalTasks", totalTasks);
    localStorage.setItem("nextID", nextID);
  }
}

function searchTask() {
  let table = document.getElementById("TODO-List");
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
}
