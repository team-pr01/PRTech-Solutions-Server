import Client from "../modules/client/client.model";

export const generateUniqueClientId = async (): Promise<string> => {
  const lastClient = await Client.findOne({ clientId: /^PR/ })
    .sort({ clientId: -1 })
    .select("clientId")
    .lean();

  if (!lastClient || !lastClient.clientId) {
    return "PR01";
  }

  const lastNumber = parseInt(lastClient.clientId.replace("PR", ""), 10);
  const nextNumber = lastNumber + 1;
  
  // Pad with leading zeros (e.g., PR01, PR02, PR10, PR100)
  const paddedNumber = nextNumber.toString().padStart(2, "0");
  return `PR${paddedNumber}`;
};