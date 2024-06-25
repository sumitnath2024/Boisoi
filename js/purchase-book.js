document.addEventListener('DOMContentLoaded', function () {
  const db = firebase.firestore();
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  const bookNameElement = document.getElementById('bookName');
  const authorElement = document.getElementById('author');
  const priceElement = document.getElementById('price');
  const paymentForm = document.getElementById('paymentForm');

  function displayBookDetails(book) {
    bookNameElement.textContent = book.title;
    authorElement.textContent = book.author;
    priceElement.textContent = book.price;
  }

  db.collection('books').doc(bookId).get()
    .then((doc) => {
      if (doc.exists) {
        displayBookDetails(doc.data());
      } else {
        console.log('No such document!');
      }
    })
    .catch((error) => {
      console.error('Error getting document:', error);
    });

  paymentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    // Handle the payment process (e.g., integrate with a payment gateway)

    // After successful purchase, redirect to read-book.html
    window.location.href = `read-book.html?id=${bookId}`;
  });
});
