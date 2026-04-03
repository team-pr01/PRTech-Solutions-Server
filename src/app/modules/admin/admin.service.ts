import Category from "../client/client.model";

const getPlatformOverview = async () => {
  const [
    totalNewsletters,
    // totalCategories,
    // totalProducts,
    // totalProductOrders,
  ] = await Promise.all([
    Category.countDocuments(),
    // Product.countDocuments(),
    // ProductOrder.countDocuments(),
    // CouponCode.countDocuments(),
  ]);

  return {
    totalNewsletters,
  };
};

export const AdminStatsService = {
  getPlatformOverview,
};
