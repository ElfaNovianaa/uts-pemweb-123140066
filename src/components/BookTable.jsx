import React from 'react';

function BookTable({ books, onSelect, onAdd, readingList }) {
  if (!books.length) return <p>No books found.</p>;

  return (
    <table className="book-table">
      <thead>
        <tr>
          <th>Cover</th>
          <th>Title</th>
          <th>Author</th>
          <th>Year</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {books.map(book => (
          <tr key={book.key}>
            <td>
              {book.cover
                ? <img src={book.cover} alt={book.title} width={50} />
                : <span className="no-cover">No Cover</span>
              }
            </td>
            <td>
              <button className="link" onClick={() => onSelect(book)}>
                {book.title}
              </button>
            </td>
            <td>{book.author}</td>
            <td>{book.year}</td>
            <td>
              <button
                className="add-btn"
                onClick={() => onAdd(book)}
                disabled={readingList.some(b => b.key === book.key)}
              >
                {readingList.some(b => b.key === book.key) ? 'Added' : 'Add'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BookTable;
