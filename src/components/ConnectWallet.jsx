import { useState } from "react";
import { ethers } from "ethers";
import { SEPOLIA_CHAIN_ID, SEPOLIA_RPC_URL } from "../constants/contract";

function ConnectWallet({ account, setAccount }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    setError("");

    try {
      if (!window.ethereum) {
        setError("MetaMask was not detected. Open this app in a browser with MetaMask installed and unlocked.");
        return;
      }

      setLoading(true);

      const ethereum = window.ethereum.providers?.find((item) => item.isMetaMask) || window.ethereum;
      let provider = new ethers.BrowserProvider(ethereum);

      const accounts = await provider.send(
        "eth_requestAccounts",
        []
      );

      let network = await provider.getNetwork();

      if (network.chainId !== BigInt(SEPOLIA_CHAIN_ID)) {
        const chainId = `0x${SEPOLIA_CHAIN_ID.toString(16)}`;

        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
          });
        } catch (switchError) {
          if (switchError?.code !== 4902) throw switchError;

          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId,
              chainName: "Sepolia",
              nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: [SEPOLIA_RPC_URL],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            }],
          });
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
          });
        }

        provider = new ethers.BrowserProvider(ethereum);
        network = await provider.getNetwork();
      }

      if (network.chainId !== BigInt(SEPOLIA_CHAIN_ID)) {
        throw new Error("MetaMask must be connected to Sepolia.");
      }

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      const errorCode = error?.code ?? error?.info?.error?.code;

      if (errorCode === 4001) {
        setError("Connection was cancelled in MetaMask.");
      } else if (errorCode === -32002) {
        setError("MetaMask already has a pending request. Open MetaMask to respond to it.");
      } else {
        setError(error?.shortMessage || error?.message || "Could not connect wallet.");
      }
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
          <button
            className="disconnect-button"
            type="button"
            onClick={() => setAccount("")}
          >
            Disconnect
          </button>
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
      {error && <div className="wallet-error" role="alert">{error}</div>}
    </div>
  );
}

export default ConnectWallet;