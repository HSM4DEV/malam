"use client";

import { useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  DeveloperSettingsData,
  SettingsField,
  SettingsToggle,
} from "@/types/dashboard";

export function SettingsForm({
  profileFields,
  companyFields,
  notifications,
}: DeveloperSettingsData) {
  return (
    <div className="animate-fade-up rounded-2xl border border-foreground/9 bg-surface">
      <Tabs defaultValue="profile">
        <div className="border-b border-foreground/9 px-6 pt-5">
          <TabsList className="flex-wrap gap-2 bg-transparent p-0">
            <SettingsTab value="profile">الملف الشخصي</SettingsTab>
            <SettingsTab value="company">الشركة</SettingsTab>
            <SettingsTab value="notifications">الإشعارات</SettingsTab>
            <SettingsTab value="security">الأمان</SettingsTab>
          </TabsList>
        </div>

        <div className="px-6 py-7 dash:px-8">
          <TabsContent value="profile">
            <AccountForm fields={profileFields} />
          </TabsContent>
          <TabsContent value="company">
            <AccountForm fields={companyFields} />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsForm items={notifications} />
          </TabsContent>
          <TabsContent value="security">
            <SecurityForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function SettingsTab({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-b-2 border-transparent px-1 pb-3 text-sm data-[state=active]:border-pine data-[state=active]:bg-transparent data-[state=active]:text-pine"
    >
      {children}
    </TabsTrigger>
  );
}

type FormValues = Record<string, string>;

function AccountForm({ fields }: { fields: SettingsField[] }) {
  const defaultValues = Object.fromEntries(fields.map((f) => [f.name, f.value]));
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ defaultValues });
  const [saved, setSaved] = useState(false);

  const onSubmit = async () => {
    // Mock persistence — Phase 2 posts to a Server Action / API route.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGrid fields={fields} register={register} />
      <SaveRow isSubmitting={isSubmitting} saved={saved} label="حفظ التغييرات" />
    </form>
  );
}

function FieldGrid({
  fields,
  register,
}: {
  fields: SettingsField[];
  register: UseFormRegister<FormValues>;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 dash:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={field.full ? "dash:col-span-2" : undefined}>
          <label
            htmlFor={field.name}
            className="mb-1.5 block text-xs font-semibold text-muted-strong"
          >
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              rows={3}
              {...register(field.name)}
              className="w-full rounded-[11px] border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          ) : (
            <Input id={field.name} type={field.type ?? "text"} {...register(field.name)} />
          )}
        </div>
      ))}
    </div>
  );
}

function NotificationsForm({ items }: { items: SettingsToggle[] }) {
  const [state, setState] = useState(items);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-3">
      {state.map((item, index) => (
        <div
          key={item.name}
          className="flex items-center justify-between gap-4 rounded-xl border border-foreground/8 bg-cream/50 px-5 py-4"
        >
          <div>
            <div className="text-sm font-semibold">{item.label}</div>
            <div className="mt-0.5 text-[12.5px] text-muted">{item.description}</div>
          </div>
          <Switch
            checked={item.enabled}
            label={item.label}
            onCheckedChange={(value) =>
              setState((prev) =>
                prev.map((x, i) => (i === index ? { ...x, enabled: value } : x)),
              )
            }
          />
        </div>
      ))}
      <div className="mt-2">
        <SaveRow isSubmitting={false} saved={saved} label="حفظ التفضيلات" onClick={save} asButton />
      </div>
    </div>
  );
}

function SecurityForm() {
  const [saved, setSaved] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: { current: "", next: "", confirm: "" },
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSaved(true);
    reset();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-5 dash:grid-cols-2">
          <div className="dash:col-span-2 dash:w-1/2 dash:pe-2.5">
            <label htmlFor="current" className="mb-1.5 block text-xs font-semibold text-muted-strong">
              كلمة المرور الحالية
            </label>
            <Input id="current" type="password" placeholder="••••••••" {...register("current")} />
          </div>
          <div>
            <label htmlFor="next" className="mb-1.5 block text-xs font-semibold text-muted-strong">
              كلمة المرور الجديدة
            </label>
            <Input id="next" type="password" placeholder="••••••••" {...register("next")} />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-xs font-semibold text-muted-strong">
              تأكيد كلمة المرور
            </label>
            <Input id="confirm" type="password" placeholder="••••••••" {...register("confirm")} />
          </div>
        </div>
        <SaveRow isSubmitting={isSubmitting} saved={saved} label="تحديث كلمة المرور" />
      </form>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-foreground/8 bg-cream/50 px-5 py-4">
        <div>
          <div className="text-sm font-semibold">التحقّق بخطوتين</div>
          <div className="mt-0.5 text-[12.5px] text-muted">
            طبقة حماية إضافية عبر رمزٍ يُرسل إلى جوالك عند تسجيل الدخول.
          </div>
        </div>
        <Switch checked={twoFactor} onCheckedChange={setTwoFactor} label="التحقّق بخطوتين" />
      </div>
    </div>
  );
}

function SaveRow({
  isSubmitting,
  saved,
  label,
  onClick,
  asButton,
}: {
  isSubmitting: boolean;
  saved: boolean;
  label: string;
  onClick?: () => void;
  asButton?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <Button
        type={asButton ? "button" : "submit"}
        disabled={isSubmitting}
        onClick={onClick}
      >
        {isSubmitting ? "جارٍ الحفظ…" : label}
      </Button>
      {saved ? <span className="text-sm font-semibold text-pine">✓ تم الحفظ</span> : null}
    </div>
  );
}
