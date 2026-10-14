let shoppingItems = JSON.parse(localStorage.getItem("shoppingItems")) || [];
let selectedItem = null;

const form = document.getElementById("shopping-form");
const nameInput = document.getElementById("item-name");
const priceInput = document.getElementById("item-price");
const list = document.getElementById("shopping-list");
const total = document.getElementById("total");
const message = document.getElementById("message");

function displayItems() {
  list.innerHTML = "";
  let totalCost = 0;

  shoppingItems.forEach(function(item, index) {
    const li = document.createElement("li");
    li.dataset.index = index;

    if (item.purchased) li.classList.add("purchased");
    if (selectedItem === index) li.classList.add("selected");

    li.innerHTML = `
      <span class="item-name"></span>
      <span>KSh ${item.price.toFixed(2)}</span>
      <button data-action="edit">Edit</button>
      <button data-action="purchase">
        ${item.purchased ? "Undo" : "Mark Purchased"}
      </button>
      <button data-action="delete">Delete</button>
    `;

    li.querySelector(".item-name").textContent = item.name;
    list.appendChild(li);

    if (item.purchased) totalCost += item.price;
  });

  total.textContent = totalCost.toFixed(2);

  document.getElementById("item-count").textContent =
    shoppingItems.length +
    (shoppingItems.length === 1 ? " item" : " items");

  document.getElementById("empty-message").style.display =
    shoppingItems.length === 0 ? "block" : "none";

  document.getElementById("selected-item").textContent =
    selectedItem !== null && shoppingItems[selectedItem]
      ? "Selected item: " + shoppingItems[selectedItem].name
      : "Selected item: None";

  localStorage.setItem("shoppingItems", JSON.stringify(shoppingItems));
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const price = Number(priceInput.value);

  if (!name || priceInput.value === "" ||
      !Number.isFinite(price) || price <= 0) {
    message.textContent = "Enter a valid item name and price.";
    return;
  }

  shoppingItems.push({
    name: name,
    price: price,
    purchased: false
  });

  form.reset();
  message.textContent = "Item added successfully!";
  displayItems();
});

list.addEventListener("click", function(event) {
  const li = event.target.closest("li");
  if (!li) return;

  const index = Number(li.dataset.index);
  const item = shoppingItems[index];
  if (!item) return;

  selectedItem = index;
  const action = event.target.dataset.action;

  if (action === "purchase") {
    item.purchased = !item.purchased;
    message.textContent = "Item status updated!";
  } else if (action === "edit") {
    const name = prompt("Enter item name:", item.name);
    if (name === null) return;

    const price = prompt("Enter item price:", item.price);
    if (price === null) return;

    if (!name.trim() || !Number.isFinite(Number(price)) ||
        Number(price) <= 0) {
      message.textContent = "Enter a valid name and price.";
      return;
    }

    item.name = name.trim();
    item.price = Number(price);
    message.textContent = "Item updated successfully!";
  } else if (action === "delete") {
    shoppingItems.splice(index, 1);
    selectedItem = null;
    message.textContent = "Item deleted.";
  }

  displayItems();
});

document.getElementById("mark-button").addEventListener("click", function() {
  if (selectedItem === null || !shoppingItems[selectedItem]) {
    message.textContent = "Select an item first.";
    return;
  }

  shoppingItems[selectedItem].purchased =
    !shoppingItems[selectedItem].purchased;

  displayItems();
});

document.getElementById("clear-button").addEventListener("click", function() {
  if (!confirm("Are you sure you want to clear the shopping list?")) return;

  shoppingItems = [];
  selectedItem = null;
  message.textContent = "Shopping list cleared.";
  displayItems();
});

displayItems();