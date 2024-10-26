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
        // ... (rest of your collections) ...
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

    // ... (rest of your JavaScript functions) ...

    // Run initialization when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializePage();
        applyTheme();
    });

    // Make sure to expose necessary functions to the global scope
    window.setTheme = setTheme;
    window.connectWallet = connectWallet;
    window.disconnectWallet = disconnectWallet;
    window.convertSolToUwu = convertSolToUwu;
    window.applyFilter = applyFilter;
    window.buyNFT = buyNFT;
})();
