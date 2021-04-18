const NO_RESULTS_MSG = "Aucun livre n'a été trouvé.";
const EMPTY_FIELDS_MSG = "Merci de remplir au moins un des champs proposés.";

class Book {
  constructor(title, id, author, description, image) {
    this.title = title;
    this.id = id;
    this.author = author;
    this.description = description;
    this.image = image;
  }
  createBookPresentation(parentElt) {
    let section, bookInfo, imgWrapper, bookInfoChildren, icon, titleElt, idElt, authorElt, descriptionElt, imageElt;
    section = document.createElement("section");
    section.classList.add("result");
    // section.id = "res-content";
    bookInfo = document.createElement("div");
    bookInfo.classList.add("result__info");
    imgWrapper = document.createElement("div");
    imgWrapper.classList.add("result__img");
    icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-bookmark");
    titleElt = document.createElement("h3");
    titleElt.classList.add("result__info--title");
    idElt = document.createElement("h3");
    authorElt = document.createElement("p");
    descriptionElt = document.createElement("p");
    imageElt = document.createElement("img");
    imageElt.src = this.image;
    titleElt.innerHTML = "Titre : " + this.title;
    idElt.innerHTML = "Id : " + this.id;
    authorElt.innerHTML = "Auteur : " + this.author;
    descriptionElt.innerHTML = "Description : " + this.description;
    bookInfoChildren = [icon, titleElt, idElt, authorElt, descriptionElt];
    for (let child of bookInfoChildren) {
      bookInfo.appendChild(child);
    }
    imgWrapper.appendChild(imageElt);
    section.appendChild(bookInfo);
    section.appendChild(imgWrapper);
    parentElt.appendChild(section);
  }
}

function insertElement(elt) {
  const PARENT_DIV = document.getElementById("myBooks");
  const TARGET = document.getElementsByTagName("hr")[0];
  PARENT_DIV.insertBefore(elt, TARGET);
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
  labelTitle.setAttribute("for", "intitle");
  labelTitle.appendChild(labelTitleTxt);

  let title = document.createElement("input");
  title.setAttribute("type", "text");
  title.setAttribute("name", "intitle");
  title.setAttribute("id", "book-title");

  let labelAuthor = document.createElement("label");
  let labelAuthorTxt = document.createTextNode("Auteur");
  labelAuthor.setAttribute("for", "inauthor");
  labelAuthor.appendChild(labelAuthorTxt);

  let author = document.createElement("input");
  author.setAttribute("type", "text");
  author.setAttribute("name", "inauthor");
  author.setAttribute("id", "author");

  let message = createWarningMessage("empty-fields-msg", EMPTY_FIELDS_MSG);

  let searchBtn = document.createElement("button");
  searchBtn.innerHTML = "Rechercher";
  searchBtn.classList.add("btn");
  searchBtn.setAttribute("id", "search-btn");
  searchBtn.onclick = searchBook;

  let dropBtn = document.createElement("button");
  dropBtn.innerHTML = "Annuler";
  dropBtn.classList.add("btn", "btn--cancel");
  dropBtn.setAttribute("id", "cancel-btn");

  form.appendChild(createField(labelTitle, title));
  form.appendChild(createField(labelAuthor, author));
  form.appendChild(message);
  form.appendChild(searchBtn);
  form.appendChild(dropBtn);
  insertElement(form);
  form.style.display = "none";
}

