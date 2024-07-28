import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBook, createBook, updateBook } from '../Services/bookService.js';
import './BookForm.css';
import Modal from './Modal';

function BookForm(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState({
        title: '',
        author: '',
        isbn: '',
        publishedDate: '',
        price: '',
        quantity: ''
    });
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchBook(){
            if(id){
                const response = await getBook(id);
                setBook(response.data);
            }
        }
        
        fetchBook();
    }, [id]);

    function handleChange(e){
        const { name, value } = e.target;

        // Validate price field
        if(name === 'price'){
            if (!/^\d+(\.\d{1,2})?$/.test(value)){
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    price: 'Price must be a valid number with up to 2 decimal places'
                }));
            }else{
                setErrors((prevErrors) => {
                    const { price, ...rest } = prevErrors;
                    return rest;
                });
            }
        }

        // Validate quantity field
        if(name === 'quantity'){
            if (!/^\d+$/.test(value)){
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    quantity: 'Quantity must be an integer'
                }));
            }else{
                setErrors((prevErrors) => {
                    const { quantity, ...rest } = prevErrors;
                    return rest;
                });
            }
        }

        setBook({ ...book, [name]: value });
    }

    function validateForm(){
        const newErrors = {};
        if(!/^\d+(\.\d{1,2})?$/.test(book.price)) {
            newErrors.price = 'Price must be a valid number with up to 2 decimal places';
        }
        if(!/^\d+$/.test(book.quantity)) {
            newErrors.quantity = 'Quantity must be an integer';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e){
        e.preventDefault();

        if (!validateForm()){
            return;
        }

        if (id){
            await updateBook(id, book);
        }else {
            await createBook(book);
        }
        navigate('/');
    }

    function handleBackClick(){
        setShowModal(true);
    }

    function handleModalConfirm(){
        setShowModal(false);
        navigate('/');
    }

    function handleModalClose(){
        setShowModal(false);
    }

    return (
        <div className="book-form">
            <h1>{id ? 'Edit Book' : 'Add Book'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        name="title"
                        value={book.title}
                        onChange={handleChange}
                        placeholder="Title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                        id="author"
                        name="author"
                        value={book.author}
                        onChange={handleChange}
                        placeholder="Author"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="isbn">ISBN</label>
                    <input
                        id="isbn"
                        name="isbn"
                        value={book.isbn}
                        onChange={handleChange}
                        placeholder="ISBN"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="publishedDate">Published Date</label>
                    <input
                        id="publishedDate"
                        name="publishedDate"
                        value={book.publishedDate}
                        onChange={handleChange}
                        placeholder="Published Date"
                        type="date"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        id="price"
                        name="price"
                        value={book.price}
                        onChange={handleChange}
                        placeholder="Price"
                        type="number"
                        step="0.01" // Ensures that decimals are allowed
                        required
                    />
                    {errors.price && <span className="error">{errors.price}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        id="quantity"
                        name="quantity"
                        value={book.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        type="number"
                        required
                    />
                    {errors.quantity && <span className="error">{errors.quantity}</span>}
                </div>
                <button
                    type="submit"
                    disabled={Object.keys(errors).length > 0}
                    className={Object.keys(errors).length > 0 ? 'error-disabled' : ''}
                >
                    {id ? 'Update' : 'Create'}
                </button>
            </form>
            <button className="floating-back-button" onClick={handleBackClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path d="M15.5 8a.5.5 0 0 1-.5-.5H4.707l3.646-3.646a.5.5 0 0 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L4.707 8.5H15a.5.5 0 0 1 .5-.5z"/>
                </svg>
            </button>
            <Modal
                isOpen={showModal}
                onClose={handleModalClose}
                onConfirm={handleModalConfirm}
            />
        </div>
    );
}

export default BookForm;
