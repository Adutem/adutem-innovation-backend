import multer from "multer";
import { routerCreator } from "../helpers";
import { createBlog, deleteBlog, getAllBlogs } from "../controllers";
import { validateToken } from "../middlewares";

const upload = multer();

const blogRouter = routerCreator();

blogRouter.use(validateToken);
blogRouter.route("/").post(upload.any(), createBlog).get(getAllBlogs);
blogRouter.route("/:blogId").delete(deleteBlog);

export default blogRouter;
