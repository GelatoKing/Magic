(function() {
    // Configuration and Constants
    const UWU_TO_SOL_API = 'https://pro-api.solscan.io/v2.0/token/price?address=UwU8RVXB69Y6Dcju6cN2Qef6fykkq6UUNpB15rZku6Z';
    const MAGIC_EDEN_API = "https://api-mainnet.magiceden.dev/v2";
    const SOL_TO_USD_API = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';
    const UPDATE_INTERVAL = 60000; // 1 minute

    const requestOptions = {
        method: "get",
        headers: {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3Mjk4NjkyNTE3ODEsImVtYWlsIjoiY2x2dGNoZGVzaWduc0BnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3Mjk4NjkyNTF9.k4QFwynlrXfSdLMP6yCa3jANSFIRf8mNkAQnP0IZBiA"
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
    let wallet = null;
    let provider = null;
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

    // Attach setTheme to window object to make it globally accessible
    window.setTheme = setTheme;

    // Updated Wallet Management
    async function connectWallet() {
        if (wallet) {
            showMessage('Wallet already connected.');
            return;
        }

        try {
            let walletProvider;

            if (window.solana && window.solana.isPhantom) {
                walletProvider = window.solana;
            } else if (window.backpack) {
                walletProvider = window.backpack;
            } else {
                throw new Error('No compatible wallet found. Please install Phantom or Backpack.');
            }

            await walletProvider.connect();
            provider = walletProvider;
            wallet = provider.publicKey.toString();

            // Use the API key to verify the connection (this is a placeholder, adjust as needed)
            const response = await fetch('https://api.magiceden.dev/v2/wallets/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${requestOptions.headers.token}`
                },
                body: JSON.stringify({ publicKey: wallet })
            });

            if (!response.ok) {
                throw new Error('Failed to verify wallet connection with the server.');
            }

            showMessage('Wallet connected successfully!');
            updateWalletSection();
        } catch (error) {
            console.error('Error connecting wallet:', error);
            showMessage(`Failed to connect wallet: ${error.message}`, true);
            wallet = null;
            provider = null;
        }
    }

    function updateWalletSection() {
        const walletSection = document.getElementById('walletSection');
        if (wallet) {
            walletSection.innerHTML = `
                <div class="wallet-address">Connected: ${wallet.slice(0, 4)}...${wallet.slice(-4)}</div>
                <button class="wallet-button" onclick="disconnectWallet()">Disconnect</button>
            `;
        } else {
            walletSection.innerHTML = `
                <button class="wallet-button" onclick="connectWallet()">Connect Wallet</button>
            `;
        }
    }

    async function disconnectWallet() {
        if (provider && provider.disconnect) {
            await provider.disconnect();
        }
        wallet = null;
        provider = null;
        showMessage('Wallet disconnected.');
        updateWalletSection();
    }

    // Make sure to expose the connectWallet and disconnectWallet functions to the global scope
    window.connectWallet = connectWallet;
    window.disconnectWallet = disconnectWallet;

    // API Interactions
    async function fetchUwuToSolRate() {
        try {
            const response = await fetch(UWU_TO_SOL_API, requestOptions);
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

        for (let collection of collections) {
            try {
                const response = await fetch(`${magicEdenApi}${collection.symbol}/stats`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data && typeof data.floorPrice !== 'undefined') {
                    collection.floorPrice = data.floorPrice / 1e9; // Convert to SOL
                } else {
                    console.warn(`Floor price data not found for ${collection.name}`);
                    collection.floorPrice = null;
                }
            } catch (error) {
                console.error(`Error fetching floor price for ${collection.name}:`, error.message);
                collection.floorPrice = null;
            }
        }
    }

    async function fetchRates() {
        try {
            // Fetch UwU to SOL rate
            const uwuResponse = await fetch(UWU_TO_SOL_API, requestOptions);
            const uwuData = await uwuResponse.json();
            uwuToSolRate = uwuData.data.price;

            // Fetch SOL to USD rate
            const solResponse = await fetch(SOL_TO_USD_API);
            const solData = await solResponse.json();
            solToUsdRate = solData.solana.usd;

            updateUwUTracker();
        } catch (error) {
            console.error('Error fetching rates:', error);
            showMessage('Error fetching current rates.', true);
        }
    }

    function updateUwUTracker() {
        const uwuToUsdRate = 1 / uwuToSolRate * solToUsdRate;
        document.getElementById('uwuToUsd').textContent = `1 $UwU = $${uwuToUsdRate.toFixed(4)} USD`;
        document.getElementById('uwuToSol').textContent = `1 $UwU = ${uwuToSolRate.toFixed(6)} SOL`;
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

    // Make sure to expose the convertSolToUwu function to the global scope
    window.convertSolToUwu = convertSolToUwu;
    
    // Expose applyFilter to the global scope
    window.applyFilter = applyFilter;
    
    // Expose buyNFT to the global scope
    window.buyNFT = buyNFT;
})();
