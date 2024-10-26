// Configuration and Constants
const UWU_TO_SOL_API = 'https://pro-api.solscan.io/v2.0/token/price?address=UwU8RVXB69Y6Dcju6cN2Qef6fykkq6UUNpB15rZku6Z';
const MAGIC_EDEN_API = "https://api-mainnet.magiceden.dev/v2";
const UPDATE_INTERVAL = 300000; // 5 minutes

const requestOptions = {
    method: "get",
    headers: {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
};

const collections = [
    { 
        name: "UwU Punk", 
        link: "https://magiceden.io/marketplace/uwupunk", 
        symbol: "uwupunk",
        image: "https://img-cdn.magiceden.dev/..."
    },
    // other collections
];

// State Management
let wallet = null;
let uwuToSolRate = 0;

// UI Helper Functions
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showMessage(message, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isError ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    document.querySelector('.container').insertBefore(messageDiv, document.querySelector('.collection-grid'));
    setTimeout(() => messageDiv.remove(), 5000);
}

// Theme Management
function setTheme(themeName) {
    document.body.className = themeName;
    localStorage.setItem('theme', themeName);
}

function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'night-mode';
    setTheme(savedTheme);
}

// Wallet Management
async function connectWallet() {
    // Implement wallet connection logic
}

// API Interactions
async function fetchUwuToSolRate() {
    try {
        const response = await fetch(UWU_TO_SOL_API, requestOptions);
        const data = await response.json();
        uwuToSolRate = data.data.price;
        return uwuToSolRate;
    } catch (error) {
        console.error('Error fetching UWU to SOL rate:', error);
        showMessage('Error fetching current exchange rate.', true);
        return 0;
    }
}

async function fetchFloorPrices() {
    const magicEdenApi = `${MAGIC_EDEN_API}/collections/`;
    // Fetch and update each collection's floor price
}

// Initialize Theme
applyTheme();

// Add these new properties to each collection object
collections.forEach((collection, index) => {
    collection.createdAt = new Date(2023, 0, 1 + index).getTime(); // Example creation dates
    collection.sales24h = Math.floor(Math.random() * 100); // Random sales data for demonstration
});

// Filter function
function applyFilter() {
    // Filter logic based on user selection
}

// Initial rendering of the page
function initializePage() {
    showLoading();
    fetchUwuToSolRate().then(rate => {
        updatePrices();
        renderCollections();
        hideLoading();
    });
}

// Render collection data
function renderCollections(collectionsToRender = collections) {
    const collectionGrid = document.getElementById("collectionGrid");
    collectionGrid.innerHTML = "";
    collectionsToRender.forEach(collection => {
        collectionGrid.appendChild(createCollectionCard(collection));
    });
}

// Create individual collection cards
function createCollectionCard(collection) {
    const card = document.createElement("div");
    card.className = "collection-card";
    card.innerHTML = `
        <img src="${collection.image}" alt="${collection.name}" class="collection-image">
        <div class="collection-info">
            <h3 class="collection-name">${collection.name}</h3>
            <div class="price-info">Floor Price: ${collection.floorPrice} SOL</div>
            <div class="button-container">
                <a href="${collection.link}" class="collection-link" target="_blank">View</a>
                <button class="buy-button" onclick="buyNFT('${collection.symbol}')">Buy</button>
            </div>
        </div>
    `;
    return card;
}

// Update prices periodically
async function updatePrices() {
    // Logic to update prices every UPDATE_INTERVAL
}

// Buy NFT (stub for now)
async function buyNFT(symbol) {
    // Implement buy functionality
    showMessage(`Attempting to buy ${symbol}...`);
}

initializePage();
