"use client";

import { useActionState } from "react";
import Image from "next/image";

import { FormField } from "@/components/dashboard/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProjectFormState } from "@/lib/validation/project";

interface ProjectFormProps {
  action: (prevState: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  returnTo: string;
  project?: {
    id: string;
    name: string;
    city: string;
    district: string;
    type: string;
    status: "DRAFT" | "IN_REVIEW" | "PUBLISHED";
    priceFromMillions: number;
    tag: string;
    blurb: string | null;
    amenities: string[];
    imageUrl: string | null;
  };
}

const initialState: ProjectFormState = {};

export function ProjectForm({ action, returnTo, project }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isEdit = Boolean(project);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4.5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <input type="hidden" name="returnTo" value={returnTo} />

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
        <FormField label="اسم المشروع *">
          <Input name="name" defaultValue={project?.name} placeholder="مساكن نلاين" required />
        </FormField>
        <FormField label="الوسم *">
          <Input name="tag" defaultValue={project?.tag} placeholder="مميّز" required />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
        <FormField label="المدينة *">
          <Input name="city" defaultValue={project?.city} placeholder="الرياض" required />
        </FormField>
        <FormField label="الحي *">
          <Input name="district" defaultValue={project?.district} placeholder="العليا" required />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
        <FormField label="نوع العقار *">
          <Input name="type" defaultValue={project?.type} placeholder="بنتهاوس" required />
        </FormField>
        <FormField label="السعر يبدأ من (مليون) *">
          <Input
            type="number"
            step="0.1"
            min="0"
            name="priceFromMillions"
            defaultValue={project?.priceFromMillions}
            placeholder="٤٫٨"
            required
          />
        </FormField>
      </div>

      <FormField label="الحالة *">
        <select
          name="status"
          defaultValue={project?.status ?? "DRAFT"}
          required
          className="h-11 w-full rounded-[11px] border border-input bg-surface px-4 text-sm text-foreground outline-none focus-visible:border-ring"
        >
          <option value="DRAFT">مسوّدة</option>
          <option value="IN_REVIEW">قيد المراجعة</option>
          <option value="PUBLISHED">منشور</option>
        </select>
      </FormField>

      <FormField label="نبذة عن المشروع">
        <textarea
          name="blurb"
          rows={4}
          defaultValue={project?.blurb ?? ""}
          placeholder="وصفٌ مختصر يظهر في صفحة المشروع العامة…"
          className="w-full rounded-[12px] border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus-visible:border-ring"
        />
      </FormField>

      <FormField label="المرافق (كل مرفق في سطر)">
        <textarea
          name="amenities"
          rows={4}
          defaultValue={project?.amenities?.join("\n") ?? ""}
          placeholder={"مسبح لا متناهٍ\nصالة رياضية مجهّزة\nأمن على مدار الساعة"}
          className="w-full rounded-[12px] border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus-visible:border-ring"
        />
      </FormField>

      <FormField label={isEdit ? "تغيير صورة الغلاف" : "صورة الغلاف"}>
        {project?.imageUrl ? (
          <div className="relative mb-2.5 h-32 w-full max-w-[220px] overflow-hidden rounded-[12px] border border-foreground/10">
            <Image
              src={project.imageUrl}
              alt="صورة الغلاف الحالية"
              fill
              sizes="220px"
              className="object-cover"
            />
          </div>
        ) : null}
        <input
          type="file"
          name="file"
          accept="image/*"
          className="block w-full text-sm text-muted-strong file:me-3 file:rounded-[9px] file:border-0 file:bg-sage file:px-3.5 file:py-2 file:text-[13px] file:font-semibold file:text-pine"
        />
      </FormField>

      {state.error ? <p className="text-[13px] text-clay">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="h-[52px] text-[15px]">
        {pending ? "جارٍ الحفظ…" : isEdit ? "حفظ التعديلات" : "إنشاء المشروع"}
      </Button>
    </form>
  );
}
