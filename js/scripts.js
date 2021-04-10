const parentDiv = document.getElementById("myBooks");

function insertElement(elt) {
  const target = document.getElementsByTagName("hr")[0];
  parentDiv.insertBefore(elt, target);
}

function createField(label, input) {
  let field = document.createElement("div");
  field.classList.add("form__field");
  field.appendChild(label);
  field.appendChild(input);
  return field;
}

function createForm() {
  let form = document.createElement("form");
  form.classList.add("form");

  let labelTitle = document.createElement("label");
  let labelTitleTxt = document.createTextNode("Titre du livre");
  labelTitle.setAttribute("for", "book-title");
  labelTitle.appendChild(labelTitleTxt);

  let title = document.createElement("input");
  title.setAttribute("type", "text");
  title.setAttribute("name", "book-title");
  title.setAttribute("id", "book-title");

  let labelAuthor = document.createElement("label");
  let labelAuthorTxt = document.createTextNode("Auteur");
  labelAuthor.setAttribute("for", "author");
  labelAuthor.appendChild(labelAuthorTxt);

  let author = document.createElement("input");
  author.setAttribute("type", "text");
  author.setAttribute("name", "author");
  author.setAttribute("id", "author");

  let searchBtn = document.createElement("button");
  searchBtn.innerHTML = "Rechercher";
  searchBtn.classList.add("btn");

  let dropBtn = document.createElement("button");
  dropBtn.innerHTML = "Annuler";
  dropBtn.classList.add("btn", "btn--cancel");

  form.appendChild(createField(labelTitle, title));
  form.appendChild(createField(labelAuthor, author));
  form.appendChild(searchBtn);
  form.appendChild(dropBtn);
  insertElement(form);
  form.style.display = "none";
}

function displayForm() {
  const btn = document.getElementById("addBook");
  const form = document.getElementsByClassName("form")[0];
  if (btn !== null && form !== null) {
    btn.style.display = "none";
    form.style.display = "block";
    document.getElementById("book-title").focus();
  }
}

function addButton() {
  // Creates a new button element
  let addBookBtn = document.createElement("button");
  addBookBtn.innerHTML = "Ajouter un livre";
  addBookBtn.classList.add("btn", "btn--center");
  addBookBtn.id = "addBook";
  insertElement(addBookBtn);
  addBookBtn.onclick = displayForm;
}

function onload() {
  createForm();
  addButton();
}

window.addEventListener("load", onload);
