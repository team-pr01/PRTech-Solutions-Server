import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ProjectServices } from "./project.services";

// Add Project
const addProject = catchAsync(async (req, res) => {
  const result = await ProjectServices.addProject(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Project added successfully",
    data: result,
  });
});

// Get All Projects
const getAllProjects = catchAsync(async (req, res) => {
  const { keyword, status, projectType, clientId, startDate, endDate, skip, limit } = req.query;

  const result = await ProjectServices.getAllProjects(
    {
      keyword: keyword as string,
      status: status as string,
      projectType: projectType as string,
      clientId: clientId as string,
      startDate: startDate as string,
      endDate: endDate as string,
    },
    skip ? parseInt(skip as string) : 0,
    limit ? parseInt(limit as string) : 10
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully",
    data: result,
  });
});

// Get Single Project
const getSingleProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await ProjectServices.getSingleProject(projectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project retrieved successfully",
    data: result,
  });
});

// Update Project
const updateProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await ProjectServices.updateProject(projectId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

// Delete Project
const deleteProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await ProjectServices.deleteProject(projectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project deleted successfully",
    data: result,
  });
});

// Add Phase
const addPhase = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await ProjectServices.addPhase(projectId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Phase added successfully",
    data: result,
  });
});

// Update Phase
const updatePhase = catchAsync(async (req, res) => {
  const { projectId, phaseId } = req.params;
  const result = await ProjectServices.updatePhase(projectId, phaseId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Phase updated successfully",
    data: result,
  });
});


// Add Installment to Phase
const addInstallment = catchAsync(async (req, res) => {
  const { projectId, phaseId } = req.params;
  const result = await ProjectServices.addInstallment(projectId, phaseId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Installment added successfully",
    data: result,
  });
});

// Update Installment in Phase
const updateInstallment = catchAsync(async (req, res) => {
  const { projectId, phaseId, installmentId } = req.params;
  const result = await ProjectServices.updateInstallment(
    projectId,
    phaseId,
    installmentId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Installment updated successfully",
    data: result,
  });
});

// Delete Phase
const deletePhase = catchAsync(async (req, res) => {
  const { projectId, phaseId } = req.params;
  const result = await ProjectServices.deletePhase(projectId, phaseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Phase deleted successfully",
    data: result,
  });
});

// Get Single Phase
const getSinglePhase = catchAsync(async (req, res) => {
  const { projectId, phaseId } = req.params;
  const result = await ProjectServices.getSinglePhase(projectId, phaseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Phase retrieved successfully",
    data: result,
  });
});

// Get All Phases
const getAllPhases = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await ProjectServices.getAllPhases(projectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Phases retrieved successfully",
    data: result,
  });
});


const addExpenditure = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await ProjectServices.addExpenditure(projectId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Expenditure added successfully",
    data: result,
  });
});

// Add phase to expenditure
const addPhaseToExpenditure = catchAsync(async (req, res) => {
  const { projectId, expenditureId } = req.params;
  const result = await ProjectServices.addPhaseToExpenditure(
    projectId,
    expenditureId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Phase added to expenditure successfully",
    data: result,
  });
});

// Get projects by client ID
const getProjectsByClientId = catchAsync(async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  const result = await ProjectServices.getProjectsByClientId(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully",
    data: result,
  });
});

export const ProjectControllers = {
  addProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  addPhase,
  updatePhase,
  addInstallment,
  updateInstallment,
  deletePhase,
  getSinglePhase,
  getAllPhases,
  addExpenditure,
  addPhaseToExpenditure,
  getProjectsByClientId
};