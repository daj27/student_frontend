import { useState } from "react";
import { ethers } from "ethers";

function ConnectWallet({ account, setAccount }) {
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      setLoading(true);

      const provider = new ethers.BrowserProvider(
        window.ethereum
      );

      const accounts = await provider.send(
        "eth_requestAccounts",
        []
      );

      const network = await provider.getNetwork();

      if (network.chainId !== 11155111n) {
        alert("Please switch MetaMask to Sepolia.");
        return;
      }

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-section">
      {account ? (
        <div className="connected">
          <span>Connected</span>

          <strong>
            {account.slice(0, 6)}...
            {account.slice(-4)}
          </strong>
        </div>
      ) : (
        <button
          className="primary-button"
          onClick={connectWallet}
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}

export default ConnectWallet;