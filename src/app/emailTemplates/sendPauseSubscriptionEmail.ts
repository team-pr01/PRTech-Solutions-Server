/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { sendEmail } from "../utils/sendEmail";

export const sendSubscriptionStatusEmails = async (
  user: any,
  subscriptionDetails: any,
  action: "paused" | "active" | "cancelled"
) => {
  const actionTense =
    action === "paused"
      ? "paused"
      : action === "active"
        ? "resumed"
        : "cancelled";

  const actionTitle =
    action === "paused"
      ? "Paused"
      : action === "active"
        ? "Resumed"
        : "Cancelled";

  // Email to user
  const userSubject = `Subscription ${actionTitle} - Boardroom Banter`;
  const userHtmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Boardroom Banter</h2>
      <p style="font-size:16px; color:#333;">Hello <strong>${user.name}</strong>,</p>
      <p style="font-size:15px; color:#555;">
        Your Boardroom Banter subscription has been successfully ${actionTense}.
      </p>
      <div style="background:#f5f5f5; padding:15px; border-radius:6px; margin:20px 0;">
        <p style="font-size:14px; margin:5px 0;"><strong>Subscription ID:</strong> ${subscriptionDetails.razorpaySubscriptionId}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Status:</strong> ${actionTitle}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>${actionTitle} Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p style="font-size:15px; color:#555;">
        ${
          action === "paused"
            ? "Your subscription benefits will be temporarily unavailable while paused. You can resume your subscription at any time from your account settings."
            : action === "active"
              ? "Your subscription benefits have been restored. You now have full access to all premium features."
              : "Your subscription has been cancelled. You will no longer have access to premium features. If this was a mistake, you can purchase a new subscription anytime."
        }
      </p>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">The Boardroom Banter Team</p>
    </div>
  </div>
  `;

  // Email to admin
  const adminEmail = "rahul.mitraconsultancy@gmail.com";
  const adminSubject = `Subscription ${actionTitle} - Boardroom Banter`;
  const adminHtmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Boardroom Banter - Subscription ${actionTitle}</h2>
      <p style="font-size:16px; color:#333;">Hello Admin,</p>
      <p style="font-size:15px; color:#555;">
        A subscription has been ${actionTense}. Here are the details:
      </p>
      <div style="background:#f5f5f5; padding:15px; border-radius:6px; margin:20px 0;">
        <p style="font-size:14px; margin:5px 0;"><strong>Customer Name:</strong> ${user.name}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Customer Email:</strong> ${user.email}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Subscription ID:</strong> ${subscriptionDetails.razorpaySubscriptionId}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>${actionTitle} Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Action:</strong> ${actionTitle}</p>
      </div>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">Boardroom Banter System</p>
    </div>
  </div>
  `;

  try {
    // Send email to user
    await sendEmail(user.email, userSubject, userHtmlBody);

    // Send email to admin
    await sendEmail(adminEmail, adminSubject, adminHtmlBody);

  } catch (error) {
    console.error(`Failed to send ${action} emails:`, error);
  }
};

export const sendSubscriptionEmails = async (
  user: any,
  subscriptionDetails: any
) => {
  // Email to user
  const userSubject = "Subscription Confirmation - Boardroom Banter";
  const userHtmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Boardroom Banter</h2>
      <p style="font-size:16px; color:#333;">Hello <strong>${user.name}</strong>,</p>
      <p style="font-size:15px; color:#555;">
        Thank you for subscribing to Boardroom Banter! Your subscription has been successfully activated.
      </p>
      <div style="background:#f5f5f5; padding:15px; border-radius:6px; margin:20px 0;">
        <p style="font-size:14px; margin:5px 0;"><strong>Subscription ID:</strong> ${subscriptionDetails.razorpaySubscriptionId}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Status:</strong> Active</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Start Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p style="font-size:15px; color:#555;">
        You now have access to all premium features of Boardroom Banter. 
        If you have any questions, please contact our support team.
      </p>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">The Boardroom Banter Team</p>
    </div>
  </div>
  `;

  // Email to admin
  const adminEmail = "rahul.mitraconsultancy@gmail.com";
  const adminSubject = "New Subscription - Boardroom Banter";
  const adminHtmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Boardroom Banter - New Subscription</h2>
      <p style="font-size:16px; color:#333;">Hello Admin,</p>
      <p style="font-size:15px; color:#555;">
        A new subscription has been purchased. Here are the details:
      </p>
      <div style="background:#f5f5f5; padding:15px; border-radius:6px; margin:20px 0;">
        <p style="font-size:14px; margin:5px 0;"><strong>Customer Name:</strong> ${user.name}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Customer Email:</strong> ${user.email}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Subscription ID:</strong> ${subscriptionDetails.razorpaySubscriptionId}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Purchase Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">Boardroom Banter System</p>
    </div>
  </div>
  `;

  try {
    // Send email to user
    await sendEmail(user.email, userSubject, userHtmlBody);

    // Send email to admin
    await sendEmail(adminEmail, adminSubject, adminHtmlBody);
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is not valid.");
  }
};

