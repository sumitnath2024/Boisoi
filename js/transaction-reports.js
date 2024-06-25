document.addEventListener('DOMContentLoaded', function () {
  const db = firebase.firestore();
  const transactionsList = document.getElementById('transactionsList');
  const filterDate = document.getElementById('filterDate');
  const filterUser = document.getElementById('filterUser');
  const filterBook = document.getElementById('filterBook');
  const filterButton = document.getElementById('filterButton');
  const exportButton = document.getElementById('exportButton');

  function displayTransaction(transaction) {
    const transactionItem = document.createElement('div');
    transactionItem.classList.add('transaction-item');
    transactionItem.innerHTML = `
      <h2>${transaction.bookTitle}</h2>
      <p><strong>ব্যবহারকারী:</strong> ${transaction.userName}</p>
      <p><strong>তারিখ:</strong> ${transaction.date.toDate().toLocaleDateString()}</p>
      <p><strong>মূল্য:</strong> ৳${transaction.price}</p>
    `;

    transactionsList.appendChild(transactionItem);
  }

  function fetchTransactions() {
    db.collection('transactions').get()
      .then((querySnapshot) => {
        transactionsList.innerHTML = '';
        querySnapshot.forEach((doc) => {
          const transaction = { id: doc.id, ...doc.data() };
          displayTransaction(transaction);
        });
      })
      .catch((error) => {
        console.error('Error fetching transactions: ', error);
      });
  }

  filterButton.addEventListener('click', function () {
    const date = filterDate.value;
    const user = filterUser.value.toLowerCase();
    const book = filterBook.value.toLowerCase();

    let query = db.collection('transactions');

    if (date) {
      query = query.where('date', '==', new Date(date));
    }

    if (user) {
      query = query.where('userName', '==', user);
    }

    if (book) {
      query = query.where('bookTitle', '==', book);
    }

    query.get()
      .then((querySnapshot) => {
        transactionsList.innerHTML = '';
        querySnapshot.forEach((doc) => {
          const transaction = { id: doc.id, ...doc.data() };
          displayTransaction(transaction);
        });
      })
      .catch((error) => {
        console.error('Error filtering transactions: ', error);
      });
  });

  exportButton.addEventListener('click', function () {
    const transactions = [];
    db.collection('transactions').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          transactions.push(doc.data());
        });

        const csvContent = 'data:text/csv;charset=utf-8,'
          + 'Book Title,User Name,Date,Price\n'
          + transactions.map(t => `${t.bookTitle},${t.userName},${t.date.toDate().toLocaleDateString()},${t.price}`).join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'transaction_reports.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error exporting transactions: ', error);
      });
  });

  fetchTransactions(); // Initial fetch to display all transactions
});
