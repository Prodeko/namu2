import bcrypt from "bcrypt";

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
