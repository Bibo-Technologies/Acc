
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




var mnu = document.getElementById("mnu");
var mstate = false;

function slideMenu() {
  mstate = !mstate;
  if(mstate){
    mnu.style.left = "0px";
    mnu.style.boxShadow = "100px 0px 300px 0px rgba(0,0,0,0.3)";
  }
  else{
    mnu.style.left = "-250px";
    mnu.style.boxShadow = "0px 0px 00px 0px rgba(0,0,0,0.0)";
  }
}

// Get the button and popup
var uploadBtn = document.getElementById("uploadBtn");
var uploadPopup = document.getElementById("uploadPopup");

// Get the close button
var closeBtn = uploadPopup.querySelector(".close");

// When the user clicks the button, open the popup
uploadBtn.addEventListener("click", function() {
  uploadPopup.style.display = "block";
});

// When the user clicks on the close button, close the popup
closeBtn.addEventListener("click", function() {
  uploadPopup.style.display = "none";
});

// When the user clicks anywhere outside of the popup, close it
window.addEventListener("click", function(event) {
  if (event.target == uploadPopup) {
    uploadPopup.style.display = "none";
  }
});
// Handle form submission
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission

  try {
    // Get form values
    const productName = document.getElementById("productName").value;
    const productDescription = document.getElementById("productDescription").value;
    const productImage = document.getElementById("productImage").files[0]; // Get the first selected file
    const costPrice = document.getElementById("costPrice").value;
    const lastSellPrice = document.getElementById("lastSellPrice").value;
    const buyingPrice = document.getElementById("buyingPrice").value;
    const initialStock = document.getElementById("initialStock").value;
    const dateOfStock = document.getElementById("dateOfStock").value;
    const stockedBy = document.getElementById("stockedBy").value;

    // Upload product image to Firebase Storage
    const imageRef = storageRef(storage, 'productImages/' + productImage.name);
    await uploadBytes(imageRef, productImage);

    // Get download URL of the uploaded image
    const imageUrl = await getDownloadURL(imageRef);

    // Get current date and time
    const currentDate = new Date();
    const dateTime = currentDate.toISOString();

    // Generate product ID
    const productId = await generateProductId(); // Await the result of generateProductId()

    // Save product data to Firebase Database with product ID as node name
    const newProductRef = ref(database, 'products/' + productId);
    set(newProductRef, {
      productName: productName,
      productDescription: productDescription,
      imageUrl: imageUrl,
      costPrice: costPrice,
      lastSellPrice: lastSellPrice,
      buyingPrice: buyingPrice,
      initialStock: initialStock,
      dateOfStock: dateOfStock,
      stockedBy: stockedBy,
      dateTime: dateTime
    });

    // Clear form fields
    uploadForm.reset();

    // Close the popup
    uploadPopup.style.display = "none";
  } catch (error) {
    console.error('Error submitting form:', error);
  }
});

// Function to generate product ID
async function generateProductId() {
  try {
    // Fetch the latest product ID from the database
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    const productIds = [];
    snapshot.forEach((childSnapshot) => {
      productIds.push(parseInt(childSnapshot.key));
    });

    // If there are no products in the database, start with '0001'
    if (productIds.length === 0) {
      return '0001';
    }

    // Increment the latest product ID by 1
    const latestProductId = Math.max(...productIds);
    const nextProductId = (latestProductId + 1).toString().padStart(4, '0');

    return nextProductId;
  } catch (error) {
    console.error('Error generating product ID:', error);
    throw error; // Propagate the error to the caller
  }
}
// Function to fetch product data from Firebase
function fetchProductData() {
  try {
    const productsRef = ref(database, 'products');
    
    // Listen for changes to the products reference
    onValue(productsRef, (snapshot) => {
      // Clear existing product list
      const productList = document.getElementById('productList');
      productList.innerHTML = ''; // Clear existing product list
      
      snapshot.forEach((childSnapshot) => {
        const productData = childSnapshot.val();
        const productId = childSnapshot.key;

        // Create HTML elements for each product
        const productItem = document.createElement('div');
        productItem.classList.add('content-bar');
        
        const itemNum = document.createElement('div');
        itemNum.classList.add('itemnum');
        itemNum.textContent = `#${productId}`; // Use the product ID as item number
        
        const itemTitle = document.createElement('div');
        itemTitle.classList.add('itemtitle');
        itemTitle.textContent = productData.productName; // Use the product name as item title
        
        const itemPrice = document.createElement('div');
        itemPrice.classList.add('itemprice');
        itemPrice.textContent = `Ush. ${productData.lastSellPrice}/=`; // Use the sell price as item price
        
        const itemStock = document.createElement('div');
        itemStock.classList.add('itemstock');
        itemStock.textContent = `${productData.initialStock} In Stock`; // Use the initial stock as item stock
        
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('btncontainer');
        
        const editBtn = document.createElement('button');
        editBtn.classList.add('cbbtn');
        editBtn.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
        
        const addToCartBtn = document.createElement('button');
        addToCartBtn.classList.add('cbbtn');
        addToCartBtn.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i>';

        // Append elements to the product item
        btnContainer.appendChild(addToCartBtn)
        btnContainer.appendChild(editBtn);
        productItem.appendChild(itemNum);
        productItem.appendChild(itemTitle);
        productItem.appendChild(itemPrice);
        productItem.appendChild(itemStock);
        productItem.appendChild(btnContainer);
        
        // Append the product item to the product list container
        productList.appendChild(productItem);
      });
    });
  } catch (error) {
    console.error('Error fetching product data:', error);
  }
}

// Call the fetchProductData function to retrieve and display product data
fetchProductData();
function filterProductItems(searchQuery) {
  console.log('Filtering product items'); // Log a message when filtering is performed
  const productList = document.getElementById('productList');
  const productItems = productList.getElementsByClassName('content-bar');
  
  for (const productItem of productItems) {
    const itemTitle = productItem.querySelector('.itemtitle');
    const productName = itemTitle.textContent.toLowerCase();
    
    if (productName.includes(searchQuery.toLowerCase())) {
      productItem.style.display = 'block'; // Show matching product item
    } else {
      productItem.style.display = 'none'; // Hide non-matching product item
    }
  }
}


const searchInput = document.querySelector('.search');
searchInput.addEventListener('input', function(event) {
  console.log('Input event triggered'); // Log a message when the input event is triggered
  const searchQuery = event.target.value.trim(); // Trim whitespace from search query
  filterProductItems(searchQuery);
});



