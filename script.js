//book class: represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: handle tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById("book-list");

        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><button class="btn btn-danger btn-sm delete">X</button></td>`;

        list.appendChild(row);
    }

    static deleteBook(element) {
        if(element.classList.contains("delete")) {
            element.parentElement.parentElement.remove();
        }
    }
    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert  alert-${className} text-center`;
        div.appendChild(document.createTextNode(message));
        const container = document.getElementById('container');
        const form = document.getElementById("book-form");
        container.insertBefore(div, form);

        setTimeout(() => {
            div.remove();
        }, 3000);
    }

    static clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';

    }
}

//Store class: handles storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}

//Event: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


//Event: Add a book
document.getElementById('book-form').addEventListener("submit", (e) => {
        //prevent submitting fast
        e.preventDefault();

        //get form values
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const isbn = document.getElementById("isbn").value;

        //validate 
        if(title === "" || author === "" || isbn === "") {
            UI.showAlert("Inputs are empty. Fill it to add a book in the list.", "warning");
            
        } else {  
        //instatiate book
        const book = new Book(title, author, isbn);

        //Add book to UI 
        UI.addBookToList(book);

        //Add book to store 
        Store.addBook(book);

        //Show success message for adding a book
        UI.showAlert("Book added.", "success");

        //clear fields
        UI.clearFields();
        }
});


//Event: remove a book 
document.getElementById("book-list").addEventListener("click", (e) => {
    UI.deleteBook(e.target);

    //Remove book from UI

    //Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show warning message for removing a book
    UI.showAlert("Book removed.", "danger");
    
});