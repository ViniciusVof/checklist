"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

import jsonData from "@/data/items.json";
import { useState } from "react";

interface Item {
  id: string;
  label: string;
}

interface StepData {
  title: string;
  description: string;
  items?: Item[];
}

interface Data {
  [key: string]: StepData | StepData[];
}

const data: Data = jsonData;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
export default function Home() {
  const [step, setStep] = useState<number>(0);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["1"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setStep((currentStep) => currentStep + 1);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const currentKey = Object.keys(data)[step] as keyof Data;
  const currentData = data[currentKey] as StepData;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    {currentData.title}
                  </FormLabel>
                  <FormDescription>{currentData.description}</FormDescription>
                </div>
                {currentData.items?.map(
                  ({ id, label }: { id: number | string; label: string }) => (
                    <FormField
                      key={id}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(id as string)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: any) => value !== id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  )
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <p>
            Passo {step + 1} de {Object.keys(data).length}
          </p>
          <Button type="submit">
            {step - 1 === Object.keys(data).length ? "Enviar" : "Próximo Passo"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
