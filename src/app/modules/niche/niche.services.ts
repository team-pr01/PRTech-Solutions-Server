import httpStatus from "http-status";
import { TNiche } from "./niche.interface";
import Niche from "./niche.model";
import AppError from "../../errors/AppError";

// Add a niche
const addNiche = async (payload: TNiche) => {
  const { name, subNiches } = payload;

  // Check if niche with same name already exists
  const existingNiche = await Niche.findOne({ name });
  if (existingNiche) {
    throw new AppError(httpStatus.CONFLICT, "Niche with this name already exists");
  }

  const payloadData = {
    name,
    subNiches: subNiches || [],
  };

  const result = await Niche.create(payloadData);
  return result;
};

// Get all niches
const getAllNiches = async () => {
  const result = await Niche.find().sort({ createdAt: -1 });
  return result;
};

// Get single niche by ID
const getSingleNicheById = async (nicheId: string) => {
  const result = await Niche.findById(nicheId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Niche not found");
  }
  return result;
};

// Update niche by ID
const updateNiche = async (nicheId: string, payload: Partial<TNiche>) => {
  const existingNiche = await Niche.findById(nicheId);
  if (!existingNiche) {
    throw new AppError(httpStatus.NOT_FOUND, "Niche not found");
  }

  // If updating name, check for duplicate
  if (payload.name && payload.name !== existingNiche.name) {
    const duplicateNiche = await Niche.findOne({ name: payload.name });
    if (duplicateNiche) {
      throw new AppError(httpStatus.CONFLICT, "Niche with this name already exists");
    }
  }

  // Handle subNiches: if subNiches is provided, merge with existing (avoid duplicates)
  if (payload.subNiches && payload.subNiches.length > 0) {
    // Create a Set to avoid duplicates
    const existingSubNiches = existingNiche.subNiches || [];
    const newSubNiches = payload.subNiches;
    
    // Merge and remove duplicates
    const mergedSubNiches = [...new Set([...existingSubNiches, ...newSubNiches])];
    payload.subNiches = mergedSubNiches;
  }

  const result = await Niche.findByIdAndUpdate(nicheId, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};
// Delete niche by ID
const deleteNiche = async (nicheId: string) => {
  const result = await Niche.findByIdAndDelete(nicheId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Niche not found");
  }
  return result;
};

export const NicheServices = {
  addNiche,
  getAllNiches,
  getSingleNicheById,
  updateNiche,
  deleteNiche,
};