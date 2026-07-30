"use client";

import { useActionState } from "react";
import Image from "next/image";

import { FormField } from "@/components/dashboard/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UnitFormState } from "@/lib/validation/unit";

interface UnitFormProps {
  action: (prevState: UnitFormState, formData: FormData) => Promise<UnitFormState>;
  returnTo: string;
  projectOptions: { id: string; name: string }[];
  unit?: {
    id: string;
    projectId: string;
    projectName: string;
    code: string;
    typeName: string;
    areaSqm: number;
    floorLabel: string;
    beds: number;
    baths: number;
    priceMillions: number;
    status: "AVAILABLE" | "RESERVED" | "SOLD";
    imageUrl: string | null;
  };
}

const initialState: UnitFormState = {};

export function UnitForm({ action, returnTo, projectOptions, unit }: UnitFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isEdit = Boolean(unit);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4.5">
      {unit ? <input type="hidden" name="id" value={unit.id} /> : null}
      <input type="hidden" name="returnTo" value={returnTo} />

      <FormField label="المشروع *">
        {isEdit ? (
          <>
            <input type="hidden" name="projectId" value={unit!.projectId} />
            <div className="flex h-11 items-center rounded-[11px] border border-input bg-cream px-4 text-sm text-muted-strong">
              {unit!.projectName}
            </div>
          </>
        ) : (
          <select
            name="projectId"
            required
            defaultValue=""
            className="h-11 w-full rounded-[11px] border border-input bg-surface px-4 text-sm text-foreground outline-none focus-visible:border-ring"
          >
            <option value="" disabled>
              اختر مشروعاً…
            </option>
            {projectOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
        <FormField label="رقم الوحدة *">
          <Input name="code" defaultValue={unit?.code} placeholder="NL-1204" dir="ltr" className="text-end" required />
        </FormField>
        <FormField label="نوع الوحدة *">
          <Input name="typeName" defaultValue={unit?.typeName} placeholder="شقة بثلاث غرف" required />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-3">
        <FormField label="المساحة (م²) *">
          <Input type="number" min="0" name="areaSqm" defaultValue={unit?.areaSqm} placeholder="٢٤٠" required />
        </FormField>
        <FormField label="الغرف *">
          <Input type="number" min="0" name="beds" defaultValue={unit?.beds} placeholder="٣" required />
        </FormField>
        <FormField label="دورات المياه *">
          <Input type="number" min="0" name="baths" defaultValue={unit?.baths ?? 0} placeholder="٢" required />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
        <FormField label="الطابق *">
          <Input name="floorLabel" defaultValue={unit?.floorLabel} placeholder="الطابق ١٢" required />
        </FormField>
        <FormField label="السعر (مليون) *">
          <Input
            type="number"
            step="0.1"
            min="0"
            name="priceMillions"
            defaultValue={unit?.priceMillions}
            placeholder="٤٫٨"
            required
          />
        </FormField>
      </div>

      <FormField label="الحالة *">
        <select
          name="status"
          defaultValue={unit?.status ?? "AVAILABLE"}
          required
          className="h-11 w-full rounded-[11px] border border-input bg-surface px-4 text-sm text-foreground outline-none focus-visible:border-ring"
        >
          <option value="AVAILABLE">متاح</option>
          <option value="RESERVED">محجوز</option>
          <option value="SOLD">مباع</option>
        </select>
      </FormField>

      <FormField label={isEdit ? "تغيير صورة الوحدة" : "صورة الوحدة"}>
        {unit?.imageUrl ? (
          <div className="relative mb-2.5 h-32 w-full max-w-[220px] overflow-hidden rounded-[12px] border border-foreground/10">
            <Image
              src={unit.imageUrl}
              alt="صورة الوحدة الحالية"
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
        {pending ? "جارٍ الحفظ…" : isEdit ? "حفظ التعديلات" : "إنشاء الوحدة"}
      </Button>
    </form>
  );
}
