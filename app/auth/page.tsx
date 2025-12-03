"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Email or Contact Number is required" }),
});

export default function AuthPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
    },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
    },
  });

  async function onSignup(values: z.infer<typeof signupSchema>) {
    // Store email in sessionStorage and redirect to onboarding
    sessionStorage.setItem("signup_email", values.email);
    router.push("/onboarding");
  }

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setLoginError("");
    try {
      await login(values.identifier);
    } catch (error) {
      setLoginError((error as Error).message);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10" />
        <Image
          src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTV3Xb1TYGQZ7SxM8p5HKGkCZPkMdDUHRpkcR_J06sXNGGhtZe3"
          alt="Shark Tank India"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-end p-12 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h1 className="text-5xl font-bold mb-4 heading-shark">
              Shark Tank India
            </h1>
            <p className="text-xl text-slate-200 max-w-lg">
              Join the platform where entrepreneurs meet investors. Your big idea starts here.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Back to Home Link */}
          <Link href="/" className="inline-flex items-center text-slate-300 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Auth Card */}
          <div className="glass-shark rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold heading-shark mb-2">
                Welcome Back
              </h2>
              <p className="text-shark-muted">Sign in to continue your journey</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-800/50 p-1">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black data-[state=active]:font-semibold"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black data-[state=active]:font-semibold"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="identifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Email or Contact Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter email or phone" 
                              {...field}
                              className="input-shark"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {loginError && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                      >
                        {loginError}
                      </motion.p>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full btn-shark-primary py-6"
                    >
                      Login
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john@example.com" 
                              {...field}
                              className="input-shark"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full btn-shark-primary py-6"
                    >
                      Start Onboarding
                    </Button>
                    <p className="text-xs text-center text-shark-muted mt-2">
                      We'll collect more details in the next step
                    </p>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Mobile Image Preview */}
          <div className="lg:hidden mt-8 rounded-xl overflow-hidden border border-white/10">
            <div className="relative h-48">
              <Image
                src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTV3Xb1TYGQZ7SxM8p5HKGkCZPkMdDUHRpkcR_J06sXNGGhtZe3"
                alt="Shark Tank India"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
