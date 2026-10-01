import { useEffect, useState } from "react";
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

    window.ethereum.on(
      "accountsChanged",
      handleAccountsChanged
    );

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <div>
          <h1>Student Registry</h1>
          <span>Sepolia Testnet</span>
        </div>

        <ConnectWallet
          account={account}
          setAccount={setAccount}
        />
      </header>

      <main>
        <div className="hero">
          <span className="badge">
            Ethereum · Sepolia
          </span>

          <h2>
            Student information
            <br />
            on-chain.
          </h2>

          <p>
            Register student information and read
            existing records directly from the smart
            contract.
          </p>
        </div>

        <div className="grid">
          <RegisterStudent />

          <StudentDetails />

          <RegisteredStatus />
        </div>
      </main>

      <footer>
        <span>Contract</span>

        <a
          href="https://sepolia.etherscan.io/address/0xa551cb621e1b7b2350049d842bf73C1c4e89a126"
          target="_blank"
          rel="noreferrer"
        >
          0xa551...a126 ↗
        </a>
      </footer>
    </div>
  );
}

export default App;