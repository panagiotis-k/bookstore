# Table of Contents
1. [Bookstore Project](#bookstore-project)
2. [API Documentation](#api-documentation)
3. [Production URLs](#production-urls)
4. [Testing](#testing)

## Bookstore Project

### Overview

This project is a simple bookstore application with a backend API and a frontend client. The backend is built with PHP, and the frontend is built with React.

### Prerequisites
- PHP 7.x or higher (tested with version 8.2.4)
- MySQL
- Node.js and npm (tested with Node.js v.20.9.0)

### Project Structure

```plaintext
bookstore/
├── api/
│   ├── config/
│   │   ├── database.php
│   │   └── database.example.php
│   ├── controllers/
│   │   └── BookController.php
│   ├── .htaccess
│   ├── auth.php
│   └── auth.example.php
│   └── index.php
│
├── client/
│   ├── node_modules/
│   ├── public/
│   │   ├── icons8-book-32.png
│   │   └── index.html
│   ├── src/
│   │   ├── Components/
│   │   │   ├── BookForm.css
│   │   │   ├── BookForm.js
│   │   │   ├── BookList.css
│   │   │   ├── BookList.js
│   │   │   ├── DeleteModal.css
│   │   │   ├── DeleteModal.js
│   │   │   ├── Modal.css
│   │   │   └── Modal.js
│   │   ├── Services/
│   │   │   └── bookService.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   ├── index.js
│   │   └── styles.css
│   ├── .env
│   ├── package-lock.json
│   └── package.json
│
├── tests/
│   └── BookApiTest.php
│ 
├── vendor/
│   └── ...
├── .gitignore
├── composer.json
├── composer.lock
├── phpunit.xml
└── README.md
```


### Setup Instructions

#### API Setup

1. **Configure Database:**
   - Create a file `api/config/database.php` by copying `api/config/database.example.php`.
   - Edit `api/config/database.php` with your database credentials:

   ```php
   <?php
   #api/config/database.php
   $host = 'localhost';
   $dbname = 'bookstore';
   $username = 'your_username';
   $password = 'your_password';

   try {
       $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
       $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   } catch (PDOException $e) {
       http_response_code(500);
       echo json_encode(array('error' => 'Database connection failed: ' . $e->getMessage()));
       exit;
   }
   ```
2. **Configure Authentication:**
    - Create a file `api/auth.php` by copying `api/auth.example.php`.
    - Edit `api/auth.php` with your authentication  credentials:

    ```php
    <?php
    #api/auth.php
    define('API_USERNAME', 'your_api_username');
    define('API_PASSWORD', 'your_api_password');

    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']) ||
        $_SERVER['PHP_AUTH_USER'] != API_USERNAME || $_SERVER['PHP_AUTH_PW'] != API_PASSWORD) {
        header('WWW-Authenticate: Basic realm="Bookstore API"');
        http_response_code(401);
        echo json_encode(array('error' => 'Unauthorized'));
        die();
    }
    ```
3. **Database Setup:**
    - Use the following SQL commands to create the database and insert dummy data:
    ```sql
    CREATE TABLE books (
         id INT AUTO_INCREMENT PRIMARY KEY,
         title VARCHAR(255) NOT NULL,
         author VARCHAR(255) NOT NULL,
         isbn VARCHAR(20) NOT NULL,
         publishedDate DATE NOT NULL,
         price DECIMAL(10, 2) NOT NULL,
         quantity INT NOT NULL
    );


    INSERT INTO books (title, author, isbn, publishedDate, price, quantity) VALUES
    ('Crime and Punishment', 'Fyodor Dostoevsky', '9780140449136', '1866-01-01', 11.99, 3),
    ('The Brothers Karamazov', 'Fyodor Dostoevsky', '9780374528379', '1880-01-01', 12.99, 4),
    ('Brave New World', 'Aldous Huxley', '9780060850524', '1932-08-30', 10.99, 5),
    ('The Grapes of Wrath', 'John Steinbeck', '9780143039433', '1939-04-14', 13.99, 6),
    ('Jane Eyre', 'Charlotte Bronte', '9780141441146', '1847-10-16', 9.99, 7),
    ('Wuthering Heights', 'Emily Bronte', '9780141439556', '1847-12-01', 8.99, 8),
    ('Great Expectations', 'Charles Dickens', '9780141439563', '1861-08-01', 7.99, 9),
    ('Little Women', 'Louisa May Alcott', '9780143135424', '1868-09-30', 10.99, 10),
    ('Anna Karenina', 'Leo Tolstoy', '9780143035008', '1877-01-01', 14.99, 2),
    ('Dracula', 'Bram Stoker', '9780486411095', '1897-05-26', 6.99, 5),
    ('Frankenstein', 'Mary Shelley', '9780486282114', '1818-01-01', 5.99, 7),
    ('The Count of Monte Cristo', 'Alexandre Dumas', '9780140449266', '1844-01-01', 13.99, 4),
    ('A Tale of Two Cities', 'Charles Dickens', '9780141439600', '1859-04-30', 9.99, 6),
    ('Les Miserables', 'Victor Hugo', '9780451419439', '1862-01-01', 15.99, 3),
    ('Ulysses', 'James Joyce', '9780199535675', '1922-02-02', 18.99, 2),
    ('Madame Bovary', 'Gustave Flaubert', '9780140449129', '1857-01-01', 10.99, 6),
    ('The Divine Comedy', 'Dante Alighieri', '9780142437221', '1320-01-01', 14.99, 4),
    ('The Iliad', 'Homer', '9780140275360', '750-01-01', 9.99, 8),
    ('The Aeneid', 'Virgil', '9780143106296', '19-01-01', 11.99, 5),
    ('The Stranger', 'Albert Camus', '9780679720201', '1942-04-01', 12.99, 7),
    ('One Hundred Years of Solitude', 'Gabriel Garcia Marquez', '9780060883287', '1967-06-05', 14.99, 6),
    ('The Metamorphosis', 'Franz Kafka', '9780553213690', '1915-01-01', 6.99, 8),
    ('Don Quixote', 'Miguel de Cervantes', '9780060934347', '1605-01-16', 17.99, 4),
    ('Heart of Darkness', 'Joseph Conrad', '9780486264646', '1899-01-01', 5.99, 9),
    ('The Picture of Dorian Gray', 'Oscar Wilde', '9780141439570', '1890-06-20', 7.99, 6),
    ('The Trial', 'Franz Kafka', '9780805209990', '1925-04-26', 10.99, 5),
    ('The Sound and the Fury', 'William Faulkner', '9780679732242', '1929-10-07', 12.99, 4),
    ('Lolita', 'Vladimir Nabokov', '9780679723165', '1955-09-15', 14.99, 3),
    ('Catch-22', 'Joseph Heller', '9781451626650', '1961-11-10', 9.99, 8),
    ('Slaughterhouse-Five', 'Kurt Vonnegut', '9780440180296', '1969-03-31', 8.99, 5);
    ```
4. **Run the API:**
    - Ensure you have a web server set up (e.g., Apache, Nginx) that points to the api directory.
    - Start your Web Server.


#### Client Setup
1. **Clone the Repository:**
Clone the repository from GitHub to your local machine:
```bash
git clone https://github.com/panagiotis-k/bookstore
```


2. **Install Dependencies:**
    - Navigate to the client directory.
    ```bash
    cd client
    ```
    - Run `npm install` to install the necessary dependencies.
    ```bash
    npm install
    ```
    The client project uses the following dependencies:
    ```json
    {
        "axios": "^1.7.2",
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "react-modal": "^3.16.1",
        "react-router-dom": "^6.25.1",
        "react-scripts": "5.0.1"
    }
    ```
3. **Configure Environment Variables:**
    - Create a `.env` file in the client directory if it does not exist.
    - Add your environment-specific variables.
    ```bash
    REACT_APP_API_BASE_URL=http://localhost/bookstore/api/books
    REACT_APP_API_USERNAME=<your_api_username>
    REACT_APP_API_PASSWORD=<your_api_password>
    ```
4. **Run the Client:**
    - In the client directory, run `npm start` to start the React development server.
    ```bash
    npm start
    ```
    - Open your browser and navigate to `http://localhost:3000`.

### Usage
- Access the client at `http://localhost:3000`.
- Ensure your API server is running and accessible by the client.


### Sensitive Information
Sensitive files like `database.php`,`auth.php` (api) and `client/.env` (client) are excluded from version control via `.gitignore` to protect credentials.

---

## API Documentation

### Base URL
The base URL for the API is: `http://api.panagiotiskordas.gr`.

### Authentication
All endpoints require basic authentication. You need to provide your API credentials with each request.

### Endpoints

1. **Get All Books:**
    -   URL: `/books`
    -   Method: `GET`
    -   Authorization: Basic Auth
        - Username: your_api_username
        - Password: your_api_password
    -   Description: Retrieve a list of all books.
    -   Successful Response:
    ```json
    {
        "tt": 1722169176,
        "books": [
            {
            "id": 1,
            "title": "Crime and Punishment",
            "author": "Fyodor Dostoevsky",
            "isbn": "9780140449136",
            "publishedDate": "1866-01-01",
            "price": 11.99,
            "quantity": 3
            },
            ...
        ],
        "totalBooks": 2,
        "totalPages": 1
    }
    ```
2. **Get Book by ID:**
    -   URL: `/books/:id`
    -   Method: `GET`
    -   Authorization: Basic Auth
        - Username: your_api_username
        - Password: your_api_password
    -   Description: Retrieve details of a specific book by its ID.
    -   Successful Response:
    ```json
    {
        "id": 1,
        "title": "Crime and Punishment",
        "author": "Fyodor Dostoevsky",
        "isbn": "9780140449136",
        "publishedDate": "1866-01-01",
        "price": 11.99,
        "quantity": 3
    }
    ```
3. **Create a Book:**
    -   URL: `/books`
    -   Method: `POST`
    -   Authorization: Basic Auth
        - Username: your_api_username
        - Password: your_api_password
    -   Description: Add a new book.
    -   Request Body:
    ```json
    {
        "title": "New Book",
        "author": "Author Name",
        "isbn": "1234567890",
        "publishedDate": "2024-01-01",
        "price": 19.99,
        "quantity": 10
    }
    ```
    - Successful Response:
    ```json
    {
        "status": "Book created"
    }
    ```
4. **Update a Book:**
    -   URL: `/books/:id`
    -   Method: `PUT`
    -   Authorization: Basic Auth
        - Username: your_api_username
        - Password: your_api_password
    -   Description: Update an existing book by its ID.
    -   Request Body:
    ```json
    {
        "title": "Updated Book",
        "author": "Updated Author",
        "isbn": "1234567890",
        "publishedDate": "2024-01-01",
        "price": 19.99,
        "quantity": 10
    }
    ```
    - Successful Response:
    ```json
    {
        "status": "Book updated"
    }
    ```
5. **Delete  a Book:**
    -   URL: `/books/:id`
    -   Method: `DELETE`
    -   Authorization: Basic Auth
        - Username: your_api_username
        - Password: your_api_password
    - Description: Delete a book by its ID.
    - Successful Response:
    ```json
    {
        "status": "Book deleted"
    }
    ```
### Error Messages
The API responds with appropriate HTTP status codes and error messages for various error conditions:
- 400 Bad Request
    - Cause: Invalid input or missing required parameters.
    - Response:
    ```json
    {
        "error": "Invalid input"
    }
    ```
- 401 Unauthorized
    - Cause: Authentication failed or missing credentials.
    - Response:
    ```json
    {
        "error": "Unauthorized"
    }
    ```
- 404 Not Found
    - Cause: The requested resource does not exist.
    - Response:
    ```json
    {
        "error": "Book not found"
    }
    ```
- 500 Internal Server Error
    - Cause: An error occurred on the server.
    - Response:
    ```json
    {
        "error": "Server error"
    }
    ```

---

## Production URLs
- Frontend URL: [http://app.panagiotiskordas.gr](http://app.panagiotiskordas.gr)
- API URL: [http://api.panagiotiskordas.gr](http://api.panagiotiskordas.gr)

---

## Testing

### Overview

Integration tests have been implemented to ensure that the Bookstore API functions correctly. These tests cover various endpoints and operations, verifying that the API behaves as expected under different scenarios.

### Integration Tests

#### Purpose

The integration tests are designed to verify the following:
- Retrieval of all books
- Retrieval of a specific book by ID
- Creation of a new book
- Updating an existing book
- Deleting a book

These tests help ensure that the API endpoints work correctly with the database and other components of the system.

#### Technologies Used

- **PHPUnit**: A popular testing framework for PHP, used to write and run the tests.
- **Guzzle**: A PHP HTTP client used to send HTTP requests to the API endpoints during testing.

#### Test Summary

The following tests were implemented:

1. **Get All Books**:
   - Sends a GET request to the `/books` endpoint.
   - Verifies the status code is 200.
   - Checks if the response contains an array of books.

2. **Get Book by ID**:
   - Sends a GET request to the `/books/1` endpoint.
   - Verifies the status code is 200.
   - Checks if the response contains the expected book details.

3. **Create a Book**:
   - Sends a POST request to the `/books` endpoint with a new book's details.
   - Verifies the status code is 201.
   - Checks if the response confirms the book was created.

4. **Update a Book**:
   - Sends a PUT request to the `/books/1` endpoint with updated book details.
   - Verifies the status code is 200.
   - Checks if the response confirms the book was updated.

5. **Delete a Book**:
   - Sends a DELETE request to the `/books/1` endpoint.
   - Verifies the status code is 200.
   - Checks if the response confirms the book was deleted.

#### Test Results

All tests passed successfully, indicating that the API endpoints are functioning as expected.

```plaintext
OK (5 tests, 16 assertions)
```