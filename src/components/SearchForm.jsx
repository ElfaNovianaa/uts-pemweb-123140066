import React, { useState } from 'react';

const initialState = {
  title: '',
  author: '',
  year: '',
  subject: '',
  isbn: '',
};

function SearchForm({ onSearch }) {
  const [form, setForm] = useState(initialState);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit} autoComplete="off">
      <input
        name="title"
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        minLength={2}
      />
      <input
        name="author"
        type="text"
        placeholder="Author"
        value={form.author}
        onChange={handleChange}
      />
      <input
        name="year"
        type="number"
        placeholder="Year"
        value={form.year}
        onChange={handleChange}
        min="1000"
        max={new Date().getFullYear()}
      />
      <input
        name="isbn"
        type="text"
        placeholder="ISBN"
        value={form.isbn}
        onChange={handleChange}
        pattern="\d*"
        maxLength={13}
      />
      <button type="submit">Search</button>
    </form>
  );
  
}


export default SearchForm;
