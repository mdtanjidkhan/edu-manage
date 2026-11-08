// "use client";
// import { useState, useEffect } from "react";
// import { authClient } from "@/lib/auth-client";
// import { 
//   FiBookOpen, FiPlus, FiSearch, FiEdit2, FiTrash2, FiLayers, 
//   FiCheck, FiX, FiBook, FiUser, FiFileText, FiUpload, FiImage, FiFilter 
// } from "react-icons/fi";
// import toast from "react-hot-toast";

// export default function AdminLibraryPage() {
//   const [activeTab, setActiveTab] = useState("books");
  
//   // States for Categories & Books
//   const [categories, setCategories] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(false);
  
//   // Filters & Search for Books
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterCategory, setFilterCategory] = useState("");
//   const [filterClass, setFilterClass] = useState("");

//   // Add/Edit Book Form States
//   const [editingBookId, setEditingBookId] = useState(null);
//   const [bookForm, setBookForm] = useState({
//     title: "",
//     author: "",
//     categoryId: "",
//     className: "Class 6",
//     subject: "",
//     coverImage: "",
//     pdfUrl: "",
//     description: "",
//     isActive: true
//   });
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [uploadingPdf, setUploadingPdf] = useState(false);

//   // Category Modal States (Manage Categories)
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [formData, setFormData] = useState({ name: "", slug: "", description: "", isActive: true });

//   // Fetch Categories
//   const fetchCategories = async () => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/categories`);
//       const data = await res.json();
//       if (data.success) {
//         setCategories(data.categories);
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   // Fetch Books
//   const fetchBooks = async () => {
//     setLoading(true);
//     try {
//       let url = `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/books?search=${searchQuery}`;
//       if (filterCategory) url += `&categoryId=${filterCategory}`;
//       if (filterClass) url += `&className=${filterClass}`;

//       const res = await fetch(url);
//       const data = await res.json();
//       if (data.success) {
//         setBooks(data.books);
//       }
//     } catch (err) {
//       console.error("Error fetching books:", err);
//       toast.error("Failed to load books");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (activeTab === "books" || activeTab === "categories") {
//       fetchBooks();
//     }
//   }, [activeTab, searchQuery, filterCategory, filterClass]);

//   // Handle Category Form Submit (Create / Edit)
//   const handleSubmitCategory = async (e) => {
//     e.preventDefault();
//     try {
//       const { data: tokenData } = await authClient.token();
//       const url = editingCategory 
//         ? `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/categories/${editingCategory._id}`
//         : `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/categories`;
      
//       const method = editingCategory ? "PATCH" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `Bearer ${tokenData?.token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await res.json();
//       if (data.success) {
//         toast.success(editingCategory ? "Category updated successfully!" : "Category created successfully!");
//         setIsModalOpen(false);
//         setEditingCategory(null);
//         setFormData({ name: "", slug: "", description: "", isActive: true });
//         fetchCategories();
//       } else {
//         toast.error(data.message || "Something went wrong.");
//       }
//     } catch (err) {
//       toast.error("Server error while saving category.");
//     }
//   };

//   // Handle Delete Category
//   const handleDeleteCategory = async (id) => {
//     if (!confirm("Are you sure you want to delete this category?")) return;
//     try {
//       const { data: tokenData } = await authClient.token();
//       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/categories/${id}`, {
//         method: "DELETE",
//         headers: { authorization: `Bearer ${tokenData?.token}` }
//       });
//       const data = await res.json();
//       if (data.success) {
//         toast.success("Category deleted successfully!");
//         fetchCategories();
//       } else {
//         toast.error(data.message || "Failed to delete category.");
//       }
//     } catch (err) {
//       toast.error("Server error while deleting.");
//     }
//   };

//   // Handle Category Status Toggle
//   const handleToggleStatus = async (id) => {
//     try {
//       const { data: tokenData } = await authClient.token();
//       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/categories/status/${id}`, {
//         method: "PATCH",
//         headers: { authorization: `Bearer ${tokenData?.token}` }
//       });
//       const data = await res.json();
//       if (data.success) {
//         toast.success(data.message);
//         fetchCategories();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error("Failed to toggle status.");
//     }
//   };

//   // Handle Image Upload Placeholder
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setBookForm(prev => ({ ...prev, coverImage: URL.createObjectURL(file) }));
//     toast.success("Cover image attached!");
//   };

