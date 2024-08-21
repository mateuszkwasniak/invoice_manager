"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "../ui/calendar";

import { useProjectStore } from "@/store/project_store";
import { DialogClose } from "../ui/dialog";
import { CalendarIcon, FileUp, Loader, Trash, X } from "lucide-react";
import {
  CompanyBudgetFormInput,
  CompanyBudgetFormSchema,
} from "@/schemas/Company";
import { convertNumberToPrice } from "@/lib/utils/numbers";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { pl } from "date-fns/locale/pl";
import { Textarea } from "../ui/textarea";
import { budgetTypes } from "@/lib/utils/budgets";
import { validateUploadedFiles } from "@/lib/utils/files_client";

export default function CompanyForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<CompanyBudgetFormInput>({
    resolver: zodResolver(CompanyBudgetFormSchema),
    mode: "onBlur",
    defaultValues: {
      companyName: "",
      startDate: new Date(),
      endDate: undefined,
      details: "",
      budgets: [
        {
          type: "services",
          value: "",
        },
        {
          type: "materials",
          value: "",
        },
      ],
    },
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState<string>("");
  const filesInputRef = useRef<HTMLInputElement | null>(null);

  const createCompany = useProjectStore((store) => store.createCompany);

  const onSubmit = async (data: CompanyBudgetFormInput) => {
    setLoading(true);
    setFormError("");
    setFilesError("");
    let filesFormData: FormData | null = null;

    if (files.length > 0) {
      filesFormData = new FormData();
      for (let file of files) {
        filesFormData.append("files", file);
      }
    }

    try {
      await createCompany(data, filesFormData);
      setOpen(false);
    } catch (error: any) {
      setFormError(error.message);
    } finally {
      onFilesClear();
      setLoading(false);
    }
  };

  const onFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilesError("");
    if (e.target.files) {
      let filesList = e.target.files;

      const filesValidationResult = validateUploadedFiles(filesList, files, 0);

      if (filesValidationResult.ok) {
        setFiles((prev) => [...prev, ...Array.from(filesList)]);
      } else {
        setFilesError(filesValidationResult.error);
        e.target.value = "";
      }
    }
  };

  const onFilesClear = () => {
    setFiles([]);
    if (filesInputRef?.current?.value) {
      filesInputRef.current.value = "";
    }
  };

  const onSingleFileClear = (name: string) => {
    setFiles((prev) => prev?.filter((file) => file.name !== name));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex justify-between gap-8"
      >
        <div className="flex flex-col gap-8 flex-1">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa firmy:</FormLabel>
                <FormControl>
                  <Input placeholder="Firma XYZ" {...field} />
                </FormControl>
                <FormDescription>Nazwa nowej firmy</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-1">
                  Rozpoczęcie usługi:
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild className="dark:bg-zinc-900">
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-[240px] pl-3 text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        {field.value ? (
                          field.value.toLocaleDateString("pl")
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-auto p-0 bg-background border rounded-md z-20 dark:bg-zinc-900"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      locale={pl}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Data rozpoczęcia świadczenia usługi
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-1">
                  Zakończenie usługi:
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild className="dark:bg-zinc-900">
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-[240px] pl-3 text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        {field.value ? (
                          field.value.toLocaleDateString("pl")
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-background border rounded-md z-20 dark:bg-zinc-900"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field?.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      locale={pl}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Data zakończenia świadczenia usługi
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel htmlFor="files_modal">Dokumenty:</FormLabel>
            <div className="flex justify-center gap-4">
              <FormLabel
                htmlFor="files_modal"
                className="cursor-pointer w-full border rounded-md flex items-center p-2 text-sm text-muted-foreground dark:bg-zinc-900"
              >
                Wybierz pliki...
              </FormLabel>
              <Input
                ref={filesInputRef}
                type="file"
                multiple
                accept=".jpg,jpeg,.png,.pdf,text/plain"
                max={5}
                onChange={onFilesChange}
                id="files_modal"
                className="hidden"
              />

              {files.length !== 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onFilesClear}
                  type="button"
                >
                  <X />
                </Button>
              )}
            </div>
            <FormDescription>
              Pliki związane z firmą i projektem
            </FormDescription>
            <FormMessage>{filesError}</FormMessage>
          </FormItem>
          {files && (
            <div className="flex flex-col gap-2">
              {files.map((file, idx) => (
                <div
                  className="w-full flex items-center gap-2 text-sm"
                  key={file.name + idx.toString()}
                >
                  <FileUp className="w-5 h-5" /> {file.name}{" "}
                  <Button
                    variant="outline"
                    onClick={() => onSingleFileClear(file.name)}
                    type="button"
                    className="ml-auto px-2 py-1"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 gap-8">
          {budgetTypes.map((budget, index) => (
            <>
              <FormField
                control={form.control}
                name={`budgets.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Wartość budżetu {budget.label.toLowerCase()}:
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10 000"
                        {...field}
                        onBlur={(e) => {
                          const val = e.target?.value
                            ?.replaceAll(",", ".")
                            ?.replace(/\s/g, "")
                            ?.trim();

                          if (isNaN(Number(val))) {
                            form.trigger(`budgets.${index}.value`);
                          } else {
                            form.setValue(
                              `budgets.${index}.value`,
                              convertNumberToPrice(Number(val))
                            );
                            form.trigger(`budgets.${index}.value`);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Wielkość budżetu {budget.label.toLowerCase()} w zł
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ))}
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notatki:</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Informacje dotyczące firmy i projektu..."
                    {...field}
                    rows={10}
                  />
                </FormControl>
                <FormDescription>
                  Szczegóły dotyczące firmy i projektu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2 mt-auto ml-auto">
            <div className="ml-auto flex items-center gap-4">
              <DialogClose asChild>
                <Button type="button" variant={"outline"} disabled={loading}>
                  Anuluj
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="w-20 dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-400"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Dodaj"
                )}
              </Button>
            </div>
            {formError && <p className="text-destructive">{formError}</p>}
          </div>
        </div>
      </form>
    </Form>
  );
}
