import mongoose, { Schema, Document } from "mongoose";

// Define the interface for your document
export interface ILog extends Document {
  logLevel: string;
  message: string;
  fileName: string;
  Server: string;
  time: Date;
}

// Define the schema for the log data
const LogSchema: Schema = new Schema(
  {
    logLevel: { type: String, required: true },
    message: { type: String, required: true },
    fileName: { type: String, required: true },
    Server: { type: String, required: true },
    time: { type: Date, required: true },
  },
  {
    timestamps: false,  // No need for createdAt and updatedAt
    collection: 'api-nxt',  // Specify the collection name
  }
);

// Create the model from the schema
const Log = mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);

export default Log;
