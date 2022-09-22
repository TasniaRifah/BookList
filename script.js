let form = document.querySelector("#book-form");
let booklist = document.querySelector("#book-list");

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
class UI {
  addBooklist = (book) => {
    let list = document.querySelector("#book-list");
    let row = document.createElement("tr");
    row.innerHTML = `<td>${book.title}</td>
                     <td>${book.author}</td>
                     <td>${book.isbn}</td> 
                     <td><a href="#" class="delete"><i class="bi bi-trash3" id="delete-icon"></i></a></td>`;
    booklist.appendChild(row);
  };
  clearFields = (book) => {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  };
  showAlert = (message, className) => {
    let div = document.createElement("div");
    // div.className = `alert ${className}`;
    div.setAttribute("class", `alert ${className}`);
    div.appendChild(document.createTextNode(message));
    // console.log(div);
    let container = document.querySelector(".container");
    let form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  };
  deleteFromBook(target) {
    if (target.hasAttribute("id")) {
      target.parentElement.parentElement.parentElement.remove();
     Store.removeBookFromLS(target.parentElement.parentElement.previousElementSibling.textContent.trim()); 
      this.showAlert("Book Removed!", "success");
    }
  }
}

//create local storage
class Store {
  static getBooks = () => {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books; //get all books from local storage
  };
  static addBook = (book) => {
    //add book to storage
    let books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  };
  static displayBooksFromLS = () => {
    let books=Store.getBooks();
    books.forEach(book=> {
        let ui=new UI();
        ui.addBooklist(book);
    });
  };
  static removeBookFromLS=(isbn)=>{
    let books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
  }
}

let newBook = (e) => {
  let title = document.querySelector("#title").value,
    author = document.querySelector("#author").value,
    isbn = document.querySelector("#isbn").value;
  let ui = new UI();
  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Please fill all the fields!", "error");
  } else {
    let book = new Book(title, author, isbn);
    ui.addBooklist(book);
    ui.showAlert("Book Added!", "success");
    ui.clearFields();
    Store.addBook(book);
  }
  e.preventDefault();
};

function removeBook(e) {
  let ui = new UI();
  ui.deleteFromBook(e.target);
  e.preventDefault();
}

form.addEventListener("submit", newBook);
booklist.addEventListener("click", removeBook);
document.addEventListener('DOMContentLoaded',Store.displayBooksFromLS)
