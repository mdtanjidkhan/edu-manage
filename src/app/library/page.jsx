"use client";
import { useState, useEffect } from "react";
import { 
  FiBookOpen, FiSearch, FiFileText, FiDownload, FiBook, FiFilter, FiUser, FiLayers 
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function StudentLibraryPage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories.filter(c => c.isActive)); // শুধু অ্যাক্টিভ ক্যাটেগরিগুলো দেখাবে
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch Books with Filters
  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/books?search=${searchQuery}`;
      if (selectedCategory) url += `&categoryId=${selectedCategory}`;
      if (selectedClass) url += `&className=${selectedClass}`;
      if (selectedSubject) url += `&subject=${selectedSubject}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setBooks(data.books.filter(b => b.isActive));
      }
    } catch (err) {
      console.error("Error fetching library books:", err);
      toast.error("Failed to load digital library books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, selectedCategory, selectedClass, selectedSubject]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content flex items-center gap-3">
            <div className="p-3 bg-primary text-primary-content rounded-2xl shadow-sm">
              <FiBookOpen size={24} />
            </div>
            Student Digital Library
          </h1>
          <p className="text-sm text-base-content/70 mt-2 max-w-xl">
            Explore your curriculum textbooks, reference guides, and subject materials online. Read directly in your browser or download for offline study.
          </p>
        </div>
        <div className="stats bg-base-100 border border-base-200 rounded-2xl shadow-xs shrink-0">
          <div className="stat px-4 py-2">
            <div className="stat-title text-xs">Total Available Books</div>
            <div className="stat-value text-primary text-xl">{books.length}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar Section */}
      <div className="bg-base-100 border border-base-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative w-full">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input 
              type="text" 
              placeholder="Search by book title or author..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered input-sm sm:input-md w-full pl-10 rounded-xl"
            />
          </div>

          {/* Category Filter */}
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select select-bordered select-sm sm:select-md rounded-xl w-full"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          {/* Class Filter */}
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="select select-bordered select-sm sm:select-md rounded-xl w-full"
          >
            <option value="">All Classes</option>
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
          </select>

          {/* Reset Filters Button */}
          <button 
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
              setSelectedClass("");
              setSelectedSubject("");
            }}
            className="btn btn-outline btn-sm sm:btn-md rounded-xl gap-2 font-medium"
          >
            <FiFilter /> Clear Filters
          </button>
        </div>
      </div>

      {/* Books Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-base-100 border border-base-200 rounded-3xl p-4 h-64 animate-pulse flex gap-4">
              <div className="w-28 h-full bg-base-300 rounded-2xl"></div>
              <div className="flex-1 space-y-3 py-2">
                <div className="h-4 bg-base-300 rounded w-3/4"></div>
                <div className="h-3 bg-base-300 rounded w-1/2"></div>
                <div className="h-3 bg-base-300 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-3xl p-12 text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-base-200 rounded-full flex items-center justify-center text-base-content/40">
            <FiBook size={32} />
          </div>
          <h3 className="font-bold text-lg text-base-content">No Books Found</h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            We couldn't find any textbooks matching your search or filter criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-base-100 border border-base-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex gap-4">
                  {/* Book Cover Image */}
                  <div className="w-24 h-32 sm:w-28 sm:h-38 rounded-2xl bg-base-200 overflow-hidden shrink-0 border border-base-300 shadow-inner group-hover:scale-105 transition-transform">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base-content/40">
                        <FiBook size={28} />
                      </div>
                    )}
                  </div>

                  {/* Book Metadata */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-primary badge-xs sm:badge-sm font-semibold">
                        {book.categoryDetails?.name || "Textbook"}
                      </span>
                      <span className="badge badge-ghost badge-xs font-mono">{book.className}</span>
                    </div>

                    <h3 className="font-bold text-base text-base-content line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    
                    <p className="text-xs text-base-content/70 flex items-center gap-1">
                      <FiUser size={12} className="opacity-70" /> {book.author}
                    </p>

                    <p className="text-xs font-medium text-primary">
                      Subject: {book.subject}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {book.description && (
                  <p className="text-xs text-base-content/60 mt-3 line-clamp-2 bg-base-200/40 p-2.5 rounded-xl">
                    {book.description}
                  </p>
                )}
              </div>

              {/* Action Buttons (Read & Download PDF) */}
              <div className="flex items-center gap-2 mt-5 pt-3 border-t border-base-200">
                <a 
                  href={book.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 btn btn-primary btn-sm rounded-xl gap-1.5 font-semibold text-xs shadow-xs"
                >
                  <FiFileText size={15} /> Read PDF
                </a>
                <a 
                  href={book.pdfUrl} 
                  download 
                  className="btn btn-outline btn-sm rounded-xl gap-1.5 text-xs px-3"
                  title="Download PDF"
                >
                  <FiDownload size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}