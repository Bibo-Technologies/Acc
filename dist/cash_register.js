
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";
import { getDatabase, ref, remove, push, get, update, onValue, child, set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged,sendPasswordResetEmail , signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBY46P1UIBori6Tk9d4OF3uohJ-bAfvK6Y",
  authDomain: "divine-accessories.firebaseapp.com",
  databaseURL: "https://divine-accessories-default-rtdb.firebaseio.com",
  projectId: "divine-accessories",
  storageBucket: "divine-accessories.appspot.com",
  messagingSenderId: "741636212415",
  appId: "1:741636212415:web:de6257778b617a6eae280a",
  measurementId: "G-412R22SPV3"
};

  const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Function to fetch and display matching items from Firebase based on input value
function displayMatchingItems(inputValue) {
    // Query Firebase to retrieve items whose names match the entered value
    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
      const matchingItems = [];
      snapshot.forEach((childSnapshot) => {
        const productData = childSnapshot.val();
        const productName = productData.productName;
        const productPrice = productData.buyingPrice; // Assuming 'price' is the property containing the price in your Firebase database
        if (productName.toLowerCase().includes(inputValue.toLowerCase())) {
          // Add the matching item to the list
          matchingItems.push({ name: productName, price: productPrice });
        }
      });
  
      // Populate the datalist with options containing the names of the matching items along with their prices
      const datalist = document.getElementById('product_names');
      datalist.innerHTML = ''; // Clear previous options
      matchingItems.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.name; // Set the option value to the item name
        option.textContent = `${item.name} @ Ush. ${item.price}`; // Set the option text to include item name and price
        datalist.appendChild(option);
      });
    });
  }
  
  // Event listener for input events on the "Type item" input field
  const typeItemInput = document.querySelector('.product-inputs-left input');
  typeItemInput.addEventListener('input', function(event) {
    const inputValue = event.target.value;
    displayMatchingItems(inputValue);
  });
  

  document.addEventListener("DOMContentLoaded", function() {
    // Get references to HTML elements
    const inputedProductName = document.getElementById("inputed_product_name");
    const productUnitCost = document.getElementById("productUnitCost");
    const itemDisplay = document.getElementById("itemDisplay");

    // Listen for input event on the input field
    inputedProductName.addEventListener("input", function() {
        const inputValue = inputedProductName.value.toLowerCase();
        const filteredProducts = product_list.filter(product => product.name.toLowerCase().includes(inputValue));
        updateDatalist(filteredProducts);
    });

    // Function to update the datalist options
    function updateDatalist(products) {
        const datalist = document.getElementById("product_names");
        datalist.innerHTML = "";
        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.name;
            datalist.appendChild(option);
        });
    }

    // Listen for click event on datalist options
    inputedProductName.addEventListener("click", function(event) {
        if (event.target.tagName === "OPTION") {
            const selectedProductName = event.target.value;
            const selectedProduct = product_list.find(product => product.name === selectedProductName);
            if (selectedProduct) {
                productUnitCost.value = selectedProduct.price;
                itemDisplay.innerText = selectedProduct.name;
            }
        }
    });
});
