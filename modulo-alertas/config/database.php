<?php
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        $host = $_ENV['POSTGRES_HOST'] ?? 'localhost';
        $dbname = $_ENV['POSTGRES_DATABASE'] ?? 'safealert';
        $username = $_ENV['POSTGRES_USER'] ?? 'postgres';
        $password = $_ENV['POSTGRES_PASSWORD'] ?? '';
        
        try {
            $this->connection = new PDO(
                "pgsql:host=$host;dbname=$dbname",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            die("Error de conexión: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
}
?>
