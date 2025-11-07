import mongoose, { Document, Schema } from "mongoose";

export type ContractStatus = "draft" | "partially_signed" | "signed";

export interface ContractParty {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
}

export interface ContractSignature {
  partyId: mongoose.Types.ObjectId;
  imagePath: string; // local path to signature PNG
  typedName: string;
  signedAt: Date;
  ip: string;
}

export interface ContractDocument extends Document {
  title: string;
  templateKey: string;
  fields: Record<string, string>;
  parties: ContractParty[];
  signatures: ContractSignature[];
  status: ContractStatus;
  workspaceId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  pdfPath?: string;
  sha256?: string;
  audit: Array<{ at: Date; actor?: string; event: string; meta?: any }>;
  createdAt: Date;
  updatedAt: Date;
}

const partySubSchema = new Schema<ContractParty>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    role: { type: String, required: true, trim: true },
  },
  { _id: true }
);

const signatureSubSchema = new Schema<ContractSignature>(
  {
    partyId: { type: Schema.Types.ObjectId, required: true },
    imagePath: { type: String, required: true },
    typedName: { type: String, required: true },
    signedAt: { type: Date, required: true },
    ip: { type: String, required: true },
  },
  { _id: false }
);

const contractSchema = new Schema<ContractDocument>(
  {
    title: { type: String, required: true, trim: true },
    templateKey: { type: String, required: true, trim: true },
    fields: { type: Schema.Types.Mixed, default: {} },
    parties: { type: [partySubSchema], default: [] },
    signatures: { type: [signatureSubSchema], default: [] },
    status: { type: String, enum: ["draft", "partially_signed", "signed"], default: "draft" },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pdfPath: { type: String },
    sha256: { type: String },
    audit: {
      type: [
        new Schema(
          {
            at: { type: Date, required: true },
            actor: { type: String },
            event: { type: String, required: true },
            meta: { type: Schema.Types.Mixed },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const ContractModel = mongoose.model<ContractDocument>("Contract", contractSchema);
export default ContractModel;
