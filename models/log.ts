import mongoose, { Schema, model, models } from 'mongoose';

// Define the interface for your document
export interface ILog extends Document {
  logLevel: string;
  message: string;
  fileName: string;
  Server: string;
  time: Date;
}

const getLogModel = (collectionName: string) => {
  const LogSchema = new Schema(
    {
      logLevel: { type: String, required: true },
      message: { type: String, required: true },
      fileName: { type: String, required: true },
      Server: { type: String, required: true },
      time: { type: Date, required: true },
    },
    {
      timestamps: false, // No need for createdAt and updatedAt
      collection: collectionName, // Dynamic collection name
    }
  );

  return models[collectionName] || model(collectionName, LogSchema);
};

export default getLogModel;
