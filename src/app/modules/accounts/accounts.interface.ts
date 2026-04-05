export type TAccounts = {
    type: "earning" | "expense";
    expenseType: "salary" | "ui/ux" | "tools" | "graphics" | "deployment" | "other";
    description: string;
    currency: string;
    paidAmount?: number;
    pendingAmount?: number;
    totalAmount: number;
    paidBy?: string;
    paymentMethod: string;
    date: Date;
}