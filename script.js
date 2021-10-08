
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
        this.equals = function(otherBook) {
            return this.title === otherBook.title
            && this.author === otherBook.author
            && this.numPages === otherBook.numPages
            && this.read === otherBook.read;
        }
    }

};
///////////////////////////////////////

//////// global variables////////

let myLibrary = [new Book("hi", "hi", 4, true), new Book("no", "no", 14, false)];
const bookContainer = document.getElementById("books-container");
////////////////////////////////

// function declarations and implementations /////

function addBookToLibrary(userTitle, userAuthor, userNumPages, userRead) {
    myLibrary.push(new Book(userTitle, userAuthor, userNumPages, userRead));
};

function openForm() {
    document.getElementById("popupForm").style.display = "block";
};

function closeForm() {
    document.getElementById("popupForm").style.display = "none";
};

function userAddBook() {
    const submitted = document.querySelector("form");
    for (let i = 0; i < submitted.length; i++) {
        console.log(submitted.elements[i].value);
    }
    let formValues = submitted.elements;
    userTitle = formValues[0].value;
    userAuthor = formValues[1].value;
    userNumPages = formValues[2].value;
    userRead = formValues[3].checked ? true : false;

    addBookToLibrary(userTitle, userAuthor, userNumPages, userRead);
    displayBooks();
    closeForm();
}

function displayBooks() {
    let currId = 0;
    for (let book of myLibrary) {

        /* create book HTML */
        const bookElement = document.createElement("div");
        bookElement.id = "book" + String(currId);
        bookElement.className = "book-card";
        const title = document.createElement("p");
        title.innerHTML = "Title: " + book.title;
        const author = document.createElement("p");
        author.innerHTML = "Author: " + book.author;
        const numBookPages = document.createElement("p");
        numBookPages.innerHTML = "Length: " + String(book.numPages) + " pages";
        const readStatus = document.createElement("button");
        readStatus.innerHTML = book.read ? "Mark as Read" : "Mark as Unread";
        const removeButton = document.createElement("button");
        removeButton.innerHTML = "Remove";
        /* * * * * * * * * */

        /* add book element to HTML */
        bookElement.appendChild(title);
        bookElement.appendChild(author);
        bookElement.appendChild(numBookPages);
        bookElement.appendChild(readStatus);
        bookElement.appendChild(removeButton);
        bookContainer.appendChild(bookElement);
        /* * * * * * * * * * * * * */

        /* toggle readStatus whenever button is clicked */
        readStatus.addEventListener('click', () => {
            book.changeReadStatus();
            readStatus.innerHTML = book.read ? "Mark as Read" : "Mark as Unread";
        });

        removeButton.addEventListener('click', () => {
            let id = Number(bookElement.id.charAt(bookElement.id.length-1));
            myLibrary.splice(currId, 1); // removes this book from library
            bookElement.remove();
        });
        /* * * * * * * * * * * * * * * * * * * * * * * */

        ++currId;
    }
}
///////////////////////////////////////////////



///////////////// event handling /////////////
const bookSubmission = document.querySelector("form").addEventListener("submit", () => {
    console.log("submitted!")
});

///////////////////////////////////////////////
