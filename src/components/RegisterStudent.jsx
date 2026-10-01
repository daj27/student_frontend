import { useState } from "react";
import { getWriteContract } from "../hooks/useContract";

function RegisterStudent() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const registerStudent = async (e) => {
    e.preventDefault();

    if (!name || !age || !course) {
      setStatus("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Waiting for wallet confirmation...");

      const contract = await getWriteContract();

      const tx = await contract.register(
        name,
        Number(age),
        course
      );

      setStatus(
        `Transaction submitted: ${tx.hash}`
      );

      await tx.wait();

      setStatus(
        "Student registered successfully."
      );

      setName("");
      setAge("");
      setCourse("");
    } catch (error) {
      console.error(error);

      setStatus(
        error?.reason ||
          error?.shortMessage ||
          "Transaction failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Register Student</h2>

      <p className="description">
        Register your student information on-chain.
      </p>

      <form onSubmit={registerStudent}>
        <label>
          Name
          <input
            type="text"
            placeholder="Enter your name"
            maxLength={80}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Age
          <input
            type="number"
            min="1"
            max="150"
            placeholder="Enter your age"
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>

        <label>
          Course
          <input
            type="text"
            placeholder="e.g. Computer Science"
            maxLength={100}
            required
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading
            ? "Registering..."
            : "Register Student"}
        </button>
      </form>

      {status && (
        <div className="status">
          {status}
        </div>
      )}
    </section>
  );
}

export default RegisterStudent;