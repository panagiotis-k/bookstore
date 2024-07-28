<?php

use PHPUnit\Framework\TestCase;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class BookApiTest extends TestCase {
    private $client;

    protected function setUp(): void {
        $this->client = new Client([
            'base_uri' => 'http://api.panagiotiskordas.gr',
            'auth' => ['your_api_username', 'your_api_password'],
            'http_errors' => false 
        ]);
    }

    public function testGetAllBooks() {
        try {
            $response = $this->client->get('/books');
            $statusCode = $response->getStatusCode();
            $body = (string) $response->getBody();
            $data = json_decode($body, true);

            $this->assertEquals(200, $statusCode, "Unexpected status code: $statusCode. Response body: $body");
            $this->assertIsArray($data, "Response is not an array. Response body: $body");
            $this->assertArrayHasKey('books', $data, "Response does not contain 'books' key. Response body: $body");
        } catch (RequestException $e) {
            $this->fail("HTTP request failed: " . $e->getMessage());
        }
    }

    public function testGetBookById() {
        try {
            $response = $this->client->get('/books/1');
            $statusCode = $response->getStatusCode();
            $body = (string) $response->getBody();
            $data = json_decode($body, true);

            $this->assertEquals(200, $statusCode, "Unexpected status code: $statusCode. Response body: $body");
            $this->assertIsArray($data, "Response is not an array. Response body: $body");
            $this->assertArrayHasKey('id', $data, "Response does not contain 'id' key. Response body: $body");
            $this->assertEquals(1, $data['id'], "Book ID does not match. Response body: $body");
        } catch (RequestException $e) {
            $this->fail("HTTP request failed: " . $e->getMessage());
        }
    }

    public function testCreateBook() {
        try {
            $response = $this->client->post('/books', [
                'json' => [
                    'title' => 'New Book',
                    'author' => 'Author Name',
                    'isbn' => '1234567890',
                    'publishedDate' => '2024-01-01',
                    'price' => 19.99,
                    'quantity' => 10
                ]
            ]);

            $statusCode = $response->getStatusCode();
            $body = (string) $response->getBody();
            $data = json_decode($body, true);

            $this->assertEquals(201, $statusCode, "Unexpected status code: $statusCode. Response body: $body");
            $this->assertArrayHasKey('status', $data, "Response does not contain 'status' key. Response body: $body");
            $this->assertEquals('Book created', $data['status'], "Unexpected status message. Response body: $body");
        } catch (RequestException $e) {
            $this->fail("HTTP request failed: " . $e->getMessage());
        }
    }

    public function testUpdateBook() {
        try {
            $response = $this->client->put('/books/1', [
                'json' => [
                    'title' => 'Updated Book',
                    'author' => 'Updated Author',
                    'isbn' => '1234567890',
                    'publishedDate' => '2024-01-01',
                    'price' => 19.99,
                    'quantity' => 10
                ]
            ]);

            $statusCode = $response->getStatusCode();
            $body = (string) $response->getBody();
            $data = json_decode($body, true);

            $this->assertEquals(200, $statusCode, "Unexpected status code: $statusCode. Response body: $body");
            $this->assertArrayHasKey('status', $data, "Response does not contain 'status' key. Response body: $body");
            $this->assertEquals('Book updated', $data['status'], "Unexpected status message. Response body: $body");
        } catch (RequestException $e) {
            $this->fail("HTTP request failed: " . $e->getMessage());
        }
    }

    public function testDeleteBook() {
        try {
            $response = $this->client->delete('/books/1');
            $statusCode = $response->getStatusCode();
            $body = (string) $response->getBody();
            $data = json_decode($body, true);

            $this->assertEquals(200, $statusCode, "Unexpected status code: $statusCode. Response body: $body");
            $this->assertArrayHasKey('status', $data, "Response does not contain 'status' key. Response body: $body");
            $this->assertEquals('Book deleted', $data['status'], "Unexpected status message. Response body: $body");
        } catch (RequestException $e) {
            $this->fail("HTTP request failed: " . $e->getMessage());
        }
    }
}
