<?php

class BookController
{
    private $pdo;

    public function __construct($pdo){
        $this->pdo = $pdo;
    }

    public function getBooks($id = null){
        try{
            if($id){
                $stmt = $this->pdo->prepare('SELECT * FROM books WHERE id = :id');
                $stmt->execute(['id' => $id]);
                $book = $stmt->fetch(PDO::FETCH_ASSOC);

                if($book) {
                    echo json_encode($book);
                }else {
                    http_response_code(404);
                    echo json_encode(array('error' => 'Book not found'));
                }
            }else{
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
                $offset = ($page - 1) * $limit;
                $search = isset($_GET['search']) ? $_GET['search'] : '';

                $query = 'SELECT COUNT(*) FROM books WHERE title LIKE :search OR author LIKE :search';
                $stmt = $this->pdo->prepare($query);
                $stmt->execute(array('search' => "%$search%"));
                $totalBooks = $stmt->fetchColumn();

                $query = 'SELECT * FROM books WHERE title LIKE :search OR author LIKE :search LIMIT :limit OFFSET :offset';
                $stmt = $this->pdo->prepare($query);
                $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
                $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
                $stmt->execute();
                $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode([
                    'books' => $books,
                    'totalBooks' => $totalBooks,
                    'totalPages' => ceil($totalBooks / $limit)
                ]);
            }
        }catch(PDOException $e){
            http_response_code(500);
            echo json_encode(array('error' => 'Server error'));
        }
    }

    public function createBook(){
        try{
            $data = json_decode(file_get_contents('php://input'), true);

            if(!isset($data['title'], $data['author'], $data['isbn'], $data['publishedDate'], $data['price'], $data['quantity'])){
                http_response_code(400);
                echo json_encode(array('error' => 'Invalid input'));
                return;
            }

            $stmt = $this->pdo->prepare('INSERT INTO books (title, author, isbn, publishedDate, price, quantity) VALUES (:title, :author, :isbn, :publishedDate, :price, :quantity)');
            $stmt->execute([
                'title' => $data['title'],
                'author' => $data['author'],
                'isbn' => $data['isbn'],
                'publishedDate' => $data['publishedDate'],
                'price' => $data['price'],
                'quantity' => $data['quantity']
            ]);

            http_response_code(201);
            echo json_encode(array('status' => 'Book created'));
        }catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(array('error' => 'Server error'));
        }
    }

    public function updateBook($id){
        try{
            if(!$id){
                http_response_code(400);
                echo json_encode(array('error' => 'Invalid input'));
                return;
            }

            $data = json_decode(file_get_contents('php://input'), true);
            if(!isset($data['title'], $data['author'], $data['isbn'], $data['publishedDate'], $data['price'], $data['quantity'])) {
                http_response_code(400);
                echo json_encode(array('error' => 'Invalid input'));
                return;
            }
    

            $stmt = $this->pdo->prepare('UPDATE books SET title = :title, author = :author, isbn = :isbn, publishedDate = :publishedDate, price = :price, quantity = :quantity WHERE id = :id');
            $stmt->execute(array(
                'title' => $data['title'],
                'author' => $data['author'],
                'isbn' => $data['isbn'],
                'publishedDate' => $data['publishedDate'],
                'price' => $data['price'],
                'quantity' => $data['quantity'],
                'id' => $id
            ));

          

            echo json_encode(array('status' => 'Book updated'));
        }catch(PDOException $e){
            http_response_code(500);
            echo json_encode(array('error' => 'Server error'));
        }
    }

    public function deleteBook($id){
        try{
            if(!$id){
                http_response_code(400);
                echo json_encode(array('error' => 'Invalid input'));
                return;
            }

            $stmt = $this->pdo->prepare('DELETE FROM books WHERE id = :id');
            $stmt->execute(array('id' => $id));

            if($stmt->rowCount() === 0){
                http_response_code(404);
                echo json_encode(array('error' => 'Book not found'));
                return;
            }

            echo json_encode(array('status' => 'Book deleted'));
        }catch(PDOException $e){
            http_response_code(500);
            echo json_encode(array('error' => 'Server error'));
        }
    }
}
