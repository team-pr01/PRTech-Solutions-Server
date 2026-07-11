export type TBlog = {
  imageUrl: string;
  title: string;
  slug: string;
  overview: string;
  category: string;
  description: string;
  isFeatured?: boolean;
  timeToRead: string;
  tags : string[];
  createdAt?: Date;
  updatedAt?: Date;
};