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

export const ProjectControllers = {
  addProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
};