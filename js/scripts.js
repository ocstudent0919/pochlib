const NO_RESULTS_MSG = "Aucun livre n'a été trouvé.";
const EMPTY_FIELDS_MSG = "Merci de remplir au moins un des champs proposés.";
const NO_INFO = "Information manquante";
const AVOID_DUPLICATES_MSG = "Vous ne pouvez ajouter deux fois le même livre !";

class Book {
  constructor(title, idISBN, idItem, author, description, image) {
    this.title = title;
    this.idISBN = idISBN;
    this.idItem = idItem;
    this.author = author;
    this.description = description;
    this.image = image;
  }

  createBookPresentation(parentElt) {
    const section = document.createElement("section");
    section.classList.add("result");
    const bookInfo = document.createElement("div");
    bookInfo.classList.add("result__info");
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("result__img");
    const iconBkmrk = document.createElement("i");
    iconBkmrk.classList.add("fas");
    iconBkmrk.classList.add("fa-bookmark");
    const iconTrash = document.createElement("i");
    iconTrash.classList.add("fas");
    iconTrash.classList.add("fa-trash");
    iconTrash.style.display = "none";
    const titleElt = document.createElement("h3");
    titleElt.classList.add("result__info--title");
    const idElt = document.createElement("h3");
    const idHiddenElt = document.createElement("div");
    idHiddenElt.style.display = "none";
    const authorElt = document.createElement("p");
    const descriptionElt = document.createElement("p");
    const imageElt = document.createElement("img");
    imageElt.src = this.image;
    titleElt.innerHTML = "Titre : " + this.title;
    idElt.innerHTML = "Id : " + this.idISBN;
    idHiddenElt.innerHTML = this.idItem;
    authorElt.innerHTML = "Auteur : " + this.author;
    descriptionElt.innerHTML = "Description : " + this.description;
    const bookInfoChildren = [iconBkmrk, iconTrash, titleElt, idElt, idHiddenElt, authorElt, descriptionElt];
    for (const child of bookInfoChildren) {
      bookInfo.appendChild(child);
    }
    imgWrapper.appendChild(imageElt);
    section.appendChild(bookInfo);
    section.appendChild(imgWrapper);
    parentElt.appendChild(section);
  }
}

function insertElement(elt) {
  const parentDiv = document.getElementById("myBooks");
  const target = document.getElementsByTagName("hr")[0];
  parentDiv.insertBefore(elt, target);
}

function createField(label, input) {
  const field = document.createElement("div");
  field.classList.add("form__field");
  field.appendChild(label);
  field.appendChild(input);
  return field;
}

function createForm() {
  const form = document.createElement("form");
  form.classList.add("form");

  const labelTitle = document.createElement("label");
  const labelTitleTxt = document.createTextNode("Titre du livre");
  labelTitle.setAttribute("for", "intitle");
  labelTitle.appendChild(labelTitleTxt);

  const title = document.createElement("input");
  title.setAttribute("type", "text");
  title.setAttribute("name", "intitle");
  title.setAttribute("id", "book-title");

  const labelAuthor = document.createElement("label");
  const labelAuthorTxt = document.createTextNode("Auteur");
  labelAuthor.setAttribute("for", "inauthor");
  labelAuthor.appendChild(labelAuthorTxt);

  const author = document.createElement("input");
  author.setAttribute("type", "text");
  author.setAttribute("name", "inauthor");
  author.setAttribute("id", "author");

  const message = createWarningMessage("empty-fields-msg", EMPTY_FIELDS_MSG);

  const searchBtn = document.createElement("button");
  searchBtn.innerHTML = "Rechercher";
  searchBtn.classList.add("btn");
  searchBtn.onclick = (event) => {
    event.preventDefault();
    searchBook();
    title.value = "";
    title.focus();
    author.value = "";
  };

  const dropBtn = document.createElement("button");
  dropBtn.innerHTML = "Annuler";
  dropBtn.classList.add("btn", "btn--cancel");
  dropBtn.onclick = (event) => {
    event.preventDefault();
    cancelSearch(form);
    message.style.display = "none";
  };

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
  const addBookBtn = document.createElement("button");
  addBookBtn.innerHTML = "Ajouter un livre";
  addBookBtn.classList.add("btn", "btn--center");
  addBookBtn.id = "addBook";
  insertElement(addBookBtn);
  addBookBtn.onclick = displayForm;
}

function createWarningMessage(msgId, msg) {
  const message = document.createElement("div");
  message.id = msgId;
  message.classList.add("warning-msg");
  message.innerHTML = msg;
  message.style.display = "none";
  return message;
}

function createResultsContainer() {
  const resultsContainer = document.createElement("div");
  resultsContainer.id = "res-output";
  resultsContainer.classList.add("res-container");
  resultsContainer.style.display = "none";
  const resultsLine = document.createElement("hr");
  const resultsTitle = document.createElement("h2");
  resultsTitle.innerHTML = "Résultats de recherche";
  const warningMsg = createWarningMessage("no-results-msg", NO_RESULTS_MSG);
  const resultsGrid = document.createElement("div");
  resultsGrid.classList.add("res-grid");
  resultsGrid.id = "list-grid";
  resultsContainer.appendChild(resultsLine);
  resultsContainer.appendChild(resultsTitle);
  resultsContainer.appendChild(warningMsg);
  resultsContainer.appendChild(resultsGrid);
  insertElement(resultsContainer);
}

