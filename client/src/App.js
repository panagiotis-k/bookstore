import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookList from './Components/BookList';
import BookForm from './Components/BookForm';
import './styles.css';

function App(){
    return(
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<BookList />} />
                    <Route path="/add" element={<BookForm />} />
                    <Route path="/edit/:id" element={<BookForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
