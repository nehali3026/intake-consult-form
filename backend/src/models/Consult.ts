import mongoose, { Schema, Document } from "mongoose";

export interface IConsult extends Document {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  responses: Array<{
    questionId: string;
    questionType: string;
    answer: string;
  }>;
  timezone: string;
  submittedAt: Date;
}

const ConsultSchema = new Schema<IConsult>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    responses: [
      {
        questionId: { type: String, required: true },
        questionType: { type: String, required: true },
        answer: { type: String, required: true },
        _id: false,
      },
    ],
    timezone: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IConsult>("Consult", ConsultSchema);
