import httpStatus from "http-status";
import { NicheServices } from "./niche.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Add a niche
const addNiche = catchAsync(async (req, res) => {
  const result = await NicheServices.addNiche(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Niche added successfully",
    data: result,
  });
});

// Get all niches
const getAllNiches = catchAsync(async (req, res) => {
  const result = await NicheServices.getAllNiches();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Niches fetched successfully",
    data: result,
  });
});

// Get single niche by ID
const getSingleNicheById = catchAsync(async (req, res) => {
  const { nicheId } = req.params;
  const result = await NicheServices.getSingleNicheById(nicheId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Niche fetched successfully",
    data: result,
  });
});

// Update niche by ID
const updateNiche = catchAsync(async (req, res) => {
  const { nicheId } = req.params;
  const result = await NicheServices.updateNiche(nicheId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Niche updated successfully",
    data: result,
  });
});

// Delete niche by ID
const deleteNiche = catchAsync(async (req, res) => {
  const { nicheId } = req.params;
  const result = await NicheServices.deleteNiche(nicheId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Niche deleted successfully",
    data: result,
  });
});

export const NicheController = {
  addNiche,
  getAllNiches,
  getSingleNicheById,
  updateNiche,
  deleteNiche,
};