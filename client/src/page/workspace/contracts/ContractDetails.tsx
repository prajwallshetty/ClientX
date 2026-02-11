import { useParams } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { downloadContractFile, finalizeContractMutationFn, getContractByIdQueryFn, signContractMutationFn } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SignaturePad from "@/components/contract/SignaturePad";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ContractDetails() {
  const { contractId } = useParams();
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["contract", workspaceId, contractId],
    queryFn: () => getContractByIdQueryFn({ workspaceId, contractId: contractId! }),
    enabled: !!contractId,
  });

  const [signatureByParty, setSignatureByParty] = useState<Record<string, { typedName: string; dataUrl?: string }>>({});

  const signMutation = useMutation({
    mutationFn: signContractMutationFn,
    onSuccess: () => {
      toast({ title: "Signed", description: "Signature captured", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["contract", workspaceId, contractId] });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message || "Failed to sign", variant: "destructive" }),
  });

  const finalizeMutation = useMutation({
    mutationFn: finalizeContractMutationFn,
    onSuccess: () => {
      toast({ title: "Finalized", description: "PDF generated", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["contract", workspaceId, contractId] });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message || "Failed to finalize", variant: "destructive" }),
  });

  const onSign = (partyId: string) => {
    const entry = signatureByParty[partyId];
    if (!entry?.typedName || !entry?.dataUrl) {
      toast({ title: "Incomplete", description: "Provide typed name and a signature", variant: "destructive" });
      return;
    }
    signMutation.mutate({
      workspaceId,
      contractId: contractId!,
      data: { partyId, typedName: entry.typedName, signatureDataUrl: entry.dataUrl },
    });
  };

  const onDownload = async () => {
    try {
      const blob = await downloadContractFile({ workspaceId, contractId: contractId! });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract-${contractId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Download failed", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Failed to load contract</div>;

  const contract = data?.contract;
  if (!contract) return <div className="p-4">Not Found</div>;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{contract.title}</h1>
          <div className="text-xs text-muted-foreground">{contract.templateKey} • {contract.status}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => finalizeMutation.mutate({ workspaceId, contractId: contract._id })} disabled={finalizeMutation.isPending}>
            Finalize PDF
          </Button>
          <Button onClick={onDownload} disabled={!contract.sha256}>Download PDF</Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-medium">Fields</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(contract.fields || {}).map(([k, v]) => (
            <div key={k} className="text-sm">
              <span className="font-medium mr-1">{k}:</span>
              <span className="text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="font-medium">Parties & Signatures</div>
        {contract.parties.map((p) => {
          const existing = contract.signatures.find((s) => s.partyId === p._id);
          const local = signatureByParty[p._id] || { typedName: p.name, dataUrl: undefined };
          return (
            <div key={p._id} className="border rounded p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.role}: {p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.email}</div>
                </div>
                {existing ? (
                  <div className="text-xs text-green-700">Signed at {new Date(existing.signedAt).toLocaleString()}</div>
                ) : (
                  <div className="text-xs text-amber-700">Pending</div>
                )}
              </div>

              {!existing && (
                <div className="grid gap-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Typed Name</label>
                      <Input
                        value={local.typedName}
                        onChange={(e) => setSignatureByParty((s) => ({ ...s, [p._id]: { ...(s[p._id] || {}), typedName: e.target.value } }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Signature</label>
                      <SignaturePad
                        width={500}
                        height={150}
                        onChange={(dataUrl) => setSignatureByParty((s) => ({ ...s, [p._id]: { ...(s[p._id] || {}), dataUrl } }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => onSign(p._id)} disabled={signMutation.isPending}>Sign as {p.role}</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
