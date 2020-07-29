import express from "express";
import morgan from "morgan";

//@ts-ignore
import arranger from "@arranger/server";
//@ts-ignore
// import adminGraphql from "@arranger/admin/dist";

const PORT = process.env.PORT || 6060;
const ES_HOST = process.env.ES_HOST || "http://localhost:9200";

(async () => {
  const app = express();
  app.use(morgan("combined"));

  // const adminApolloServer = await adminGraphql({
  //   esHost: ES_HOST,
  // });

  // adminApolloServer.applyMiddleware({
  //   app: app,
  //   cors: true,
  //   path: "/admin",
  // });

  console.log("Initializing Arranger API");
  const arrangerRouter = await arranger({ enableAdmin: false });
  console.log("Initialized Arranger API");
  app.use("/arranger", arrangerRouter);

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
})();
