import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { createContractSchema, contractIdSchema, signContractSchema } from "../validation/contract.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { createContract, finalizeContract, getContract, listContracts, signContract } from "../services/contract.service";

export const createContractController = asyncHandler(async (req: Request, res: Response) => {
  const body = createContractSchema.parse(req.body);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const userId = req.user?._id as any;

  const { contract } = await createContract({
    title: body.title,
    templateKey: body.templateKey,
    fields: body.fields,
    parties: body.parties,
    workspaceId,
    createdBy: userId,
  });

  return res.status(HTTPSTATUS.CREATED).json({ message: "Contract created successfully", contract });
});

export const getContractController = asyncHandler(async (req: Request, res: Response) => {
  const id = contractIdSchema.parse(req.params.id);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const { contract } = await getContract(id, workspaceId);
  return res.status(HTTPSTATUS.OK).json({ contract });
});

export const listContractsController = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const { contracts } = await listContracts(workspaceId);
  return res.status(HTTPSTATUS.OK).json({ contracts });
});

export const signContractController = asyncHandler(async (req: Request, res: Response) => {
  const id = contractIdSchema.parse(req.params.id);
  const { partyId, signatureDataUrl, typedName } = signContractSchema.parse(req.body);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const ip = req.ip;

  const { contract } = await signContract({ id, workspaceId, partyId, signatureDataUrl, typedName, ip });
  return res.status(HTTPSTATUS.OK).json({ message: "Signature captured", contract });
});

export const finalizeContractController = asyncHandler(async (req: Request, res: Response) => {
  const id = contractIdSchema.parse(req.params.id);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const { contract } = await finalizeContract({ id, workspaceId });
  return res.status(HTTPSTATUS.OK).json({ message: "Contract finalized", contract });
});

export const downloadContractController = asyncHandler(async (req: Request, res: Response) => {
  const id = contractIdSchema.parse(req.params.id);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const { contract } = await getContract(id, workspaceId);
  if (!contract || !contract.pdfPath) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Contract not finalized" });
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=contract-${contract._id}.pdf`);
  return res.status(200).sendFile(contract.pdfPath);
});
