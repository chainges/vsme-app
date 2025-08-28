"use client";

import React from "react";
import { Controller, useFieldArray, type Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Subsidiary {
  name: string;
  organizationNumber: string;
  address: string;
}

interface SubsidiaryManagerProps {
  control: Control<any>;
  errors?: any;
}

export default function SubsidiaryManager({ control, errors }: SubsidiaryManagerProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subsidiaries",
  });

  const addSubsidiary = () => {
    append({
      name: "",
      organizationNumber: "",
      address: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Subsidiaries</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSubsidiary}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Subsidiary
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
          No subsidiaries added yet. Click "Add Subsidiary" to get started.
        </div>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Subsidiary {index + 1}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`subsidiaries.${index}.name`} className="text-sm">
                  Company Name
                </Label>
                <Controller
                  name={`subsidiaries.${index}.name`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Input
                      {...controllerField}
                      id={`subsidiaries.${index}.name`}
                      placeholder="Enter subsidiary company name"
                      className={cn(
                        errors?.subsidiaries?.[index]?.name && "border-destructive"
                      )}
                    />
                  )}
                />
                {errors?.subsidiaries?.[index]?.name && (
                  <p className="text-sm text-destructive">
                    {errors.subsidiaries[index].name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`subsidiaries.${index}.organizationNumber`} className="text-sm">
                  Organization Number
                </Label>
                <Controller
                  name={`subsidiaries.${index}.organizationNumber`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Input
                      {...controllerField}
                      id={`subsidiaries.${index}.organizationNumber`}
                      placeholder="123456789"
                      className={cn(
                        errors?.subsidiaries?.[index]?.organizationNumber && "border-destructive"
                      )}
                    />
                  )}
                />
                {errors?.subsidiaries?.[index]?.organizationNumber && (
                  <p className="text-sm text-destructive">
                    {errors.subsidiaries[index].organizationNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`subsidiaries.${index}.address`} className="text-sm">
                  Registered Address
                </Label>
                <Controller
                  name={`subsidiaries.${index}.address`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Input
                      {...controllerField}
                      id={`subsidiaries.${index}.address`}
                      placeholder="Street address, City, Country"
                      className={cn(
                        errors?.subsidiaries?.[index]?.address && "border-destructive"
                      )}
                    />
                  )}
                />
                {errors?.subsidiaries?.[index]?.address && (
                  <p className="text-sm text-destructive">
                    {errors.subsidiaries[index].address.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {errors?.subsidiaries && typeof errors.subsidiaries === "object" && !Array.isArray(errors.subsidiaries) && (
        <p className="text-sm text-destructive">
          {errors.subsidiaries.message}
        </p>
      )}
    </div>
  );
}