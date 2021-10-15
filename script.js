
//////////// class definitions //////////
class Book {

    constructor(title, author, numPages, read) {
        this.title = title;
        this.author = author;
        this.numPages = numPages;
        this.read = read;

        this.info = function () {
            const infoString = `${this.title} by ${this.author}, ${this.numPages}, not read yet`;
            return infoString;
        };
        this.changeReadStatus = function() {
            this.read = !this.read;
        };
    }

};
///////////////////////////////////////

//////// global variables////////

let myLibrary = [];

const bookContainer = document.getElementById("books-container");
const formDiv = document.getElementById("popupForm");
const realForm = document.querySelector("form");
const mainContainer = document.querySelector(".main-container");

const requiredMessages = document.querySelectorAll(".err-msg");
const requiredMessageRadio = document.querySelector(".err-msg-radio");

if (storageAvailable('localStorage')) {

    // populate and display previously stored library
    populateLibraryFromLocalStorage();
    displayBooks();

}

////////////////////////////////

// function declarations and implementations /////

function allInputsValid() {
    let numValid = 0;

    if (realForm.elements[0].value === '') {
        requiredMessages[0].style.display = 'block';
    }
    else {
        requiredMessages[0].style.display = 'none';
        numValid += 1;
    }

    if (realForm.elements[1].value === '') {
        requiredMessages[1].style.display = 'block';
    }
    else {
        requiredMessages[1].style.display = 'none';
        numValid += 1;
    }

    if (realForm.elements[2].value === '' || !(isNaN(typeof realForm.elements[2].value))) {
        requiredMessages[2].style.display = 'block';
        console.log(typeof realForm.elements[2].value);
    }
    else {
        requiredMessages[2].style.display = 'none';

        numValid += 1;
    }

    if (realForm.elements[3].checked === false && realForm.elements[4].checked === false) {
        requiredMessageRadio.style.display = 'block';
    }
    else {
        requiredMessageRadio.style.display = 'none';
        numValid += 1;
    }

    return numValid === 4;
}

function clearInputs() {
    realForm.elements[0].value = '';
    realForm.elements[1].value = '';
    realForm.elements[2].value = '';
    realForm.elements[3].checked = false;
    realForm.elements[4].checked = false;
    requiredMessages[0].style.display = 'none';
    requiredMessages[1].style.display = 'none';
    requiredMessages[2].style.display = 'none';
    requiredMessageRadio.style.display = 'none';
}

function addBookToLibrary(userTitle, userAuthor, userNumPages, userRead) {
    myLibrary.push(new Book(userTitle, userAuthor, userNumPages, userRead));
};

function openForm() {
    formDiv.style.display = "block";
    mainContainer.style.filter = "blur(3px)";

};

function closeForm() {

    clearInputs();

    formDiv.style.display = "none";
    mainContainer.style.filter = "";
};

function userAddBook() {

    if (allInputsValid()) {

        let formValues = realForm.elements;
        userTitle = formValues[0].value;
        userAuthor = formValues[1].value;
        userNumPages = formValues[2].value;
        userRead = formValues[3].checked ? true : false;

        document.querySelector('div#books-container').innerHTML = '';
        addBookToLibrary(userTitle, userAuthor, userNumPages, userRead);
        saveLibrarytoLocalStorage();
        displayBooks();
        closeForm();

    }
}

function displayBooks() {
    let currId = 0;
    for (let book of myLibrary) {

        /* create book HTML */
        const bookElement = document.createElement("div");
        bookElement.setAttribute('data-library', currId);
        bookElement.className = "book-card";
        const title = document.createElement("p");
        title.innerHTML = "Title: " + book.title;
        const author = document.createElement("p");
        author.innerHTML = "Author: " + book.author;
        const numBookPages = document.createElement("p");
        numBookPages.innerHTML = "Length: " + String(book.numPages) + " pages";
        const readStatus = document.createElement("button");
        readStatus.className = "read-status";
        readStatus.innerHTML = book.read ? "Read" : "Unread";
        const removeButton = document.createElement("button");
        removeButton.innerHTML = "Remove";
        removeButton.className = "remove-button";

        /* add book element to HTML */
        bookElement.appendChild(title);
        bookElement.appendChild(author);
        bookElement.appendChild(numBookPages);
        bookElement.appendChild(readStatus);
        bookElement.appendChild(removeButton);
        bookContainer.appendChild(bookElement);

        /* toggle readStatus whenever button is clicked */
        readStatus.addEventListener('click', () => {
            book.changeReadStatus();
            saveLibrarytoLocalStorage();
            readStatus.innerHTML = book.read ? "Read" : "Unread";
        });

        /* logic for removing a book when the remove button is clicked */
        removeButton.addEventListener('click', () => {
            let bookId = Number(bookElement.getAttribute('data-library'));
            for (let i = 0; i < myLibrary.length; ++i) {
                if (bookId === i) {
                    myLibrary.splice(i, 1);
                    saveLibrarytoLocalStorage();
                    break;
                }
            }

            bookElement.remove();

            /* renumber book data attributes after removing to ensure the next removal will be the correct book */
            let books = document.querySelectorAll('div.book-card');
            let newId = 0;
            for (let newBook of books) {
                newBook.setAttribute('data-library', newId++);
            }

        });

        ++currId;
    }
}

/***** function to check if localStorage is available in the current web browser. *****/
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
/*** above code directly copy and pasted from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API ***/

function saveLibrarytoLocalStorage() {
    localStorage.setItem('library', JSON.stringify(myLibrary));
}

function populateLibraryFromLocalStorage() {
    if (localStorage.getItem('library')) {
        let bookData = JSON.parse(localStorage.getItem('library'));
        for (let book of bookData) {
            addBookToLibrary(book.title, book.author, Number(book.numPages), Boolean(book.read));
        }
    }
}

///////////////////////////////////////////////
