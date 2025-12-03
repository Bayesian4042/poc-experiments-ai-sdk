"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  surname: string;
  city: string;
  age: number;
  gender: string;
  companyName: string;
  email: string;
  contactNumber: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (identifier: string) => Promise<void>;
  signup: (profile: UserProfile) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock In-Memory Database
const USERS_DB: UserProfile[] = [];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  const login = async (identifier: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Find user in memory
    const foundUser = USERS_DB.find(
        (u) => u.email === identifier || u.contactNumber === identifier
    );
    
    if (foundUser) {
        setUser(foundUser);
        router.push("/");
        return;
    }
    
    throw new Error("User not found or invalid credentials");
  };

  const signup = async (profile: UserProfile) => {
     // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = USERS_DB.find(
        (u) => u.email === profile.email || u.contactNumber === profile.contactNumber
    );

    if (existingUser) {
        throw new Error("User with this email or contact number already exists");
    }

    // Save to memory
    USERS_DB.push(profile);
    
    // Log in the user immediately
    setUser(profile);
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    router.push("/auth");
  };

  const updateProfile = (updatedFields: Partial<UserProfile>) => {
      if (!user) return;
      const updatedUser = { ...user, ...updatedFields };
      
      // Update in memory DB
      const index = USERS_DB.findIndex((u) => u.email === user.email);
      if (index !== -1) {
          USERS_DB[index] = updatedUser;
      }

      setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
