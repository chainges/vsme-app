"use client";

import React, { useState, useEffect } from "react";
import { useFormData } from "@/hooks/use-form-data";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

// Define the form schema for each step
const companyInfoSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  organizationNumber: z.string().min(9, "Organization number must be valid"),
  website: z.url("Please enter a valid website URL").optional().or(z.literal("")),
  contactPersonName: z.string().min(2, "Contact person name must be at least 2 characters"),
  // contactPersonTitle: z.string().min(2, "Contact person title must be at least 2 characters"),
  contactPersonEmail: z.email("Please enter a valid email address"),
  legalForm: z.string().min(2, "Legal form is required"),
  naceCode: z.string().min(5, "NACE code is required - xx.xxx"),
  balanceSheetSize: z.coerce.number().min(1, "Balance sheet size is required"),
  turnover: z.coerce.number().min(1, "Turnover is required"),
  numberOfEmployees: z.coerce.number().min(1, "Number of employees must be at least 1"),
  country: z.string().min(2, "Country is required"),
});

const reportingSetupSchema = z.object({
  reportingYear: z.string().min(4, "Please select a reporting year"),
  reportingOption: z.enum(["basic", "basic-comprehensive"], {
    message: "Please select a reporting option",
  }),
  reportBasis: z.enum(["individual", "consolidated"], {
    message: "Please specify if the report is individual or consolidated",
  }).default("individual"),
  hasOmittedInfo: z.boolean().default(true),
  subsidiaries: z.string().optional(),
});

const sustainabilityBaseSchema = z.object({
  hasPracticesPolicies: z.boolean(),
  sustainabilityCertifications: z.string().optional(),
  practicesDescription: z.string().min(10, "Please provide a description of at least 10 characters").optional(),
});

const sustainabilitySchema = sustainabilityBaseSchema;

// Combine all schemas for the final form data
const formSchema = z.object({
  ...companyInfoSchema.shape,
  ...reportingSetupSchema.shape,
  ...sustainabilityBaseSchema.shape,
});

type FormData = z.infer<typeof formSchema>;

interface MultiStepFormProps {
  className?: string;
  onSubmit?: (data: FormData) => void;
}

