"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentFormInput, PaymentFormSchema } from "@/schemas/Payment";
import { ActionResponse, createPayment } from "@/actions/actions";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { X, Trash, FileUp, CalendarIcon, Loader } from "lucide-react";
import { pl } from "date-fns/locale/pl";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { useProjectStore } from "@/store/project_store";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { convertNumberToPrice } from "@/lib/utils/numbers";
import { Card, CardContent } from "../ui/card";
import { validateUploadedFiles } from "@/lib/utils/files_client";

export default function PaymentForm() {
  const selectedCompany = useProjectStore((store) => store.selectedCompany);
  const selectedProject = useProjectStore((store) => store.selectedProject);
  const projects = useProjectStore((store) => store.projects);

  const form = useForm<PaymentFormInput>({
    mode: "onBlur",
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      companyId: selectedCompany?.id,
      projectId: selectedProject?.id,
      title: "",
      details: "",
      paid: false,
      type: "services",
      price: "",
      paymentDate: new Date(),
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string>();
  const [filesError, setFilesError] = useState<string>("");
  const router = useRouter();

  const filesInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (selectedCompany && form.getValues("companyId") !== selectedCompany.id) {
      form.setValue("companyId", selectedCompany.id);
    }
  }, [selectedCompany, form]);

  useEffect(() => {
    if (selectedProject && form.getValues("projectId") !== selectedProject.id) {
      form.setValue("projectId", selectedProject.id);
    }
  }, [selectedCompany, form]);

  const onSubmit = async (data: PaymentFormInput) => {
    setFormError("");
    setFilesError("");

    let filesFormData: FormData | null = null;

    if (files.length > 0) {
      filesFormData = new FormData();
      for (let file of files) {
        filesFormData.append("files", file);
      }
    }

    const response: ActionResponse<null> = await createPayment(
      data,
      filesFormData
    );

    if (!response.ok) {
      setFormError(response.message);
    } else {
      form.reset();
      onFilesClear();
      router.replace(`/payments?cid=${selectedCompany!.id}`);
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

  if (!selectedCompany && !projects.length) {
    return <Loader className="w-8 h-8 animate-spin text-foreground-muted" />;
  }

  if (!projects.length || selectedCompany?.id === "-1") {
    return (
      <h1 className="text-3xl font-semibold">
        Aby dodać płatność, najpierw utwórz firmę dla wybranego projektu
      </h1>
    );
  } else if (selectedCompany)
    return (
      <>
        <h1 className="text-3xl font-semibold text-start mb-8">
          Dodaj nową płatność dla firmy {selectedCompany.name}
        </h1>
        <Card>
          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col md:flex-row gap-8 md:gap-12"
              >
                <div className="flex flex-col space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nazwa:</FormLabel>
                        <FormControl>
                          <Input placeholder="FVS/01/07/2024" {...field} />
                        </FormControl>
                        <FormDescription>
                          Nazwa płatności - na przykład numer faktury
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block mb-1">
                          Data płatności:
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
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("1900-01-01")}
                              locale={pl}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Data wykonania płatności
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kwota:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="3000 zł"
                            {...field}
                            onBlur={(e) => {
                              const val = e.target?.value
                                ?.replaceAll(",", ".")
                                ?.replace(/\s/g, "")
                                ?.trim();

                              if (isNaN(Number(val))) {
                                form.trigger("price");
                              } else {
                                form.setValue(
                                  "price",
                                  convertNumberToPrice(Number(val))
                                );
                                form.trigger("price");
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Kwota danej płatności w zł
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typ płatności:</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz czego dotyczy płatność" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="materials">materiały</SelectItem>
                            <SelectItem value="services">usługi</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Wybierz czego dotyczy płatność
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paid"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel className="mr-3 inline-flex items-center">
                            Zapłacono
                          </FormLabel>
                          <FormControl>
                            <Switch
                              className="dark:!bg-muted-foreground"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Informacja o tym, czy dana faktura została już
                          opłacona
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-8">
                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notatki:</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Szczegóły danej płatności..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Jakie usługi zostały wykonane, materiały, które
                          zostały zakupione
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel htmlFor="files">Dokumenty:</FormLabel>
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
                    <FormDescription>
                      Pliki związane z daną płatnością
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
                  <Button
                    type="submit"
                    className="bg-primary text-white dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-400"
                  >
                    Dodaj płatność
                  </Button>
                  {formError && <p className="text-destructive">{formError}</p>}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </>
    );
}
