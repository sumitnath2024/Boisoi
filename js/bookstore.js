document.addEventListener('DOMContentLoaded', function () {
  const db = firebase.firestore();
  const bookList = document.getElementById('bookList');
  const searchBar = document.getElementById('searchBar');
  const categoryFilter = document.getElementById('categoryFilter');

  function displayBooks(querySnapshot) {
    bookList.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const book = doc.data();
      const bookItem = document.createElement('div');
      bookItem.classList.add('book-item');
      bookItem.innerHTML = `
        <img src="${book.coverUrl}" alt="${book.title}" class="book-cover">
        <div class="book-details">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-author">${book.author}</p>
          <p class="book-price">৳${book.price}</p>
        </div>
      `;
      bookItem.addEventListener('click', () => {
        window.location.href = `book-details.html?id=${doc.id}`;
      });
      bookList.appendChild(bookItem);
    });
  }

  function fetchBooks() {
    db.collection('books')
      .get()
      .then((querySnapshot) => {
        displayBooks(querySnapshot);
      })
      .catch((error) => {
        console.error('Error fetching books: ', error);
      });
  }

  searchBar.addEventListener('input', function () {
    const searchTerm = searchBar.value.toLowerCase();
    db.collection('books')
      .where('keywords', 'array-contains', searchTerm)
      .get()
      .then((querySnapshot) => {
        displayBooks(querySnapshot);
      })
      .catch((error) => {
        console.error('Error searching books: ', error);
      });
  });

  categoryFilter.addEventListener('change', function () {
    const category = categoryFilter.value;
    let query = db.collection('books');
    if (category) {
      query = query.where('category', '==', category);
    }
    query
      .get()
      .then((querySnapshot) => {
        displayBooks(querySnapshot);
      })
      .catch((error) => {
        console.error('Error filtering books: ', error);
      });
  });

  fetchBooks(); // Initial fetch to display all books
});
