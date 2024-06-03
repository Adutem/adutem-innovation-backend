import { Request, Response } from "express";
import { Blog, IBlogContent } from "../models";
import { deleteImage, throwErrorIfBodyIsEmpty } from "../utils";
import {
  sendSuccessResponse,
  throwBadRequestError,
  throwNotFoundError,
} from "../helpers";
import { StatusCodes } from "http-status-codes";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { storage } from "../firebase/init";

export const getAllBlogs = async (req: Request, res: Response) => {
  let blogs = await Blog.find({});
  return sendSuccessResponse(res, { blogs, message: "Successful" });
};

export const getBlog = async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);
  if (!blog) throwNotFoundError("Resource not found");
  return sendSuccessResponse(res, { blog, message: "Successful" });
};

export const createBlog = async (req: Request, res: Response) => {
  const data = req.body;
  const files = req.files as Express.Multer.File[];
  throwErrorIfBodyIsEmpty(
    data,
    ["title", "shortIntroduction", "publicationDate", "tag"],
    "Please provide all required fields"
  );

  const { nanoid } = await import("nanoid");
  const blogNanoId = nanoid(9);

  // Upload thumbnail
  const thumbNailFile = files.find((file) => file.fieldname === "thumbNail");
  if (!thumbNailFile) return throwBadRequestError("Please provide thumbnail");
  const thumbNailRef = ref(
    storage,
    `thumbnails/${blogNanoId}-${thumbNailFile.originalname}`
  );
  await uploadBytes(thumbNailRef, thumbNailFile.buffer);
  const thumbNailURL = await getDownloadURL(thumbNailRef);
  const thumbNailMetaData = await getMetadata(thumbNailRef);

  //   const blogContents: IBlogContent[] = [];
  let parsedContents: Array<Partial<IBlogContent>> = [];

  Object.keys(data).map((key) => {
    if (key.includes("content")) {
      const [contentWithIndex, property] = key.split(".");
      const contentIndex = Number(contentWithIndex.replace(/\D+/g, ""));
      if (!parsedContents[contentIndex]) parsedContents[contentIndex] = {};
      parsedContents[contentIndex] = {
        ...parsedContents[contentIndex],
        [property]:
          property === "listContent" ? JSON.parse(data[key]) : data[key],
      };
    }
  });

  // Upload blog contents and update parsed contents
  const blogContentFileUploadPromise: Promise<any>[] = [];
  files.forEach((file) => {
    if (file.fieldname === "thumbNail") return;
    let uploadFile = new Promise(async (resolve) => {
      const contentIndex = Number(file.fieldname.replace(/\D+/g, ""));
      const fileRef = ref(
        storage,
        `contents/${blogNanoId}-${parsedContents[contentIndex]?.nanoId}-${file.originalname}`
      );
      await uploadBytes(fileRef, file.buffer);
      const contentURL = await getDownloadURL(fileRef);
      const contentMetaData = await getMetadata(fileRef);
      const metadata = {
        size: contentMetaData.size,
        fullPath: contentMetaData.fullPath,
        name: contentMetaData.name,
        timeCreated: contentMetaData.timeCreated,
      };
      parsedContents[contentIndex] = {
        ...parsedContents[contentIndex],
        fileContent: {
          downloadUrl: contentURL,
          metadata,
        },
      };
      resolve(null);
    });
    blogContentFileUploadPromise.push(uploadFile);
  });

  await Promise.all(blogContentFileUploadPromise);

  const newBlog = await Blog.create({
    ...data,
    blogNanoId,
    thumbNail: {
      downloadUrl: thumbNailURL,
      metadata: {
        size: thumbNailMetaData.size,
        fullPath: thumbNailMetaData.fullPath,
        name: thumbNailMetaData.name,
        timeCreated: thumbNailMetaData.timeCreated,
      },
    },
    blogContents: parsedContents,
  });

  return sendSuccessResponse(
    res,
    {
      blog: newBlog,
      message: "Successful",
    },
    StatusCodes.CREATED
  );
};

export const deleteBlog = async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const currentBlog = await Blog.findById(blogId);
  if (!currentBlog) return throwNotFoundError("Resource not found");
  const { thumbNail, blogContents } = currentBlog;
  const thumbNailPath = thumbNail.metadata.fullPath;
  console.log("Deleting thumbnail...");
  await deleteImage(thumbNailPath);
  console.log("Thumbnail deleted...");
  console.log("Deleting blog images...");
  const blogImageDeletionPromises: Promise<any>[] = [];
  blogContents.forEach((content) => {
    if (content.type === "image") {
      if (content.fileContent) {
        blogImageDeletionPromises.push(
          deleteImage(content.fileContent.metadata.fullPath)
        );
      }
    }
  });

  await Promise.all(blogImageDeletionPromises);
  console.log("Blog images deleted...");
  console.log("Delete blog from database");
  const deletedBlog = await Blog.findByIdAndDelete(blogId);
  return sendSuccessResponse(res, {
    blog: deletedBlog,
    message: "Blog successfully deleted",
  });
};
