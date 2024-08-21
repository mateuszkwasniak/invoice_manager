"use client";

import {
  Trash2,
  FileText,
  PenIcon,
  CalendarIcon,
  Trash2Icon,
  X,
  FileUp,
  Loader,
  Sprout,
  Rocket,
} from "lucide-react";
import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { pl } from "date-fns/locale/pl";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { convertNumberToPrice } from "@/lib/utils/numbers";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import ConfirmRemovalModal from "../modals/ConfirmRemovalModal";
import {
  CompanyDisplayAndEditFormData,
  CompanyUpdateFormInput,
  CompanyUpdateFormSchema,
} from "@/schemas/Company";
import { updateCompany } from "@/actions/actions";
import { useProjectStore } from "@/store/project_store";
import { budgetTypes } from "@/lib/utils/budgets";
import { validateUploadedFiles } from "@/lib/utils/files_client";

export default function CompanyDisplayAndEditForm({
  company,
}: {
  company: CompanyDisplayAndEditFormData;
}) {
  const router = useRouter();

  const form = useForm<CompanyUpdateFormInput>({
    resolver: zodResolver(CompanyUpdateFormSchema),
    defaultValues: {
      id: company.id,
      companyName: company.name,
      startDate: company.startDate,
      endDate: company?.endDate,
      details: company?.details || "",
      files: [...company.files],
      budgets: budgetTypes.map((budget) => {
        const budgetValue = company.budgets.find(
          (companyBudget) => companyBudget.type === budget.type
        )?.value;

        return {
          type: budget.type,
          value: budgetValue ? convertNumberToPrice(budgetValue) : "",
        };
      }),
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string>();
  const [filesError, setFilesError] = useState<string>("");
  const [rocketLaunched, setRocketLaunched] = useState<boolean>(false);
  const refetchCompanies = useProjectStore(
    (store) => store.fetchAndLoadUserProjectCompanies
  );
  const deleteCompany = useProjectStore((store) => store.deleteCompany);
  const filesInputRef = useRef<HTMLInputElement | null>(null);
  const existingFiles = form.watch("files");

  const onProjectEditSubmit = async (data: CompanyUpdateFormInput) => {
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

    const response = await updateCompany(data, filesFormData);

    if (!response.ok) {
      setFormError(response.message);
    } else {
      onFilesClear();
      refetchCompanies(company.project.id, company.id);
      if (response.message !== company.slug) {
        router.replace(`/projects/${company.project.slug}/${response.message}`);
      } else {
        if (response?.data) {
          form.reset({
            ...response.data,
            endDate: response.data?.endDate || undefined,
            budgets: budgetTypes.map((budget) => {
              const budgetValue = response?.data?.budgets?.find(
                (responseBudget) => responseBudget.type === budget.type
              )?.value;

              return {
                type: budget.type,
                value: budgetValue ? convertNumberToPrice(budgetValue) : "",
              };
            }),
          });
        }
      }
    }

    setLoading(false);
    setEdit(false);
  };

  const onCompanyDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteCompany(id, company.project.id);
      router.replace(`/projects`);
    } catch (error: any) {
      setLoading(false);
      setFormError(
        error?.message || "Nie udało się usunąc firmy, proszę spróbować później"
      );
    }
  };

  const onFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilesError("");
    if (e.target.files) {
      let filesList = e.target.files;

      const filesValidationResult = validateUploadedFiles(
        filesList,
        files,
        form.getValues("files").length
      );

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

  useEffect(() => {
    setTimeout(() => {
      setRocketLaunched(true);
    }, 2500);
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onProjectEditSubmit)}
        className="w-full"
      >
        <Card className={`w-full relative`}>
          {loading && (
            <div className="w-full h-full absolute rounded-md left-0 top-0 opacity-50 bg-slate-50 dark:bg-card z-50" />
          )}
          <CardHeader className="pb-1">
            <div className="w-full flex justify-between items-start">
              <div className="flex items-center gap-1">
                <Link
                  href="/projects"
                  className="w-fit p-1 px-2 bg-primary text-secondary text-xs font-semibold uppercase text-center rounded-md transition duration-300 hover:opacity-65 dark:bg-zinc-200"
                >
                  {company.project.name}
                </Link>
              </div>
              <div className="flex gap-2 items-center">
                <PenIcon
                  className="h-6 w-6 text-slate-700 dark:text-slate-400 transition duration-300 hover:opacity-50 cursor-pointer"
                  onClick={() => setEdit(true)}
                />

                <ConfirmRemovalModal
                  triggerVariant={"icon"}
                  onDelete={() => onCompanyDelete(company.id)}
                  loading={loading}
                  title={`Czy na pewno chcesz usunąc firmę ${company.name}?`}
                  description={"Ta operacja jest nieodwracalna"}
                />
              </div>
            </div>
            <CardTitle className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Nazwa firmy"
                        {...field}
                        className="border-none text-3xl p-0 disabled:!cursor-default disabled:!opacity-100 bg-background dark:disabled:bg-card"
                        disabled={!edit || loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="w-full flex gap-4 mb-6 items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-2 mt-1">
                <Sprout />
                <p className="font-semibold text-sm mt-auto">
                  Dołączenie do projektu:
                </p>
              </div>
              <p className="text-muted-foreground font-semibold">
                {company.createdAt.toLocaleDateString("pl")}
              </p>
            </div>
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="w-full flex items-center justify-between">
                  <FormLabel className="text-muted-foreground font-semibold text-sm flex itesm-center gap-2">
                    <span className="mt-auto text-base">
                      Rozpoczęcie świadczenia usług:
                    </span>
                  </FormLabel>
                  {edit && !loading ? (
                    <>
                      <Popover>
                        <PopoverTrigger asChild className="dark:bg-zinc-900">
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-[240px] !mt-0 pl-3 text-left font-normal ${
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
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            locale={pl}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </>
                  ) : (
                    <span className="font-semibold !mt-0 flex items-center gap-2">
                      <Rocket
                        className={`text-primary opacity-65 z-100 ${
                          !rocketLaunched ? "animate-rocket-launch" : "hidden"
                        }`}
                      />
                      {form.getValues("startDate").toLocaleDateString("PL")}
                    </span>
                  )}
                </FormItem>
              )}
            />
            {(form?.getValues("endDate") || edit) && (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="w-full flex items-center justify-between">
                    <FormLabel className="text-muted-foreground font-semibold text-base">
                      Zakończenie usługi:
                    </FormLabel>
                    {edit && !loading ? (
                      <>
                        <Popover>
                          <PopoverTrigger asChild className="dark:bg-zinc-900">
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-[240px] !mt-0 pl-3 text-left font-normal ${
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
                              onSelect={(date: Date | undefined) => {
                                console.log(date);
                                if (!date) {
                                  form.setValue("endDate", null);
                                } else field.onChange(date);
                              }}
                              disabled={(date) => date < new Date("1900-01-01")}
                              locale={pl}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </>
                    ) : (
                      <span className="font-semibold">
                        {form?.getValues("endDate")?.toLocaleDateString("PL")}
                      </span>
                    )}
                  </FormItem>
                )}
              />
            )}
            <Separator className="my-4" />
            {budgetTypes.map((budget, index) => (
              <FormField
                key={budget.type}
                control={form.control}
                name={`budgets.${index}.value`}
                render={({ field }) => (
                  <FormItem
                    className={`flex !items-center justify-between ${
                      !edit && form.getValues(`budgets.${index}.value`) === ""
                        ? "hidden"
                        : ""
                    }`}
                  >
                    <FormLabel className="text-muted-foreground text-base font-semibold">
                      Wartość budżetu {budget.label.toLowerCase()}:
                    </FormLabel>
                    <div className="flex flex-col items-start gap-2 !mt-0">
                      <FormControl>
                        {edit ? (
                          <Input
                            className="w-fit !mt-0"
                            placeholder="0,00"
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
                            disabled={!edit || loading}
                          />
                        ) : (
                          <p className="font-semibold">
                            {form.getValues(`budgets.${index}.value`)} zł
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            ))}
            {(form.getValues("budgets").find((budget) => budget.value !== "") ||
              edit) && <Separator className="my-4" />}
            <div className="mb-4 p-4 border rounded-md">
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <p
                        className={`flex items-center gap-2 font-semibold text-sm text-muted-foreground mb-4 `}
                      >
                        Notatki:
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brak..."
                        rows={6}
                        {...field}
                        className={`text-base disabled:border-none disabled:resize-none disabled:opacity-100 disabled:p-0 disabled:cursor-default italic disabled:dark:bg-card`}
                        disabled={!edit || loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-8 p-4 border rounded-md">
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-muted-foreground mb-4">
                  Załączone dokumenty:
                </p>
                <ul className="flex flex-col gap-2">
                  {form.getValues("files")?.length
                    ? form.getValues("files")?.map((fileName) => (
                        <li key={fileName} className="w-full flex gap-6">
                          <Link
                            href={`/api/download/company?projectId=${company.project.id}&companyId=${company.id}&fileName=${fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:opacity-50 transition duration-300 cursor-pointer"
                          >
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            {fileName}
                          </Link>
                          {edit && !loading && (
                            <Trash2Icon
                              className="text-red-500 transition duration:300 hover:opacity-50 cursor-pointer ml-auto"
                              onClick={() => {
                                form.setValue("files", [
                                  ...form
                                    .getValues("files")
                                    .filter((file) => file !== fileName),
                                ]);
                              }}
                            />
                          )}
                        </li>
                      ))
                    : "Brak"}
                </ul>
              </div>
              {edit && !loading && (
                <div className="flex flex-col gap-2">
                  <FormItem>
                    <p className="font-semibold text-sm text-muted-foreground mb-4">
                      Dodaj nowe dokumenty:
                    </p>
                    <div className="flex justify-center gap-4">
                      <FormLabel
                        htmlFor="files"
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
                    <FormMessage>{filesError}</FormMessage>
                  </FormItem>
                </div>
              )}
              {files && (
                <div className="flex flex-col gap-2">
                  {files.map((file, idx) => (
                    <div
                      className="w-full flex items-center gap-2 text-sm"
                      key={file.name + idx.toString()}
                    >
                      <FileUp className="w-5 h-5" /> {file.name}{" "}
                      {!loading && (
                        <Button
                          variant="outline"
                          onClick={() => onSingleFileClear(file.name)}
                          type="button"
                          className="ml-auto px-2 py-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {edit && (
              <div className="ml-auto flex items-center gap-4">
                <Button
                  variant="outline"
                  disabled={loading}
                  onClick={() => {
                    setFiles([]);
                    setEdit(false);
                    form.reset();
                  }}
                >
                  Anuluj
                </Button>
                <Button
                  disabled={loading}
                  type="submit"
                  className="dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-400"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    "Zapisz"
                  )}
                </Button>
              </div>
            )}
            {formError && <p className="text-destructive">{formError}</p>}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
