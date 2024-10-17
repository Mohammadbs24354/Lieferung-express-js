CREATE TABLE warenkorb (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    anzahl INT NOT NULL CHECK (anzahl > 0),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    UNIQUE KEY unique_user_product (user_id, product_id)
);