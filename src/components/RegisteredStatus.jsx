import { useState } from "react";
import { getReadContract } from "../hooks/useContract";

function RegisteredStatus() {
  const [address, setAddress] = useState("");
  const [registered, setRegistered] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkRegistered = async (e) => {
    e.preventDefault();

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError("Enter a valid Ethereum address.");
      setRegistered(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRegistered(null);

      const contract = await getReadContract();

      const result = await contract.registered(address);

      setRegistered(result);
    } catch (error) {
      console.error(error);
      setError(
        error?.reason ||
          error?.shortMessage ||
          "Failed to check registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Registration Status</h2>

      <p className="description">
        Check whether an address has registered.
      </p>

      <form onSubmit={checkRegistered}>
        <label>
          Wallet Address

          <input
            type="text"
            placeholder="0x..."
            autoComplete="off"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="secondary-button"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Status"}
        </button>
      </form>

      {error && <div className="error" role="alert">{error}</div>}

      {registered !== null && (
        <div
          className={
            registered
              ? "status success"
              : "status warning"
          }
        >
          {registered
            ? "This address is registered."
            : "This address is not registered."}
        </div>
      )}
    </section>
  );
}

export default RegisteredStatus;