function displayForm() {
  const btn = document.getElementById("addBook");
  const form = document.getElementsByClassName("form")[0];
  const title = document.getElementById("book-title");
  if (btn !== null && form !== null) {
    btn.style.display = "none";
    form.style.display = "block";
    title.focus();
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

function createWarningMessage(msgId, msg) {
  let message = document.createElement("div");
  message.id = msgId;
  message.classList.add("warning-msg");
  message.innerHTML = msg;
  message.style.display = "none";
  return message;
}

function createResultsPlaceholder() {
  let resultsContainer = document.createElement("div");
  resultsContainer.id = "res-output";
  resultsContainer.classList.add("res-container");
  resultsContainer.style.display = "none";
  let resultsLine = document.createElement("hr");
  let resultsTitle = document.createElement("h2");
  resultsTitle.classList.add("h2--results");
  resultsTitle.innerHTML = "Résultats de recherche";
  let warningMsg = createWarningMessage("no-results-msg", NO_RESULTS_MSG);
  let resultsGrid = document.createElement("div");
  resultsGrid.classList.add("res-grid");
  resultsGrid.id = "list-grid";
  resultsContainer.appendChild(resultsLine);
  resultsContainer.appendChild(resultsTitle);
  resultsContainer.appendChild(warningMsg);
  resultsContainer.appendChild(resultsGrid);
  insertElement(resultsContainer);
}

function createPochlistPlacefolder() {
  let pochlistContainer = document.getElementById("content");
  let pochlistGrid = document.createElement("div");
  pochlistGrid.classList.add("res-grid");
  pochlistGrid.id = "pochlist-grid";
  pochlistContainer.appendChild(pochlistGrid);
}

function onload() {
  createForm();
  addButton();
  createResultsPlaceholder();
}

window.addEventListener("load", onload);

function setBookURL() {
  let bookURL = "https://www.googleapis.com/books/v1/volumes?q="
  let message = document.getElementById("empty-fields-msg");
  if(message.style.display === "block"){
    message.style.display = "none";
  }
  const form = document.forms[0];
  const formData = new FormData(form);
  const urlParams = new URLSearchParams(formData);
  let queryString = urlParams.toString();
  const intitle = urlParams.get("intitle");
  const inauthor = urlParams.get("inauthor");
  if (intitle === "" && inauthor === "") {
    message.style.display = "block";
    document.getElementById("book-title").focus();
    return null;
  }
  if (intitle === "") {
    queryString = queryString.replace("intitle=&inauthor", "inauthor");
  }
  if (inauthor === "") {
    queryString = queryString.replace("&inauthor=", "");
  }
  queryString = queryString.replace("&", "+");
  queryString = queryString.replace(/=/g, ":");
  bookURL += queryString;
  return bookURL
}

function displayResults(data, list) {
  let book, item, title, id, author, description, image;
  for (item of data.items) {
    id = null;
    title = item.volumeInfo.title;
    if (item.volumeInfo.industryIdentifiers) {
      for (let i = 0; i < item.volumeInfo.industryIdentifiers.length; i++) {
        if (item.volumeInfo.industryIdentifiers[i].type == "ISBN_13") {
          id = item.volumeInfo.industryIdentifiers[i].identifier;
        }
      }
      if (!id) {
        id = item.volumeInfo.industryIdentifiers[0].identifier;
      }
    } else {
      id = "Information manquante";
    }
    author = item.volumeInfo.authors ? item.volumeInfo.authors[0] : "Information manquante";
    if (item.volumeInfo.description) {
      description = item.volumeInfo.description;
      if (description.length > 200) {
        description = description.slice(0, 200);
        description = description.substring(0, description.lastIndexOf(" "));
        if (!description.endsWith(".")) {
          description += "...";
        }
      }
    } else {
      description = "Information manquante";
    }
    image = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : "images/unavailable.png";
    book = new Book(title, id, author, description, image);
    book.createBookPresentation(list);
  }
}

function searchBook(event) {
  let resultsPlaceholder = document.getElementById("res-output");
  let listOutput = document.getElementById("list-grid");
  let message = document.getElementById("no-results-msg");
  let url = setBookURL();
  event.preventDefault();
  while(listOutput.childNodes.length > 0){
    cleanOutputList(listOutput);
  }
  if(url){
  fetch(url, {
      method: "get"
    })
    .then(response => response.json())
    .then(jsonData => {
      if (jsonData.totalItems === 0) {
        resultsPlaceholder.style.display = "block";
        message.style.display = "block";
        return false;
      } else {
        displayResults(jsonData, listOutput);
        message.style.display = "none";
        resultsPlaceholder.style.display = "block";
        return true;
      }
    })
    .catch(err => {
        console.error('Erreur :', err); return false;
    })

  }
}

function cleanOutputList(parentElt){
  for (let i = 0; i < parentElt.childNodes.length; i++) {
    parentElt.removeChild(parentElt.childNodes[i]);
  }
}
