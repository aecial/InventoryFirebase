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
  update(dbror, { price: 0, qty: 0 });
  clear();
});

function clear() {
  field.value = "";
}
function appendToView(item) {
  let itemID = item[0];
  let itemValue = item[1].qty;
  let newEl = document.createElement("li");
  newEl.textContent = `${itemID} - ${itemValue}`;
  newEl.classList.add("btn", "btn-dark", "text-white");
  // newEl.addEventListener("dblclick", function () {
  //   let ans = confirm("Are you sure you want to delete this item?");
  //   if (ans == true) {
  //     let exactLocInDb = ref(database, `Menu/Food/${itemID}`);
  //     remove(exactLocInDb);
  //     alert(`Successfully Removed '${itemID}' from the database`);
  //   }
  // });
  let UpBtn = document.createElement("button");
  UpBtn.textContent = "+";
  UpBtn.classList.add("btn", "btn-primary", "mx-1");
  UpBtn.addEventListener("click", function () {
    let loc = ref(database, `Menu/Food/${itemID}`);
    let newQty = itemValue + 1;
    update(loc, { qty: newQty });
  });
  let DwnBtn = document.createElement("button");
  DwnBtn.textContent = "-";
  DwnBtn.classList.add("btn", "btn-primary", "mx-1");
  DwnBtn.addEventListener("click", function () {
    let loc = ref(database, `Menu/Food/${itemID}`);
    let newQty = itemValue - 1;
    update(loc, { qty: newQty });
  });

  newEl.append(DwnBtn);
  newEl.append(UpBtn);
  list.append(newEl);
}
