import { ethers } from "ethers";
import ABI from "../constants/abi";
import {
  CONTRACT_ADDRESS,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_RPC_URL,
} from "../constants/contract";

export function getProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = getProvider();
  const network = await provider.getNetwork();

  if (network.chainId !== BigInt(SEPOLIA_CHAIN_ID)) {
    throw new Error("Switch MetaMask to Sepolia before registering.");
  }

  await provider.send("eth_requestAccounts", []);

  return provider.getSigner();
}

export async function getReadContract() {
  const provider = new ethers.JsonRpcProvider(
    SEPOLIA_RPC_URL,
    SEPOLIA_CHAIN_ID
  );

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