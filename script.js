
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
////////////////////////////////

// function declarations and implementations /////

function addBookToLibrary(userTitle, userAuthor, userNumPages, userRead) {
    myLibrary.push(new Book(userTitle, userAuthor, userNumPages, userRead));
};

function openForm() {
    formDiv.style.display = "block";
    mainContainer.style.filter = "blur(3px)";
};

function closeForm() {
    realForm.elements[0].value = '';
    realForm.elements[1].value = '';
    realForm.elements[2].value = '';
    realForm.elements[3].checked = false;
    realForm.elements[4].checked = false;

    formDiv.style.display = "none";
    mainContainer.style.filter = "";
};

function userAddBook() {
    let formValues = realForm.elements;
    userTitle = formValues[0].value;
    userAuthor = formValues[1].value;
    userNumPages = formValues[2].value;
    userRead = formValues[3].checked ? true : false;

    document.querySelector('div#books-container').innerHTML = '';
    addBookToLibrary(userTitle, userAuthor, userNumPages, userRead);
    displayBooks();
    closeForm();
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
        readStatus.innerHTML = book.read ? "Mark as Unread" : "Mark as Read";
        const removeButton = document.createElement("button");
        removeButton.innerHTML = "Remove";

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
            readStatus.innerHTML = book.read ? "Mark as Unread" : "Mark as Read";
        });

        /* logic for removing a book when the remove button is clicked */
        removeButton.addEventListener('click', () => {
            let bookId = Number(bookElement.getAttribute('data-library'));
            for (let i = 0; i < myLibrary.length; ++i) {
                if (bookId === i) {
                    myLibrary.splice(i, 1);
                    console.log("removed at index" + String(i));
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
///////////////////////////////////////////////
