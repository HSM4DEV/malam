import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import type { LeadSource, LeadStage } from "../src/generated/prisma/enums";

const connectionString =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const now = new Date();
const daysAgo = (d: number, h = 12, m = 0) => {
  const date = new Date(now);
  date.setDate(date.getDate() - d);
  date.setHours(h, m, 0, 0);
  return date;
};
const minutesAgo = (n: number) => new Date(now.getTime() - n * 60000);
const at = (h: number, m: number, dayOffset = 0) => daysAgo(dayOffset, h, m);

async function main() {
  console.log("🌱 Seeding مَعلم demo data…");

  // Clean in FK-safe order (idempotent re-seed).
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.analyticsPoint.deleteMany();
  await prisma.trafficSource.deleteMany();
  await prisma.analyticsSummary.deleteMany();
  await prisma.project.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  // --- Company + owner user -------------------------------------------------
  const company = await prisma.company.create({
    data: {
      name: "مجموعة فيجن العقارية",
      slug: "vision-group",
      type: "DEVELOPER",
      avatarSeed: "dd-user",
      licenseNumber: "1200004567",
      city: "الرياض",
      website: "vision-group.sa",
      bio: "مطوّر عقاري رائد في المملكة، متخصّص في المساكن الفاخرة والوجهات المتكاملة.",
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "سلمان الراجحي",
      email: "salman@vision-group.sa",
      role: "DEVELOPER",
      jobTitle: "مدير التطوير العقاري",
      phone: "0554441234",
      companyId: company.id,
    },
  });

  await prisma.notificationPreference.createMany({
    data: [
      { userId: owner.id, key: "newLeads", enabled: true },
      { userId: owner.id, key: "messages", enabled: true },
      { userId: owner.id, key: "weeklyReport", enabled: true },
      { userId: owner.id, key: "marketing", enabled: false },
    ],
  });

  // --- Projects -------------------------------------------------------------
  const projectSeed = [
    { key: "nline", name: "مساكن نلاين", slug: "nline", city: "الرياض", district: "العليا", type: "بنتهاوس", status: "PUBLISHED", price: 4.8, tag: "مميّز", total: 90, sold: 54, reserved: 4, views: 18400, imageSeed: "pl-nline", imageAlt: "واجهة برج مساكن نلاين في العليا عند الغسق", blurb: "سبعةٌ وأربعون طابقاً من الزجاج البرونزيّ تعيد رسم أفق العليا." },
    { key: "diriyah", name: "فلل بلاط الدرعية", slug: "diriyah", city: "الرياض", district: "الدرعية", type: "فيلا", status: "PUBLISHED", price: 9.2, tag: "إطلاق جديد", total: 40, sold: 12, reserved: 3, views: 9200, imageSeed: "pl-diriyah", imageAlt: "فلل بلاط الدرعية بعمارة نجدية معاصرة", blurb: "عمارةٌ نجديةٌ أُعيدت قراءتها بلغةٍ معاصرة حول فناءاتٍ خاصّة." },
    { key: "corniche", name: "شرفات الكورنيش", slug: "corniche", city: "جدة", district: "الكورنيش", type: "شقة", status: "IN_REVIEW", price: 3.6, tag: "واجهة بحرية", total: 60, sold: 0, reserved: 2, views: 1100, imageSeed: "pl-corniche", imageAlt: "شرفات الكورنيش المطلة على البحر في جدة", blurb: "شققٌ على البحر مباشرةً بشرفاتٍ ممتدّةٍ تطلّ على غروب الكورنيش." },
    { key: "khobar", name: "مرسى الخبر", slug: "khobar", city: "الخبر", district: "الكورنيش", type: "فيلا", status: "PUBLISHED", price: 6.4, tag: "على البحر", total: 24, sold: 8, reserved: 1, views: 4600, imageSeed: "pl-khobar", imageAlt: "فلل مرسى الخبر على واجهة الخليج", blurb: "فللٌ على المرسى بمظلّاتٍ خاصّةٍ لليخوت وهدوءٍ يليق بالخليج." },
    { key: "kafd", name: "بنتهاوس المركز المالي", slug: "kafd", city: "الرياض", district: "المركز المالي", type: "بنتهاوس", status: "PUBLISHED", price: 7.9, tag: "بنتهاوس", total: 18, sold: 10, reserved: 2, views: 6800, imageSeed: "pl-kafd", imageAlt: "بنتهاوس المركز المالي في الرياض", blurb: "مساكن علويةٌ في قلب المركز الماليّ بخدمات فندقيةٍ على مدار الساعة." },
    { key: "malqa", name: "واحة الملقا", slug: "malqa", city: "الرياض", district: "الملقا", type: "دوبلكس", status: "DRAFT", price: 4.2, tag: "مسوّدة", total: 0, sold: 0, reserved: 0, views: 0, imageSeed: "pl-malqa", imageAlt: "مخطط واحة الملقا السكنية في الرياض", blurb: null },
    { key: "obhur", name: "خليج أبحر", slug: "obhur", city: "جدة", district: "أبحر", type: "فيلا", status: "DRAFT", price: 5.1, tag: "مسوّدة", total: 0, sold: 0, reserved: 0, views: 0, imageSeed: "pl-obhur", imageAlt: "فلل خليج أبحر الشاطئية في جدة", blurb: null },
  ] as const;

  const projectIds = new Map<string, string>();
  for (const p of projectSeed) {
    const created = await prisma.project.create({
      data: {
        companyId: company.id,
        name: p.name,
        slug: p.slug,
        city: p.city,
        district: p.district,
        type: p.type,
        status: p.status,
        priceFromMillions: p.price,
        tag: p.tag,
        blurb: p.blurb,
        totalUnits: p.total,
        soldUnits: p.sold,
        reservedUnits: p.reserved,
        viewCount: p.views,
        imageSeed: p.imageSeed,
        imageAlt: p.imageAlt,
      },
    });
    projectIds.set(p.key, created.id);
  }

  // --- Units (representative inventory sample) ------------------------------
  const unitSeed = [
    { code: "NL-1204", typeName: "شقة بثلاث غرف", project: "nline", areaSqm: 240, floorLabel: "الطابق ١٢", beds: 3, price: 4.8, status: "AVAILABLE" },
    { code: "NL-1801", typeName: "مسكن سماوي بأربع غرف", project: "nline", areaSqm: 360, floorLabel: "الطابق ١٨", beds: 4, price: 6.9, status: "RESERVED" },
    { code: "NL-4701", typeName: "بنتهاوس دوبلكس", project: "nline", areaSqm: 620, floorLabel: "الطابق ٤٧", beds: 5, price: 12.5, status: "SOLD" },
    { code: "DR-V08", typeName: "فيلا نجدية", project: "diriyah", areaSqm: 680, floorLabel: "دورين", beds: 5, price: 9.2, status: "AVAILABLE" },
    { code: "DR-V12", typeName: "فيلا نجدية بفناء", project: "diriyah", areaSqm: 900, floorLabel: "دورين + قبو", beds: 6, price: 11.4, status: "RESERVED" },
    { code: "KF-3302", typeName: "بنتهاوس المركز المالي", project: "kafd", areaSqm: 540, floorLabel: "الطابق ٣٣", beds: 4, price: 7.9, status: "AVAILABLE" },
    { code: "KH-V03", typeName: "فيلا مرسى", project: "khobar", areaSqm: 420, floorLabel: "دورين", beds: 4, price: 6.4, status: "SOLD" },
    { code: "KH-V07", typeName: "فيلا مرسى بمظلة يخت", project: "khobar", areaSqm: 700, floorLabel: "دورين", beds: 5, price: 8.8, status: "AVAILABLE" },
    { code: "CR-0902", typeName: "شقة بحرية", project: "corniche", areaSqm: 180, floorLabel: "الطابق ٩", beds: 2, price: 3.6, status: "AVAILABLE" },
    { code: "CR-1501", typeName: "شقة بحرية بثلاث غرف", project: "corniche", areaSqm: 410, floorLabel: "الطابق ١٥", beds: 3, price: 5.2, status: "RESERVED" },
  ] as const;

  for (const u of unitSeed) {
    await prisma.unit.create({
      data: {
        projectId: projectIds.get(u.project)!,
        code: u.code,
        typeName: u.typeName,
        areaSqm: u.areaSqm,
        floorLabel: u.floorLabel,
        beds: u.beds,
        priceMillions: u.price,
        status: u.status,
      },
    });
  }

  // --- Leads ----------------------------------------------------------------
  type LeadInput = {
    buyerName: string;
    phone: string;
    source: LeadSource;
    stage: LeadStage;
    unitLabel: string | null;
    project: string;
    createdAt: Date;
  };

  const namedLeads: LeadInput[] = [
    { buyerName: "عبدالله المطيري", phone: "0551234567", source: "WEBSITE", stage: "NEW", unitLabel: "بنتهاوس", project: "nline", createdAt: minutesAgo(5) },
    { buyerName: "لطيفة السعد", phone: "0509876543", source: "AD", stage: "NEW", unitLabel: "فيلا ٥غ", project: "diriyah", createdAt: minutesAgo(22) },
    { buyerName: "خالد الغامدي", phone: "0564442211", source: "REFERRAL", stage: "CONTACTED", unitLabel: "٣غ", project: "nline", createdAt: minutesAgo(60) },
    { buyerName: "منيرة الحربي", phone: "0537778899", source: "WEBSITE", stage: "VIEWING", unitLabel: null, project: "corniche", createdAt: minutesAgo(180) },
    { buyerName: "سعود القرني", phone: "0591103344", source: "WHATSAPP", stage: "NEGOTIATING", unitLabel: null, project: "kafd", createdAt: daysAgo(1, 16) },
    { buyerName: "نوف العتيبي", phone: "0585556666", source: "EXHIBITION", stage: "WON", unitLabel: "دوبلكس", project: "nline", createdAt: daysAgo(2, 14) },
    { buyerName: "فيصل الدوسري", phone: "0542229988", source: "WEBSITE", stage: "CONTACTED", unitLabel: "فيلا", project: "khobar", createdAt: daysAgo(2, 11) },
    { buyerName: "ريم الشهري", phone: "0576661122", source: "AD", stage: "VIEWING", unitLabel: "فيلا ٦غ", project: "diriyah", createdAt: daysAgo(3, 10) },
    { buyerName: "ماجد العنزي", phone: "0513334455", source: "REFERRAL", stage: "NEW", unitLabel: "شقة", project: "corniche", createdAt: daysAgo(4, 9) },
  ];

  const namePool = [
    "محمد القحطاني", "سارة الزهراني", "فهد العتيبي", "نورة الدوسري", "تركي الشهري",
    "هيا المالكي", "بندر الحربي", "رهف السبيعي", "عبدالعزيز آل سعود", "جواهر الرشيد",
    "ناصر الغامدي", "مها العنزي", "سلطان البقمي", "دانة الفيصل", "ياسر الشمري",
    "لمى الخالدي", "وليد المطيري", "أسماء القرني", "راكان الدوسري", "شهد العمري",
    "عمر باناجه", "غادة الأحمدي", "صالح الرشيدي", "منال السلمي", "طلال الحارثي",
    "ريما الجهني", "خالد بن نايف", "عبير الصاعدي", "مشعل العتيبي", "نوال الزهراني",
    "فارس الشثري",
  ];
  const genStages: LeadStage[] = [
    ...Array<LeadStage>(5).fill("NEW"),
    ...Array<LeadStage>(10).fill("CONTACTED"),
    ...Array<LeadStage>(4).fill("VIEWING"),
    ...Array<LeadStage>(7).fill("NEGOTIATING"),
    ...Array<LeadStage>(3).fill("WON"),
    ...Array<LeadStage>(2).fill("LOST"),
  ];
  const sources: LeadSource[] = ["WEBSITE", "AD", "REFERRAL", "WHATSAPP", "EXHIBITION"];
  const leadProjectKeys = ["nline", "diriyah", "corniche", "khobar", "kafd"];
  const unitLabels = ["٣غ", "٤غ", "بنتهاوس", "فيلا", "فيلا ٥غ", "دوبلكس", "شقة", null];

  const generatedLeads: LeadInput[] = namePool.map((buyerName, i) => ({
    buyerName,
    phone: `05${((10000000 + i * 137911) % 90000000).toString().padStart(8, "0")}`.slice(0, 10),
    source: sources[i % sources.length],
    stage: genStages[i],
    unitLabel: unitLabels[i % unitLabels.length],
    project: leadProjectKeys[i % leadProjectKeys.length],
    createdAt: daysAgo(1 + (i % 22), 9 + (i % 10), (i * 7) % 60),
  }));

  for (const lead of [...namedLeads, ...generatedLeads]) {
    await prisma.lead.create({
      data: {
        companyId: company.id,
        projectId: projectIds.get(lead.project)!,
        buyerName: lead.buyerName,
        phone: lead.phone,
        source: lead.source,
        stage: lead.stage,
        unitLabel: lead.unitLabel,
        createdAt: lead.createdAt,
      },
    });
  }

  // --- Conversations + messages ---------------------------------------------
  type Msg = { sender: "COMPANY" | "CONTACT"; body: string; createdAt: Date; unread?: boolean };
  const conversationSeed: Array<{
    contactName: string;
    project: string | null;
    online: boolean;
    messages: Msg[];
  }> = [
    {
      contactName: "عبدالله المطيري",
      project: "nline",
      online: true,
      messages: [
        { sender: "CONTACT", body: "السلام عليكم، أنا مهتمّ ببنتهاوس مساكن نلاين.", createdAt: at(13, 50) },
        { sender: "COMPANY", body: "وعليكم السلام أستاذ عبدالله، أهلاً بك. الوحدة متاحة ولدينا نموذج مفروش للمعاينة.", createdAt: at(13, 56) },
        { sender: "CONTACT", body: "رائع، ما هي المساحة والسعر المبدئي؟", createdAt: at(14, 2) },
        { sender: "COMPANY", body: "المساحة ٦٢٠ م²، والسعر يبدأ من ١٢٫٥ مليون شامل التشطيب الفاخر.", createdAt: at(14, 5) },
        { sender: "CONTACT", body: "ممتاز، هل يمكن تحديد موعد للمعاينة الأسبوع القادم؟", createdAt: at(14, 14), unread: true },
      ],
    },
    {
      contactName: "لطيفة السعد",
      project: "diriyah",
      online: false,
      messages: [
        { sender: "CONTACT", body: "هل يتوفّر مخطط طابقي لفيلا الخمس غرف؟", createdAt: at(11, 20) },
        { sender: "COMPANY", body: "بالتأكيد، أرسلت لك المخطط عبر البريد للتوّ.", createdAt: at(11, 32) },
        { sender: "CONTACT", body: "شكراً لك، سأطّلع على المخطط وأعود إليك.", createdAt: at(11, 40) },
      ],
    },
    {
      contactName: "خالد الغامدي",
      project: "nline",
      online: true,
      messages: [
        { sender: "CONTACT", body: "أرغب بعرض سعر نهائي لشقة الثلاث غرف.", createdAt: at(16, 10, 1) },
        { sender: "COMPANY", body: "سأجهّز لك العرض خلال اليوم إن شاء الله.", createdAt: at(16, 22, 1) },
        { sender: "CONTACT", body: "تمام، بانتظار عرض السعر النهائي.", createdAt: at(16, 30, 1), unread: true },
      ],
    },
    {
      contactName: "منيرة الحربي",
      project: "corniche",
      online: false,
      messages: [
        { sender: "COMPANY", body: "شرفات الكورنيش تطلّ مباشرةً على البحر، وقريبة من الخدمات.", createdAt: at(12, 0, 3) },
        { sender: "CONTACT", body: "الموقع مناسب جداً، شكراً على المعلومات.", createdAt: at(12, 20, 3) },
      ],
    },
    {
      contactName: "سعود القرني",
      project: "kafd",
      online: false,
      messages: [
        { sender: "CONTACT", body: "أرسلت لك مستندات التمويل المطلوبة.", createdAt: at(10, 0, 4) },
        { sender: "COMPANY", body: "تسلم، استلمناها وسنبدأ الإجراءات فوراً.", createdAt: at(10, 15, 4) },
      ],
    },
  ];

  for (const conv of conversationSeed) {
    const last = conv.messages[conv.messages.length - 1];
    await prisma.conversation.create({
      data: {
        companyId: company.id,
        projectId: conv.project ? projectIds.get(conv.project)! : null,
        contactName: conv.contactName,
        online: conv.online,
        lastMessageAt: last.createdAt,
        messages: {
          create: conv.messages.map((m) => ({
            sender: m.sender,
            body: m.body,
            readByCompany: !m.unread,
            createdAt: m.createdAt,
          })),
        },
      },
    });
  }

  // --- Analytics ------------------------------------------------------------
  const weekly = [44, 52, 47, 61, 55, 70, 66, 78, 72, 86, 80, 93];
  const monthsAr = ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"];
  const monthly = [40, 48, 54, 51, 63, 59, 68, 73, 71, 80, 87, 94];
  const toAr = (n: number) => String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

  await prisma.analyticsPoint.createMany({
    data: [
      ...weekly.map((value, i) => ({ companyId: company.id, period: "WEEKLY" as const, bucket: i, label: toAr(i + 1), value })),
      ...monthly.map((value, i) => ({ companyId: company.id, period: "MONTHLY" as const, bucket: i, label: monthsAr[i], value })),
    ],
  });

  await prisma.trafficSource.createMany({
    data: [
      { companyId: company.id, label: "بحث Google", visits: 13272, sort: 0 },
      { companyId: company.id, label: "مباشر", visits: 8216, sort: 1 },
      { companyId: company.id, label: "وسائل التواصل", visits: 6004, sort: 2 },
      { companyId: company.id, label: "إحالات", visits: 4108, sort: 3 },
    ],
  });

  await prisma.analyticsSummary.create({
    data: {
      companyId: company.id,
      portfolioViewsDelta: 12,
      newLeadsDelta: 8,
      unitsSoldDelta: 5,
      monthlyRevenueMillions: 214,
      monthlyRevenueDelta: -3,
      uniqueVisitors: 31600,
      uniqueVisitorsDelta: 9,
      avgSessionSeconds: 204,
      avgSessionDelta: 11,
      conversionRate: 2.7,
      conversionRateDelta: -0.3,
      leadsConversionRate: 26,
      leadsConversionDelta: 4,
    },
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
