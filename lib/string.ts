import { v5 } from "uuid";

const NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341"; // A unique UUID used as a namespace

export const generateHumanReadableId = () => {
  const uuid = v5(Math.random().toString(), NAMESPACE); // Generate a UUID based on a random value
  // Remove dashes and keep only the first 12 characters
  return uuid.replace(/-/g, "").slice(0, 12);
};
