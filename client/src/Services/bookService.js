import axios from 'axios';

const API_BASE_URL = 'http://localhost/bookstore/api/books';
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; //For Production
const USERNAME = process.env.REACT_APP_API_USERNAME;
const PASSWORD = process.env.REACT_APP_API_PASSWORD;


const authHeader = {
    headers: {
        'Authorization': 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`)
    }
};


async function getBooks({ search = '', page = 1 } = {}){
    const response = await axios.get(`${API_BASE_URL}?search=${search}&page=${page}`, authHeader);
    return response;
}

async function getBook(id){
    const response = await axios.get(`${API_BASE_URL}/${id}`, authHeader);
    return response;
}

async function createBook(book){
    const response = await axios.post(API_BASE_URL, book, authHeader);
    return response;
}


async function updateBook(id, book){
    const response = await axios.put(`${API_BASE_URL}/${id}`, book, authHeader);
    console.log(response);
    return response;
}

async function deleteBook(id){
    const response = await axios.delete(`${API_BASE_URL}/${id}`, authHeader);
    return response;
}


export {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
}