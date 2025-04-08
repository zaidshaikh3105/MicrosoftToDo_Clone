import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/lib/redux/slices/authSlice";
import { z } from "zod";
import { Link, Redirect } from "wouter";
import { Loader2, LayoutGrid, KeyRound, Mail } from "lucide-react";
import { RootState } from "@/lib/redux/store";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // Use cast to any to handle Redux Toolkit AsyncThunk typing issue
    (dispatch(login({ email: data.email, password: data.password })) as any)
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
      })
      .catch((error: any) => {
        toast({
          title: "Error",
          description:
            typeof error === "string"
              ? error
              : "Login failed. Please check your credentials.",
          variant: "destructive",
        });
      });
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gradient-to-br from-background to-muted">
      {/* Left side - Brand info */}
      <div className="sm:w-1/2 flex flex-col justify-center items-center p-8 sm:p-16 text-center sm:text-left">
        <div className="mb-6">
          <div className="flex items-center justify-center sm:justify-start">
            <LayoutGrid className="h-10 w-10 text-primary mr-2" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              ToDo'Em
            </h1>
          </div>
          <p className="text-xl mt-2 text-muted-foreground max-w-md">
            Organize your tasks by urgency and importance to boost your
            productivity
          </p>
        </div>

        <div className="mt-8 space-y-4 max-w-md">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">1</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">Prioritize with clarity</h3>
              <p className="text-muted-foreground">
                Know exactly what needs to be done first
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">2</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">Focus on what matters</h3>
              <p className="text-muted-foreground">
                Eliminate time wasted on unimportant tasks
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">3</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">Achieve more, stress less</h3>
              <p className="text-muted-foreground">
                Work smarter with a visual productivity system
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="sm:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 p-3 rounded-md mb-4 text-sm text-destructive">
                {typeof error === "string"
                  ? error
                  : "Login failed. Please try again."}
              </div>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="name@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Create account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
