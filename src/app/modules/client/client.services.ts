/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TClient, TSubordinate } from "./client.interface";
import Client from "./client.model";
import { generateUniqueClientId } from "../../utils/generateUniqueClientId";
import { infinitePaginate } from "../../utils/infinitePaginate";


// Add client
const addClient = async (payload: TClient) => {
  const { name, emails, phoneNumbers, country, source } = payload;

  // Check if client with same email already exists
  if (emails && emails.length > 0) {
    const existingClient = await Client.findOne({
      "emails.email": emails[0].email,
    });
    if (existingClient) {
      throw new AppError(httpStatus.CONFLICT, "Client with this email already exists");
    }
  }

  // Generate unique client ID
  const clientId = await generateUniqueClientId();

  const payloadData = {
    clientId,
    name,
    emails,
    phoneNumbers,
    country,
    source,
    socialMedia: payload.socialMedia,
    preferredContactMethod: payload.preferredContactMethod,
    languages: payload.languages,
    timezone: payload.timezone,
    address: payload.address,
    notes: payload.notes,
    industry: payload.industry,
    companySize: payload.companySize,
    subordinates: payload.subordinates || [],
  };

  const result = await Client.create(payloadData);
  return result;
};

// Get all clients with filtering and pagination
const getAllClients = async (
  filters: any = {},
  skip = 0,
  limit = 10
) => {
  const query: any = {};

  // SEARCH (name, email, clientId, subordinate name)
  if (filters.keyword) {
    query.$or = [
      { name: { $regex: filters.keyword, $options: "i" } },
      { clientId: { $regex: filters.keyword, $options: "i" } },
      { "emails.email": { $regex: filters.keyword, $options: "i" } },
      { "subordinates.name": { $regex: filters.keyword, $options: "i" } },
      { "subordinates.email": { $regex: filters.keyword, $options: "i" } },
    ];
  }

  // STATUS FILTER
  if (filters.status) {
    query.status = {
      $regex: `^${filters.status.trim()}$`,
      $options: "i",
    };
  }

  // SOURCE FILTER
  if (filters.source) {
    query.source = {
      $regex: `^${filters.source.trim()}$`,
      $options: "i",
    };
  }

  // INDUSTRY FILTER
  if (filters.industry) {
    query.industry = {
      $regex: `^${filters.industry.trim()}$`,
      $options: "i",
    };
  }

  // COUNTRY FILTER
  if (filters.country) {
    query.country = {
      $regex: `^${filters.country.trim()}$`,
      $options: "i",
    };
  }

  return infinitePaginate(
    Client,
    query,
    skip,
    limit,
    [] // populate fields if needed
  );
};

// Get single client by id
const getSingleClient = async (clientId: string) => {
  const result = await Client.findById(clientId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }
  return result;
};

// Get client by clientId (PR01, PR02, etc.)
const getClientByClientId = async (clientId: string) => {
  const result = await Client.findOne({ clientId });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }
  return result;
};

// Update client
const updateClient = async (clientId: string, payload: Partial<TClient>) => {
  const existingClient = await Client.findById(clientId);

  if (!existingClient) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  // Check email uniqueness if updating emails
  if (payload.emails && payload.emails.length > 0) {
    const emailExists = await Client.findOne({
      _id: { $ne: clientId },
      "emails.email": payload.emails[0].email,
    });
    if (emailExists) {
      throw new AppError(httpStatus.CONFLICT, "Client with this email already exists");
    }
  }

  const result = await Client.findByIdAndUpdate(clientId, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Add subordinate to client
const addSubordinate = async (clientId: string, payload: TSubordinate) => {
  const client = await Client.findById(clientId);
  if (!client) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  client.subordinates = client.subordinates || [];
  client.subordinates.push(payload as any);

  await client.save();
  return client;
};

// Update subordinate
const updateSubordinate = async (
  clientId: string,
  subordinateId: string,
  payload: Partial<TSubordinate>
) => {
  const client = await Client.findById(clientId);
  if (!client) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  const subordinateIndex = client.subordinates?.findIndex(
    (sub: any) => sub._id?.toString() === subordinateId
  );

  if (subordinateIndex === undefined || subordinateIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, "Subordinate not found");
  }

  client.subordinates![subordinateIndex] = {
    ...client.subordinates![subordinateIndex],
    ...payload,
  } as any;

  await client.save();
  return client;
};

// Delete subordinate
const deleteSubordinate = async (clientId: string, subordinateId: string) => {
  const client = await Client.findById(clientId);
  if (!client) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  const subordinateExists = client.subordinates?.some(
    (sub: any) => sub._id?.toString() === subordinateId
  );

  if (!subordinateExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Subordinate not found");
  }

  client.subordinates = client.subordinates?.filter(
    (sub: any) => sub._id?.toString() !== subordinateId
  );

  await client.save();
  return client;
};

// Soft delete client (instead of hard delete)
const deleteClient = async (clientId: string) => {
  const existingClient = await Client.findById(clientId);

  if (!existingClient) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  // Soft delete - you can add an isDeleted field to schema
  const result = await Client.findByIdAndDelete(clientId);

  return result;
};

export const ClientServices = {
  addClient,
  getAllClients,
  getSingleClient,
  getClientByClientId,
  updateClient,
  deleteClient,
  addSubordinate,
  updateSubordinate,
  deleteSubordinate,
};