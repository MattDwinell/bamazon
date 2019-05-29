DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  id INT(5) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT(10) NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department, price, stock_quantity)
VALUES ("apple", "produce", 1.00, 100), ("banana", "produce", 0.2, 300), ("chair", "furniture", 80.00, 10), ("table", "furniture", 160, 20), ("Juggling_ball","miscellaneous", 5.50, 300), ("dog_whistle", "pets", 5.00, 100), ("milk_bath_powder", "cosmetics", 50, 5);
SELECT * FROM products;