export default function MultiStepForm({ className, onSubmit }: MultiStepFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Define the steps
  const steps = [
    {
      id: "company-info",
      title: "Company Information",
      description: "Basic organization details",
      schema: companyInfoSchema,
      fields: [
        { name: "organizationName", label: "Organization Name", type: "text", placeholder: "ACME Corporation AS" },
        { name: "organizationNumber", label: "Organization Number", type: "text", placeholder: "123456789" },
        { name: "legalForm", label: "Legal Form", type: "select", placeholder: "Select legal form", options: [
            { label: "Aksjeselskap (AS)", value: "as" },
            { label: "Allmennaksjeselskap (ASA)", value: "asa" },
            { label: "Ansvarlig selskap (ANS)", value: "ans" },
            { label: "Enkeltpersonforetak (ENK)", value: "enk" },
            { label: "Other", value: "other" },
          ]},
        { name: "website", label: "Website (Optional)", type: "url", placeholder: "https://www.acme.com" },
        { name: "contactPersonName", label: "Contact Person Name", type: "text", placeholder: "John Smith" },
        // { name: "contactPersonTitle", label: "Contact Person Title", type: "text", placeholder: "Sustainability Manager" },
        { name: "contactPersonEmail", label: "Contact Person Email", type: "email", placeholder: "john.smith@acme.com" },
        
        { name: "naceCode", label: "NACE Code", type: "text", placeholder: "62.010" },
        { name: "balanceSheetSize", label: "Balance Sheet Size (€)", type: "number", placeholder: "#"},
        { name: "turnover", label: "Annual Turnover (€)", type: "number", placeholder: "#"},
        { name: "numberOfEmployees", label: "Number of Employees", type: "number", placeholder: "#"},
        { name: "country", label: "Country", type: "select", placeholder: "Select country", options: [
          { label: "Norway", value: "norway" },
          { label: "Sweden", value: "sweden" },
          { label: "Denmark", value: "denmark" },
          { label: "Finland", value: "finland" },
          { label: "Other EU Country", value: "other-eu" },
        ]},
      ],
    },
    {
      id: "reporting-setup",
      title: "Reporting Setup",
      description: "Configure your sustainability report",
      schema: reportingSetupSchema,
      fields: [
        { name: "reportingYear", label: "Reporting Year", type: "select", placeholder: "Select year", options: [
          { label: "2024", value: "2024" },
          { label: "2023", value: "2023" },
          { label: "2022", value: "2022" },
        ]},
        { name: "reportingOption", label: "Reporting Option", type: "select", placeholder: "Select reporting option", options: [
          { label: "Basic Module only", value: "basic" },
          { label: "Basic and Comprehensive Module", value: "basic-comprehensive" },
        ]},
        { name: "reportBasis", label: "Report Basis", type: "select", options: [
          { label: "Individual basis", value: "individual" },
          { label: "Consolidated basis", value: "consolidated" },
        ]},
        { name: "hasOmittedInfo", label: "Information Omitted", type: "checkbox", description: "Check if any information has been omitted." },
        { name: "subsidiaries", label: "Subsidiaries (if consolidated)", type: "textarea", placeholder: "List subsidiary names and registered addresses..." },
      ],
    },
    {
      id: "sustainability",
      title: "Sustainability Practices",
      description: "Your current sustainability initiatives",
      schema: sustainabilitySchema,
      fields: [
        { name: "hasPracticesPolicies", label: "Sustainability Practices", type: "checkbox", description: "We have practices, policies, or future initiatives for transitioning towards a more sustainable economy" },
        { name: "sustainabilityCertifications", label: "Sustainability Certifications", type: "textarea", placeholder: "Describe any sustainability-related certifications or labels..." },
        { name: "practicesDescription", label: "Practices Description", type: "textarea", placeholder: "Describe your sustainability practices, policies, or initiatives..." },
      ],
    },
  ];

  // Get the current step schema
  const currentStepSchema = steps[step].schema;

  // Helper function to extract default values - now delegates to hook
  const getSchemaDefaults = (schema: any, existingData: any = {}) => {
    const defaults = getEnrichedDefaults(step, existingData);
    console.log(`Applied defaults for step ${step}:`, defaults);
    return defaults;
  };


  // Merge schema defaults with form data
  const defaultValues = getSchemaDefaults(currentStepSchema, formData);
  
  // Debug: Log default values
  console.log("Step:", step, "Default values:", defaultValues);

  // Setup form with the current step schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<any>({
    resolver: zodResolver(currentStepSchema as any),
    defaultValues,
  });

  // Reset form with default values when step changes
  useEffect(() => {
    reset(defaultValues);
  }, [step, reset]);

  // Calculate progress percentage
  const progress = ((step + 1) / steps.length) * 100;

  // Handle next step
  const handleNextStep = (data: any) => {
    console.log("Form submission data:", data);
    console.log("Current step:", step);
    console.log("Form errors:", errors);
    
    const updatedData = { ...formData, ...data };
    console.log("Updated form data:", updatedData)
    setFormData(updatedData);

    if (step < steps.length - 1) {
      setStep(step + 1);
      // Don't need to reset here as the useForm will reinitialize with new defaultValues
    } else {
      // Final step submission
      setIsSubmitting(true);
      setTimeout(() => {
        if (onSubmit) {
          onSubmit(updatedData as FormData);
        }
        setIsComplete(true);
        setIsSubmitting(false);
      }, 1500);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Animation variants
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className={cn("w-full max-w-xl mx-auto p-6 rounded-lg shadow-lg bg-card/40", className)}>
      {!isComplete ? (
        <>
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Step {step + 1} of {steps.length}</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{s.title}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold">{steps[step].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[step].description}</p>
              </div>

              <form onSubmit={handleSubmit(handleNextStep)} className="space-y-4">
                {steps[step].fields.map((field: any) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    
                    {field.type === "select" && (
                      <Controller
                        name={field.name}
                        control={control}
                        render={({ field: controllerField }) => (
                          <Select 
                            onValueChange={controllerField.onChange} 
                            value={controllerField.value || ""}
                            defaultValue={controllerField.value || ""}
                          >
                            <SelectTrigger className={cn("w-full", errors[field.name as string] && "border-destructive")}>
                              <SelectValue placeholder={field.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option: any) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    )}
                    
                    {field.type === "checkbox" && (
                      <div className="flex items-start space-x-2">
                        <Controller
                          name={field.name}
                          control={control}
                          render={({ field: controllerField }) => {
                            console.log(`Checkbox ${field.name} value:`, controllerField.value);
                            return (
                              <Checkbox
                                id={field.name}
                                checked={Boolean(controllerField.value)}
                                onCheckedChange={controllerField.onChange}
                                className={cn(errors[field.name as string] && "border-destructive")}
                              />
                            );
                          }}
                        />
                        {field.description && (
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={field.name}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {field.description}
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {field.type === "textarea" && (
                      <Textarea
                        id={field.name}
                        placeholder={field.placeholder}
                        {...register(field.name as any)}
                        className={cn(errors[field.name as string] && "border-destructive")}
                        rows={3}
                      />
                    )}
                    
                    {["text", "number", "email", "url", "password"].includes(field.type) && (
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        {...register(field.name as any)}
                        className={cn(errors[field.name as string] && "border-destructive")}
                      />
                    )}
                    
                    {errors[field.name as string] && (
                      <p className="text-sm text-destructive">
                        {errors[field.name as string]?.message as string}
                      </p>
                    )}
                  </div>
                ))}

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={step === 0}
                    className={cn(step === 0 && "invisible")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {step === steps.length - 1 ? (
                      isSubmitting ? "Submitting..." : "Submit"
                    ) : (
                      <>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Setup Complete!</h2>
          <p className="text-muted-foreground mb-6">
            Your sustainability reporting setup is complete. You can now proceed to enter your sustainability data.
          </p>
          <Button onClick={() => {
            setStep(0);
            setFormData({});
            setIsComplete(false);
            reset({});
          }}>
            Start Over
          </Button>
        </motion.div>
      )}
    </div>
  );
}