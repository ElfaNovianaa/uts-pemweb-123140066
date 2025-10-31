"use client"

import { useState, useEffect } from "react"
import SearchForm from "./components/SearchForm"
import BookTable from "./components/BookTable"
import BookDetail from "./components/BookDetail"
import ReadingList from "./components/ReadingList"
import "./styles/App.css"

const LOCAL_STORAGE_KEY = "readingList"

export default function App() {
  const [books, setBooks] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedBook, setSelectedBook] = useState(null)
  const [readingList, setReadingList] = useState([])
  const [filterSubject, setFilterSubject] = useState("")
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Load reading list dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        setReadingList(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load reading list:", e)
      }
    }
  }, [])

  useEffect(() => {
    handleSearch({})
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(readingList))
  }, [readingList])

  // Fetch books dari Open Library API
  const handleSearch = async (query) => {
    setLoading(true)
    setError("")
    setSelectedBook(null)
    setFilterSubject("") 
    
    if (!isInitialLoad) {
      setBooks([])
      setSubjects([])
    }

    try {
      const params = new URLSearchParams()
      
      // Build query params
      if (query.title) params.append("title", query.title)
      if (query.author) params.append("author", query.author)
      if (query.year) params.append("first_publish_year", query.year)
      if (query.isbn) params.append("isbn", query.isbn)

      if (params.toString() === "") {
        params.append("q", "harry potter")
      }
      
      params.append("limit", "50")
      params.append("fields", "key,title,author_name,first_publish_year,cover_i,subject")

      const url = `https://openlibrary.org/search.json?${params.toString()}`
      console.log("Fetching:", url) 
      const res = await fetch(url)

      if (!res.ok) throw new Error("Failed to fetch books")

      const data = await res.json()
      console.log("API Response:", data) 
      
      const mapped = data.docs.map((doc) => ({
        key: doc.key,
        title: doc.title || "Untitled",
        author: doc.author_name?.[0] || "Unknown",
        year: doc.first_publish_year || "-",
        cover: doc.cover_i 
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` 
          : null,
        subjects: doc.subject || [],
      }))

      setBooks(mapped)

      const allSubjects = mapped
        .flatMap((b) => b.subjects)
        .filter(s => s && s.trim() !== "") 
      
      console.log("All subjects found:", allSubjects.length) 

      if (allSubjects.length > 0) {
        const subjectCount = allSubjects.reduce((acc, subj) => {
          acc[subj] = (acc[subj] || 0) + 1
          return acc
        }, {})

        const topSubjects = Object.entries(subjectCount)
          .sort((a, b) => b[1] - a[1]) 
          .slice(0, 30) 
          .map(([subj, count]) => ({ name: subj, count }))
          .sort((a, b) => a.name.localeCompare(b.name)) 

        console.log("Top subjects:", topSubjects) 
        setSubjects(topSubjects)
      } else {
        console.warn("No subjects found in API response") 
        setSubjects([])
      }

    } catch (e) {
      setError("Failed to fetch books. Please try again.")
      console.error("Search error:", e)
      setBooks([])
      setSubjects([])
    } finally {
      setLoading(false)
      setIsInitialLoad(false)
    }
  }

  const handleSelectBook = async (book) => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`https://openlibrary.org${book.key}.json`)
      if (!res.ok) throw new Error("Failed to fetch detail")

      const data = await res.json()
      
      setSelectedBook({
        ...book,
        description:
          typeof data.description === "string"
            ? data.description
            : data.description?.value || "No description available",
        subjects: data.subjects || book.subjects || [],
      })
    } catch (e) {
      setError("Failed to fetch book details.")
      console.error("Detail error:", e)
    }

    setLoading(false)
  }

  const addToReadingList = (book) => {
    if (!readingList.find((b) => b.key === book.key)) {
      setReadingList([...readingList, book])
    }
  }

  const removeFromReadingList = (key) => {
    setReadingList(readingList.filter((b) => b.key !== key))
  }

  const filteredBooks = filterSubject
    ? books.filter((b) => b.subjects.includes(filterSubject))
    : books

  const handleResetFilter = () => {
    setFilterSubject("")
  }

  return (
    <main className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>📚 Book Library</h1>
          <p className="header-subtitle">Discover and manage your reading list</p>
        </div>
      </header>

      <div className="app-layout">
        <section className="main-content">
          {/* Search Form */}
          <section className="search-section">
            <SearchForm onSearch={handleSearch} />
          </section>

          {books.length > 0 && (
            <section className="filter-section">
              <div className="filter-container">
                <label htmlFor="subject-filter" className="filter-label">
                  📂 Filter by Category:
                </label>
                
                <select
                  id="subject-filter"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="filter-select"
                  disabled={subjects.length === 0}
                >
                  <option value="">
                    {subjects.length > 0 
                      ? `All Categories (${books.length} books)` 
                      : `No categories available (${books.length} books)`}
                  </option>
                  {subjects.map((subj) => (
                    <option key={subj.name} value={subj.name}>
                      {subj.name} ({subj.count})
                    </option>
                  ))}
                </select>

                {filterSubject && (
                  <button 
                    onClick={handleResetFilter}
                    className="filter-reset-btn"
                    title="Clear filter"
                  >
                    ✕ Clear Filter
                  </button>
                )}
              </div>

              {subjects.length === 0 && (
                <div className="filter-warning">
                  ⚠️ No categories found. Try searching for different books.
                </div>
              )}

              {filterSubject && (
                <div className="filter-info">
                  <span className="filter-badge">
                    Active Filter: <strong>{filterSubject}</strong>
                  </span>
                  <span className="filter-count">
                    Showing {filteredBooks.length} of {books.length} books
                  </span>
                </div>
              )}
            </section>
          )}

          <section className="table-section">
            {loading && <p className="loading-message">⏳ Loading...</p>}
            {error && <p className="error-message">❌ {error}</p>}
            {!loading && books.length === 0 && !isInitialLoad && (
              <p className="empty-message">🔍 Search for books to get started</p>
            )}

            {books.length > 0 && (
              <BookTable
                books={filteredBooks}
                onSelect={handleSelectBook}
                onAdd={addToReadingList}
                readingList={readingList}
              />
            )}
          </section>

          {selectedBook && (
            <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
          )}
        </section>

        <aside className="sidebar">
          <ReadingList books={readingList} onRemove={removeFromReadingList} />
        </aside>
      </div>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Book Library | Powered by Open Library API</p>
      </footer>
    </main>
  )
}
