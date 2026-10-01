import { useState } from "react";
import { getReadContract } from "../hooks/useContract";

function RegisteredStatus() {
  const [address, setAddress] = useState("");
  const [registered, setRegistered] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkRegistered = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setRegistered(null);

      const contract = await getReadContract();

      const result = await contract.registered(address);

      setRegistered(result);
    } catch (error) {
      console.error(error);
      alert(
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