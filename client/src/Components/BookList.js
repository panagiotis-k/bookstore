import React, { useState, useEffect } from 'react';
import { getBooks, deleteBook } from '../Services/bookService.js';
import { Link } from 'react-router-dom';
import DeleteModal from './DeleteModal'; 
import './BookList.css';

function BookList(){
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, [search, page]);

    async function fetchBooks(){
        setLoading(true);
        try{
            const response = await getBooks({ search, page });
            setBooks(response.data.books);
            setTotalPages(response.data.totalPages);
        }catch (error){
            console.error('Error fetching books:', error);
        }finally {
            setLoading(false);
        }
    }

    async function handleDelete(){
        try {
            await deleteBook(bookToDelete);
            const response = await getBooks({ search, page });
            if(response.data.books.length === 0 && page > 1) {
                setPage(page - 1);
            }else{
                setBooks(response.data.books);
            }
            setTotalPages(response.data.totalPages);
            setIsDeleteModalOpen(false); 
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    }

    function showDeleteModal(id){
        setBookToDelete(id);
        setIsDeleteModalOpen(true);
    }

    function handlePageChange(newPage){
        if(newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    }

    function renderPagination(){
        const buttons = [];
        for(let i = 1; i <= totalPages; i++){
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`page-button ${i === page ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    }

    function highlightText(text, highlight){
        if(!highlight.trim()) {
            return text;
        }
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={index} className="highlight">
                    {part}
                </span>
            ) : (
                part
            )
        );
    }

    return(
        <div className="book-list">
            <h1>Book List</h1>
            <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                className="search-bar"
            />
            <Link to="/add" className="add-button">Add New Book</Link>
            <ul>
                {loading ? (
                    <p>Loading...</p>
                ) : books.length > 0 ? (
                    books.map(book => (
                        <li key={book.id}>
                            <div>
                                <strong>{highlightText(book.title, search)}</strong> <i>by {highlightText(book.author, search)}</i>
                            </div>
                            <div>
                                <p><strong>ISBN:</strong> {book.isbn}</p>
                                <p><strong>Published Date:</strong> {new Date(book.publishedDate).toLocaleDateString()}</p>
                                <p><strong>Price:</strong> € {book.price}</p>
                                <p><strong>Quantity:</strong> {book.quantity}</p>
                            </div>
                            <div>
                                <Link to={`/edit/${book.id}`} className="edit-button">Edit</Link>
                                <button onClick={() => showDeleteModal(book.id)} className="delete-button">Delete</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No books found</p>
                )}
            </ul>
            {!search && !loading && (
                <div className="pagination">
                    {page > 1 && <span className='pagination-pointer' onClick={() => handlePageChange(page - 1)}>Previous</span>}
                    {renderPagination()}
                    {page < totalPages && <span className='pagination-pointer' onClick={() => handlePageChange(page + 1)}>Next</span>}
                </div>
            )}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}

export default BookList;
