"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/app/context/auth-context";
import { OnboardingStep } from "./OnboardingStep";
import { ProgressBar } from "./ProgressBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProfileData {
  name: string;
  surname: string;
  city: string;
  age: string;
  gender: string;
  companyName: string;
  email: string;
  contactNumber: string;
}

export function OnboardingFlow() {
  const { signup } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    surname: "",
    city: "",
    age: "",
    gender: "",
    companyName: "",
    email: "",
    contactNumber: "",
  });

  // Load email from sessionStorage on mount
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("signup_email");
    if (savedEmail) {
      setProfileData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);
 
  const totalSteps = 10;
  const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];

   const updateField = (field: keyof ProfileData, value: string) => {
     setProfileData((prev) => ({
       ...prev,
       [field]: value,
     }));
   };
 
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };
 
  const handleComplete = async () => {
    setLoading(true);
    setError("");
    try {
    	await signup({
        name: profileData.name,
        surname: profileData.surname,
        city: profileData.city,
        age: Number(profileData.age),
        gender: profileData.gender,
        companyName: profileData.companyName,
        email: profileData.email,
        contactNumber: profileData.contactNumber,
      });
      // Clear the stored email after successful signup
      sessionStorage.removeItem("signup_email");
      nextStep();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
 
   const steps = useMemo(
     () => [
       <OnboardingStep key="welcome" onNext={nextStep}>
         <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
           <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4">
             Personal onboarding
           </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 heading-shark">
            Welcome! 👋
          </h1>
           <p className="text-2xl text-gray-600 leading-relaxed">
             Let's get to know you better. This will only take a minute.
           </p>
         </motion.div>
       </OnboardingStep>,
       <OnboardingStep key="name" onNext={nextStep} nextDisabled={!profileData.name.trim()}>
         <label className="block">
           <span className="text-4xl font-bold text-gray-800 mb-4 block">
             What's your first name?
           </span>
           <input
             type="text"
             value={profileData.name}
             onChange={(e) => updateField("name", e.target.value)}
             placeholder="Type your answer here..."
             autoFocus
             className="w-full text-3xl font-medium border-b-4 border-gray-200 focus:border-blue-500 outline-none py-4 transition-colors bg-transparent placeholder:text-gray-300"
           />
         </label>
       </OnboardingStep>,
       <OnboardingStep key="surname" onNext={nextStep} nextDisabled={!profileData.surname.trim()}>
         <label className="block">
           <span className="text-4xl font-bold text-gray-800 mb-4 block">
             And your last name, {profileData.name || "friend"}?
           </span>
           <input
             type="text"
             value={profileData.surname}
             onChange={(e) => updateField("surname", e.target.value)}
             placeholder="Type your answer here..."
             autoFocus
             className="w-full text-3xl font-medium border-b-4 border-gray-200 focus:border-blue-500 outline-none py-4 transition-colors bg-transparent placeholder:text-gray-300"
           />
         </label>
       </OnboardingStep>,
       <OnboardingStep key="city" onNext={nextStep} nextDisabled={!profileData.city.trim()}>
         <label className="block">
           <span className="text-4xl font-bold text-gray-800 mb-4 block">
             Which city do you call home?
           </span>
           <input
             type="text"
             value={profileData.city}
             onChange={(e) => updateField("city", e.target.value)}
             placeholder="Type your answer here..."
             autoFocus
             className="w-full text-3xl font-medium border-b-4 border-gray-200 focus:border-blue-500 outline-none py-4 transition-colors bg-transparent placeholder:text-gray-300"
           />
         </label>
       </OnboardingStep>,
       <OnboardingStep
         key="age"
         onNext={nextStep}
         nextDisabled={!profileData.age || Number(profileData.age) < 18}
         nextLabel={Number(profileData.age) < 18 ? "Must be 18+" : "Continue"}
       >
         <label className="block">
           <span className="text-4xl font-bold text-gray-800 mb-4 block">
             How old are you?
           </span>
           <input
             type="number"
             min={18}
             max={100}
             value={profileData.age}
             onChange={(e) => updateField("age", e.target.value)}
             placeholder="Type your answer here..."
             autoFocus
             className="w-full text-3xl font-medium border-b-4 border-gray-200 focus:border-blue-500 outline-none py-4 transition-colors bg-transparent placeholder:text-gray-300"
           />
           <p className="text-sm text-gray-400 mt-2">
             You must be at least 18 years old to join the platform.
           </p>
         </label>
       </OnboardingStep>,
       <OnboardingStep key="gender" showNext={false}>
         <div>
           <h2 className="text-4xl font-bold text-gray-800 mb-8">
             How do you identify?
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {genderOptions.map((option) => (
               <motion.button
                 key={option}
                 onClick={() => {
                   updateField("gender", option);
                   setTimeout(nextStep, 250);
                 }}
                 className={`p-6 text-xl font-medium border-2 rounded-xl text-left transition-all ${
                   profileData.gender === option
                     ? "border-blue-500 bg-blue-50"
                     : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                 }`}
                 whileHover={{ scale: 1.02, y: -2 }}
                 whileTap={{ scale: 0.98 }}
               >
                 {option}
               </motion.button>
             ))}
           </div>
         </div>
       </OnboardingStep>,
       <OnboardingStep key="company" onNext={nextStep} nextDisabled={!profileData.companyName.trim()}>
         <label className="block">
           <span className="text-4xl font-bold text-gray-800 mb-4 block">
             Where do you work?
           </span>
           <input
             type="text"
             value={profileData.companyName}
             onChange={(e) => updateField("companyName", e.target.value)}
             placeholder="Type your answer here..."
             autoFocus
             className="w-full text-3xl font-medium border-b-4 border-gray-200 focus:border-blue-500 outline-none py-4 transition-colors bg-transparent placeholder:text-gray-300"
           />
         </label>
      </OnboardingStep>,
      <OnboardingStep
         key="contact"
         onNext={handleComplete}
         nextDisabled={!profileData.contactNumber.trim()}
         nextLabel={loading ? "Saving..." : "Create Profile"}
       >
         <label className="block">
           <span className="text-4xl font-bold text-gray-800 mb-4 block">
             What's the best contact number for you?
           </span>
           <input
             type="tel"
             value={profileData.contactNumber}
             onChange={(e) => updateField("contactNumber", e.target.value)}
             placeholder="1234567890"
             autoFocus
             className="w-full text-3xl font-medium border-b-4 border-gray-200 focus:border-blue-500 outline-none py-4 transition-colors bg-transparent placeholder:text-gray-300"
           />
         </label>
         {error && <p className="text-red-500 mt-4">{error}</p>}
       </OnboardingStep>,
       <OnboardingStep key="success" showNext={false}>
         <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
           className="text-center"
         >
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
             className="text-8xl mb-6"
           >
             🎉
           </motion.div>
           <h1 className="text-5xl font-bold mb-4 text-gray-800">
             All set, {profileData.name}!
           </h1>
           <p className="text-2xl text-gray-600 mb-8">
             Your profile has been created successfully.
           </p>
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="bg-gray-50 rounded-2xl p-8 text-left max-w-md mx-auto"
           >
             <h3 className="text-lg font-semibold text-gray-700 mb-4">
               Your Profile:
             </h3>
             <div className="space-y-2 text-gray-600">
               <p>
                 <strong>Name:</strong> {profileData.name} {profileData.surname}
               </p>
               <p>
                 <strong>City:</strong> {profileData.city}
               </p>
               <p>
                 <strong>Age:</strong> {profileData.age}
               </p>
               <p>
                 <strong>Gender:</strong> {profileData.gender}
               </p>
               <p>
                 <strong>Company:</strong> {profileData.companyName}
               </p>
             </div>
           </motion.div>
          <div className="mt-8 flex flex-col gap-3 items-center justify-center sm:flex-row">
            <Link href="/" passHref>
              <Button className="px-8 py-4 text-lg">Explore Sharks</Button>
            </Link>
            <Link href="/demand-forecast" passHref>
              <Button variant="outline" className="px-8 py-4 text-lg">
                Go to Assistant
              </Button>
            </Link>
          </div>
         </motion.div>
       </OnboardingStep>,
     ],
     [profileData, loading, error] // intentionally capture state for re-render
   );
 
   return (
    <div className="min-h-screen bg-white">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
       <AnimatePresence mode="wait">{steps[currentStep]}</AnimatePresence>
     </div>
   );
 }

