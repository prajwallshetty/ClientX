import { z } from "zod";

export const createContractSchema = z.object({
  title: z.string().min(1),
  templateKey: z.enum(["NDA", "MSA", "SOW"]),
  fields: z.record(z.string()).default({}),
  parties: z
    .array(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        role: z.string().min(1),
      })
    )
    .min(2),
});

export const contractIdSchema = z.string().min(1);

export const signContractSchema = z.object({
  partyId: z.string().min(1),
  typedName: z.string().min(1),
  signatureDataUrl: z.string().startsWith("data:image/png;base64,"),
});

export const finalizeContractSchema = z.object({
  // can carry no data; keeping for future options
});
