document.addEventListener('DOMContentLoaded', function () {
  const db = firebase.firestore();
  const submissionsList = document.getElementById('submissionsList');
  const searchBar = document.getElementById('searchBar');

  function displaySubmission(submission) {
    const submissionItem = document.createElement('div');
    submissionItem.classList.add('submission-item');
    submissionItem.innerHTML = `
      <h2>${submission.title}</h2>
      <p><strong>লেখক:</strong> ${submission.author}</p>
      <p><strong>বিভাগ:</strong> ${submission.category}</p>
      <p><strong>বর্ণনা:</strong> ${submission.description}</p>
      <p><strong>মূল্য:</strong> ৳${submission.price}</p>
      <div class="actions">
        <button class="view-button">বিস্তারিত দেখুন</button>
        <button class="reject-button">অনুরোধ বাতিল করুন</button>
        <button class="modify-button">পরিবর্তনের জন্য অনুরোধ করুন</button>
        <button class="publish-button">বই প্রকাশ করুন</button>
      </div>
    `;

    submissionItem.querySelector('.view-button').addEventListener('click', () => {
      window.location.href = `book-details.html?id=${submission.id}`;
    });

    submissionItem.querySelector('.reject-button').addEventListener('click', async () => {
      try {
        await db.collection('books').doc(submission.id).update({ status: 'rejected' });
        alert('অনুরোধ বাতিল করা হয়েছে');
        submissionItem.remove();
      } catch (error) {
        console.error('Error rejecting submission: ', error);
      }
    });

    submissionItem.querySelector('.modify-button').addEventListener('click', async () => {
      try {
        await db.collection('books').doc(submission.id).update({ status: 'modification_requested' });
        alert('পরিবর্তনের জন্য অনুরোধ করা হয়েছে');
      } catch (error) {
        console.error('Error requesting modification: ', error);
      }
    });

    submissionItem.querySelector('.publish-button').addEventListener('click', async () => {
      try {
        // Convert doc to EPUB and upload (implementation not shown here)
        await db.collection('books').doc(submission.id).update({ status: 'published' });
        alert('বই প্রকাশিত হয়েছে');
      } catch (error) {
        console.error('Error publishing book: ', error);
      }
    });

    submissionsList.appendChild(submissionItem);
  }

  function fetchSubmissions() {
    db.collection('books').where('status', '==', 'pending').get()
      .then((querySnapshot) => {
        submissionsList.innerHTML = '';
        querySnapshot.forEach((doc) => {
          const submission = { id: doc.id, ...doc.data() };
          displaySubmission(submission);
        });
      })
      .catch((error) => {
        console.error('Error fetching submissions: ', error);
      });
  }

  searchBar.addEventListener('input', function () {
    const searchTerm = searchBar.value.toLowerCase();
    db.collection('books
