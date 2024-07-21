const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemFilter = document.getElementById('filter');
const btnClear = document.getElementById('clear');
const btnSubmit = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const items = getItemsFromStorage();
  items.forEach((item) => addItemToDom(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  if (newItem === '') {
    alert('Please add an item');
    return;
  }
  if(isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  }

  addItemToDom(newItem);
  addItemToStorage(newItem);
  checkUI();
  itemInput.value = '';
}

function addItemToDom(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  li.appendChild(createButton('remove-item btn-link text-red'));

  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  button.appendChild(createIcon('fa-solid fa-xmark'));
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList.querySelectorAll('li').forEach(li => li.classList.remove('edit-mode'));
  item.classList.add("edit-mode");
  btnSubmit.innerHTML = '<i class = "fa-solid fa-pen"/>&nbsp;&nbsp;Изменить элемент';
  btnSubmit.style.backgroundColor = '#228b22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  item.remove();
  removeItemFromStorage(item.textContent);
  checkUI();
}

function removeItemFromStorage(item) {
  const items = getItemsFromStorage().filter((el) => el !== item);
  localStorage.setItem('items', JSON.stringify(items));
}

function removeAllItems(e) {
  while ((el = itemList.firstChild)) {
    itemList.removeChild(el);
  }
  localStorage.removeItem('items');
  checkUI();
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    item.style.display = itemName.indexOf(text) !== -1 ? 'flex' : 'none';
  });
}

function addItemToStorage(item) {
  const items = getItemsFromStorage();

  items.push(item);
  localStorage.setItem('items', JSON.stringify(items));
}

function getItemsFromStorage() {
  const itemsFromStorage = localStorage.getItem('items');
  return itemsFromStorage === null ? [] : JSON.parse(itemsFromStorage);
}

function checkUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    itemFilter.style.display = 'none';
    btnClear.style.display = 'none';
  } else {
    itemFilter.style.display = 'block';
    btnClear.style.display = 'block';
  }

  isEditMode = false;
  btnSubmit.innerHTML = '<i class = "fa-solid fa-plus"/>Добавить элемент';
  btnSubmit.style.backgroundColor = '#333';
}

function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  btnClear.addEventListener('click', removeAllItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
}

init();
