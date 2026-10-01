import { useEffect, useState } from "react";
import "./App.css";
import ConnectWallet from "./components/ConnectWallet";
import RegisterStudent from "./components/RegisterStudent";
import StudentDetails from "./components/StudentDetails";
import RegisteredStatus from "./components/RegisteredStatus";

function App() {
  const [account, setAccount] = useState("");

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || "");
    };

    const handleChainChanged = () => {
      setAccount("");
    };

    window.ethereum.on(
      "accountsChanged",
      handleAccountsChanged
    );
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#top" aria-label="Student Registry home">
          <span className="brand-mark" aria-hidden="true">SR</span>
          <span className="brand-copy">
            <strong>Student Registry</strong>
            <span>Academic records on Ethereum</span>
          </span>
        </a>

        <div className="navbar-actions">
          <span className="network-indicator"><span /> Sepolia testnet</span>
          <ConnectWallet
            account={account}
            setAccount={setAccount}
          />
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">A public record, by design</span>
            <h1>Academic credentials.<br /><span>Verified on-chain.</span></h1>
            <p>Register a student record or look up credentials directly from the Sepolia network.</p>
          </div>
          <div className="hero-note" aria-label="Network details">
            <span className="note-label">ACTIVE NETWORK</span>
            <strong>Ethereum Sepolia</strong>
            <span className="note-detail"><span /> Contract is ready to query</span>
          </div>
        </section>

        <div className="grid">
          <RegisterStudent />

          <StudentDetails />

          <RegisteredStatus />
        </div>
      </main>

      <footer>
        <span className="footer-label">REGISTRY CONTRACT</span>

        <a
          href="https://sepolia.etherscan.io/address/0xa551cb621e1b7b2350049d842bf73C1c4e89a126"
          target="_blank"
          rel="noreferrer"
        >
          0xa551...a126 <span aria-hidden="true">↗</span>
        </a>
        <span className="footer-network">Sepolia · Etherscan</span>
      </footer>
    </div>
  );
}

export default App;