function createPochlistContainer() {
  const pochlistContainer = document.getElementById("content");
  const pochlistGrid = document.createElement("div");
  pochlistGrid.classList.add("res-grid");
  pochlistGrid.id = "pochlist-grid";
  pochlistContainer.appendChild(pochlistGrid);
}

function onload() {
  createForm();
  addButton();
  createResultsContainer();
  createPochlistContainer();
  displayPochlist();
}

window.addEventListener("load", onload);

function setBookURL() {
  let bookURL = "https://www.googleapis.com/books/v1/volumes?q=";
  const resultsContainer = document.getElementById("res-output");
  const message = document.getElementById("empty-fields-msg");
  if (message.style.display === "block") {
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
    resultsContainer.style.display = "none";
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

function toggleIcons() {
  const icons = document.querySelectorAll("#pochlist-grid i");
  for (const icon of icons) {
    if (icon.className === "fas fa-bookmark" && icon.style.display !== "none") {
      icon.style.display = "none";
    }
    if (icon.className === "fas fa-trash" && icon.style.display === "none") {
      icon.style.display = "block";
    }
  }
}

function addIconBookmarkAction(books) {
  for (let i = 0; i < books.length; i++) {
    const iconBkmrk = document.getElementsByClassName("fa-bookmark")[i];
    iconBkmrk.onclick = () => {
      saveBook(books[i], books[i].idItem);
    };
  }
}

function addIconTrashAction(idItem, parentElt) {
  const section = parentElt.lastChild;
  const iconTrash = section.getElementsByTagName("i")[1];
  iconTrash.addEventListener("click", () => {
    removeBook(idItem);
  });
}

function isInSession(idItem) {
  if (sessionStorage.getItem(idItem) !== null) {
    alert(AVOID_DUPLICATES_MSG);
    return true;
  }
  return false;
}

function saveBook(book, idItem) {
  const parentDiv = document.getElementById("pochlist-grid");
  if (!isInSession(idItem)) {
    sessionStorage.setItem(book.idItem, JSON.stringify(book));
    book.createBookPresentation(parentDiv);
    toggleIcons();
    addIconTrashAction(idItem, parentDiv);
  }
}

function removeBook(idItem) {
  const targetElt = document.querySelectorAll("#pochlist-grid > section");
  targetElt.forEach((elt) => {
    const targetId = elt.querySelector(".result__info > div");
    if (targetId.innerHTML === idItem) {
      elt.parentNode.removeChild(elt);
      sessionStorage.removeItem(idItem);
    }
  });
}

function displayResults(data, list) {
  let item, title, id, idHidden, author, description, image;
  let books = [];
  let index = 0;
  for (item of data.items) {
    id = null;
    title = item.volumeInfo.title;
    idHidden = item.id;
    if (item.volumeInfo.industryIdentifiers) {
      for (let i = 0; i < item.volumeInfo.industryIdentifiers.length; i++) {
        if (item.volumeInfo.industryIdentifiers[i].type === "ISBN_13") {
          id = item.volumeInfo.industryIdentifiers[i].identifier;
        }
      }
      if (!id) {
        id = item.volumeInfo.industryIdentifiers[0].identifier;
      }
    } else {
      id = NO_INFO;
    }
    author = item.volumeInfo.authors ? item.volumeInfo.authors[0] : NO_INFO;
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
      description = NO_INFO;
    }
    image = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : "images/unavailable.png";
    books[index] = new Book(title, id, idHidden, author, description, image);
    books[index].createBookPresentation(list);
    index++;
  }
  addIconBookmarkAction(books);
}

function displayPochlist() {
  const parentDiv = document.getElementById("pochlist-grid");
  const keys = Object.keys(sessionStorage);
  for (const key of keys) {
    const sessionObject = JSON.parse(sessionStorage.getItem(key));
    const book = new Book(sessionObject.title, sessionObject.idISBN, sessionObject.idItem, sessionObject.author, sessionObject.description, sessionObject.image);
    book.createBookPresentation(parentDiv);
    addIconTrashAction(sessionObject.idItem, parentDiv);
  }
  toggleIcons();
}

function searchBook() {
  const resultsContainer = document.getElementById("res-output");
  const listOutput = document.getElementById("list-grid");
  const message = document.getElementById("no-results-msg");
  const url = setBookURL();
  while (listOutput.childNodes.length > 0) {
    cleanOutputList(listOutput);
  }
  if (url) {
    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.send();
    request.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let jsonData = JSON.parse(this.responseText);
        if (jsonData.totalItems === 0) {
          resultsContainer.style.display = "block";
          message.style.display = "block";
        } else {
          displayResults(jsonData, listOutput);
          message.style.display = "none";
          resultsContainer.style.display = "block";
        }
      } else if (this.status !== 200) {
        console.error("Network request failed. Returned status of " + this.status);
      }
    }
  }
}

function cleanOutputList(parentElt) {
  while (parentElt.lastChild) {
    parentElt.removeChild(parentElt.lastChild);
  }
}

function cancelSearch(form) {
  const parentElt = document.getElementById("list-grid");
  const btn = document.getElementById("addBook");
  const resContainer = document.getElementById("res-output");
  const inputs = form.querySelectorAll("input");
  if (parentElt) {
    cleanOutputList(parentElt);
  }
  form.style.display = "none";
  btn.style.display = "block";
  resContainer.style.display = "none";
  for (const input of inputs) {
    if (input) {
      input.value = "";
    }
  }
}
