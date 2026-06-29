import { useEffect, useState } from "react";
import {
  useGetAdminPlans,
  useCreateAdminPlan,
  useUpdateAdminPlan,
  getGetAdminPlansQueryKey,
} from "@workspace/api-client-react";
import type {
  AdminPlan,
  AdminPlanUpdate,
  AdminPlanCreate,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Wallet, Plus, Save, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type Audience = NonNullable<AdminPlanUpdate["audience"]>;
const AUDIENCES: Audience[] = ["individual", "dealer", "company", "enterprise"];
const AUDIENCE_LABEL: Record<Audience, string> = {
  individual: "Individual",
  dealer: "Dealer",
  company: "Company",
  enterprise: "Enterprise",
};

// Numeric coercion — inputs are strings; money/weights default to 0, while
// quotas are nullable ("" → null = unlimited).
const numOr = (s: string, fallback = 0): number => {
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
};
const intOrNull = (s: string): number | null => {
  const t = s.trim();
  if (t === "") return null;
  const n = parseInt(t, 10);
  return Number.isFinite(n) ? n : null;
};

interface PlanForm {
  name: string;
  name_ar: string;
  monthly_price: string;
  boost_price: string;
  listing_quota: string;
  active_listing_cap: string;
  cpl_whatsapp: string;
  cpl_call: string;
  cpl_chat: string;
  cpl_finance_request: string;
  ranking_weight: string;
  sort_order: string;
  is_active: boolean;
  is_baseline: boolean;
}

const emptyForm = (): PlanForm => ({
  name: "",
  name_ar: "",
  monthly_price: "0",
  boost_price: "0",
  listing_quota: "",
  active_listing_cap: "",
  cpl_whatsapp: "0",
  cpl_call: "0",
  cpl_chat: "0",
  cpl_finance_request: "0",
  ranking_weight: "0",
  sort_order: "0",
  is_active: true,
  is_baseline: false,
});

const seed = (p: AdminPlan): PlanForm => ({
  name: p.name,
  name_ar: p.name_ar ?? "",
  monthly_price: String(p.monthly_price),
  boost_price: String(p.boost_price),
  listing_quota: p.listing_quota == null ? "" : String(p.listing_quota),
  active_listing_cap:
    p.active_listing_cap == null ? "" : String(p.active_listing_cap),
  cpl_whatsapp: String(p.cpl_whatsapp),
  cpl_call: String(p.cpl_call),
  cpl_chat: String(p.cpl_chat),
  cpl_finance_request: String(p.cpl_finance_request),
  ranking_weight: String(p.ranking_weight),
  sort_order: String(p.sort_order),
  is_active: p.is_active,
  is_baseline: p.is_baseline,
});

// Shared field shape sent for both update and (with slug+audience added) create.
const formToBody = (f: PlanForm): AdminPlanUpdate => ({
  name: f.name.trim(),
  name_ar: f.name_ar.trim() || null,
  monthly_price: numOr(f.monthly_price),
  boost_price: numOr(f.boost_price),
  listing_quota: intOrNull(f.listing_quota),
  active_listing_cap: intOrNull(f.active_listing_cap),
  cpl_whatsapp: numOr(f.cpl_whatsapp),
  cpl_call: numOr(f.cpl_call),
  cpl_chat: numOr(f.cpl_chat),
  cpl_finance_request: numOr(f.cpl_finance_request),
  ranking_weight: numOr(f.ranking_weight),
  sort_order: numOr(f.sort_order),
  is_active: f.is_active,
  is_baseline: f.is_baseline,
});

/** A labelled number input bound to one PlanForm key. */
function NumField({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <Input
        id={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** The editable grid of economic levers, reused by the card and the dialog. */
function PlanFields({
  form,
  set,
}: {
  form: PlanForm;
  set: <K extends keyof PlanForm>(k: K, v: PlanForm[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="name" className="text-xs">
            Name (EN)
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="name_ar" className="text-xs">
            Name (AR)
          </Label>
          <Input
            id="name_ar"
            dir="rtl"
            value={form.name_ar}
            onChange={(e) => set("name_ar", e.target.value)}
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          Pricing (EGP)
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumField
            id="monthly_price"
            label="Monthly price"
            value={form.monthly_price}
            onChange={(v) => set("monthly_price", v)}
          />
          <NumField
            id="boost_price"
            label="Boost price"
            value={form.boost_price}
            onChange={(v) => set("boost_price", v)}
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          Quotas (blank = unlimited)
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumField
            id="listing_quota"
            label="Listing quota"
            value={form.listing_quota}
            onChange={(v) => set("listing_quota", v)}
          />
          <NumField
            id="active_listing_cap"
            label="Active listing cap"
            value={form.active_listing_cap}
            onChange={(v) => set("active_listing_cap", v)}
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          Cost per lead (EGP)
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumField
            id="cpl_whatsapp"
            label="WhatsApp"
            value={form.cpl_whatsapp}
            onChange={(v) => set("cpl_whatsapp", v)}
          />
          <NumField
            id="cpl_call"
            label="Call"
            value={form.cpl_call}
            onChange={(v) => set("cpl_call", v)}
          />
          <NumField
            id="cpl_chat"
            label="Chat"
            value={form.cpl_chat}
            onChange={(v) => set("cpl_chat", v)}
          />
          <NumField
            id="cpl_finance_request"
            label="Finance request"
            value={form.cpl_finance_request}
            onChange={(v) => set("cpl_finance_request", v)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumField
          id="ranking_weight"
          label="Ranking weight"
          value={form.ranking_weight}
          onChange={(v) => set("ranking_weight", v)}
          hint="Higher = ranked above lower-tier plans in the feed."
        />
        <NumField
          id="sort_order"
          label="Sort order"
          value={form.sort_order}
          onChange={(v) => set("sort_order", v)}
          hint="Display order on the pricing page (ascending)."
        />
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <label className="flex items-center gap-2">
          <Switch
            checked={form.is_active}
            onCheckedChange={(v) => set("is_active", v)}
          />
          <span className="text-sm">Active (offered to users)</span>
        </label>
        <label className="flex items-center gap-2">
          <Switch
            checked={form.is_baseline}
            onCheckedChange={(v) => set("is_baseline", v)}
          />
          <span className="text-sm">Baseline (free default for its audience)</span>
        </label>
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: AdminPlan }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const update = useUpdateAdminPlan();
  const [form, setForm] = useState<PlanForm>(() => seed(plan));

  // Re-seed when the server row changes (after a save refetch).
  const planSig = JSON.stringify(plan);
  useEffect(() => {
    setForm(seed(plan));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planSig]);

  const set = <K extends keyof PlanForm>(k: K, v: PlanForm[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const save = () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    update.mutate(
      { id: plan.id, data: formToBody(form) },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetAdminPlansQueryKey() });
          toast({ title: "Plan saved", description: `${form.name} updated.` });
        },
        onError: () => toast({ title: "Save failed", variant: "destructive" }),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {plan.name}
            {plan.is_baseline ? (
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            ) : null}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{AUDIENCE_LABEL[plan.audience as Audience] ?? plan.audience}</Badge>
            <Badge variant={plan.is_active ? "default" : "destructive"}>
              {plan.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <CardDescription className="font-mono text-xs">{plan.slug}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <PlanFields form={form} set={set} />
        <Separator />
        <div className="flex justify-end">
          <Button onClick={save} disabled={update.isPending}>
            {update.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CreatePlanDialog() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const create = useCreateAdminPlan();
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [audience, setAudience] = useState<Audience>("dealer");
  const [form, setForm] = useState<PlanForm>(emptyForm());

  const set = <K extends keyof PlanForm>(k: K, v: PlanForm[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const submit = () => {
    if (!slug.trim() || !form.name.trim()) {
      toast({ title: "Slug and name are required", variant: "destructive" });
      return;
    }
    const data: AdminPlanCreate = {
      ...formToBody(form),
      slug: slug.trim(),
      audience,
    };
    create.mutate(
      { data },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetAdminPlansQueryKey() });
          setOpen(false);
          setSlug("");
          setAudience("dealer");
          setForm(emptyForm());
          toast({ title: "Plan created", description: `${data.name} added.` });
        },
        onError: () =>
          toast({
            title: "Create failed",
            description: "A plan with that slug may already exist.",
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a plan</DialogTitle>
          <DialogDescription>
            Slug is the permanent identifier (e.g. <code>dealer_pro</code>) and
            cannot be changed later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="new_slug" className="text-xs">
                Slug
              </Label>
              <Input
                id="new_slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dealer_pro"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Audience</Label>
              <Select
                value={audience}
                onValueChange={(v) => setAudience(v as Audience)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {AUDIENCE_LABEL[a]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <PlanFields form={form} set={set} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={create.isPending}>
            {create.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Create plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PlansPage() {
  const { data: resp, isLoading } = useGetAdminPlans();
  const plans = resp?.data ?? [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Plans &amp; Pricing</h1>
            <p className="text-muted-foreground mt-1">
              The platform&apos;s economic levers — subscription price, listing
              quotas, cost-per-lead, boost price and feed ranking, per audience.
              Changes take effect immediately for new checkouts and lead charges.
            </p>
          </div>
        </div>
        {!isLoading ? <CreatePlanDialog /> : null}
      </div>

      {isLoading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No plans yet. Create the first one to start charging.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>
      )}
    </div>
  );
}
