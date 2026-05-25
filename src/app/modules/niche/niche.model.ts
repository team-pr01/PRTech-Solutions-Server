import { Schema, model } from "mongoose";
import { TNiche } from "./niche.interface";

const NicheSchema = new Schema<TNiche>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subNiches: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Niche = model<TNiche>("Niche", NicheSchema);

export default Niche;