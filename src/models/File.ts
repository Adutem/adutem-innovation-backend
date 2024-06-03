import { Schema, Document } from "mongoose";

type FileMetaData = {
  name: string;
  size: number;
  fullPath: string;
  timeCreated: string | Date;
};

export interface FileContentType {
  downloadUrl: string;
  metadata: FileMetaData;
}

export interface IFile extends FileContentType, Document {}

export const FileSchema: Schema<IFile> = new Schema<IFile>(
  {
    downloadUrl: {
      type: String,
      required: [true, "Please provide file download url"],
      trim: true,
    },
    metadata: {
      name: {
        type: String,
        required: [true, "Please provide file name"],
        trim: true,
      },
      size: {
        type: Number,
        required: [true, "Please provide file size"],
      },
      fullPath: {
        type: String,
        required: [true, "Please provide file full path"],
        trim: true,
      },
      timeCreated: {
        type: Date,
        required: [true, "Please provide file created time"],
        trim: true,
      },
    },
  },
  { timestamps: true }
);
