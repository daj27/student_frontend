import { ethers } from "ethers";
import ABI from "../constants/abi";
import { CONTRACT_ADDRESS } from "../constants/contract";

export function getProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = getProvider();

  await provider.send("eth_requestAccounts", []);

  return provider.getSigner();
}

export async function getReadContract() {
  const provider = getProvider();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    provider
  );
}

export async function getWriteContract() {
  const signer = await getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  );
}