//   // Handle PDF Upload Placeholder
//   const handlePdfUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setBookForm(prev => ({ ...prev, pdfUrl: URL.createObjectURL(file) }));
//     toast.success("PDF attached successfully!");
//   };

//   // Submit Book Form (Create / Edit)
//   const handleBookSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data: tokenData } = await authClient.token();
//       const url = editingBookId 
//         ? `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/books/${editingBookId}`
//         : `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/books`;
      
//       const method = editingBookId ? "PATCH" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `Bearer ${tokenData?.token}`
//         },
//         body: JSON.stringify(bookForm)
//       });

//       const data = await res.json();
//       if (data.success) {
//         toast.success(editingBookId ? "Book updated successfully!" : "Book added successfully!");
//         setEditingBookId(null);
//         setBookForm({
//           title: "", author: "", categoryId: "", className: "Class 6",
//           subject: "", coverImage: "", pdfUrl: "", description: "", isActive: true
//         });
//         setActiveTab("books");
//       } else {
//         toast.error(data.message || "Failed to save book.");
//       }
//     } catch (err) {
//       toast.error("Server error while saving book.");
//     }
//   };

//   // Delete Book
//   const handleDeleteBook = async (id) => {
//     if (!confirm("Are you sure you want to delete this book?")) return;
//     try {
//       const { data: tokenData } = await authClient.token();
//       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/books/${id}`, {
//         method: "DELETE",
//         headers: { authorization: `Bearer ${tokenData?.token}` }
//       });
//       const data = await res.json();
//       if (data.success) {
//         toast.success("Book deleted successfully!");
//         fetchBooks();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error("Failed to delete book.");
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 pb-12">
//       {/* Header */}
//       <div className="bg-base-100 border border-base-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
//             <FiBookOpen className="text-primary" /> Digital Library Management
//           </h1>
//           <p className="text-sm text-base-content/60 mt-1">
//             Manage books, categories, and student digital library resources efficiently.
//           </p>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="flex bg-base-200/50 p-1.5 rounded-xl w-fit gap-1">
//         <button 
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'books' ? 'bg-primary text-primary-content shadow-xs' : 'text-base-content/70 hover:bg-base-300/50'}`}
//           onClick={() => setActiveTab('books')}
//         >
//           All Books ({books.length})
//         </button>
//         <button 
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'add-book' ? 'bg-primary text-primary-content shadow-xs' : 'text-base-content/70 hover:bg-base-300/50'}`}
//           onClick={() => {
//             setEditingBookId(null);
//             setBookForm({
//               title: "", author: "", categoryId: categories[0]?._id || "", className: "Class 6",
//               subject: "", coverImage: "", pdfUrl: "", description: "", isActive: true
//             });
//             setActiveTab('add-book');
//           }}
//         >
//           Add Book
//         </button>
//         <button 
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'categories' ? 'bg-primary text-primary-content shadow-xs' : 'text-base-content/70 hover:bg-base-300/50'}`}
//           onClick={() => setActiveTab('categories')}
//         >
//           Manage Categories
//         </button>
//       </div>

//       {/* TAB 1: ALL BOOKS */}
//       {activeTab === 'books' && (
//         <div className="bg-base-100 border border-base-200 rounded-2xl p-6 shadow-xs space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div className="relative w-full">
//               <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
//               <input 
//                 type="text" 
//                 placeholder="Search by title or author..." 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="input input-bordered input-sm w-full pl-10 rounded-xl"
//               />
//             </div>
//             <select 
//               value={filterCategory} 
//               onChange={(e) => setFilterCategory(e.target.value)}
//               className="select select-bordered select-sm rounded-xl"
//             >
//               <option value="">All Categories</option>
//               {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//             </select>
//             <select 
//               value={filterClass} 
//               onChange={(e) => setFilterClass(e.target.value)}
//               className="select select-bordered select-sm rounded-xl"
//             >
//               <option value="">All Classes</option>
//               <option value="Class 6">Class 6</option>
//               <option value="Class 7">Class 7</option>
//               <option value="Class 8">Class 8</option>
//               <option value="Class 9">Class 9</option>
//               <option value="Class 10">Class 10</option>
//             </select>
//           </div>

//           <div className="overflow-x-auto border border-base-200 rounded-xl">
//             <table className="table w-full">
//               <thead>
//                 <tr className="bg-base-200/50 text-xs text-base-content/70 uppercase">
//                   <th>Book Info</th>
//                   <th>Category</th>
//                   <th>Class & Subject</th>
//                   <th>Status</th>
//                   <th className="text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-base-200">
//                 {loading ? (
//                   <tr><td colSpan="5" className="text-center py-8 text-base-content/50">Loading books...</td></tr>
//                 ) : books.length === 0 ? (
//                   <tr><td colSpan="5" className="text-center py-8 text-base-content/50">No books found.</td></tr>
//                 ) : (
//                   books.map((book) => (
//                     <tr key={book._id} className="hover:bg-base-200/30">
//                       <td>
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-12 rounded-lg bg-base-200 overflow-hidden shrink-0 border border-base-300">
//                             {book.coverImage ? (
//                               <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
//                             ) : (
//                               <div className="w-full h-full flex items-center justify-center text-base-content/40"><FiBook size={16} /></div>
//                             )}
//                           </div>
//                           <div>
//                             <div className="font-bold text-sm text-base-content">{book.title}</div>
//                             <div className="text-xs text-base-content/60">By {book.author}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <span className="badge badge-sm badge-ghost font-medium">
//                           {book.categoryDetails?.name || "Uncategorized"}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="text-xs font-semibold">{book.className}</div>
//                         <div className="text-xs text-base-content/60">{book.subject}</div>
//                       </td>
//                       <td>
//                         <span className={`badge badge-sm ${book.isActive ? 'badge-success text-white' : 'badge-ghost'}`}>
//                           {book.isActive ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="text-right space-x-1">
//                         <button 
//                           onClick={() => {
//                             setEditingBookId(book._id);
//                             setBookForm({
//                               title: book.title,
//                               author: book.author,
//                               categoryId: book.categoryId,
//                               className: book.className,
//                               subject: book.subject,
//                               coverImage: book.coverImage || "",
//                               pdfUrl: book.pdfUrl,
//                               description: book.description || "",
//                               isActive: book.isActive
//                             });
//                             setActiveTab('add-book');
//                           }}
//                           className="btn btn-ghost btn-xs text-primary"
//                           title="Edit"
//                         >
//                           <FiEdit2 size={14} />
//                         </button>
//                         <button 
//                           onClick={() => handleDeleteBook(book._id)}
//                           className="btn btn-ghost btn-xs text-error"
//                           title="Delete"
//                         >
//                           <FiTrash2 size={14} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* TAB 2: ADD / EDIT BOOK FORM */}
//       {activeTab === 'add-book' && (
//         <div className="bg-base-100 border border-base-200 rounded-2xl p-6 shadow-xs max-w-3xl mx-auto">
//           <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-base-200 pb-3">
//             <FiBook className="text-primary" /> {editingBookId ? "Edit Book Details" : "Add New Digital Book"}
//           </h3>
//           <form onSubmit={handleBookSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label py-1"><span className="label-text text-xs font-semibold">Book Title *</span></label>
//                 <input 
//                   type="text" required placeholder="e.g. Higher Mathematics" 
//                   value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
//                   className="input input-bordered input-sm rounded-xl w-full"
//                 />
//               </div>
//               <div className="form-control">
//                 <label className="label py-1"><span className="label-text text-xs font-semibold">Author Name *</span></label>
//                 <input 
//                   type="text" required placeholder="e.g. Dr. Muhammad Zafar Iqbal" 
//                   value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
//                   className="input input-bordered input-sm rounded-xl w-full"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="form-control">
//                 <label className="label py-1"><span className="label-text text-xs font-semibold">Category *</span></label>
//                 <select 
//                   required value={bookForm.categoryId} 
//                   onChange={(e) => setBookForm({ ...bookForm, categoryId: e.target.value })}
//                   className="select select-bordered select-sm rounded-xl w-full"
//                 >
//                   <option value="" disabled>Select Category</option>
//                   {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                 </select>
//               </div>
//               <div className="form-control">
//                 <label className="label py-1"><span className="label-text text-xs font-semibold">Class *</span></label>
//                 <select 
//                   value={bookForm.className} 
//                   onChange={(e) => setBookForm({ ...bookForm, className: e.target.value })}
//                   className="select select-bordered select-sm rounded-xl w-full"
//                 >
//                   <option value="Class 6">Class 6</option>
//                   <option value="Class 7">Class 7</option>
//                   <option value="Class 8">Class 8</option>
//                   <option value="Class 9">Class 9</option>
//                   <option value="Class 10">Class 10</option>
//                 </select>
//               </div>
//               <div className="form-control">
//                 <label className="label py-1"><span className="label-text text-xs font-semibold">Subject *</span></label>
//                 <input 
//                   type="text" required placeholder="e.g. Physics" 
//                   value={bookForm.subject} onChange={(e) => setBookForm({ ...bookForm, subject: e.target.value })}
//                   className="input input-bordered input-sm rounded-xl w-full"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label py-1"><span className="label-text text-xs font-semibold">Cover Image URL</span></label>
//                 <input 
//                   type="text" placeholder="Paste image URL" 
//                   value={bookForm.coverImage} onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
//                   className="input input-bordered input-sm rounded-xl w-full"
//                 />
//               </div>
//               <div className="form-control">
//                 <label className="label py-1"><span className="label-text text-xs font-semibold">PDF File URL *</span></label>
//                 <input 
//                   type="text" required placeholder="Paste PDF URL" 
//                   value={bookForm.pdfUrl} onChange={(e) => setBookForm({ ...bookForm, pdfUrl: e.target.value })}
//                   className="input input-bordered input-sm rounded-xl w-full"
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label py-1"><span className="label-text text-xs font-semibold">Description</span></label>
//               <textarea 
//                 placeholder="Write a brief overview of the book..." 
//                 value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
//                 className="textarea textarea-bordered textarea-sm rounded-xl h-24"
//               ></textarea>
//             </div>

//             <div className="form-control flex flex-row items-center gap-3">
//               <input 
//                 type="checkbox" checked={bookForm.isActive} 
//                 onChange={(e) => setBookForm({ ...bookForm, isActive: e.target.checked })}
//                 className="checkbox checkbox-primary checkbox-sm rounded-md"
//               />
//               <label className="label-text text-xs font-semibold cursor-pointer">Active / Published Status</label>
//             </div>

//             <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
//               <button type="button" onClick={() => setActiveTab('books')} className="btn btn-ghost btn-sm rounded-xl">Cancel</button>
//               <button type="submit" className="btn btn-primary btn-sm rounded-xl px-6">
//                 {editingBookId ? "Update Book" : "Publish Book"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* TAB 3: MANAGE CATEGORIES */}
//       {activeTab === 'categories' && (
//         <div className="bg-base-100 border border-base-200 rounded-2xl p-6 shadow-xs space-y-6">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="relative w-full sm:w-72">
//               <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
//               <input 
//                 type="text" 
//                 placeholder="Search categories..." 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="input input-bordered input-sm w-full pl-10 rounded-xl"
//               />
//             </div>
//             <button 
//               onClick={() => {
//                 setEditingCategory(null);
//                 setFormData({ name: "", slug: "", description: "", isActive: true });
//                 setIsModalOpen(true);
//               }}
//               className="btn btn-primary btn-sm rounded-xl gap-1.5 w-full sm:w-auto"
//             >
//               <FiPlus size={16} /> Add Category
//             </button>
//           </div>

//           <div className="overflow-x-auto border border-base-200 rounded-xl">
//             <table className="table w-full">
//               <thead>
//                 <tr className="bg-base-200/50 text-xs text-base-content/70 uppercase">
//                   <th>Name & Slug</th>
//                   <th>Description</th>
//                   <th>Status</th>
//                   <th className="text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-base-200">
//                 {categories.length === 0 ? (
//                   <tr><td colSpan="4" className="text-center py-8 text-base-content/50">No categories found.</td></tr>
//                 ) : (
//                   categories.map((cat) => (
//                     <tr key={cat._id} className="hover:bg-base-200/30">
//                       <td>
//                         <div className="font-bold text-sm text-base-content">{cat.name}</div>
//                         <div className="text-xs text-base-content/50 font-mono">/{cat.slug}</div>
//                       </td>
//                       <td className="text-xs text-base-content/70 max-w-xs truncate">
//                         {cat.description || "No description provided."}
//                       </td>
//                       <td>
//                         <button 
//                           onClick={() => handleToggleStatus(cat._id)}
//                           className={`badge badge-sm font-medium cursor-pointer ${cat.isActive ? 'badge-success text-white' : 'badge-ghost'}`}
//                         >
//                           {cat.isActive ? 'Active' : 'Inactive'}
//                         </button>
//                       </td>
//                       <td className="text-right space-x-1">
//                         <button 
//                           onClick={() => {
//                             setEditingCategory(cat);
//                             setFormData({ name: cat.name, slug: cat.slug, description: cat.description || "", isActive: cat.isActive });
//                             setIsModalOpen(true);
//                           }}
//                           className="btn btn-ghost btn-xs text-primary"
//                           title="Edit"
//                         >
//                           <FiEdit2 size={14} />
//                         </button>
//                         <button 
//                           onClick={() => handleDeleteCategory(cat._id)}
//                           className="btn btn-ghost btn-xs text-error"
//                           title="Delete"
//                         >
//                           <FiTrash2 size={14} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Category Create/Edit Modal */}
//       {isModalOpen && (
//         <div className="modal modal-open">
//           <div className="modal-box rounded-2xl space-y-4 max-w-md">
//             <h3 className="font-bold text-lg flex items-center gap-2 border-b border-base-200 pb-3">
//               <FiLayers className="text-primary" /> 
//               {editingCategory ? "Edit Category" : "Add New Category"}
//             </h3>
//             <form onSubmit={handleSubmitCategory} className="space-y-4">
//               <div className="form-control">
//                 <label className="label py-1"><span className="label-text text-xs font-semibold">Category Name *</span></label>
//                 <input 
//                   type="text" required placeholder="e.g. Science & Technology" 
//                   value={formData.name}
//                   onChange={(e) => {
//                     const nameVal = e.target.value;
//                     const autoSlug = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
//                     setFormData({ ...formData, name: nameVal, slug: autoSlug });
//                   }}
//                   className="input input-bordered input-sm rounded-xl w-full"
//                 />
//               </div>

//               <div className="form-control">
//                 <label className="label py-1"><span className="label-text text-xs font-semibold">Slug (URL) *</span></label>
//                 <input 
//                   type="text" required placeholder="e.g. science-technology" 
//                   value={formData.slug}
//                   onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
//                   className="input input-bordered input-sm rounded-xl w-full font-mono text-xs"
//                 />
//               </div>

//               <div className="form-control">
//                 <label className="label py-1"><span className="label-text text-xs font-semibold">Description</span></label>
//                 <textarea 
//                   placeholder="Short description about this category..." 
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   className="textarea textarea-bordered textarea-sm rounded-xl w-full h-20"
//                 ></textarea>
//               </div>

//               <div className="form-control flex flex-row items-center gap-3 pt-1">
//                 <input 
//                   type="checkbox" checked={formData.isActive}
//                   onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
//                   className="checkbox checkbox-primary checkbox-sm rounded-md"
//                 />
//                 <label className="label-text text-xs font-semibold cursor-pointer">Active Status</label>
//               </div>

//               <div className="modal-action pt-2">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-sm rounded-xl">Cancel</button>
//                 <button type="submit" className="btn btn-primary btn-sm rounded-xl px-6">Save Category</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  FiBookOpen, FiPlus, FiSearch, FiEdit2, FiTrash2, FiLayers, 
  FiBook, FiImage, FiFileText 
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminLibraryPage() {
  const [activeTab, setActiveTab] = useState("books");
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterClass, setFilterClass] = useState("");

  // Add/Edit Book Form States
  const [editingBookId, setEditingBookId] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    categoryId: "",
    className: "Class 6",
    subject: "",
    coverImage: "",
    pdfUrl: "",
    description: "",
    isActive: true
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", isActive: true });

  // Fetch Categories & Books
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/categories`);
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) { console.error(err); }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/books?search=${searchQuery}`;
      if (filterCategory) url += `&categoryId=${filterCategory}`;
      if (filterClass) url += `&className=${filterClass}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setBooks(data.books);
    } catch (err) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { 
    if (activeTab === "books") fetchBooks(); 
    if (activeTab === "categories") fetchCategories();
  }, [activeTab, searchQuery, filterCategory, filterClass]);

  // ==========================================
  // DIRECT FRONTEND IMGBB IMAGE UPLOAD
  // ==========================================
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const dataObj = new FormData();
    dataObj.append("image", file);

    try {
      // ⚠️ এখানে আপনার ImgBB API Key বসিয়ে দিন সরাসরি!
      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: dataObj
      });
      const data = await res.json();
      console.log("ImgBB Response:", data);

      if (data.success) {
        setBookForm(prev => ({ ...prev, coverImage: data.data.url }));
        console.error("ImgBB Error Response:", data);
        toast.success("Cover image uploaded successfully!");
      } else {
        toast.error("ImgBB upload failed. Check your API key.");
      }
    } catch (err) {
      toast.error("Image upload error.");
      console.error("Fetch Error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Book Form (Create / Edit)
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: tokenData } = await authClient.token();
      const url = editingBookId 
        ? `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/books/${editingBookId}`
        : `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/books`;
      
      const method = editingBookId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify(bookForm)
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingBookId ? "Book updated successfully!" : "Book added successfully!");
        setEditingBookId(null);
        setBookForm({
          title: "", author: "", categoryId: "", className: "Class 6",
          subject: "", coverImage: "", pdfUrl: "", description: "", isActive: true
        });
        setActiveTab("books");
      } else {
        toast.error(data.message || "Failed to save book.");
      }
    } catch (err) {
      toast.error("Server error while saving book.");
    }
  };

  // Delete Book
  const handleDeleteBook = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/books/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${tokenData?.token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Book deleted successfully!");
        fetchBooks();
      } else {
        toast.error(data.message || "Failed to delete book.");
      }
    } catch (err) {
      toast.error("Server error while deleting.");
    }
  };

  // Category Submit (Create / Edit)
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      const { data: tokenData } = await authClient.token();
      const url = editingCategory 
        ? `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/categories/${editingCategory._id}`
        : `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/categories`;
      
      const method = editingCategory ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingCategory ? "Category updated successfully!" : "Category created successfully!");
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", slug: "", description: "", isActive: true });
        fetchCategories();
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Server error while saving category.");
    }
  };

  // Delete Category (বই থাকা সাপেক্ষে ডিলিট রেস্ট্রিকশন সহ)
  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/categories/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${tokenData?.token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Category deleted successfully!");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete category.");
      }
    } catch (err) {
      toast.error("Server error while deleting category.");
    }
  };

  // Category Status Toggle
  const handleToggleCategoryStatus = async (id) => {
    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/library/categories/status/${id}`, {
        method: "PATCH",
        headers: { authorization: `Bearer ${tokenData?.token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to toggle status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-3 sm:p-6 pb-16">
      {/* Header */}
      <div className="bg-base-100 border border-base-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
            <FiBookOpen className="text-primary" /> Digital Library Management
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            Manage books, categories, and student digital library resources efficiently.
          </p>
        </div>
      </div>

      {/* Navigation Tabs (Fully Responsive) */}
      <div className="grid grid-cols-3 gap-1 bg-base-200/60 p-1.5 rounded-2xl w-full sm:w-fit">
        <button 
          className={`px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center ${activeTab === 'books' ? 'bg-primary text-primary-content shadow-sm' : 'text-base-content/70 hover:bg-base-300/50'}`}
          onClick={() => setActiveTab('books')}
        >
          All Books ({books.length})
        </button>
        <button 
          className={`px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center ${activeTab === 'add-book' ? 'bg-primary text-primary-content shadow-sm' : 'text-base-content/70 hover:bg-base-300/50'}`}
          onClick={() => {
            setEditingBookId(null);
            setBookForm({
              title: "", author: "", categoryId: categories[0]?._id || "", className: "Class 6",
              subject: "", coverImage: "", pdfUrl: "", description: "", isActive: true
            });
            setActiveTab('add-book');
          }}
        >
          Add Book
        </button>
        <button 
          className={`px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center ${activeTab === 'categories' ? 'bg-primary text-primary-content shadow-sm' : 'text-base-content/70 hover:bg-base-300/50'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </div>

      {/* TAB 2: ADD / EDIT BOOK FORM */}
      {activeTab === 'add-book' && (
        <div className="bg-base-100 border border-base-200 rounded-3xl p-5 sm:p-8 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center gap-3 border-b border-base-200 pb-4 mb-6">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <FiBook size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-base-content">
                {editingBookId ? "Edit Book Details" : "Add New Digital Book"}
              </h3>
              <p className="text-xs text-base-content/60">Fill up all the mandatory fields to publish your book.</p>
            </div>
          </div>

          <form onSubmit={handleBookSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text text-xs font-semibold">Book Title *</span></label>
                <input 
                  type="text" required placeholder="e.g. Higher Mathematics" 
                  value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="input input-bordered input-sm sm:input-md rounded-xl w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text text-xs font-semibold">Author Name *</span></label>
                <input 
                  type="text" required placeholder="e.g. Dr. Muhammad Zafar Iqbal" 
                  value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  className="input input-bordered input-sm sm:input-md rounded-xl w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text text-xs font-semibold">Category *</span></label>
                <select 
                  required value={bookForm.categoryId} 
                  onChange={(e) => setBookForm({ ...bookForm, categoryId: e.target.value })}
                  className="select select-bordered select-sm sm:select-md rounded-xl w-full"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text text-xs font-semibold">Class *</span></label>
                <select 
                  value={bookForm.className} 
                  onChange={(e) => setBookForm({ ...bookForm, className: e.target.value })}
                  className="select select-bordered select-sm sm:select-md rounded-xl w-full"
                >
                  {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text text-xs font-semibold">Subject *</span></label>
                <input 
                  type="text" required placeholder="e.g. Physics" 
                  value={bookForm.subject} onChange={(e) => setBookForm({ ...bookForm, subject: e.target.value })}
                  className="input input-bordered input-sm sm:input-md rounded-xl w-full"
                />
              </div>
            </div>

            {/* Cover Image Upload Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-base-200/50 p-4 sm:p-5 rounded-2xl border border-base-200 items-center">
              <div className="sm:col-span-2 space-y-3">
                <label className="label py-0"><span className="label-text text-xs font-semibold flex items-center gap-1.5"><FiImage className="text-primary"/> Cover Image (Upload File or URL)</span></label>
                <input 
                  type="file" accept="image/*" onChange={handleImageFileChange}
                  className="file-input file-input-bordered file-input-sm rounded-xl w-full bg-base-100"
                />
                <input 
                  type="text" placeholder="Or paste image URL directly" 
                  value={bookForm.coverImage} onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                  className="input input-bordered input-sm rounded-xl w-full bg-base-100 text-xs"
                />
                {uploadingImage && <p className="text-xs text-primary font-medium animate-pulse">Uploading to ImgBB...</p>}
              </div>

              {/* Preview Box */}
              <div className="flex justify-center">
                {bookForm.coverImage ? (
                  <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden border-2 border-primary/40 shadow-md bg-base-100">
                    <img src={bookForm.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl border-2 border-dashed border-base-300 flex flex-col items-center justify-center text-base-content/40 text-xs bg-base-100">
                    <FiImage size={24} className="mb-1 opacity-40" />
                    <span>No Preview</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label py-1"><span className="label-text text-xs font-semibold flex items-center gap-1.5"><FiFileText className="text-primary"/> PDF Document URL *</span></label>
              <input 
                type="text" required placeholder="Paste secure PDF URL here" 
                value={bookForm.pdfUrl} onChange={(e) => setBookForm({ ...bookForm, pdfUrl: e.target.value })}
                className="input input-bordered input-sm sm:input-md rounded-xl w-full"
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1"><span className="label-text text-xs font-semibold">Description</span></label>
              <textarea 
                placeholder="Write a brief overview of the book..." 
                value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                className="textarea textarea-bordered rounded-xl w-full h-24 text-sm"
              ></textarea>
            </div>

            <div className="form-control flex flex-row items-center gap-3 pt-1">
              <input 
                type="checkbox" checked={bookForm.isActive} 
                onChange={(e) => setBookForm({ ...bookForm, isActive: e.target.checked })}
                className="checkbox checkbox-primary checkbox-sm rounded-md"
              />
              <label className="label-text text-xs font-semibold cursor-pointer">Active / Published Status</label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-200">
              <button type="button" onClick={() => setActiveTab('books')} className="btn btn-ghost btn-sm rounded-xl">Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm sm:btn-md rounded-xl px-6 font-semibold">
                {editingBookId ? "Update Book" : "Publish Book"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 1: ALL BOOKS */}
      {activeTab === 'books' && (
        <div className="bg-base-100 border border-base-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative w-full">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input 
                type="text" placeholder="Search by title or author..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered input-sm w-full pl-10 rounded-xl"
              />
            </div>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="select select-bordered select-sm rounded-xl">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="select select-bordered select-sm rounded-xl">
              <option value="">All Classes</option>
              {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto border border-base-200 rounded-2xl">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-base-200/50 text-xs text-base-content/70 uppercase">
                  <th>Book Info</th>
                  <th>Category</th>
                  <th>Class & Subject</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-base-content/50">Loading books...</td></tr>
                ) : books.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-base-content/50">No books found.</td></tr>
                ) : (
                  books.map((book) => (
                    <tr key={book._id} className="hover:bg-base-200/30">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-lg bg-base-200 overflow-hidden shrink-0 border border-base-300">
                            {book.coverImage ? (
                              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-base-content/40"><FiBook size={16} /></div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-base-content">{book.title}</div>
                            <div className="text-xs text-base-content/60">By {book.author}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-sm badge-ghost font-medium">{book.categoryDetails?.name || "Uncategorized"}</span></td>
                      <td>
                        <div className="text-xs font-semibold">{book.className}</div>
                        <div className="text-xs text-base-content/60">{book.subject}</div>
                      </td>
                      <td><span className={`badge badge-sm ${book.isActive ? 'badge-success text-white' : 'badge-ghost'}`}>{book.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="text-right space-x-1">
                        <button onClick={() => { setEditingBookId(book._id); setBookForm(book); setActiveTab('add-book'); }} className="btn btn-ghost btn-xs text-primary" title="Edit"><FiEdit2 size={14} /></button>
                        <button onClick={() => handleDeleteBook(book._id)} className="btn btn-ghost btn-xs text-error" title="Delete"><FiTrash2 size={14} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES (Manage Categories with Delete & Status Toggle) */}
      {activeTab === 'categories' && (
        <div className="bg-base-100 border border-base-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input type="text" placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input input-bordered input-sm w-full pl-10 rounded-xl" />
            </div>
            <button onClick={() => { setEditingCategory(null); setFormData({ name: "", slug: "", description: "", isActive: true }); setIsModalOpen(true); }} className="btn btn-primary btn-sm rounded-xl gap-1.5 w-full sm:w-auto">
              <FiPlus size={16} /> Add Category
            </button>
          </div>

          <div className="overflow-x-auto border border-base-200 rounded-2xl">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-base-200/50 text-xs text-base-content/70 uppercase">
                  <th>Name & Slug</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-base-content/50">No categories found.</td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-base-200/30">
                      <td>
                        <div className="font-bold text-base-content">{cat.name}</div>
                        <div className="text-xs text-base-content/50 font-mono">/{cat.slug}</div>
                      </td>
                      <td className="text-xs text-base-content/70 max-w-xs truncate">{cat.description || "No description."}</td>
                      <td>
                        <button onClick={() => handleToggleCategoryStatus(cat._id)} className={`badge badge-sm cursor-pointer ${cat.isActive ? 'badge-success text-white' : 'badge-ghost'}`}>
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="text-right space-x-1">
                        <button onClick={() => { setEditingCategory(cat); setFormData({ name: cat.name, slug: cat.slug, description: cat.description || "", isActive: cat.isActive }); setIsModalOpen(true); }} className="btn btn-ghost btn-xs text-primary" title="Edit"><FiEdit2 size={14} /></button>
                        <button onClick={() => handleDeleteCategory(cat._id)} className="btn btn-ghost btn-xs text-error" title="Delete"><FiTrash2 size={14} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box rounded-3xl space-y-4 max-w-md p-6">
            <h3 className="font-bold text-lg flex items-center gap-2 border-b border-base-200 pb-3">
              <FiLayers className="text-primary" /> {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleSubmitCategory} className="space-y-4">
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs font-semibold">Category Name *</span></label>
                <input 
                  type="text" required placeholder="e.g. Science & Technology" 
                  value={formData.name}
                  onChange={(e) => {
                    const nameVal = e.target.value;
                    const autoSlug = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setFormData({ ...formData, name: nameVal, slug: autoSlug });
                  }}
                  className="input input-bordered input-sm rounded-xl w-full"
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs font-semibold">Slug (URL) *</span></label>
                <input 
                  type="text" required placeholder="e.g. science-technology" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input input-bordered input-sm rounded-xl w-full font-mono text-xs"
                />
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs font-semibold">Description</span></label>
                <textarea 
                  placeholder="Short description..." 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea textarea-bordered rounded-xl w-full h-20 text-xs"
                ></textarea>
              </div>

              <div className="form-control flex flex-row items-center gap-3 pt-1">
                <input 
                  type="checkbox" checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="checkbox checkbox-primary checkbox-sm rounded-md"
                />
                <label className="label-text text-xs font-semibold cursor-pointer">Active Status</label>
              </div>

              <div className="modal-action pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-sm rounded-xl">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm rounded-xl px-6 font-semibold">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}