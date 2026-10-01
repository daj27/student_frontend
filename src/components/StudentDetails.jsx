import { useState } from "react";
import { getReadContract } from "../hooks/useContract";

function StudentDetails() {
  const [address, setAddress] = useState("");
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getStudent = async (e) => {
    e.preventDefault();

    if (!address) {
      setError("Enter a wallet address.");
      return;
    }

    try {
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        setError("Invalid Ethereum address.");
        return;
      }

      setLoading(true);
      setError("");
      setStudent(null);

      const contract = await getReadContract();

      const result = await contract.getStudent(address);

      setStudent({
        name: result[0],
        age: result[1].toString(),
        course: result[2],
      });
    } catch (error) {
      console.error(error);

      setError(
        error?.reason ||
          error?.shortMessage ||
          error?.message ||
          "Could not retrieve student."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Find Student</h2>

      <p className="description">
        Read student information from the blockchain.
      </p>

      <form onSubmit={getStudent}>
        <label>
          Student Address

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
          {loading ? "Reading..." : "Get Student"}
        </button>
      </form>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {student && (
        <div className="student-result">
          <div>
            <span>Name</span>
            <strong>{student.name}</strong>
          </div>

          <div>
            <span>Age</span>
            <strong>{student.age}</strong>
          </div>

          <div>
            <span>Course</span>
            <strong>{student.course}</strong>
          </div>
        </div>
      )}
    </section>
  );
}

export default StudentDetails;