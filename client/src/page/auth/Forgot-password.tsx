import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import Logo from "@/components/logo";

const schema = z.object({
  email: z.string().trim().email("Invalid email address").min(1, { message: "Email is required" }),
});

const ForgotPassword = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending, data } = useMutation({
    mutationFn: (payload: z.infer<typeof schema>) => forgotPasswordMutationFn(payload.email),
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (isPending) return;
    mutate(values, {
      onSuccess: (res) => {
        toast({ title: "Check your email", description: res.message });
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium">
          <Logo />
          ClientX .
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Forgot password</CardTitle>
            <CardDescription>Enter your email to receive a reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" className="!h-[48px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={isPending} type="submit" className="w-full">
                    Send reset link
                  </Button>
                  <div className="text-center text-sm">
                    Remembered it? <Link to="/sign-in" className="underline underline-offset-4">Sign in</Link>
                  </div>
                  {data?.resetUrl && (
                    <div className="text-xs text-muted-foreground text-center">
                      Dev only: <a className="underline" href={data.resetUrl}>Open reset link</a>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
