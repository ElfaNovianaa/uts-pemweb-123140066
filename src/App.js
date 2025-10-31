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

  // Pencarian inisial untuk mengisi data
  useEffect(() => {
    handleSearch({})
  }, [])

  // Save reading list to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(readingList))
  }, [readingList])

  // Fetch books dari Open Library API
  const handleSearch = async (query) => {
    setLoading(true)
    setError("")
    setSelectedBook(null)
    setFilterSubject("") // Reset filter saat search baru
    
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

      // Default query jika kosong
      if (params.toString() === "") {
        params.append("q", "harry potter")
      }
      
      // Limit untuk performa & fields untuk mendapat subject
      params.append("limit", "50")
      params.append("fields", "key,title,author_name,first_publish_year,cover_i,subject")

      const url = `https://openlibrary.org/search.json?${params.toString()}`
      console.log("Fetching:", url) // Debug
      const res = await fetch(url)

      if (!res.ok) throw new Error("Failed to fetch books")

      const data = await res.json()
      console.log("API Response:", data) // Debug
      
      // Map hasil API ke format yang kita butuhkan
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

      // EKSTRAKSI SUBJEK UNIK untuk dropdown filter
      const allSubjects = mapped
        .flatMap((b) => b.subjects)
        .filter(s => s && s.trim() !== "") // Remove empty/null
      
      console.log("All subjects found:", allSubjects.length) // Debug

      if (allSubjects.length > 0) {
        // Hitung frekuensi kemunculan setiap subjek
        const subjectCount = allSubjects.reduce((acc, subj) => {
          acc[subj] = (acc[subj] || 0) + 1
          return acc
        }, {})

        // Ambil top 30 subjek paling populer & sort alphabetically
        const topSubjects = Object.entries(subjectCount)
          .sort((a, b) => b[1] - a[1]) // Sort by frequency (descending)
          .slice(0, 30) // Limit to top 30
          .map(([subj, count]) => ({ name: subj, count }))
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically

        console.log("Top subjects:", topSubjects) // Debug
        setSubjects(topSubjects)
      } else {
        console.warn("No subjects found in API response") // Debug
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

  // Fetch book detail
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

  // Reading list handlers
  const addToReadingList = (book) => {
    if (!readingList.find((b) => b.key === book.key)) {
      setReadingList([...readingList, book])
    }
  }

  const removeFromReadingList = (key) => {
    setReadingList(readingList.filter((b) => b.key !== key))
  }

  // Filter books berdasarkan subject yang dipilih
  const filteredBooks = filterSubject
    ? books.filter((b) => b.subjects.includes(filterSubject))
    : books

  // Handler untuk reset filter
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

          {/* Filter Dropdown - Debug: Tampilkan jumlah subjects */}
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

          {/* Table Section */}
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

          {/* Book Detail Modal */}
          {selectedBook && (
            <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
          )}
        </section>

        {/* Reading List Sidebar */}
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