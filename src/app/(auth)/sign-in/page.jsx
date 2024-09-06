'use client'

// Import necessary modules and components
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import Link from 'next/link';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signInValidation } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';

// Define the SignInForm component
export default function SignInForm() {
  const router = useRouter(); // Initialize the router for navigation

  // Initialize the form with default values and validation schema
  const form = useForm({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast(); // Initialize toast for notifications

  // Define the onSubmit function to handle form submission
  const onSubmit = async (data) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    // Handle errors and display appropriate toast notifications
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    // Redirect to the home page if login is successful
    if (result?.url) {
      router.push('/');
    }
  };

  // Render the sign-in form
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
