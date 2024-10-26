(function() {
    // Configuration and Constants
    const UWU_TO_SOL_API = 'https://pro-api.solscan.io/v2.0/token/price?address=UwU8RVXB69Y6Dcju6cN2Qef6fykkq6UUNpB15rZku6Z';
    const MAGIC_EDEN_API = "https://api-mainnet.magiceden.dev/v2";
    const SOL_TO_USD_API = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';
    const UPDATE_INTERVAL = 60000; // 1 minute

    const requestOptions = {
        method: "GET",
        headers: {
            "Authorization": `Bearer your_magic_eden_api_key_here`,
            "Content-Type": "application/json"
        }
    };

    const uwuRequestOptions = {
        method: "GET",
        headers: {
            "token": "your_solscan_api_key_here"
        }
    };

    const collections = [
        { 
            name: "UwU Punk", 
            link: "https://magiceden.io/marketplace/uwupunk", 
            symbol: "uwupunk",
            image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https://na-assets.pinit.io/3wr3Var2fngt5svoBGR4bHjEmJBC713BDrMvtnw656iL/c0377a59-82d8-4958-b30f-a72aae3b1dbe/13"
        },
        { 
            name: "Nuddies", 
            link: "https://magiceden.io/marketplace/nuddies", 
            symbol: "nuddies",
            image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https://creator-x.s3.amazonaws.com/metadata/padNUaV2GYwu1YAaNDHGpXNgxqbaY2F2ejZSHDm2tND/nuddies/4255.jpeg"
        },
        { 
            name: "Unicornio", 
            link: "https://magiceden.io/marketplace/unicornio", 
            symbol: "unicornio",
            image: "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https://na-assets.pinit.io/AiBWVkRxDHY1t2ePcmGiwHkfSih1fpXFuzso4ce5qxvQ/5932c417-9560-4e48-9973-2383bb365123/68"
        },
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
        }
    ];

    // State Management
    let uwuToSolRate = 0;
    let solToUsdRate = 0;

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

    // API Interactions
    async function fetchUwuToSolRate() {
        try {
            const response = await fetch(UWU_TO_SOL_API, uwuRequestOptions);
            if (!response.ok) throw new Error('Failed to fetch UwU to SOL rate');
            const data = await response.json();
            uwuToSolRate = data.data.price;
            convertSolToUwu(); // Update the conversion when rate changes
            return uwuToSolRate;
        } catch (error) {
            console.error('Error fetching UWU to SOL rate:', error);
            showMessage('Error fetching current exchange rate.', true);
            return 0;
        }
    }

    async function fetchFloorPrices() {
        const magicEdenApi = `${MAGIC_EDEN_API}/collections/`;

        const collectionEndpoints = {
            "uwupunk": "UWUPUNK",
            "nuddies": "NUDDIES",
            "unicornio": "UNICORNIO", // This might need to be updated
            "uwumojii": "UWUMOJIS",
            "Unipuppets": "UNIPUPPETS", // This might need to be updated
            "unigirls": "UNIGIRLS"
        };

        for (let collection of collections) {
            try {
                const endpoint = collectionEndpoints[collection.symbol] || collection.symbol.toUpperCase();
                const response = await fetch(`${magicEdenApi}${endpoint}/stats?timeWindow=24h&listingAggMode=true`, {
                    method: "GET",
                    headers: {
                        "accept": "application/json"
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                if (data && typeof data.floorPrice !== 'undefined') {
                    collection.floorPrice = data.floorPrice / 1e9; // Convert to SOL
                    collection.sales24h = data.volume24hr || 0; // Update 24h sales data
                } else {
                    console.warn(`Floor price data not found for ${collection.name}`);
                    collection.floorPrice = null;
                    collection.sales24h = 0;
                }
            } catch (error) {
                console.error(`Error fetching floor price for ${collection.name}:`, error.message);
                collection.floorPrice = null;
                collection.sales24h = 0;
            }
        }
        renderCollections(); // Call this after fetching floor prices
    }

    async function fetchRates() {
        try {
            // Fetch UwU to SOL rate
            const uwuResponse = await fetch(UWU_TO_SOL_API, uwuRequestOptions);
            if (!uwuResponse.ok) {
                throw new Error(`HTTP error! status: ${uwuResponse.status}`);
            }
            const uwuData = await uwuResponse.json();
            uwuToSolRate = uwuData.data.price;

            // Fetch SOL to USD rate
            const solResponse = await fetch(SOL_TO_USD_API);
            if (!solResponse.ok) {
                throw new Error(`HTTP error! status: ${solResponse.status}`);
            }
            const solData = await solResponse.json();
            solToUsdRate = solData.solana.usd;

            updateUwUTracker();
        } catch (error) {
            console.error('Error fetching rates:', error);
            showMessage('Error fetching current rates. Please check your network connection and try again.', true);
        }
    }

    function updateUwUTracker() {
        const uwuToUsdRate = uwuToSolRate * solToUsdRate;
        document.getElementById('uwuToUsd').textContent = `1 $UwU = $${uwuToUsdRate.toFixed(4)} USD`;
        document.getElementById('uwuToSol').textContent = `1 $UwU = ${uwuToSolRate.toFixed(6)} SOL`;
        convertSolToUwu(); // Update the conversion when rates change
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
        const filterValue = document.getElementById('filterSelect').value;
        let sortedCollections = [...collections];

        switch (filterValue) {
            case 'priceHighToLow':
                sortedCollections.sort((a, b) => (b.floorPrice || 0) - (a.floorPrice || 0));
                break;
            case 'priceLowToHigh':
                sortedCollections.sort((a, b) => (a.floorPrice || 0) - (b.floorPrice || 0));
                break;
            case 'oldest':
                sortedCollections.sort((a, b) => a.createdAt - b.createdAt);
                break;
            case 'newest':
                sortedCollections.sort((a, b) => b.createdAt - a.createdAt);
                break;
            case 'sales24h':
                sortedCollections.sort((a, b) => b.sales24h - a.sales24h);
                break;
            default:
                // 'relevance' - keep original order
                break;
        }

        renderCollections(sortedCollections);
    }

    // Main function to initialize the page
    function initializePage() {
        showLoading();
        fetchRates()
            .then(() => fetchFloorPrices())
            .then(() => {
                applyFilter(); // This will render the collections with the default filter
                hideLoading();
                setInterval(fetchRates, UPDATE_INTERVAL);
            })
            .catch(error => {
                console.error('Error initializing page:', error);
                hideLoading();
                showMessage('Error loading page data. Please try again later.', true);
            });
    }

    // Render collections
    function renderCollections(collectionsToRender = collections) {
        const collectionGrid = document.getElementById('collectionGrid');
        collectionGrid.innerHTML = '';
        collectionsToRender.forEach(collection => {
            const card = createCollectionCard(collection);
            collectionGrid.appendChild(card);
        });
    }

    // Create a card for a collection
    function createCollectionCard(collection) {
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.innerHTML = `
            <img src="${collection.image}" alt="${collection.name}" class="collection-image">
            <div class="collection-info">
                <div class="collection-name">${collection.name}</div>
                <div class="price-info">Floor Price: ${collection.floorPrice !== null ? collection.floorPrice.toFixed(2) + ' SOL' : 'N/A'}</div>
                <div class="sales-info">24h Sales: ${collection.sales24h}</div>
                <div class="button-container">
                    <a href="${collection.link}" target="_blank" class="collection-link">View Collection</a>
                    <button class="buy-button" onclick="buyNFT('${collection.symbol}')">Buy NFT</button>
                </div>
            </div>
        `;
        return card;
    }

    // Buy NFT function
    async function buyNFT(symbol) {
        if (!wallet) {
            showMessage('Please connect your wallet first.', true);
            return;
        }

        showLoading();
        try {
            const collection = collections.find(c => c.symbol === symbol);
            if (!collection) {
                throw new Error('Collection not found');
            }

            // Connect to Solana network
            const connection = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com');
            const metaplex = new Metaplex(connection);

            // Find the NFT to purchase (this is a simplified example)
            const nfts = await metaplex.nfts().findAllByMint({ mintAddress: new solanaWeb3.PublicKey(collection.symbol) }).run();
            if (nfts.length === 0) {
                throw new Error('No NFTs found in this collection');
            }
            const nftToBuy = nfts[0];

            // Create a transaction to purchase the NFT
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: provider.publicKey,
                    toPubkey: new solanaWeb3.PublicKey(nftToBuy.updateAuthority),
                    lamports: collection.floorPrice * 1e9, // Convert SOL to lamports
                })
            );

            // Sign and send the transaction
            const signature = await provider.signAndSendTransaction(transaction);
            await connection.confirmTransaction(signature, 'confirmed');

            showMessage(`Successfully purchased an NFT from ${collection.name} for ${collection.floorPrice} SOL!`);
        } catch (error) {
            console.error('Error buying NFT:', error);
            showMessage(`Failed to buy NFT: ${error.message}`, true);
        } finally {
            hideLoading();
        }
    }

    // New function to convert SOL to UwU
    function convertSolToUwu() {
        const solAmount = parseFloat(document.getElementById('solInput').value);
        if (isNaN(solAmount)) {
            document.getElementById('conversionResult').textContent = '';
            return;
        }
        const uwuAmount = solAmount / uwuToSolRate;
        document.getElementById('conversionResult').textContent = `${solAmount} SOL ≈ ${uwuAmount.toFixed(2)} $UwU`;
    }

    // Run initialization when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializePage();
        applyTheme();
    });

    // Make sure to expose the necessary functions to the global scope
    window.convertSolToUwu = convertSolToUwu;
    window.applyFilter = applyFilter;
    window.buyNFT = buyNFT;
    window.setTheme = setTheme;
})();
