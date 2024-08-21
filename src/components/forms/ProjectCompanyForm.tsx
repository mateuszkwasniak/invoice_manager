"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useRef, useState } from "react";
import { X, Trash, FileUp, Loader, CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
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
import {
  ProjectCompanyFormInput,
  ProjectCompanyFormSchema,
} from "@/schemas/Company";
import { ActionResponse, createProjectCompany } from "@/actions/actions";
import { Card, CardContent } from "../ui/card";
import { useProjectStore } from "@/store/project_store";
import { convertNumberToPrice } from "@/lib/utils/numbers";
import { Textarea } from "../ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { pl } from "date-fns/locale/pl";
import { budgetTypes } from "@/lib/utils/budgets";
import { validateUploadedFiles } from "@/lib/utils/files_client";

export default function ProjectCompanyForm() {
  const form = useForm<ProjectCompanyFormInput>({
    mode: "onBlur",
    resolver: zodResolver(ProjectCompanyFormSchema),
    defaultValues: {
      companyName: "",
      projectName: "",
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
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState<string>("");
  const filesInputRef = useRef<HTMLInputElement | null>(null);
  const fetchUserProjects = useProjectStore((store) => store.fetchUserProjects);

  const router = useRouter();

  const onSubmit = async (data: ProjectCompanyFormInput) => {
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

    const response: ActionResponse<null> = await createProjectCompany(
      data,
      filesFormData
    );
    setLoading(false);
    if (!response.ok) {
      setFormError(response.message);
    } else {
      onFilesClear();
      await fetchUserProjects();
      router.refresh();
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
    <Card>
      <CardContent className="p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa projektu:</FormLabel>
                  <FormControl>
                    <Input placeholder="Kwiatowa" {...field} />
                  </FormControl>
                  <FormDescription>Nazwa nowego projektu</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa firmy:</FormLabel>
                  <FormControl>
                    <Input placeholder="Firma XYZ" {...field} />
                  </FormControl>
                  <FormDescription>
                    Firma wobec której dokonywane będą płatności
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex flex-col md:flex-row items-start justify-between gap-8">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel className="block mb-1">
                      Rozpoczęcie świadczenia usługi:
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild className="dark:bg-zinc-900">
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
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
                        className="w-auto p-0 z-50 bg-white border rounded-md dark:bg-zinc-900"
                        align="start"
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
                      Dzień od którego zaczyna obowiązywać umowa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel className="block mb-1">
                      Koniec świadczenia usługi:
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild className="dark:bg-zinc-900">
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
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
                        className="w-auto p-0 z-50 bg-white border rounded-md dark:bg-zinc-900"
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
                      Dzień zakończenia świadczenia usług
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormItem>
              <FormLabel htmlFor="files">Dokumenty:</FormLabel>
              <div className="flex justify-center gap-4">
                <FormLabel
                  htmlFor="files"
                  className="cursor-pointer w-full border rounded-md flex items-center p-2 text-sm text-muted-foreground"
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
                  id="files"
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
            {files?.length ? (
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
            ) : null}
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-8 ">
              {budgetTypes.map((budget, index) => (
                <>
                  <FormField
                    key={budget.label}
                    control={form.control}
                    name={`budgets.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Budżet {budget.label.toLowerCase()}:
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
            </div>
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notatki:</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informacje dotyczące realizacji projektu przez daną firmę..."
                      {...field}
                      rows={6}
                    />
                  </FormControl>
                  <FormDescription>
                    Szczegóły dotyczące firmy oraz projektu
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={loading}
              className="dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-400"
            >
              {loading ? <Loader className="w-4 h-4 animate:spin" /> : "Utwórz"}
            </Button>
            {formError && <p className="text-destructive">{formError}</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
