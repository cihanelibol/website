import "server-only";
// Üye adres defteri

import { randomBytes } from "crypto";
import { readJson, updateJson } from "./storage";
import { getSessionUser } from "./auth";
import { InputError } from "./security";

async function requireOwner(userId: string) {
  if ((await getSessionUser())?.uid !== userId) throw new InputError("Yetkiniz yok.");
}

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
  await requireOwner(userId);
  const all = await readJson<Address[]>(FILE, []);
  return all
    .filter((a) => a.userId === userId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function addAddress(
  input: Omit<Address, "id" | "createdAt">
): Promise<Address> {
  await requireOwner(input.userId);
  const address: Address = {
    ...input,
    id: randomBytes(8).toString("hex"),
    createdAt: new Date().toISOString(),
  };
  await updateJson<Address[], void>(FILE, [], all => {
    if (all.filter(a => a.userId === input.userId).length >= 20) throw new Error("Address limit reached");
    all.push(address); return { value: all, result: undefined };
  });
  return address;
}

export async function deleteAddress(
  userId: string,
  id: string
): Promise<void> {
  await requireOwner(userId);
  await updateJson<Address[], void>(FILE, [], all => ({ value: all.filter(a => !(a.id === id && a.userId === userId)), result: undefined }));
}
