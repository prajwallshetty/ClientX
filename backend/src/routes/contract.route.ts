import { Router } from "express";
import {
  createContractController,
  downloadContractController,
  finalizeContractController,
  getContractController,
  listContractsController,
  signContractController,
} from "../controllers/contract.controller";

const contractRoutes = Router();

contractRoutes.post("/workspace/:workspaceId/create", createContractController);
contractRoutes.get("/workspace/:workspaceId", listContractsController);
contractRoutes.get("/:id/workspace/:workspaceId", getContractController);
contractRoutes.post("/:id/workspace/:workspaceId/sign", signContractController);
contractRoutes.post("/:id/workspace/:workspaceId/finalize", finalizeContractController);
contractRoutes.get("/:id/workspace/:workspaceId/download", downloadContractController);

export default contractRoutes;
