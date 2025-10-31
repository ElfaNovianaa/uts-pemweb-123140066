"use client";

import { useState } from "react";

export default function SelectedSubject({ books }) {
  const [selectedSubject, setSelectedSubject] = useState("All");

  // Filter buku berdasarkan subject yang dipilih
  const filteredBooks =
    selectedSubject === "All"
      ? books
      : books.filter((book) => book.subject === selectedSubject);

  // Render dropdown filter dan tabel hasil
  return (
    <div>
      <label>
        Filter by:{" "}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Adventure">Adventure</option>
          {/* Tambahkan opsi subject lain sesuai data */}
        </select>
      </label>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Subject</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.subject}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
