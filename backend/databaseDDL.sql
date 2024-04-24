CREATE DATABASE recommendations_DB;
USE recommendations_DB;

CREATE TABLE Restaurants(
    business_id varchar(255),
    name varchar(255),
    address varchar(255),
    latitude decimal(10,8),
    longitude decimal(11, 8),
    stars double(2, 1),
    cat_1 varchar(255),
    cat_2 varchar(255),
    cat_3 varchar(255),
    drink_score DECIMAL(20, 15),
    value_score DECIMAL(20, 15),
    food_score DECIMAL(20, 15),
    service_score DECIMAL(20, 15),
    review_count int(10),
    PRIMARY KEY (business_id)
);

CREATE TABLE Reviews(
    review_id varchar(255),
    business_id varchar(255),
    stars double(2, 1),
    text LONGTEXT,
    PRIMARY KEY (review_id),
    FOREIGN KEY (business_id) REFERENCES Restaurants(business_id)
);

CREATE TABLE Attractions(
    longitude decimal(11, 8),
    latitude decimal(10,8),
    name varchar(255),
    type varchar(255),
    attraction_id varchar(255),
    address varchar(255),
    website varchar(255),
    PRIMARY KEY (attraction_id)
);

CREATE TABLE Nearby(
    business_id varchar(255),
    attraction_id varchar(255),
    distance decimal(20, 10),
    PRIMARY KEY (business_id, attraction_id),
    FOREIGN KEY (business_id) REFERENCES Restaurants(business_id),
    FOREIGN KEY (attraction_id) REFERENCES Attractions(attraction_id)
);