import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update,
  child,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-4b473-default-rtdb.asia-southeast1.firebasedatabase.app/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB = ref(database, "Menu/Food");

let field = document.getElementById("foodName");
let btn = document.getElementById("btn");
let list = document.getElementById("myList");
onValue(itemsInDB, function (snapshot) {
  if (snapshot.exists()) {
    console.log(Object.values(snapshot.val()));
    list.innerHTML = "";
    let itemsArray = Object.entries(snapshot.val());
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      appendToView(currentItem);
    }
  } else {
    list.innerHTML = "<h3>No items yet..</h3>";
  }
});

btn.addEventListener("click", function () {
  let Rorname = field.value;
  let dbror = ref(database, `Menu/Food/${Rorname}`);
  update(dbror, { qty: 0 });
  clear();
});

function clear() {
  field.value = "";
}
function appendToView(item) {
  let itemID = item[0];
  let itemValue = item[1].qty;
  //   list.innerHTML += `<div class="btn btn-dark text-white w-75 d-flex flex-column">
  //   <div>
  //     ${itemID} -
  //     <span class="fst-italic text-decoration-underline">${itemValue}</span>
  //   </div>
  //   <input type="number" name="" id="" class="text-center mb-2" />
  //   <div class="d-flex justify-content-between">
  //     <button class="btn btn-primary p-1">Subtract</button>
  //     <button class="btn btn-primary p-1">Add</button>
  //     <button class="btn btn-primary p-1">Transfer</button>
  //   </div>
  // </div>`;
  let newEl = document.createElement("div");
  newEl.classList.add(
    "btn",
    "btn-dark",
    "text-white",
    "w-75",
    "d-flex",
    "flex-column"
  );
  let content = document.createElement("div");
  content.textContent = `${itemID} -`;
  let contentSpan = document.createElement("span");
  contentSpan.classList.add("fst-italic", "text-decoration-underline");
  contentSpan.textContent = `${itemValue}`;
  content.append(contentSpan);
  newEl.append(content);
  let inp = document.createElement("INPUT");
  inp.setAttribute("type", "number");
  inp.setAttribute("id", `${itemID}Inp`);

  inp.classList.add("text-center", "mb-2");
  newEl.append(inp);
  let btnDiv = document.createElement("div");
  btnDiv.classList.add("d-flex", "justify-content-between");
  let subBtn = document.createElement("button");
  subBtn.classList.add("btn", "btn-danger", "p-1");
  subBtn.textContent = "Subtract";
  subBtn.addEventListener("click", function () {
    let inp = parseInt(document.getElementById(`${itemID}Inp`).value);
    let ans = confirm(
      `Are you sure you want to subtract ${inp} from ${itemID}?`
    );
    if (ans == true) {
      let loc = ref(database, `Menu/Food/${itemID}`);
      let newQty = parseInt(itemValue - inp);
      if (newQty < 0) {
        alert("You cannot have a negative stock!");
        document.getElementById(`${itemID}Inp`).value = null;
      } else {
        update(loc, { qty: newQty });
      }
    }
  });
  btnDiv.append(subBtn);
  let addBtn = document.createElement("button");
  addBtn.classList.add("btn", "btn-primary", "p-1");
  addBtn.textContent = "Add";
  addBtn.addEventListener("click", function () {
    let inp = document.getElementById(`${itemID}Inp`).value;
    let ans = confirm(`Are you sure you want to add ${inp} to ${itemID}?`);
    if (ans == true) {
      let loc = ref(database, `Menu/Food/${itemID}`);
      console.log(itemValue);
      let newQty = Number(itemValue) + Number(inp);
      update(loc, { qty: Number(newQty) });
    }
  });
  btnDiv.append(addBtn);
  newEl.append(btnDiv);
  list.append(newEl);
  // let transferBtn = document.createElement("button");
  // transferBtn.classList.add("btn", "btn-primary", "p-1");
  // transferBtn.textContent = "Transfer";
  // transferBtn.addEventListener("click", function () {
  //   let inp = document.getElementById(`${itemID}Inp`).value;
  //   let ans = confirm(
  //     `Are you sure you want to transfer ${inp} ${itemID} to the other branch?`
  //   );
  //   if (ans == true) {
  //     let loc = ref(database, `Menu2/Food/${itemID}`);
  //     let newQty = itemValue + inp;
  //     update(loc, { qty: newQty });
  //   }
  // });
  // btnDiv.append(transferBtn);

  // newEl.addEventListener("dblclick", function () {
  //   let ans = confirm("Are you sure you want to delete this item?");
  //   if (ans == true) {
  //     let exactLocInDb = ref(database, `Menu/Food/${itemID}`);
  //     remove(exactLocInDb);
  //     alert(`Successfully Removed '${itemID}' from the database`);
  //   }
  // });
  // let UpBtn = document.createElement("button");
  // UpBtn.textContent = "+";
  // UpBtn.classList.add("btn", "btn-primary", "mx-1");
  // UpBtn.addEventListener("click", function () {
  //   let loc = ref(database, `Menu/Food/${itemID}`);
  //   let newQty = itemValue + 1;
  //   update(loc, { qty: newQty });
  // });
  // let DwnBtn = document.createElement("button");
  // DwnBtn.textContent = "-";
  // DwnBtn.classList.add("btn", "btn-primary", "mx-1");
  // DwnBtn.addEventListener("click", function () {
  //   let loc = ref(database, `Menu/Food/${itemID}`);
  //   let newQty = itemValue - 1;
  //   update(loc, { qty: newQty });
  // });

  // newEl.append(DwnBtn);
  // newEl.append(UpBtn);
  // list.append(newEl);
}
