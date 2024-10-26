const UWU_TO_SOL_API = 'https://pro-api.solscan.io/v2.0/token/price?address=UwU8RVXB69Y6Dcju6cN2Qef6fykkq6UUNpB15rZku6Z';

const requestOptions = {
  method: "get",
  headers: {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3Mjk4NjkyNTE3ODEsImVtYWlsIjoiY2x2dGNoZGVzaWduc0BnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3Mjk4NjkyNTF9.k4QFwynlrXfSdLMP6yCa3jANSFIRf8mNkAQnP0IZBiA"}
};

var collections = [
    { name: "UwU Punk", image: "https://example.com/uwupunk.jpg", link: "https://magiceden.io/marketplace/uwupunk", symbol: "uwupunk" },
    { name: "UwU", image: "https://example.com/uwu.jpg", link: "https://magiceden.io/marketplace/uwu_", symbol: "uwu_" },
    { name: "Unigirls", image: "https://example.com/unigirls.jpg", link: "https://magiceden.io/marketplace/unigirls", symbol: "unigirls" },
    { name: "UwUmojii", image: "https://example.com/uwumojii.jpg", link: "https://magiceden.io/marketplace/uwumojii", symbol: "uwumojii" },
    { name: "Unipuppets", image: "https://example.com/unipuppets.jpg", link: "https://magiceden.io/marketplace/Unipuppets", symbol: "Unipuppets" },
    { name: "UwU Banners", image: "https://example.com/uwu-banners.jpg", link: "https://www.tensor.trade/trade/uwu_banners", symbol: "uwu_banners" }
];

var wallet = null;
var uwuToSolRate = 0;

async function fetchUwuToSolRate() {
    try {
        const response = await fetch(UWU_TO_SOL_API, requestOptions);
        const data = await response.json();
        uwuToSolRate = data.data.price;
        return uwuToSolRate;
    } catch (error) {
        console.error('Error fetching UWU to SOL rate:', error);
        return 0;
    }
}

function convertUwuToSol(uwuAmount) {
    return uwuAmount * uwuToSolRate;
}

async function fetchFloorPrices() {
    const magicEdenApi = "https://api-mainnet.magiceden.dev/v2/collections/";
    const tensorApi = "https://api.tensor.so/graphql";

    for (let collection of collections) {
        try {
            if (collection.link.includes("magiceden.io")) {
                const response = await fetch(`${magicEdenApi}${collection.symbol}/stats`);
                const data = await response.json();
                collection.floorPrice = data.floorPrice / 1e9; // Convert from lamports to SOL
            } else if (collection.link.includes("tensor.trade")) {
                const response = await fetch(tensorApi, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                        query CollectionStats($slug: String!) {
                            collectionStats(slug: $slug) {
                                floorPrice
                            }
                        }`,
                        variables: { slug: collection.symbol }
                    }),
                });
                const data = await response.json();
                collection.floorPrice = data.data.collectionStats.floorPrice / 1e9; // Convert from lamports to SOL
            }
        } catch (error) {
            console.error(`Error fetching floor price for ${collection.name}:`, error);
            collection.floorPrice = null;
        }
    }
}

function createCollectionCard(collection) {
    var card = document.createElement('div');
    card.className = 'collection-card';
    
    var img = document.createElement('img');
    img.src = collection.image;
    img.alt = collection.name;
    img.className = 'collection-image';
    
    var info = document.createElement('div');
    info.className = 'collection-info';
    
    var name = document.createElement('div');
    name.className = 'collection-name';
    name.textContent = collection.name;
    
    var floorPrice = document.createElement('div');
    floorPrice.className = 'floor-price';
    floorPrice.textContent = `Floor Price: ${collection.floorPrice ? collection.floorPrice.toFixed(4) + ' SOL' : 'Loading...'}`;
    
    var uwuPrice = document.createElement('div');
    uwuPrice.className = 'uwu-price';
    uwuPrice.textContent = 'Loading UWU price...';
    
    var buyButton = document.createElement('button');
    buyButton.className = 'buy-button';
    buyButton.textContent = 'Buy NFT';
    buyButton.onclick = function() { initiateNFTPurchase(collection); };
    
    var viewLink = document.createElement('a');
    viewLink.href = collection.link;
    viewLink.target = '_blank';
    viewLink.className = 'collection-link';
    viewLink.textContent = 'View on Marketplace';
    
    info.appendChild(name);
    info.appendChild(floorPrice);
    info.appendChild(uwuPrice);
    info.appendChild(buyButton);
    info.appendChild(viewLink);
    card.appendChild(img);
    card.appendChild(info);
    
    return card;
}

function updateUwuPrices() {
    const uwuPriceElements = document.querySelectorAll('.uwu-price');
    collections.forEach((collection, index) => {
        if (collection.floorPrice) {
            const uwuAmount = collection.floorPrice / uwuToSolRate;
            uwuPriceElements[index].textContent = `Price in UWU: ${uwuAmount.toFixed(4)} UWU`;<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UwU NFT Collections</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background-color: #000000;
            color: #FF85FF;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            text-align: center;
            color: #FF85FF;
            font-size: 2em;
            margin-bottom: 30px;
        }
        .collection-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }
        .collection-card {
            background-color: #1A001A;
            border: 2px solid #FF85FF;
            border-radius: 0;
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        .collection-card:hover {
            transform: translateY(-5px);
        }
        .collection-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .collection-info {
            padding: 15px;
        }
        .collection-name {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 1.2em;
        }
        .collection-link, .buy-button {
            display: inline-block;
            background-color: #FF85FF;
            color: #000000;
            text-decoration: none;
            padding: 5px 10px;
            margin-top: 10px;
            font-weight: bold;
            cursor: pointer;
            border: none;
        }
        .collection-link:hover, .buy-button:hover {
            background-color: #FF00FF;
        }
        .price {
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🦄 UwU NFT Collections 🦄</h1>
        <div class="collection-grid" id="collectionGrid"></div>
    </div>
     <script>
        // Suppress console errors
        console.error = function() {};

    <script>
        const UWU_TO_SOL_API = 'https://pro-api.solscan.io/v2.0/token/price?address=UwU8RVXB69Y6Dcju6cN2Qef6fykkq6UUNpB15rZku6Z';

        const requestOptions = {
            method: "get",
            headers: {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3Mjk4NjkyNTE3ODEsImVtYWlsIjoiY2x2dGNoZGVzaWduc0BnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3Mjk4NjkyNTF9.k4QFwynlrXfSdLMP6yCa3jANSFIRf8mNkAQnP0IZBiA"}
        };

        const collections = [
            { 
                name: "UwUmojii", 
                link: "https://magiceden.io/marketplace/uwumojii", 
                symbol: "uwumojii",
                image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/uwumojii_pfp_1725144242878.png"
            },
            { 
                name: "Unipuppets", 
                link: "https://magiceden.io/marketplace/Unipuppets", 
                symbol: "Unipuppets",
                image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https://we-assets.pinit.io/KfYEZpmddMeTN7uan3aj7HDKYpesX7spFjPRbZ2LXZ7/aa8150a8-cdd1-41b6-b9f6-5200e036e9b2/141"
            },
            { 
                name: "Unigirls", 
                link: "https://magiceden.io/marketplace/unigirls", 
                symbol: "unigirls",
                image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https://na-assets.pinit.io/EcQG1GUxNNk7BFQ6Fgq8nz3JbBQg82TtPDnPSj3izVfb/51401c4c-a30d-4e39-9eb2-1e6abe2b4345/37"
            },
            { 
                name: "UwU Punk", 
                link: "https://magiceden.io/marketplace/uwupunk", 
                symbol: "uwupunk",
                image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https://na-assets.pinit.io/3wr3Var2fngt5svoBGR4bHjEmJBC713BDrMvtnw656iL/c0377a59-82d8-4958-b30f-a72aae3b1dbe/13"
            },
            { 
                name: "Unicornio", 
                link: "https://magiceden.io/marketplace/unicornio", 
                symbol: "unicornio",
                image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https://na-assets.pinit.io/AiBWVkRxDHY1t2ePcmGiwHkfSih1fpXFuzso4ce5qxvQ/5932c417-9560-4e48-9973-2383bb365123/68"
            }
        ];

        var wallet = null;
        var uwuToSolRate = 0;

        async function fetchUwuToSolRate() {
            try {
                const response = await fetch(UWU_TO_SOL_API, requestOptions);
                const data = await response.json();
                uwuToSolRate = data.data.price;
                return uwuToSolRate;
            } catch (error) {
                console.error('Error fetching UWU to SOL rate:', error);
                return 0;
            }
        }

        function convertUwuToSol(uwuAmount) {
            return uwuAmount * uwuToSolRate;
        }

        async function fetchFloorPrices() {
            const magicEdenApi = "https://api-mainnet.magiceden.dev/v2/collections/";

            for (let collection of collections) {
                try {
                    const response = await fetch(`${magicEdenApi}${collection.symbol}/stats`);
                    const data = await response.json();
                    collection.floorPrice = data.floorPrice / 1e9; // Convert from lamports to SOL
                } catch (error) {
                    console.error(`Error fetching floor price for ${collection.name}:`, error);
                    collection.floorPrice = null;
                }
            }
        }

        function createCollectionCard(collection) {
            var card = document.createElement('div');
            card.className = 'collection-card';
            
            var img = document.createElement('img');
            img.src = collection.image;
            img.alt = collection.name;
            img.className = 'collection-image';
            
            var info = document.createElement('div');
            info.className = 'collection-info';
            
            var name = document.createElement('div');
            name.className = 'collection-name';
            name.textContent = collection.name;
            
            var floorPrice = document.createElement('div');
            floorPrice.className = 'floor-price';
            floorPrice.textContent = `Floor Price: ${collection.floorPrice ? collection.floorPrice.toFixed(4) + ' SOL' : 'Loading...'}`;
            
            var uwuPrice = document.createElement('div');
            uwuPrice.className = 'uwu-price';
            uwuPrice.textContent = 'Loading UWU price...';
            
            var buyButton = document.createElement('button');
            buyButton.className = 'buy-button';
            buyButton.textContent = 'Buy NFT';
            buyButton.onclick = function() { initiateNFTPurchase(collection); };
            
            var viewLink = document.createElement('a');
            viewLink.href = collection.link;
            viewLink.target = '_blank';
            viewLink.className = 'collection-link';
            viewLink.textContent = 'View on Marketplace';
            
            info.appendChild(name);
            info.appendChild(floorPrice);
            info.appendChild(uwuPrice);
            info.appendChild(buyButton);
            info.appendChild(viewLink);
            card.appendChild(img);
            card.appendChild(info);
            
            return card;
        }

        function updateUwuPrices() {
            const uwuPriceElements = document.querySelectorAll('.uwu-price');
            collections.forEach((collection, index) => {
                if (collection.floorPrice) {
                    const uwuAmount = collection.floorPrice / uwuToSolRate;
                    uwuPriceElements[index].textContent = `Price in UWU: ${uwuAmount.toFixed(4)} UWU`;
                }
            });
        }

        function initiateNFTPurchase(collection) {
            // Placeholder function for NFT purchase
            alert(`Initiating purchase of ${collection.name}. This feature is not yet implemented.`);
        }

        async function initializeAndRender() {
            await fetchUwuToSolRate();
            await fetchFloorPrices();
            renderCollections();
            updateUwuPrices();
        }

        function renderCollections() {
            var collectionGrid = document.getElementById('collectionGrid');
            collectionGrid.innerHTML = ''; // Clear existing content
            collections.forEach(function(collection) {
                collectionGrid.appendChild(createCollectionCard(collection));
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAndRender);
        } else {
            initializeAndRender();
        }

        // Refresh data every 5 minutes
        setInterval(initializeAndRender, 300000);

        }
    });
}

async function initializeAndRender() {
    await fetchUwuToSolRate();
    await fetchFloorPrices();
    renderCollections();
    updateUwuPrices();
}

function renderCollections() {
    var collectionGrid = document.getElementById('collectionGrid');
    collectionGrid.innerHTML = ''; // Clear existing content
    collections.forEach(function(collection) {
        collectionGrid.appendChild(createCollectionCard(collection));
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAndRender);
} else {
    initializeAndRender();
}

// Refresh data every 5 minutes
setInterval(initializeAndRender, 300000);
    </script>
</body>
</html>
