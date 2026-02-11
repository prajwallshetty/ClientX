import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useMutation } from "@tanstack/react-query";
import { createContractMutationFn } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const templateFields: Record<string, string[]> = {
  NDA: ["CompanyName", "CounterpartyName", "GoverningLaw", "EffectiveDate"],
  MSA: ["CompanyName", "CounterpartyName", "Term", "EffectiveDate"],
  SOW: ["CompanyName", "CounterpartyName", "Scope", "Fees", "Timeline"],
};

const formSchema = z.object({
  title: z.string().min(1),
  templateKey: z.enum(["NDA", "MSA", "SOW"]),
  fields: z.record(z.string()).default({}),
  parties: z.array(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      role: z.string().min(1),
    })
  ).min(2, "At least two parties are required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContractCreate() {
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Untitled Contract",
      templateKey: "NDA",
      fields: {},
      parties: [
        { name: "", email: "", role: "Company" },
        { name: "", email: "", role: "Counterparty" },
      ],
    },
  });

  const { fields: parties, append, remove } = useFieldArray({ control: form.control, name: "parties" });

  const { mutate, isPending } = useMutation({
    mutationFn: createContractMutationFn,
  });

  const currentTemplate = form.watch("templateKey");
  const keys = templateFields[currentTemplate] ?? [];

  const onSubmit = (values: FormValues) => {
    if (isPending) return;
    mutate(
      { workspaceId, data: values },
      {
        onSuccess: (res) => {
          toast({ title: "Created", description: "Contract created successfully", variant: "success" });
          navigate(`/workspace/${workspaceId}/contracts/${res.contract._id}`);
        },
        onError: (err: any) => {
          toast({ title: "Error", description: err.message || "Failed to create", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Create Contract</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Mutual NDA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="templateKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NDA">NDA</SelectItem>
                        <SelectItem value="MSA">MSA</SelectItem>
                        <SelectItem value="SOW">SOW</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="font-medium">Template Fields</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {keys.map((k) => {
                  if (k === "EffectiveDate") {
                    return (
                      <FormField
                        key={k}
                        control={form.control}
                        name={`fields.${k}` as any}
                        render={({ field }) => {
                          const selected = field.value ? new Date(field.value) : undefined;
                          return (
                            <FormItem>
                              <FormLabel>{k}</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !selected && "text-muted-foreground"
                                      )}
                                    >
                                      {selected ? format(selected, "PPP") : <span>Pick a date</span>}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={selected}
                                    onSelect={(d) => d && field.onChange(format(d, "yyyy-MM-dd"))}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    );
                  }

                  return (
                    <FormField
                      key={k}
                      control={form.control}
                      name={`fields.${k}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{k}</FormLabel>
                          <FormControl>
                            <Input placeholder={k} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">Parties</div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", email: "", role: "Signer" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>

              <div className="space-y-3">
                {parties.map((p, idx) => (
                  <div key={p.id} className="grid gap-3 sm:grid-cols-3 items-end">
                    <FormField
                      control={form.control}
                      name={`parties.${idx}.name` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`parties.${idx}.email` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`parties.${idx}.role` as const}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" onClick={() => remove(idx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
