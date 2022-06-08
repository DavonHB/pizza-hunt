const { response } = require("express");
const req = require("express/lib/request");

// create variable to hold db connection
let db;

// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);

// event will emit database versio changes
request.onupgradeneeded = function(event) {
    // save a reference to the db
    const db = event.target.result;
    // create an object store (table) called `new pizza`, set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// success
request.onsuccess = function(event) {
    // when db is successfully created with its object store or established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run logic
    if (navigator.onLine) {

    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// function if attempt is made to submit new pizza without internet connection
function saveRecord(record) {
    // open a new transaction with the db with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readWrite');

    // access object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to your store with add method
    pizzaObjectStore.add(record);
};

function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readWrite');

    // access object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    // after a successful getAll() execution
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, send to api server
        if(getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readWrite');
                // access the 'new_pizza' object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                // clear all items in store
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
};

// lsiten for app coming back online
window.addEventListener('online', uploadPizza);