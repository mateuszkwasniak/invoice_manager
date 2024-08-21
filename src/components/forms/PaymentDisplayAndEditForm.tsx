"use client";

import {
  Trash2,
  Coins,
  ShieldCheck,
  TriangleAlert,
  BrickWall,
  Handshake,
  FileText,
  PenIcon,
  CalendarIcon,
  Trash2Icon,
  X,
  FileUp,
  Loader,
} from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { $Enums } from "@prisma/client";
import { useRouter } from "next/navigation";
import { deletePayment, updatePayment } from "@/actions/actions";
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
import {
  PaymentDisplayAndEditFormData,
  PaymentUpdateFormInput,
  PaymentUpdateFormSchema,
} from "@/schemas/Payment";
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
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import ConfirmRemovalModal from "../modals/ConfirmRemovalModal";
import { validateUploadedFiles } from "@/lib/utils/files_client";

export default function PaymentDisplayAndEditForm({
  payment,
}: {
  payment: PaymentDisplayAndEditFormData;
}) {
  const router = useRouter();

  const form = useForm<PaymentUpdateFormInput>({
    resolver: zodResolver(PaymentUpdateFormSchema),
    defaultValues: {
      id: payment.id,
      title: payment.title,
      details: payment?.details || "",
      paid: payment.paid,
      type: payment.type,
      price: payment.price,
      paymentDate: payment.paymentDate,
      companyId: payment.company.id,
      projectId: payment.company.project.id,
      files: [...payment.files],
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string>();
  const [filesError, setFilesError] = useState<string>("");
  const filesInputRef = useRef<HTMLInputElement | null>(null);
  const existingFiles = form.watch("files");

  const onPaymentEditSubmit = async (data: PaymentUpdateFormInput) => {
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

    const response = await updatePayment(data, filesFormData);

    if (!response.ok) {
      setFormError(response.message);
    } else {
      onFilesClear();
      if (response.message !== payment.slug) {
        router.replace(
          `/payments/${payment.company.project.slug}/${payment?.company?.slug}/${response?.message}`
        );
      } else {
        if (response?.data) {
          form.reset(response.data);
        }
      }
    }

    setLoading(false);
    setEdit(false);
  };

  const onPaymentDelete = async (id: string) => {
    setLoading(true);
    const response = await deletePayment(id);
    if (response.ok) {
      router.replace(`/payments?cid=${payment.company.id}`);
    } else {
      setLoading(false);
      setFormError(response.message);
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onPaymentEditSubmit)}
        className="w-full"
      >
        <Card className={`w-full relative`}>
          {loading && (
            <div className="w-full h-full absolute rounded-md left-0 top-0 opacity-50 bg-slate-50 dark:bg-card z-50" />
          )}
          <CardHeader className="align-start">
            <div className="w-full flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Link
                  href="/projects"
                  className="w-fit p-1 px-2 bg-primary dark:bg-zinc-600 text-white text-xs font-semibold uppercase text-center rounded-md transition duration-300 hover:opacity-65"
                >
                  {payment.company.project.name}
                </Link>
                <Link
                  href={`/projects/${payment.company.project.slug}/${payment.company.slug}`}
                  className="w-fit p-1 px-2 bg-muted-foreground dark:bg-zinc-200 text-white dark:text-secondary text-xs font-semibold uppercase text-center rounded-md transition duration-300 hover:opacity-65"
                >
                  {payment.company.name}
                </Link>
              </div>
              <div className="flex gap-2 items-center">
                <PenIcon
                  className="h-6 w-6 text-slate-700 dark:text-slate-400 transition duration-300 hover:opacity-50 cursor-pointer"
                  onClick={() => setEdit(true)}
                />

                <ConfirmRemovalModal
                  triggerVariant={"icon"}
                  onDelete={() => onPaymentDelete(payment.id)}
                  loading={loading}
                  title={`Czy na pewno chcesz usunąc płatność ${payment.title}?`}
                  description={"Ta operacja jest nieodwracalna"}
                />
              </div>
            </div>
            <CardTitle className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl className="w-full">
                      <Input
                        placeholder="FVS/01/07/2024"
                        {...field}
                        className="w-fit disabled:!w-full border-none text-3xl p-0 disabled:!cursor-default disabled:!opacity-100 dark:disabled:bg-card"
                        disabled={!edit || loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardTitle>
            <CardDescription className={`${!edit && !loading && "!mt-0"}`}>
              {edit && !loading ? (
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger
                          asChild
                          className="dark:bg-zinc-900 mt-1"
                        >
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

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                form.getValues("paymentDate").toLocaleDateString("PL")
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row gap-4">
            <div className="flex-[1] flex flex-col gap-4">
              <div className="p-4 border rounded-md">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <p
                          className={`flex items-center gap-2 font-semibold text-nowrap text-sm text-muted-foreground ${
                            edit && !loading ? "mb-4" : "mb-0"
                          }`}
                        >
                          <Coins className="w-5 h-5" />
                          Kwota (zł):
                        </p>
                      </FormLabel>
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
                          className={`disabled:border-none font-semibold text-primary disabled:opacity-100 text-base disabled:p-0 disabled:!m-0 disabled:cursor-default bg-card                            disabled:bg-background disabled:dark:bg-card
                          `}
                          disabled={!edit || loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="p-4 border rounded-md w-full flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="paid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <p
                          className={`flex items-center gap-2 font-semibold text-nowrap text-sm text-muted-foreground ${
                            edit ? "mb-2" : "mb-0"
                          }`}
                        >
                          {form.getValues("paid") ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : (
                            <TriangleAlert className="w-5 h-5" />
                          )}
                          Status:
                        </p>
                      </FormLabel>
                      {edit && !loading && (
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!edit || loading}
                          />
                        </FormControl>
                      )}
                      <p className="font-semibold">
                        {form.getValues("paid") ? "Opłacona" : "Nieopłacona"}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="p-4 border rounded-md w-full">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <p
                          className={`flex items-center gap-2 font-semibold text-sm text-muted-foreground ${
                            edit && !loading ? "mb-4" : "mb-0"
                          }`}
                        >
                          {form.getValues("type") === "materials" ? (
                            <BrickWall className="w-5 h-5" />
                          ) : (
                            <Handshake className="w-5 h-5" />
                          )}{" "}
                          Typ:
                        </p>
                      </FormLabel>
                      {edit && !loading ? (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="text-base text-primary font-semibold ">
                              <SelectValue placeholder="Wybierz czego dotyczy płatność" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="materials">materiały</SelectItem>
                            <SelectItem value="services">usługi</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-semibold">
                          {form.getValues("type") === "materials"
                            ? "Materiały"
                            : "Usługi"}
                        </p>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex-[2] p-4 border rounded-md">
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <p
                        className={`flex items-center gap-2 font-semibold text-sm text-muted-foreground ${
                          edit && !loading ? "mb-4" : "mb-0"
                        }`}
                      >
                        Notatki:
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brak..."
                        rows={10}
                        {...field}
                        className={`text-base disabled:border-none disabled:resize-none disabled:opacity-100 disabled:p-0 disabled:cursor-default italic ${
                          (!edit || loading) && "bg-background dark:bg-card"
                        }`}
                        disabled={!edit || loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-8 p-4 border rounded-md w-fit min-w-[25%]">
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-muted-foreground mb-4">
                  Załączone dokumenty:
                </p>
                <ul className="flex flex-col gap-2">
                  {form.getValues("files")?.length
                    ? form.getValues("files")?.map((fileName) => (
                        <li key={fileName} className="w-full flex gap-6">
                          <Link
                            href={`/api/download/payment?projectId=${payment.company.project.id}&companyId=${payment.company.id}&paymentId=${payment.id}&fileName=${fileName}`}
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
              </div>{" "}
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
                  type="submit"
                  disabled={loading}
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
