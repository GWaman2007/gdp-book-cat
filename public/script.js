const booksDiv = document.getElementById("books");

// --- 🎨 NEW: Curated Palette Generator ---
function getColorForGenre(genre) {
  if (!genre) return "#34495e"; // Default Dark Grey if empty

  // A list of 12 manually selected, distinct, "book cover" colors
  // These are chosen to look good with white text.
  const palette = [
    "#c0392b", // 1. Deep Red
    "#2980b9", // 2. Strong Blue
    "#27ae60", // 3. Emerald Green
    "#8e44ad", // 4. Wisteria Purple
    "#d35400", // 5. Pumpkin Orange
    "#16a085", // 6. Green Sea (Teal)
    "#2c3e50", // 7. Midnight Blue
    "#7f8c8d", // 8. Concrete Grey
    "#8854d0", // 9. Gloomy Purple
    "#3b3b98", // 10. Matt Blue
    "#B33771", // 11. Fiery Rose
    "#58B19F"  // 12. Keppel (Soft Green)
  ];

  let hash = 0;
  // 1. Convert the string (genre) into a number
  for (let i = 0; i < genre.length; i++) {
    hash = genre.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 2. Use Modulo (%) to map that large number to our list of 12 colors
  // If hash is 100 and palette length is 12, the result is index 4.
  const index = Math.abs(hash % palette.length);

  return palette[index];
}


async function fetchBooks() {
  const res = await fetch("/books");
  const books = await res.json();
  booksDiv.innerHTML = "";

  books.forEach((book) => {
    // 1. Create the Main Book Card
    const bookDiv = document.createElement("div");
    bookDiv.className = "book";
    bookDiv.style.backgroundColor = getColorForGenre(book.genre); // ✅ Use the new function

    // 2. Create Title
    const title = document.createElement("h3");
    title.innerText = book.title;

    // 3. Create Author
    const author = document.createElement("p");
    author.className = "author";
    author.innerText = `by ${book.author}`;

    // 4. Create Year
    const year = document.createElement("p");
    year.className = "year";
    year.innerText = book.year;

    // 5. Create Buttons Container
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn-edit";
    editBtn.innerText = "Edit";
    editBtn.onclick = (e) => {
        e.stopPropagation(); // Prevent triggering other clicks if needed
        editBook(book);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.innerText = "X";
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteBook(book._id);
    };

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    // 6. Assemble the Book
    bookDiv.appendChild(title);
    bookDiv.appendChild(author);
    bookDiv.appendChild(year);
    bookDiv.appendChild(actionsDiv);

    booksDiv.appendChild(bookDiv);
  });
}


// Add book

async function addBook() {

  const title = document.getElementById("title").value;

  const author = document.getElementById("author").value;

  const genre = document.getElementById("genre").value;

  const year = document.getElementById("year").value;




  if (!title || !author || !genre || !year) {

    alert("Fill all fields");

    return;

  }



  await fetch("/books", {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ title, author, genre, year }),

  });



  document.getElementById("title").value = "";

  document.getElementById("author").value = "";

  document.getElementById("genre").value = "";

  document.getElementById("year").value = "";



  fetchBooks();

}



// Delete book

async function deleteBook(id) {

  await fetch(`/books/${id}`, {

    method: "DELETE",

  });



  fetchBooks();

}



// Edit book

// ... existing code (getColorForGenre, fetchBooks, etc.) ...

// 🆕 1. Open the Modal instead of using prompt()
function editBook(book) {
  // Populate the hidden modal fields with the current book's info
  document.getElementById("edit-id").value = book._id;
  document.getElementById("edit-title").value = book.title;
  document.getElementById("edit-author").value = book.author;
  document.getElementById("edit-genre").value = book.genre;
  document.getElementById("edit-year").value = book.year;

  // Show the modal
  document.getElementById("editModal").style.display = "block";
}

// 🆕 2. Save the changes
async function saveEdit() {
  const id = document.getElementById("edit-id").value;
  const title = document.getElementById("edit-title").value;
  const author = document.getElementById("edit-author").value;
  const genre = document.getElementById("edit-genre").value;
  const year = document.getElementById("edit-year").value;

  if (!title || !author || !genre || !year) {
    alert("Please fill all fields");
    return;
  }

  // Send the update to the server
  await fetch(`/books/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, genre, year }),
  });

  // Close modal and refresh list
  closeModal();
  fetchBooks();
}

// 🆕 3. Close the Modal (Cancel)
function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// Optional: Close modal if user clicks OUTSIDE the white box
window.onclick = function(event) {
  const modal = document.getElementById("editModal");
  if (event.target == modal) {
    closeModal();
  }
}


// Load books on page load

fetchBooks();


