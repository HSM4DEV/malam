"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { changePasswordAction } from "@/lib/actions/change-password";
import { updateCompanyAction } from "@/lib/actions/update-company";
import { updateNotificationPreferencesAction } from "@/lib/actions/update-notification-preferences";
import { updateProfileAction } from "@/lib/actions/update-profile";
import type { SettingsFormState } from "@/lib/validation/settings";
import type {
  DeveloperSettingsData,
  SettingsField,
  SettingsToggle,
} from "@/types/dashboard";

const initialState: SettingsFormState = {};

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
            <AccountForm fields={profileFields} action={updateProfileAction} label="حفظ التغييرات" />
          </TabsContent>
          <TabsContent value="company">
            <AccountForm fields={companyFields} action={updateCompanyAction} label="حفظ التغييرات" />
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

function AccountForm({
  fields,
  action,
  label,
}: {
  fields: SettingsField[];
  action: (prev: SettingsFormState, formData: FormData) => Promise<SettingsFormState>;
  label: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
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
                name={field.name}
                rows={3}
                defaultValue={field.value}
                className="w-full rounded-[11px] border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            ) : (
              <Input
                id={field.name}
                name={field.name}
                type={field.type ?? "text"}
                defaultValue={field.value}
              />
            )}
          </div>
        ))}
      </div>
      <SaveRow pending={pending} state={state} label={label} />
    </form>
  );
}

function NotificationsForm({ items }: { items: SettingsToggle[] }) {
  const [state, formAction, pending] = useActionState(updateNotificationPreferencesAction, initialState);
  const [values, setValues] = useState(items);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {values.map((item, index) => (
        <div
          key={item.name}
          className="flex items-center justify-between gap-4 rounded-xl border border-foreground/8 bg-cream/50 px-5 py-4"
        >
          <div>
            <div className="text-sm font-semibold">{item.label}</div>
            <div className="mt-0.5 text-[12.5px] text-muted">{item.description}</div>
          </div>
          <input type="hidden" name={item.name} value={String(item.enabled)} />
          <Switch
            checked={item.enabled}
            label={item.label}
            onCheckedChange={(value) =>
              setValues((prev) =>
                prev.map((x, i) => (i === index ? { ...x, enabled: value } : x)),
              )
            }
          />
        </div>
      ))}
      <div className="mt-2">
        <SaveRow pending={pending} state={state} label="حفظ التفضيلات" />
      </div>
    </form>
  );
}

function SecurityForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="flex flex-col gap-8">
      <form ref={formRef} action={formAction} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-5 dash:grid-cols-2">
          <div className="dash:col-span-2 dash:w-1/2 dash:pe-2.5">
            <label htmlFor="current" className="mb-1.5 block text-xs font-semibold text-muted-strong">
              كلمة المرور الحالية
            </label>
            <Input id="current" name="current" type="password" placeholder="••••••••" />
          </div>
          <div>
            <label htmlFor="next" className="mb-1.5 block text-xs font-semibold text-muted-strong">
              كلمة المرور الجديدة
            </label>
            <Input id="next" name="next" type="password" placeholder="••••••••" />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-xs font-semibold text-muted-strong">
              تأكيد كلمة المرور
            </label>
            <Input id="confirm" name="confirm" type="password" placeholder="••••••••" />
          </div>
        </div>
        <SaveRow pending={pending} state={state} label="تحديث كلمة المرور" />
      </form>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-foreground/8 bg-cream/50 px-5 py-4">
        <div>
          <div className="text-sm font-semibold">التحقّق بخطوتين</div>
          <div className="mt-0.5 text-[12.5px] text-muted">
            طبقة حماية إضافية عبر رمزٍ يُرسل إلى جوالك عند تسجيل الدخول. قريبًا.
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={false}
          disabled
          title="قريبًا"
          className="relative h-6 w-11 shrink-0 cursor-not-allowed rounded-full bg-sand opacity-60"
        >
          <span className="absolute top-1/2 size-[18px] -translate-y-1/2 rounded-full bg-surface shadow-sm" style={{ insetInlineStart: "3px" }} />
        </button>
      </div>
    </div>
  );
}

function SaveRow({
  pending,
  state,
  label,
}: {
  pending: boolean;
  state: SettingsFormState;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "جارٍ الحفظ…" : label}
        </Button>
        {state.success ? <span className="text-sm font-semibold text-pine">✓ تم الحفظ</span> : null}
      </div>
      {state.error ? <p className="text-[13px] text-clay">{state.error}</p> : null}
    </div>
  );
}
