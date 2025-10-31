import React from 'react';

function BookDetail({ book, onClose }) {
  return (
    <div className="book-detail">
      <button className="close-btn" onClick={onClose} aria-label="Close detail">&times;</button>
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Year:</strong> {book.year}</p>
      {book.cover && <img src={book.cover} alt={book.title} width={120} />}
      <p><strong>Description:</strong> {book.description}</p>
      <p>
        <strong>Subjects:</strong>
        {book.subjects && book.subjects.length
          ? <ul>{book.subjects.map(s => <li key={s}>{s}</li>)}</ul>
          : ' -'}
      </p>
    </div>
  );
}

export default BookDetail;
