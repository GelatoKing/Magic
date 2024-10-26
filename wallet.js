let wallet = null;
let provider = null;

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

// Expose these functions globally
window.connectWallet = connectWallet;
window.disconnectWallet = disconnectWallet;

// Helper function to show messages (this should be defined in your main script.js file)
function showMessage(message, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isError ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    document.querySelector('.container').insertBefore(messageDiv, document.querySelector('.collection-grid'));
    setTimeout(() => messageDiv.remove(), 5000);
}

// Function to get the current wallet state
function getWalletState() {
    return {
        isConnected: !!wallet,
        publicKey: wallet
    };
}

// Function to check if a wallet is connected
function isWalletConnected() {
    return !!wallet;
}

// Expose additional functions globally if needed
window.getWalletState = getWalletState;
window.isWalletConnected = isWalletConnected;

// Event listener for wallet changes
if (typeof window !== 'undefined' && window.solana) {
    window.solana.on('accountChanged', async () => {
        // Handle account change
        await connectWallet();
    });
}

// Initialize wallet connection on page load
document.addEventListener('DOMContentLoaded', async () => {
    if (window.solana && window.solana.isPhantom && window.solana.isConnected) {
        await connectWallet();
    }
});
