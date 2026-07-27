// Üye adres defteri

import { randomBytes } from "crypto";
import { readJson, writeJson } from "./storage";

export type Address = {
  id: string;
  userId: string;
  title: string; // "Ev", "İş" vb.
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  postalCode: string;
  createdAt: string;
};

const FILE = "addresses.json";

export async function getAddresses(userId: string): Promise<Address[]> {
  const all = await readJson<Address[]>(FILE, []);
  return all
    .filter((a) => a.userId === userId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function addAddress(
  input: Omit<Address, "id" | "createdAt">
): Promise<Address> {
  const address: Address = {
    ...input,
    id: randomBytes(8).toString("hex"),
    createdAt: new Date().toISOString(),
  };
  const all = await readJson<Address[]>(FILE, []);
  all.push(address);
  await writeJson(FILE, all);
  return address;
}

export async function deleteAddress(
  userId: string,
  id: string
): Promise<void> {
  const all = await readJson<Address[]>(FILE, []);
  await writeJson(
    FILE,
    all.filter((a) => !(a.id === id && a.userId === userId))
  );
}
