/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TInstallment, TPhase, TProject } from "./project.interface";
import Project from "./project.model";
import { infinitePaginate } from "../../utils/infinitePaginate";
import Client from "../client/client.model";

// Add Project
const addProject = async (payload: TProject) => {
  const { clientId, name } = payload;

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

  const result = await Project.create(payload);
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

  // Calculate project pending amount from phases if phases are being updated
  if (payload.phases !== undefined) {
    const totalPhasePending = payload.phases.reduce(
      (sum, phase) => sum + (phase.pendingAmount || 0),
      0
    );
    payload.pendingAmount = totalPhasePending;
  }

  // If price is being updated, recalculate pending amount based on phases
  if (payload.price !== undefined) {
    const totalPhasePending = existingProject.phases?.reduce(
      (sum, phase) => sum + (phase.pendingAmount || 0),
      0
    ) || 0;

    // If no phases exist, set pending amount to the new price
    if (totalPhasePending === 0 && existingProject.phases?.length === 0) {
      payload.pendingAmount = payload.price;
    }
  }

  // If phases are updated with new installments, recalculate phase pending amounts
  if (payload.phases !== undefined) {
    const updatedPhases = payload.phases.map(phase => {
      // Calculate pending amount for each phase based on its installments
      if (phase.installments && phase.installments.length > 0) {
        const totalPaid = phase.installments.reduce((sum, inst) => sum + (inst.amount || 0), 0);
        const newPendingAmount = (phase.totalAmount || 0) - totalPaid;
        return {
          ...phase,
          pendingAmount: newPendingAmount >= 0 ? newPendingAmount : 0,
          paymentStatus: newPendingAmount <= 0 ? "Paid" : "Pending",
        };
      }
      return phase;
    });
    payload.phases = updatedPhases as TPhase[];
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

// Add a new phase to a project
const addPhase = async (projectId: string, phaseData: TPhase) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  // Initialize phases array if it doesn't exist
  if (!project.phases) {
    project.phases = [];
  }

  // Add the new phase (MongoDB will auto-generate _id)
  project.phases.push(phaseData);

  // Recalculate project pending amount
  const totalPhasePending = project.phases.reduce(
    (sum, phase) => sum + (phase.pendingAmount || 0),
    0
  );
  project.pendingAmount = totalPhasePending;

  await project.save();
  
  // Return the added phase with its _id
  const addedPhase = project.phases[project.phases.length - 1];
  return addedPhase;
};

// Update an existing phase by phaseId
const updatePhase = async (
  projectId: string,
  phaseId: string,
  phaseData: Partial<TPhase>
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  // Find phase by _id
  const phaseIndex = project.phases.findIndex(
    (phase) => phase._id?.toString() === phaseId
  );

  if (phaseIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, "Phase not found");
  }

  // Update the phase
  const currentPhase = project.phases[phaseIndex];
  const updatedPhase = { ...(currentPhase.toObject() as Record<string, unknown>), ...phaseData } as TPhase;

  // If totalAmount changed, recalculate pending amount based on installments
  if (phaseData.totalAmount !== undefined || phaseData.installments !== undefined) {
    const totalPaid = (updatedPhase.installments || []).reduce(
      (sum: number, inst: TInstallment) => sum + (inst.amount || 0),
      0
    );
    updatedPhase.pendingAmount = updatedPhase.totalAmount - totalPaid;
    updatedPhase.paymentStatus = updatedPhase.pendingAmount <= 0 ? "Paid" : "Pending";
  }

  project.phases[phaseIndex] = updatedPhase;

  // If updating phase name and it was the ongoing phase, update project's onGoingPhase
  if (phaseData.name && project.onGoingPhase === currentPhase.name) {
    project.onGoingPhase = phaseData.name;
  }

  // Recalculate project pending amount
  const totalPhasePending = project.phases.reduce(
    (sum, phase) => sum + (phase.pendingAmount || 0),
    0
  );
  project.pendingAmount = totalPhasePending;

  await project.save();
  return project.phases[phaseIndex];
};

// Delete a phase by phaseId
const deletePhase = async (projectId: string, phaseId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  // Find phase by _id
  const phaseIndex = project.phases.findIndex(
    (phase) => phase._id?.toString() === phaseId
  );

  if (phaseIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, "Phase not found");
  }

  const deletedPhase = project.phases[phaseIndex];
  
  // Remove the phase
  project.phases.splice(phaseIndex, 1);

  // If the deleted phase was the ongoing phase, clear or update onGoingPhase
  if (project.onGoingPhase === deletedPhase.name) {
    // Find next ongoing phase or clear
    const nextPhase = project.phases.find(p => p.phaseStatus === "Ongoing");
    project.onGoingPhase = nextPhase?.name || "";
  }

  // Recalculate project pending amount
  const totalPhasePending = project.phases.reduce(
    (sum, phase) => sum + (phase.pendingAmount || 0),
    0
  );
  project.pendingAmount = totalPhasePending;

  await project.save();
  return {
    project,
    deletedPhase,
  };
};

// Get a single phase by phaseId
const getSinglePhase = async (projectId: string, phaseId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const phase = project.phases.find(
    (phase) => phase._id?.toString() === phaseId
  );

  if (!phase) {
    throw new AppError(httpStatus.NOT_FOUND, "Phase not found");
  }

  return phase;
};

// Get all phases of a project
const getAllPhases = async (projectId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  return project.phases || [];
};


export const ProjectServices = {
  addProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  addPhase,
  updatePhase,
  deletePhase,
  getSinglePhase,
  getAllPhases,
};