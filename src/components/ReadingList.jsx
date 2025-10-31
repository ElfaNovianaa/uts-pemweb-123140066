import React from 'react';

function ReadingList({ books, onRemove }) {
  return (
    <div className="reading-list">
      <h3>📖 Reading List</h3>
      {books.length === 0 && <p>No books in your list.</p>}
      <ul>
        {books.map(book => (
          <li key={book.key}>
            <span>{book.title} ({book.author})</span>
            <button className="remove-btn" onClick={() => onRemove(book.key)} aria-label="Remove from list">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReadingList;
