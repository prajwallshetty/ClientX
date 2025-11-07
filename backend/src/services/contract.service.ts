import ContractModel from "../models/contract.model";
import { renderSimpleContractPdf } from "../utils/pdf.util";
import { sha256Hex } from "../utils/hash.util";


const TEMPLATE_BODIES: Record<string, string[]> = {
  NDA: [
    "This Non-Disclosure Agreement (NDA) is made between {CompanyName} and {CounterpartyName}.",
    "Parties agree to protect Confidential Information disclosed for the Project.",
    "Governing Law: {GoverningLaw}. Effective Date: {EffectiveDate}.",
  ],
  MSA: [
    "This Master Services Agreement (MSA) is between {CompanyName} and {CounterpartyName}.",
    "It governs services to be provided under Statements of Work.",
    "Term: {Term}. Effective Date: {EffectiveDate}.",
  ],
  SOW: [
    "This Statement of Work (SOW) is issued under the MSA between {CompanyName} and {CounterpartyName}.",
    "Scope: {Scope}. Fees: {Fees}. Timeline: {Timeline}.",
  ],
};

const substitute = (lines: string[], fields: Record<string, string>) =>
  lines.map((l) => l.replace(/\{(.*?)\}/g, (_, k) => fields[k] ?? `{${k}}`));

export const createContract = async (params: {
  title: string;
  templateKey: "NDA" | "MSA" | "SOW";
  fields: Record<string, string>;
  parties: Array<{ name: string; email: string; role: string }>;
  workspaceId: string;
  createdBy: string;
}) => {
  const contract = await ContractModel.create({
    title: params.title,
    templateKey: params.templateKey,
    fields: params.fields,
    parties: params.parties,
    status: "draft",
    workspaceId: params.workspaceId,
    createdBy: params.createdBy,
    audit: [{ at: new Date(), actor: params.createdBy, event: "created" }],
  });
  return { contract };
};

export const getContract = async (id: string, workspaceId: string) => {
  const contract = await ContractModel.findOne({ _id: id, workspaceId });
  return { contract };
};

export const signContract = async (params: {
  id: string;
  workspaceId: string;
  partyId: string;
  typedName: string;
  signatureDataUrl: string;
  ip: string;
}) => {
  const contract = await ContractModel.findOne({ _id: params.id, workspaceId: params.workspaceId });
  if (!contract) throw new Error("Contract not found");

  const party = contract.parties.find(
    (p: any) => p && p._id && p._id.toString() === params.partyId
  );
  if (!party) throw new Error("Party not found");

  const base64 = params.signatureDataUrl.replace(/^data:image\/png;base64,/, "");
  const buf = Buffer.from(base64, "base64");

  const existing = contract.signatures.find((s) => s.partyId.toString() === party._id.toString());
  if (existing) {
    existing.imageData = buf;
    existing.typedName = params.typedName;
    existing.signedAt = new Date();
    existing.ip = params.ip;
  } else {
    contract.signatures.push({
      partyId: party._id as any,
      imageData: buf,
      typedName: params.typedName,
      signedAt: new Date(),
      ip: params.ip,
    });
  }

  // update status
  contract.status = contract.signatures.length === contract.parties.length ? "signed" : "partially_signed";
  contract.audit.push({ at: new Date(), event: "signed", actor: party.email });
  await contract.save();

  return { contract };
};

export const finalizeContract = async (params: { id: string; workspaceId: string }) => {
  const contract = await ContractModel.findOne({ _id: params.id, workspaceId: params.workspaceId });
  if (!contract) throw new Error("Contract not found");

  const bodyTemplate = TEMPLATE_BODIES[contract.templateKey] || [];
  const bodyLines = substitute(bodyTemplate, contract.fields);

  // prepare signature images by role
  const signaturesByRole: Array<{ role: string; typedName: string; imageBytes?: Uint8Array }> = contract.parties.map(
    (p: any) => {
      const sig = contract.signatures.find(
        (s) => s.partyId.toString() === p._id.toString()
      );
      const imageBytes: Uint8Array | undefined = sig?.imageData
        ? new Uint8Array(sig.imageData)
        : undefined;
      return { role: p.role, typedName: sig?.typedName || p.name, imageBytes };
    }
  );

  const pdfBytes = await renderSimpleContractPdf({
    title: contract.title,
    bodyLines,
    fieldValues: contract.fields,
    signatures: signaturesByRole,
  });

  const pdfBuffer = Buffer.from(pdfBytes);
  const sha = sha256Hex(pdfBuffer);
  contract.pdfData = pdfBuffer;
  contract.sha256 = sha;
  contract.audit.push({ at: new Date(), event: "finalized" });
  await contract.save();

  return { contract };
};

export const listContracts = async (workspaceId: string) => {
  const contracts = await ContractModel.find({ workspaceId }).sort({ createdAt: -1 });
  return { contracts };
};
