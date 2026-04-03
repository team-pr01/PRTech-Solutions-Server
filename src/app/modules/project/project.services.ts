/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TProject } from "./project.interface";
import Project from "./project.model";
import { infinitePaginate } from "../../utils/infinitePaginate";
import Client from "../client/client.model";

// Add Project
const addProject = async (payload: TProject) => {
  const { clientId, name, projectType, status } = payload;

  // Check if client exists
  const clientExists = await Client.findById(clientId);
  if (!clientExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  // Check if project with same name exists for this client
  const existingProject = await Project.findOne({ name, clientId });
  if (existingProject) {
    throw new AppError(httpStatus.CONFLICT, "Project with this name already exists for this client");
  }

  const payloadData = {
    name,
    projectType,
    description: payload.description,
    startDate: payload.startDate,
    endDate: payload.endDate,
    status,
    priceCurrency: payload.priceCurrency,
    price: payload.price,
    installments: payload.installments || [],
    dueAmount: payload.price,
    phases: payload.phases || [],
    onGoingPhase: payload.onGoingPhase,
    timelineLink: payload.timelineLink,
    contactPerson: payload.contactPerson || [],
    notes: payload.notes,
    clientId,
  };

  const result = await Project.create(payloadData);
  return result;
};

// Get all projects with filtering and pagination
const getAllProjects = async (
  filters: any = {},
  skip = 0,
  limit = 10
) => {
  const query: any = {};

  // SEARCH (name, description, phases)
  if (filters.keyword) {
    query.$or = [
      { name: { $regex: filters.keyword, $options: "i" } },
      { description: { $regex: filters.keyword, $options: "i" } },
      { phases: { $regex: filters.keyword, $options: "i" } },
      { clientId: { $regex: filters.keyword, $options: "i" } },

    ];
  }

  // STATUS FILTER
  if (filters.status) {
    query.status = {
      $regex: `^${filters.status.trim()}$`,
      $options: "i",
    };
  }

  // PROJECT TYPE FILTER
  if (filters.projectType) {
    query.projectType = {
      $regex: `^${filters.projectType.trim()}$`,
      $options: "i",
    };
  }

  return infinitePaginate(
    Project,
    query,
    skip,
    limit,
    ["clientId"]
  );
};

// Get single project by id
const getSingleProject = async (projectId: string) => {
  const result = await Project.findById(projectId).populate("clientId");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }
  return result;
};

// Update project
const updateProject = async (projectId: string, payload: Partial<TProject>) => {
  const existingProject = await Project.findById(projectId);

  if (!existingProject) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  // If updating clientId, check if client exists
  if (payload.clientId) {
    const clientExists = await Client.findById(payload.clientId);
    if (!clientExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Client not found");
    }
  }

  // If updating price or installments, recalculate dueAmount
  if (payload.price !== undefined || payload.installments !== undefined) {
    const newPrice = payload.price !== undefined ? payload.price : existingProject.price;
    const newInstallments = payload.installments !== undefined ? payload.installments : existingProject.installments;

    if (newPrice && newInstallments) {
      const totalPaid = newInstallments.reduce((sum, installment) => sum + installment.amount, 0);
      payload.dueAmount = newPrice - totalPaid;
    } else if (newPrice) {
      payload.dueAmount = newPrice;
    }
  }

  const result = await Project.findByIdAndUpdate(projectId, payload, {
    new: true,
    runValidators: true,
  }).populate("clientId");

  return result;
};

// Delete project (Hard delete)
const deleteProject = async (projectId: string) => {
  const result = await Project.findByIdAndDelete(projectId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }
  return result;
};

export const ProjectServices = {
  addProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
};