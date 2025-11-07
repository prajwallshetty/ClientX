import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  invoiceNumber: z.string().trim().min(1, { message: "Invoice number is required" }),
  companyName: z.string().trim().min(1, { message: "Company name is required" }),
  companyEmail: z.string().trim().email({ message: "Enter a valid email" }).optional(),
  companyPhone: z.string().trim().optional(),
  companyAddress: z.string().trim().optional(),
  clientName: z.string().trim().min(1, { message: "Client name is required" }),
  amount: z
    .string()
    .refine((val) => !Number.isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Enter a valid amount",
    }),
  currency: z.string().trim().min(1, { message: "Currency is required" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  description: z.string().trim().optional(),
  status: z.enum(["DRAFT", "SENT", "PAID"], { required_error: "Status is required" }),
});

export default function InvoiceCreate() {
  const workspaceId = useWorkspaceId();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNumber: "",
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      companyAddress: "",
      clientName: "",
      amount: "",
      currency: "USD",
      status: "DRAFT",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Stub: replace with API call when available
    toast({
      title: "Invoice Created",
      description: `Invoice ${values.invoiceNumber} for ${values.clientName} created in workspace ${workspaceId}.`,
      variant: "success",
    });
    form.reset();
  };

  const handleDownload = () => {
    const v = form.getValues();
    const due = v.dueDate ? format(v.dueDate, "PPP") : "";
    const html = `<!doctype html>
<html>
<head>
  <meta charset=\"utf-8\" />
  <title>Invoice ${v.invoiceNumber}</title>
  <style>
    body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; padding:24px; color:#111}
    h1{font-size:20px;margin:0}
    .muted{color:#555}
    .row{display:flex; justify-content:space-between; gap:24px}
    .card{border:1px solid #e5e7eb; border-radius:8px; padding:16px; margin:16px 0}
    table{width:100%; border-collapse:collapse; margin-top:8px}
    td,th{padding:8px; border-bottom:1px solid #e5e7eb; text-align:left}
  </style>
</head>
<body>
  <div class="row">
    <div>
      <h1>${v.companyName || ""}</h1>
      <div class="muted">${v.companyEmail || ""}${v.companyEmail && v.companyPhone ? " • " : ""}${v.companyPhone || ""}</div>
      <div class="muted">${(v.companyAddress as string) || ""}</div>
    </div>
    <div style="text-align:right">
      <div><strong>Invoice:</strong> ${v.invoiceNumber}</div>
      <div><strong>Status:</strong> ${v.status}</div>
      <div><strong>Due:</strong> ${due}</div>
    </div>
  </div>

  <div class="card">
    <div><strong>Billed To:</strong> ${v.clientName}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${(v.description as string) || "Invoice"}</td>
        <td>${v.currency} ${v.amount}</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top:24px; text-align:right"><strong>Total:</strong> ${v.currency} ${v.amount}</div>

  <script>window.onload=function(){window.print();}</script>
</body>
</html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="w-full h-auto max-w-3xl">
      <div className="mb-5 pb-2 border-b">
        <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1">
          Create Invoice
        </h1>
        <p className="text-muted-foreground text-sm leading-tight">Generate a payment invoice for your client</p>
      </div>

      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Company Pvt Ltd" className="!h-[48px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="billing@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 555 0100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Address</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="Street, City, State, ZIP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input placeholder="INV-2025-001" className="!h-[48px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Corp" className="!h-[48px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="1000" inputMode="decimal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full flex-1 pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      defaultMonth={new Date()}
                      fromMonth={new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SENT">Sent</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-xs font-extralight ml-1">Optional</span>
                </FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Add notes or line items" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" type="button" onClick={handleDownload}>
              Download
            </Button>
            <Button className="h-[40px] text-white font-semibold" type="submit">
              <Loader className="hidden" />
              Create Invoice
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
