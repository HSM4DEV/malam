import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import type { LeadSource, LeadStage } from "../src/generated/prisma/enums";

// Demo logins — seeded so the developer dashboard and admin review page are
// testable without a real signup flow. Not production credentials.
const DEMO_PASSWORD = "Demo12345!";
const ADMIN_PASSWORD = "AdminDemo123!";

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
  await prisma.inquiry.deleteMany();

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
      foundedYear: 2011,
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "سلمان الراجحي",
      email: "salman@vision-group.sa",
      passwordHash: await bcrypt.hash(DEMO_PASSWORD, 12),
      role: "DEVELOPER",
      jobTitle: "مدير التطوير العقاري",
      phone: "0554441234",
      companyId: company.id,
    },
  });

  // --- Admin (reviews developer/broker applications at /admin/applications) -
  await prisma.user.create({
    data: {
      name: "مدير المنصّة",
      email: "admin@malam.sa",
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
      role: "ADMIN",
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
    { key: "nline", name: "مساكن نلاين", slug: "nline", city: "الرياض", district: "العليا", lat: 24.6944, lng: 46.6853, type: "بنتهاوس", status: "PUBLISHED", price: 4.8, tag: "مميّز", total: 90, sold: 54, reserved: 4, views: 18400, imageSeed: "pl-nline", imageAlt: "واجهة برج مساكن نلاين في العليا عند الغسق", blurb: "سبعةٌ وأربعون طابقاً من الزجاج البرونزيّ تعيد رسم أفق العليا.", amenities: ["مسبح لا متناهٍ", "صالة رياضية مجهّزة", "أمن على مدار الساعة", "مواقف خاصة", "صالة استقبال فندقية", "مصعد خاص"] },
    { key: "diriyah", name: "فلل بلاط الدرعية", slug: "diriyah", city: "الرياض", district: "الدرعية", lat: 24.7477, lng: 46.5719, type: "فيلا", status: "PUBLISHED", price: 9.2, tag: "إطلاق جديد", total: 40, sold: 12, reserved: 3, views: 9200, imageSeed: "pl-diriyah", imageAlt: "فلل بلاط الدرعية بعمارة نجدية معاصرة", blurb: "عمارةٌ نجديةٌ أُعيدت قراءتها بلغةٍ معاصرة حول فناءاتٍ خاصّة.", amenities: ["حديقة خاصة", "مسبح خاص", "أمن على مدار الساعة", "غرفة خادمة", "موقف لسيارتين", "فناء داخلي"] },
    { key: "corniche", name: "شرفات الكورنيش", slug: "corniche", city: "جدة", district: "الكورنيش", lat: 21.5500, lng: 39.1600, type: "شقة", status: "IN_REVIEW", price: 3.6, tag: "واجهة بحرية", total: 60, sold: 0, reserved: 2, views: 1100, imageSeed: "pl-corniche", imageAlt: "شرفات الكورنيش المطلة على البحر في جدة", blurb: "شققٌ على البحر مباشرةً بشرفاتٍ ممتدّةٍ تطلّ على غروب الكورنيش.", amenities: ["إطلالة بحرية مباشرة", "شرفة واسعة", "صالة رياضية", "أمن على مدار الساعة", "موقف خاص"] },
    { key: "khobar", name: "مرسى الخبر", slug: "khobar", city: "الخبر", district: "الكورنيش", lat: 26.2896, lng: 50.2083, type: "فيلا", status: "PUBLISHED", price: 6.4, tag: "على البحر", total: 24, sold: 8, reserved: 1, views: 4600, imageSeed: "pl-khobar", imageAlt: "فلل مرسى الخبر على واجهة الخليج", blurb: "فللٌ على المرسى بمظلّاتٍ خاصّةٍ لليخوت وهدوءٍ يليق بالخليج.", amenities: ["مظلة يخت خاصة", "مسبح خاص", "إطلالة بحرية", "أمن على مدار الساعة", "حديقة خاصة"] },
    { key: "kafd", name: "بنتهاوس المركز المالي", slug: "kafd", city: "الرياض", district: "المركز المالي", lat: 24.7635, lng: 46.6412, type: "بنتهاوس", status: "PUBLISHED", price: 7.9, tag: "بنتهاوس", total: 18, sold: 10, reserved: 2, views: 6800, imageSeed: "pl-kafd", imageAlt: "بنتهاوس المركز المالي في الرياض", blurb: "مساكن علويةٌ في قلب المركز الماليّ بخدمات فندقيةٍ على مدار الساعة.", amenities: ["خدمات فندقية", "صالة رياضية", "مسبح على السطح", "أمن على مدار الساعة", "موقف خاص", "مصعد خاص"] },
    { key: "malqa", name: "واحة الملقا", slug: "malqa", city: "الرياض", district: "الملقا", lat: 24.8236, lng: 46.6103, type: "دوبلكس", status: "DRAFT", price: 4.2, tag: "مسوّدة", total: 0, sold: 0, reserved: 0, views: 0, imageSeed: "pl-malqa", imageAlt: "مخطط واحة الملقا السكنية في الرياض", blurb: null, amenities: ["مسبح مشترك", "حديقة", "أمن على مدار الساعة"] },
    { key: "obhur", name: "خليج أبحر", slug: "obhur", city: "جدة", district: "أبحر", lat: 21.7386, lng: 39.1044, type: "فيلا", status: "DRAFT", price: 5.1, tag: "مسوّدة", total: 0, sold: 0, reserved: 0, views: 0, imageSeed: "pl-obhur", imageAlt: "فلل خليج أبحر الشاطئية في جدة", blurb: null, amenities: ["وصول مباشر للشاطئ", "مسبح خاص", "حديقة خاصة"] },
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
        latitude: p.lat,
        longitude: p.lng,
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
        amenities: [...p.amenities],
      },
    });
    projectIds.set(p.key, created.id);
  }

  // --- Units (representative inventory sample) ------------------------------
  const unitSeed = [
    { code: "NL-1204", typeName: "شقة بثلاث غرف", project: "nline", areaSqm: 240, floorLabel: "الطابق ١٢", beds: 3, baths: 3, price: 4.8, status: "AVAILABLE" },
    { code: "NL-1801", typeName: "مسكن سماوي بأربع غرف", project: "nline", areaSqm: 360, floorLabel: "الطابق ١٨", beds: 4, baths: 4, price: 6.9, status: "RESERVED" },
    { code: "NL-4701", typeName: "بنتهاوس دوبلكس", project: "nline", areaSqm: 620, floorLabel: "الطابق ٤٧", beds: 5, baths: 6, price: 12.5, status: "SOLD" },
    { code: "DR-V08", typeName: "فيلا نجدية", project: "diriyah", areaSqm: 680, floorLabel: "دورين", beds: 5, baths: 5, price: 9.2, status: "AVAILABLE" },
    { code: "DR-V12", typeName: "فيلا نجدية بفناء", project: "diriyah", areaSqm: 900, floorLabel: "دورين + قبو", beds: 6, baths: 7, price: 11.4, status: "RESERVED" },
    { code: "KF-3302", typeName: "بنتهاوس المركز المالي", project: "kafd", areaSqm: 540, floorLabel: "الطابق ٣٣", beds: 4, baths: 5, price: 7.9, status: "AVAILABLE" },
    { code: "KH-V03", typeName: "فيلا مرسى", project: "khobar", areaSqm: 420, floorLabel: "دورين", beds: 4, baths: 4, price: 6.4, status: "SOLD" },
    { code: "KH-V07", typeName: "فيلا مرسى بمظلة يخت", project: "khobar", areaSqm: 700, floorLabel: "دورين", beds: 5, baths: 6, price: 8.8, status: "AVAILABLE" },
    { code: "CR-0902", typeName: "شقة بحرية", project: "corniche", areaSqm: 180, floorLabel: "الطابق ٩", beds: 2, baths: 2, price: 3.6, status: "AVAILABLE" },
    { code: "CR-1501", typeName: "شقة بحرية بثلاث غرف", project: "corniche", areaSqm: 410, floorLabel: "الطابق ١٥", beds: 3, baths: 3, price: 5.2, status: "RESERVED" },
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
        baths: u.baths,
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

  // ===========================================================================
  // Broker company — its own portfolio, clients, and pipeline (/dashboard/broker)
  // ===========================================================================

  const brokerCompany = await prisma.company.create({
    data: {
      name: "مكتب الشمري العقاري",
      slug: "shammari-realty",
      type: "BROKER",
      avatarSeed: "bd-user",
      licenseNumber: "1200009821",
      city: "الرياض",
      website: "shammari-realty.sa",
      bio: "وسيطٌ عقاريٌّ معتمد، متخصّص في تسويق الوحدات السكنية الفاخرة في الرياض وجدة.",
      foundedYear: 2016,
    },
  });

  const brokerOwner = await prisma.user.create({
    data: {
      name: "فهد الشمري",
      email: "fahad@shammari-realty.sa",
      passwordHash: await bcrypt.hash(DEMO_PASSWORD, 12),
      role: "BROKER",
      jobTitle: "وسيطٌ معتمد",
      phone: "0561239876",
      companyId: brokerCompany.id,
    },
  });

  await prisma.notificationPreference.createMany({
    data: [
      { userId: brokerOwner.id, key: "newLeads", enabled: true },
      { userId: brokerOwner.id, key: "messages", enabled: true },
      { userId: brokerOwner.id, key: "weeklyReport", enabled: true },
      { userId: brokerOwner.id, key: "marketing", enabled: false },
    ],
  });

  const brokerProjectSeed = [
    { key: "yasmin", name: "فلل الياسمين", slug: "yasmin-villas", city: "الرياض", district: "الياسمين", lat: 24.8358, lng: 46.6289, type: "فيلا", status: "PUBLISHED" as const, price: 4.8, tag: "حصري", total: 12, sold: 3, reserved: 2, views: 5200, imageSeed: "bd-yasmin", imageAlt: "فلل الياسمين في حي الياسمين بالرياض", blurb: "فللٌ عائليةٌ حديثة في حيٍّ هادئ شمال الرياض.", amenities: ["حديقة خاصة", "مسبح خاص", "أمن على مدار الساعة", "موقف لسيارتين"] },
    { key: "nakheel", name: "شقق النخيل", slug: "nakheel-apartments", city: "جدة", district: "النخيل", lat: 21.5940, lng: 39.1728, type: "شقة", status: "PUBLISHED" as const, price: 2.4, tag: "نشط", total: 20, sold: 6, reserved: 3, views: 3100, imageSeed: "bd-nakheel", imageAlt: "شقق النخيل السكنية في جدة", blurb: "شققٌ عصريةٌ قريبة من الخدمات في حيّ النخيل بجدة.", amenities: ["صالة رياضية", "أمن على مدار الساعة", "مواقف مظللة"] },
  ];

  const brokerProjectIds = new Map<string, string>();
  for (const p of brokerProjectSeed) {
    const created = await prisma.project.create({
      data: {
        companyId: brokerCompany.id,
        name: p.name,
        slug: p.slug,
        city: p.city,
        district: p.district,
        latitude: p.lat,
        longitude: p.lng,
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
        amenities: [...p.amenities],
      },
    });
    brokerProjectIds.set(p.key, created.id);
  }

  const brokerUnitSeed = [
    { code: "YS-V01", typeName: "فيلا بأربع غرف", project: "yasmin", areaSqm: 320, floorLabel: "دورين", beds: 4, baths: 4, price: 4.8, status: "AVAILABLE" as const },
    { code: "YS-V02", typeName: "فيلا بخمس غرف", project: "yasmin", areaSqm: 380, floorLabel: "دورين", beds: 5, baths: 5, price: 5.6, status: "RESERVED" as const },
    { code: "YS-V03", typeName: "فيلا ركنية", project: "yasmin", areaSqm: 340, floorLabel: "دورين", beds: 4, baths: 4, price: 5.1, status: "SOLD" as const },
    { code: "NK-0704", typeName: "شقة بثلاث غرف", project: "nakheel", areaSqm: 210, floorLabel: "الطابق ٧", beds: 3, baths: 2, price: 2.4, status: "AVAILABLE" as const },
    { code: "NK-1102", typeName: "شقة بغرفتين", project: "nakheel", areaSqm: 150, floorLabel: "الطابق ١١", beds: 2, baths: 2, price: 1.8, status: "AVAILABLE" as const },
    { code: "NK-0301", typeName: "شقة بثلاث غرف مطلة", project: "nakheel", areaSqm: 240, floorLabel: "الطابق ٣", beds: 3, baths: 3, price: 2.9, status: "RESERVED" as const },
  ];

  for (const u of brokerUnitSeed) {
    await prisma.unit.create({
      data: {
        projectId: brokerProjectIds.get(u.project)!,
        code: u.code,
        typeName: u.typeName,
        areaSqm: u.areaSqm,
        floorLabel: u.floorLabel,
        beds: u.beds,
        baths: u.baths,
        priceMillions: u.price,
        status: u.status,
      },
    });
  }

  const brokerLeadSeed: LeadInput[] = [
    { buyerName: "عبدالله المطيري", phone: "0551112222", source: "REFERRAL", stage: "NEW", unitLabel: "فيلا ٤غ", project: "yasmin", createdAt: minutesAgo(15) },
    { buyerName: "لطيفة السعد", phone: "0509998888", source: "WEBSITE", stage: "NEW", unitLabel: null, project: "nakheel", createdAt: minutesAgo(90) },
    { buyerName: "خالد الغامدي", phone: "0564447777", source: "AD", stage: "CONTACTED", unitLabel: "شقة ٣غ", project: "nakheel", createdAt: daysAgo(1, 12) },
    { buyerName: "منيرة الحربي", phone: "0537773333", source: "WHATSAPP", stage: "VIEWING", unitLabel: null, project: "yasmin", createdAt: daysAgo(2, 10) },
    { buyerName: "سعود القرني", phone: "0591106666", source: "EXHIBITION", stage: "NEGOTIATING", unitLabel: "فيلا ٥غ", project: "yasmin", createdAt: daysAgo(3, 9) },
    { buyerName: "نوف العتيبي", phone: "0585554444", source: "REFERRAL", stage: "WON", unitLabel: "فيلا ركنية", project: "yasmin", createdAt: daysAgo(5, 14) },
    { buyerName: "فيصل الدوسري", phone: "0542221111", source: "WEBSITE", stage: "LOST", unitLabel: null, project: "nakheel", createdAt: daysAgo(6, 11) },
    { buyerName: "ريم الشهري", phone: "0576669999", source: "AD", stage: "CONTACTED", unitLabel: "شقة بغرفتين", project: "nakheel", createdAt: daysAgo(1, 16, 30) },
  ];

  for (const lead of brokerLeadSeed) {
    await prisma.lead.create({
      data: {
        companyId: brokerCompany.id,
        projectId: brokerProjectIds.get(lead.project)!,
        buyerName: lead.buyerName,
        phone: lead.phone,
        source: lead.source,
        stage: lead.stage,
        unitLabel: lead.unitLabel,
        createdAt: lead.createdAt,
      },
    });
  }

  const brokerConversationSeed: Array<{
    contactName: string;
    project: string;
    online: boolean;
    messages: Msg[];
  }> = [
    {
      contactName: "عبدالله المطيري",
      project: "yasmin",
      online: true,
      messages: [
        { sender: "CONTACT", body: "السلام عليكم، هل فيلا الياسمين رقم ١ ما زالت متاحة؟", createdAt: at(9, 40) },
        { sender: "COMPANY", body: "وعليكم السلام أستاذ عبدالله، نعم متاحة. هل ترغب بموعد معاينة؟", createdAt: at(9, 48) },
        { sender: "CONTACT", body: "نعم، يوم الخميس مساءً إن أمكن.", createdAt: at(9, 55), unread: true },
      ],
    },
    {
      contactName: "خالد الغامدي",
      project: "nakheel",
      online: false,
      messages: [
        { sender: "CONTACT", body: "أرغب بمعرفة تفاصيل التمويل المتاح لشقق النخيل.", createdAt: at(15, 5, 1) },
        { sender: "COMPANY", body: "بالتأكيد، سأرسل لك خيارات التمويل المتاحة اليوم.", createdAt: at(15, 20, 1) },
      ],
    },
  ];

  for (const conv of brokerConversationSeed) {
    const last = conv.messages[conv.messages.length - 1];
    await prisma.conversation.create({
      data: {
        companyId: brokerCompany.id,
        projectId: brokerProjectIds.get(conv.project)!,
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

  await prisma.analyticsSummary.create({
    data: {
      companyId: brokerCompany.id,
      portfolioViewsDelta: 6,
      newLeadsDelta: 9,
      unitsSoldDelta: 2,
      monthlyRevenueMillions: 0,
      monthlyRevenueDelta: 0,
      uniqueVisitors: 4200,
      uniqueVisitorsDelta: 5,
      avgSessionSeconds: 150,
      avgSessionDelta: 4,
      conversionRate: 3.1,
      conversionRateDelta: 0.6,
      leadsConversionRate: 31,
      leadsConversionDelta: 3,
    },
  });

  console.log("✅ Seed complete.");
  console.log(`   Demo developer login: salman@vision-group.sa / ${DEMO_PASSWORD}`);
  console.log(`   Demo broker login: fahad@shammari-realty.sa / ${DEMO_PASSWORD}`);
  console.log(`   Demo admin login: admin@malam.sa / ${ADMIN_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