export const sendCouponCodeEmail = async (user: any, couponCode: string) => {
  const subject = `Your Exclusive Coupon Code - Boardroom Banter`;
  const htmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Boardroom Banter</h2>
      <p style="font-size:16px; color:#333;">Hello <strong>${user.name}</strong>,</p>
      <p style="font-size:15px; color:#555;">
        We’re excited to share your exclusive coupon code for a Boardroom Banter subscription.
      </p>
      <div style="background:#f5f5f5; padding:20px; border-radius:6px; margin:20px 0; text-align:center;">
        <p style="font-size:14px; color:#555; margin-bottom:8px;">Here’s your coupon code:</p>
        <p style="font-size:24px; font-weight:bold; letter-spacing:2px; color:#c0392b; margin:0;">${couponCode}</p>
      </div>
      <p style="font-size:15px; color:#555; line-height:1.6;">
        Use this code during checkout to purchase your <strong>Boardroom Banter Subscription</strong> 
        and enjoy premium access to exclusive content, discussions, and resources.
      </p>
      <p style="font-size:15px; color:#555; margin-top:20px;">
        Don’t miss out — activate your subscription today and become part of our growing community of forward-thinkers.
      </p>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">The Boardroom Banter Team</p>
    </div>
  </div>
  `;

  try {
    await sendEmail(user.email, subject, htmlBody);
  } catch (error) {
    console.error(`Failed to send coupon code email:`, error);
  }
};

export const sendOrderInvoiceEmail = async (user: any, orderedItems: any) => {
  const subject = `Your Invoice - Hanjifinance`;

  const subTotal = orderedItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );
  const tax = subTotal * 0.18;
  const totalAmount = subTotal + tax;

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:700px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      
      <h2 style="color:#c0392b; text-align:center;">Hanjifinance</h2>
      <p style="font-size:16px; color:#333;">Hello <strong>${user.name}</strong>,</p>
      <p style="font-size:15px; color:#555;">
        Thank you for your order! Here is your invoice for your recent purchase.
      </p>

      <!-- Invoice Table -->
      <table style="width:100%; border-collapse: collapse; margin-top:20px;">
        <thead>
          <tr style="background-color:#c0392b; color:#fff; text-align:left;">
            <th style="padding:10px;">Item Name</th>
            <th style="padding:10px; text-align:right;">Price</th>
            <th style="padding:10px; text-align:center;">Quantity</th>
            <th style="padding:10px; text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderedItems
            .map(
              (item: any) => `
            <tr style="border-bottom:1px solid #e5e5e5;">
              <td style="padding:10px;">${item.name} (Size: ${item.size}, Color: ${item.color})</td>
              <td style="padding:10px; text-align:right;">₹${item.price.toFixed(2)}</td>
              <td style="padding:10px; text-align:center;">${item.quantity}</td>
              <td style="padding:10px; text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <!-- Totals -->
<div style="margin-top:20px; width:100%;">
  <table style="width:300px; border-collapse: collapse; margin-left:auto; text-align:right;">
    <tr>
      <td style="padding:8px; font-weight:bold;">Subtotal:</td>
      <td style="padding:8px;">₹${subTotal.toFixed(2)}</td>
    </tr>
    <tr>
      <td style="padding:8px; font-weight:bold;">Tax (18%):</td>
      <td style="padding:8px;">₹${tax.toFixed(2)}</td>
    </tr>
    <tr>
      <td style="padding:8px; font-weight:bold; font-size:16px; color:#c0392b;">Total Amount:</td>
      <td style="padding:8px; font-size:16px; color:#c0392b;">₹${totalAmount.toFixed(2)}</td>
    </tr>
  </table>
</div>


      <p style="font-size:15px; color:#555; margin-top:30px;">
        Please keep this invoice for your records. You can download digital invoice from your <strong>Dashboard > My Orders</strong>
      </p>

      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">Hanjifinance Team</p>
    </div>
  </div>
  `;

  try {
    await sendEmail(user.email, subject, htmlBody);
  } catch (error) {
    console.error(`Failed to send invoice email:`, error);
  }
};
