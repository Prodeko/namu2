import bcrypt from "bcrypt";
import { sha256 } from "js-sha256";

/**
 * Hashes a pincode
 *
 * @param pincode - Pincode to hash
 * @returns Hashed pincode
 */
export const createPincodeHash = async (pincode: string) => {
  return bcrypt.hash(pincode, 10);
};

/**
 * Hashes an RFID tag ID.
 * Unlice bcrypt, creates the same hash for the same string every time
 * @param rfidTag
 * @returns
 */
export const createRfidTagHash = async (rfidTag: string) => {
  return sha256(rfidTag);
};

/**
 * Verifies a pincode
 *
 * @param pincodeToVerify - Pincode to verify
 * @param hashedPincode - Hashed pincode
 * @returns True if pincode is verified, false otherwise
 */
export const verifyPincode = async (
  pincodeToVerify: string,
  hashedPincode: string,
) => {
  return bcrypt.compare(pincodeToVerify, hashedPincode);
};
