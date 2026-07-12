
export type TScheduledCall = {
  name: string;
  email: string;
  phoneNumber: string;
  message?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  scheduledDate?: Date;
  scheduledTime?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};