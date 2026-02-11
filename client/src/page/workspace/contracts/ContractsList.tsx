import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { listContractsQueryFn } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ContractsList() {
  const workspaceId = useWorkspaceId();
  const { data, isLoading, error } = useQuery({
    queryKey: ["contracts", workspaceId],
    queryFn: () => listContractsQueryFn(workspaceId),
  });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Contracts</h1>
        <Link to={`/workspace/${workspaceId}/contracts/create`}>
          <Button>Create Contract</Button>
        </Link>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && (
        <div className="text-red-600 text-sm mb-2">Error loading contracts</div>
      )}
      <div className="space-y-2">
        {data?.contracts?.map((c) => (
          <div key={c._id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-muted-foreground">{c.templateKey} • {c.status}</div>
            </div>
            <div className="flex gap-2">
              <Link to={`/workspace/${workspaceId}/contracts/${c._id}`}>
                <Button variant="outline">Open</Button>
              </Link>
            </div>
          </div>
        ))}
        {!data?.contracts?.length && !isLoading && (
          <div className="text-sm text-muted-foreground">No contracts yet.</div>
        )}
      </div>
    </div>
  );
}
