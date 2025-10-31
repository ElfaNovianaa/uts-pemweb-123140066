import React, { useEffect, useState } from 'react';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('https://openlibrary.org/search.json?q=harry+potter')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setBooks(data.docs);
        setLoading(false);
      })
      .catch(err => {
        setError('Gagal mengambil data buku');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Daftar Buku</h2>
      <ul>
        {books.map(book => (
          <li key={book.key}>
            <strong>{book.title}</strong> by {book.author_name?.[0] || 'Unknown'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;
