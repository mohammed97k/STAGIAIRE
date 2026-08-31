import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft, BookOpen, Bookmark, Check, ChevronLeft, CircleHelp,
  ClipboardCheck, Clock3, Download, FileText, HeartPulse, Home as HomeIcon, Lightbulb,
  ListFilter, PlayCircle, Printer, Search, Star, Stethoscope, Target, X,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';

type Accent = 'navy' | 'green' | 'orange' | 'purple';
type Branch = 'theory' | 'clinical';
type Tab = 'lectures' | 'explanation' | 'summaries' | 'hints' | 'mcqs' | 'review';
type Lecture = { id: string; title: string; pdf: string; pages: number; page?: number };
type Topic = { id: string; title: string; en: string; count: number; duration: string; tag?: string; group?: string; lectures?: Lecture[] };
type Subject = { id: string; title: string; english: string; accent: Accent; icon: string; description: string; topics: Record<Branch, Topic[]> };

const topic = (id: string, en: string, title: string, group?: string): Topic => ({
  id, en, title, count: 12, duration: 'ساعتان', ...(group ? { group } : {}),
});

const endocrinologyLectures: Lecture[] = [
  { id: 'pituitary-gland-part-1', title: 'Pituitary Gland - Part 1', pdf: '/lectures/01-pituitary-gland-part-1.pdf', pages: 11 },
  { id: 'pituitary-gland-part-2', title: 'Pituitary Gland - Part 2', pdf: '/lectures/02-pituitary-gland-part-2.pdf', pages: 10 },
  { id: 'adrenal-gland-part-1', title: 'Adrenal Gland - Part 1', pdf: '/lectures/03-adrenal-gland-part-1.pdf', pages: 8 },
  { id: 'adrenal-gland-part-2', title: 'Adrenal Gland - Part 2', pdf: '/lectures/04-adrenal-gland-part-2.pdf', pages: 12 },
  { id: 'parathyroid-gland', title: 'Parathyroid Gland', pdf: '/lectures/05-parathyroid-gland.pdf', pages: 9 },
  { id: 'male-hypogonadism', title: 'Male Hypogonadism', pdf: '/lectures/06-male-hypogonadism.pdf', pages: 5 },
  { id: 'lipid-abnormalities', title: 'Lipid Abnormalities', pdf: '/lectures/07-lipid-abnormalities.pdf', pages: 10 },
];

const gastroenterologyLectures: Lecture[] = [
  { id: 'gastro-lec-01', title: 'Lec 01: Anatomy & Physiology of the GI Tract', pdf: '/lectures/Gastroenterology/01-anatomy-physiology-gi-tract.pdf', pages: 7 },
  { id: 'gastro-lec-02', title: 'Lec 02: Investigations of the GIT System', pdf: '/lectures/Gastroenterology/02-investigations-git-system.pdf', pages: 13 },
  { id: 'gastro-lec-03', title: 'Lec 03: Disorders of the Esophagus (GERD & Achalasia)', pdf: '/lectures/Gastroenterology/03-esophagus-gerd-achalasia.pdf', pages: 13 },
  { id: 'gastro-lec-04', title: 'Lec 04: Acute & Chronic Gastritis (H. pylori)', pdf: '/lectures/Gastroenterology/04-acute-chronic-gastritis-h-pylori.pdf', pages: 6 },
  { id: 'gastro-lec-05', title: 'Lec 05: Malabsorption & Celiac Disease', pdf: '/lectures/Gastroenterology/05-malabsorption-celiac-disease.pdf', pages: 11 },
  { id: 'gastro-lec-06', title: 'Lec 06: Small Bowel Diseases (SIBO & Whipple)', pdf: '/lectures/Gastroenterology/06-small-bowel-diseases-sibo-whipple.pdf', pages: 9 },
  { id: 'gastro-lec-07', title: 'Lec 07: Irritable Bowel Syndrome (IBS)', pdf: '/lectures/Gastroenterology/07-irritable-bowel-syndrome-ibs.pdf', pages: 6 },
  { id: 'gastro-lec-08', title: 'Lec 08: Peptic Ulcer Disease (PUD)', pdf: '/lectures/Gastroenterology/08-peptic-ulcer-disease-pud.pdf', pages: 6 },
  { id: 'gastro-lec-09', title: 'Lec 09: PUD Complications, ZES & Dyspepsia', pdf: '/lectures/Gastroenterology/09-pud-complications-zes-dyspepsia.pdf', pages: 6 },
  { id: 'gastro-lec-10', title: 'Lec 10: Esophageal & Gastric Tumors', pdf: '/lectures/Gastroenterology/10-esophageal-gastric-tumors.pdf', pages: 14 },
  { id: 'gastro-lec-11', title: 'Lec 11: Inflammatory Bowel Disease (IBD - Part 1)', pdf: '/lectures/Gastroenterology/11-inflammatory-bowel-disease-part-1.pdf', pages: 14 },
  { id: 'gastro-lec-12', title: 'Lec 12: Inflammatory Bowel Disease (IBD - Part 2)', pdf: '/lectures/Gastroenterology/12-inflammatory-bowel-disease-part-2.pdf', pages: 10 },
  { id: 'gastro-lec-13', title: 'Lec 13: Colorectal Cancer & Polyps', pdf: '/lectures/Gastroenterology/13-colorectal-cancer-polyps.pdf', pages: 9 },
  { id: 'gastro-lec-14', title: 'Lec 14: Acute Upper GIT Bleeding', pdf: '/lectures/Gastroenterology/14-acute-upper-git-bleeding.pdf', pages: 6 },
  { id: 'gastro-lec-15', title: 'Lec 15: Pancreatic Diseases (Pancreatitis)', pdf: '/lectures/Gastroenterology/15-pancreatic-diseases-pancreatitis.pdf', pages: 14 },
  { id: 'gastro-lec-16', title: 'Lec 16: Acute Infectious Diarrhoea', pdf: '/lectures/Gastroenterology/16-acute-infectious-diarrhoea.pdf', pages: 7 },
];

const endocrinologyTopic: Topic = {
  ...topic('endocrinology', 'Endocrinology', 'الغدد الصماء'),
  count: endocrinologyLectures.length,
  duration: '7 lectures',
  lectures: endocrinologyLectures,
};

const gastroenterologyTopic: Topic = {
  ...topic('gastroenterology', 'Gastroenterology', 'أمراض الجهاز الهضمي'),
  count: gastroenterologyLectures.length,
  duration: '16 lectures',
  lectures: gastroenterologyLectures,
};

const internalMedicineTopics = [
  topic('cardiology', 'Cardiology', 'أمراض القلب'),
  topic('respiratory', 'Respiratory Medicine', 'الأمراض التنفسية'),
  gastroenterologyTopic,
  endocrinologyTopic,
  topic('nephrology', 'Nephrology', 'أمراض الكلى'),
  topic('infectious-diseases', 'Infectious Diseases', 'الأمراض الانتقالية'),
  topic('hematology', 'Hematology', 'أمراض الدم'),
  topic('rheumatology', 'Rheumatology', 'أمراض المفاصل والروماتيزم'),
  topic('neurology', 'Neurology', 'الأمراض العصبية'),
];

const surgeryTopics = [
  topic('general-surgery', 'General Surgery', 'الجراحة العامة'),
  topic('gastrointestinal-surgery', 'Gastrointestinal Surgery', 'جراحة الجهاز الهضمي'),
  topic('hepatobiliary-pancreatic-surgery', 'Hepatobiliary & Pancreatic Surgery', 'جراحة الكبد والطرق الصفراوية والبنكرياس'),
  topic('colorectal-surgery', 'Colorectal Surgery', 'جراحة القولون والمستقيم'),
  topic('breast-surgery', 'Breast Surgery', 'جراحة الثدي'),
  topic('endocrine-surgery', 'Endocrine Surgery', 'جراحة الغدد الصماء'),
  topic('vascular-surgery', 'Vascular Surgery', 'جراحة الأوعية الدموية'),
  topic('urology', 'Urology', 'جراحة المسالك البولية'),
  topic('orthopedic-surgery', 'Orthopedic Surgery', 'جراحة العظام'),
  topic('neurosurgery', 'Neurosurgery', 'جراحة الأعصاب'),
  topic('cardiothoracic-surgery', 'Cardiothoracic Surgery', 'جراحة القلب والصدر'),
  topic('plastic-reconstructive-surgery', 'Plastic & Reconstructive Surgery', 'الجراحة التجميلية والترميمية'),
  topic('pediatric-surgery', 'Pediatric Surgery', 'جراحة الأطفال'),
  topic('anesthesia', 'Anesthesia', 'التخدير'),
];

const pediatricsTopics = [
  topic('neonatology', 'Neonatology', 'حديثو الولادة'),
  topic('growth-development', 'Growth & Development', 'النمو والتطور'),
  topic('pediatric-infectious-diseases', 'Pediatric Infectious Diseases', 'الأمراض الانتقالية عند الأطفال'),
  topic('pediatric-respiratory', 'Pediatric Respiratory', 'الجهاز التنفسي للأطفال'),
  topic('pediatric-gastroenterology', 'Pediatric Gastroenterology', 'أمراض الجهاز الهضمي للأطفال'),
  topic('pediatric-cardiology', 'Pediatric Cardiology', 'أمراض القلب عند الأطفال'),
  topic('pediatric-neurology', 'Pediatric Neurology', 'الأمراض العصبية عند الأطفال'),
  topic('pediatric-nephrology', 'Pediatric Nephrology', 'أمراض الكلى عند الأطفال'),
  topic('pediatric-hematology', 'Pediatric Hematology', 'أمراض الدم عند الأطفال'),
  topic('pediatric-endocrinology', 'Pediatric Endocrinology', 'الغدد الصماء عند الأطفال'),
  topic('pediatric-rheumatology', 'Pediatric Rheumatology', 'أمراض الروماتيزم عند الأطفال'),
  topic('pediatric-emergency-medicine', 'Pediatric Emergency Medicine', 'طب طوارئ الأطفال'),
  topic('pediatric-genetics', 'Pediatric Genetics', 'الوراثة عند الأطفال'),
];

const obstetricsGynecologyTopics = [
  topic('antenatal-care', 'Antenatal Care', 'رعاية الحوامل', 'Obstetrics'),
  topic('normal-labour', 'Normal Labour', 'المخاض الطبيعي', 'Obstetrics'),
  topic('abnormal-labour', 'Abnormal Labour', 'المخاض غير الطبيعي', 'Obstetrics'),
  topic('high-risk-pregnancy', 'High-Risk Pregnancy', 'الحمل عالي الخطورة', 'Obstetrics'),
  topic('hypertensive-disorders-pregnancy', 'Hypertensive Disorders of Pregnancy', 'اضطرابات ارتفاع الضغط في الحمل', 'Obstetrics'),
  topic('diabetes-in-pregnancy', 'Diabetes in Pregnancy', 'السكري في الحمل', 'Obstetrics'),
  topic('obstetric-hemorrhage', 'Obstetric Hemorrhage', 'النزف التوليدي', 'Obstetrics'),
  topic('general-gynecology', 'General Gynecology', 'أمراض النسائية العامة', 'Gynecology'),
  topic('infertility', 'Infertility', 'العقم', 'Gynecology'),
  topic('gynecological-oncology', 'Gynecological Oncology', 'أورام النسائية', 'Gynecology'),
  topic('urogynecology', 'Urogynecology', 'أمراض المسالك البولية النسائية', 'Gynecology'),
];

const priorityTopicIds = new Set([
  'cardiology', 'infectious-diseases', 'general-surgery', 'anesthesia',
  'neonatology', 'pediatric-emergency-medicine', 'antenatal-care', 'obstetric-hemorrhage',
]);

const subjects: Subject[] = [
  {
    id: 'medicine', title: 'الباطنية', english: 'Internal Medicine', accent: 'navy', icon: '🫀',
    description: 'منهج سريري متكامل لفهم التشخيص والتدبير',
    topics: { theory: internalMedicineTopics, clinical: internalMedicineTopics },
  },
  {
    id: 'surgery', title: 'الجراحة', english: 'Surgery', accent: 'green', icon: '🔪',
    description: 'خطوات عملية مرتبة من التقييم إلى غرفة العمليات',
    topics: { theory: surgeryTopics, clinical: surgeryTopics },
  },
  {
    id: 'pediatrics', title: 'طب الأطفال', english: 'Pediatrics', accent: 'orange', icon: '👶',
    description: 'مراجعة واضحة للنمو، الأمراض الشائعة، والإنعاش',
    topics: { theory: pediatricsTopics, clinical: pediatricsTopics },
  },
  {
    id: 'obgyn', title: 'النسائية والتوليد', english: 'Obstetrics & Gynecology', accent: 'purple', icon: '🤰',
    description: 'من رعاية الحمل إلى الحالات النسائية الشائعة',
    topics: { theory: obstetricsGynecologyTopics, clinical: obstetricsGynecologyTopics },
  },
];

const accentMap: Record<Accent, { color: string; soft: string; label: string }> = {
  navy: { color: '#183b56', soft: '#e5eef4', label: 'الباطنية' },
  green: { color: '#26735f', soft: '#e4f1eb', label: 'الجراحة' },
  orange: { color: '#c96e34', soft: '#fbeade', label: 'الأطفال' },
  purple: { color: '#74558e', soft: '#eee7f4', label: 'النسائية والتوليد' },
};

const pdfUrl = 'https://apps.who.int/iris/bitstream/handle/10665/44102/9789241548303_eng.pdf';
const storageKey = 'stagier-sixth-stage-state';
type StudyState = { completed: string[]; favorites: string[]; topicProgress: Record<string, number> };

function readState(): StudyState {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) as StudyState : { completed: [], favorites: [], topicProgress: {} };
  } catch { return { completed: [], favorites: [], topicProgress: {} }; }
}

function useStudyState() {
  const [state, setState] = useState<StudyState>(readState);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(state)); }, [state]);
  const toggle = (key: 'completed' | 'favorites', id: string) => setState((s) => ({
    ...s, [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : [...s[key], id],
  }));
  const markProgress = (id: string, progress: number) => setState((s) => ({
    ...s, topicProgress: { ...s.topicProgress, [id]: progress },
  }));
  return { state, toggle, markProgress };
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="app-shell">
    <header className="sticky top-0 z-30 border-b border-[#E5EAF0] bg-white">
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '8px 16px', direction: 'ltr' }}>
        <button type="button" style={{ background: 'none', border: 'none', fontSize: '24px', color: '#0F2942', cursor: 'pointer', lineHeight: 1 }} data-testid="button-mobile-menu" aria-label="فتح القائمة">☰</button>
        <div style={{ flex: 1 }} aria-hidden="true" />
        <Link href="/" data-testid="link-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', direction: 'rtl' }}>
          <img className="brand-badge" src="/logo.png" alt="شعار ستاجير" style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '12px', objectFit: 'cover', display: 'block', boxShadow: '0 4px 10px rgba(15, 41, 66, 0.15)' }} data-testid="img-brand-logo" />
          <img src="/brand_text.png" alt="ستاجير - كل ما تحتاجه في الطب" style={{ height: '40px', width: 'auto', maxWidth: '180px', objectFit: 'contain', display: 'block' }} data-testid="img-brand-text" />
        </Link>
      </div>
    </header>
    <main>{children}</main>
    <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 hidden items-center justify-around border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/.96)] px-3 py-3 shadow-[0_-10px_30px_hsl(213_30%_20%/.08)] backdrop-blur-lg">
      <Link href="/" data-testid="mobile-link-home" className="flex min-w-[72px] flex-col items-center gap-1 text-xs font-bold text-[hsl(var(--primary))]"><HomeIcon size={19} />الرئيسية</Link>
      <Link href="/subjects" data-testid="mobile-link-subjects" className="flex min-w-[72px] flex-col items-center gap-1 text-xs font-bold text-[hsl(var(--muted-foreground))]"><BookOpen size={19} />المواد</Link>
      <Link href="/review" data-testid="mobile-link-review" className="flex min-w-[72px] flex-col items-center gap-1 text-xs font-bold text-[hsl(var(--muted-foreground))]"><ClipboardCheck size={19} />مراجعتي</Link>
    </nav>
  </div>;
}

function Breadcrumbs({ items }: { items: { title: string; href?: string }[] }) {
  return <div className="mb-7 flex flex-wrap items-center gap-2 text-xs font-bold text-[hsl(var(--muted-foreground))]" data-testid="breadcrumbs">
    <Link href="/" className="transition hover:text-[hsl(var(--primary))]" data-testid="breadcrumb-home">الرئيسية</Link>
    {items.map((item, i) => <span className="flex items-center gap-2" key={`${item.title}-${i}`}><ChevronLeft size={14} />{item.href ? <Link href={item.href} className="transition hover:text-[hsl(var(--primary))]" data-testid={`breadcrumb-${i}`}>{item.title}</Link> : <span className="text-[hsl(var(--foreground))]">{item.title}</span>}</span>)}
  </div>;
}

function Home() {
  const { state } = useStudyState();
  const completed = state.completed.length;
  const totalTopics = subjects.reduce((sum, s) => sum + s.topics.theory.length + s.topics.clinical.length, 0);
  const percent = Math.round((completed / totalTopics) * 100);
  return <Shell><div className="mx-auto max-w-[1240px] px-5 pb-16 pt-9 lg:px-8 lg:pt-14">
    <section className="relative overflow-hidden rounded-[28px] bg-[hsl(var(--sidebar))] px-6 py-9 text-[hsl(var(--sidebar-foreground))] shadow-xl shadow-[hsl(213_42%_18%/.13)] md:px-12 md:py-12">
      <div className="absolute -left-20 -top-28 h-72 w-72 rounded-full border-[30px] border-[hsl(var(--sidebar-primary)/.13)]" /><div className="absolute -bottom-36 right-1/3 h-80 w-80 rounded-full border-[38px] border-[hsl(var(--accent)/.08)]" />
      <div className="relative max-w-2xl page-in">
        <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[hsl(var(--sidebar-primary))]"><span className="h-2 w-2 rounded-full bg-[hsl(var(--sidebar-primary))]" />مساحتك الهادئة للمراجعة</div>
        <h1 className="display-font max-w-xl text-3xl font-bold leading-[1.7] md:text-5xl">كل ما تحتاجه للمرحلة السادسة، <span className="text-[hsl(var(--sidebar-primary))]">في مكان واحد.</span></h1>
        <p className="mt-5 max-w-lg text-base leading-8 text-[hsl(var(--sidebar-foreground)/.7)]">رتّب معلوماتك، راجع سريرياً، واختبر فهمك — بخطوات صغيرة تقرّبك من يوم التخرج.</p>
        <Link href="/subjects" data-testid="link-start-learning" className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[hsl(var(--sidebar-primary))] px-5 py-3.5 text-sm font-bold text-[hsl(var(--sidebar-primary-foreground))] shadow-lg shadow-[hsl(177_44%_54%/.18)] transition hover:-translate-y-0.5"><BookOpen size={18} />ابدأ المراجعة <ArrowLeft size={17} /></Link>
      </div>
      <div className="absolute bottom-10 left-12 hidden w-52 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:block"><div className="mb-3 flex items-center justify-between text-xs text-white/60"><span>تقدمك الكلي</span><span className="font-bold text-[hsl(var(--sidebar-primary))]">{percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="progress-bar h-full rounded-full bg-[hsl(var(--sidebar-primary))]" style={{ width: `${Math.max(percent, 4)}%` }} /></div><p className="mt-3 text-xs text-white/55">{completed} موضوع مكتمل من أصل {totalTopics}</p></div>
    </section>
    <section className="mt-10">
      <div className="mb-5 flex items-end justify-between"><div><p className="mb-2 text-xs font-bold tracking-widest text-[hsl(var(--primary))]">خطة المرحلة</p><h2 className="display-font text-2xl font-bold">اختر مسارك اليوم</h2></div><Link href="/subjects" data-testid="link-see-all-subjects" className="flex items-center gap-1 text-sm font-bold text-[hsl(var(--primary))]">كل المواد <ArrowLeft size={16} /></Link></div>
      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} state={state} />)}</div>
    </section>
    <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.5fr]">
      <div className="ink-card rounded-2xl p-6" data-testid="card-progress-summary"><div className="mb-5 flex items-center justify-between"><h3 className="display-font text-lg font-bold">لمحة عن تقدمك</h3><ClipboardCheck size={21} className="text-[hsl(var(--primary))]" /></div><div className="flex items-end gap-3"><strong className="display-font text-4xl text-[hsl(var(--primary))]">{percent}%</strong><span className="mb-1 text-sm text-[hsl(var(--muted-foreground))]">من الخطة الكاملة</span></div><div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[hsl(var(--secondary))]"><div className="progress-bar h-full rounded-full bg-[hsl(var(--primary))]" style={{ width: `${Math.max(percent, 3)}%` }} /></div><p className="mt-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]">الاستمرارية أهم من السرعة. موضوع واحد اليوم يصنع فرقاً.</p></div>
      <div className="relative overflow-hidden rounded-2xl bg-[hsl(29_85%_57%/.14)] p-6 md:p-7"><div className="absolute -left-4 -top-8 h-32 w-32 rounded-full bg-[hsl(29_85%_57%/.13)]" /><div className="relative flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><Lightbulb size={22} /></div><div><p className="mb-1 text-xs font-bold tracking-widest text-[hsl(29_55%_36%)]">تذكير اليوم</p><h3 className="display-font text-xl font-bold leading-9">افهم الحالة، ثم احفظ التفاصيل.</h3><p className="mt-2 max-w-lg text-sm leading-7 text-[hsl(30_32%_35%)]">ابدأ بمراجعة المفاهيم الأساسية، واستخدم الأسئلة لتتأكد من قدرتك على تطبيقها سريرياً.</p></div></div></div>
    </section>
  </div></Shell>;
}

function SubjectCard({ subject, state }: { subject: Subject; state: StudyState }) {
  const all = subject.topics.theory;
  const done = all.filter((topic) => state.completed.includes(`${subject.id}-${topic.id}`)).length;
  const colors = accentMap[subject.accent];
  return <Link href={`/subject/${subject.id}`} data-testid={`card-subject-${subject.id}`} className="ink-card subject-card lift group relative overflow-hidden rounded-2xl" style={{ borderLeftColor: colors.color }}>
    <div className="p-5"><span className="topics-badge absolute left-4 top-4" style={{ color: colors.color, background: colors.soft }}>topics {all.length}</span><div className="mb-9 flex items-start justify-between"><span className="subject-emoji" aria-hidden="true">{subject.icon}</span><span className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold" style={{ color: colors.color, background: colors.soft }}>{subject.title.slice(0, 1)}</span></div><div className="subject-title-stack"><h3 className="subject-english">{subject.english}</h3><p className="subject-arabic mt-1">{subject.title}</p></div><p className="mt-4 min-h-10 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{subject.description}</p><div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-xs"><span className="font-bold text-[hsl(var(--muted-foreground))]">{done ? `${done} مكتمل` : 'ابدأ الآن'}</span><span className="font-bold" style={{ color: colors.color }}>فتح المادة <ArrowLeft className="mr-1 inline-block transition group-hover:-translate-x-1" size={14} /></span></div></div>
  </Link>;
}

function SubjectsPage() {
  const { state } = useStudyState();
  return <Shell><div className="mx-auto max-w-[1240px] px-5 pb-16 pt-9 lg:px-8 lg:pt-14"><Breadcrumbs items={[{ title: 'المواد' }]} /><div className="mb-9 max-w-xl"><p className="mb-2 text-xs font-bold tracking-widest text-[hsl(var(--primary))]">المنهج الكامل</p><h1 className="display-font text-3xl font-bold">أربع محطات، طريق واحد.</h1><p className="mt-4 leading-8 text-[hsl(var(--muted-foreground))]">اختر المادة التي تريد مراجعتها، ثم حدّد إن كنت تريد بناء الأساس النظري أو التدريب على الجانب السريري.</p></div><div className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} state={state} />)}</div></div></Shell>;
}

function ReviewPage() {
  const { state } = useStudyState();
  const savedTopics = subjects.flatMap((subject) => subject.topics.theory.map((topic) => ({ subject, topic, key: `${subject.id}-${topic.id}` }))).filter((item) => state.completed.includes(item.key) || state.favorites.includes(item.key));
  const completedCount = state.completed.length;
  return <Shell><div className="mx-auto max-w-[1040px] px-5 pb-16 pt-9 lg:px-8 lg:pt-14"><Breadcrumbs items={[{ title: 'مراجعتي' }]} /><div className="mb-8"><p className="mb-2 text-xs font-bold tracking-widest text-[hsl(var(--primary))]">مساحتك الشخصية</p><h1 className="display-font text-3xl font-bold">مراجعتك، كما تركتها.</h1><p className="mt-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">ستجد هنا الموضوعات التي حفظتها أو أنهيتها، لتعود إليها دون بحث.</p></div><div className="mb-8 grid gap-4 sm:grid-cols-3"><div className="ink-card rounded-2xl p-5"><span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">مكتمل</span><strong className="display-font mt-2 block text-3xl text-[hsl(158_46%_35%)]">{completedCount}</strong></div><div className="ink-card rounded-2xl p-5"><span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">محفوظ</span><strong className="display-font mt-2 block text-3xl text-[hsl(var(--accent))]">{state.favorites.length}</strong></div><div className="ink-card rounded-2xl p-5"><span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">قيد المراجعة</span><strong className="display-font mt-2 block text-3xl text-[hsl(var(--primary))]">{Object.keys(state.topicProgress).length}</strong></div></div>{savedTopics.length === 0 ? <div className="ink-card rounded-2xl p-12 text-center"><Bookmark className="mx-auto mb-3 text-[hsl(var(--muted-foreground))]" size={29} /><h2 className="display-font text-xl font-bold">لم تحفظ أي موضوع بعد</h2><p className="mt-2 text-sm leading-7 text-[hsl(var(--muted-foreground))]">أثناء المراجعة، استخدم زر الحفظ لتعود إلى الموضوع هنا.</p><Link href="/subjects" data-testid="link-review-browse" className="mt-5 inline-flex rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))]">تصفح المواد</Link></div> : <div className="stagger space-y-3">{savedTopics.map(({ subject, topic, key }) => <Link key={key} href={`/subject/${subject.id}/theory/topic/${topic.id}`} data-testid={`review-topic-${key}`} className="ink-card lift flex items-center gap-4 rounded-2xl p-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold" style={{ color: accentMap[subject.accent].color, background: accentMap[subject.accent].soft }}>{subject.title.slice(0, 1)}</span><span className="min-w-0 flex-1"><span className="topic-english block truncate">{topic.en}</span><span className="topic-arabic mt-1 block truncate">{topic.title}</span><span className="mt-1 block text-xs text-[hsl(var(--muted-foreground))]">{subject.english} · {subject.title}</span></span><span className="flex items-center gap-1 text-xs font-bold text-[hsl(var(--muted-foreground))]">{state.completed.includes(key) ? <><Check size={15} className="text-[hsl(158_46%_35%)]" />مكتمل</> : <><Bookmark size={15} className="text-[hsl(var(--accent))]" />محفوظ</>}</span><ArrowLeft size={18} className="text-[hsl(var(--muted-foreground))]" /></Link>)}</div>}</div></Shell>;
}

function SubjectPage() {
  const params = useParams<{ subjectId: string }>();
  const subject = subjects.find((item) => item.id === params.subjectId) ?? subjects[0];
  const colors = accentMap[subject.accent];
  return <Shell><div className="mx-auto max-w-[1040px] px-5 pb-16 pt-9 lg:px-8 lg:pt-14"><Breadcrumbs items={[{ title: 'المواد', href: '/subjects' }, { title: subject.title }]} /><div className="page-in overflow-hidden rounded-[26px] p-7 md:p-10" style={{ background: colors.soft }}><div className="flex flex-wrap items-start justify-between gap-5"><div><span className="subject-emoji inline-block" aria-hidden="true">{subject.icon}</span><h1 className="subject-english mt-4 text-3xl md:text-4xl">{subject.english}</h1><p className="subject-arabic mt-2">{subject.title}</p><p className="mt-3 max-w-lg text-sm leading-7 text-[hsl(var(--muted-foreground))]">{subject.description}</p></div><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--card)/.7)] text-xl font-bold shadow-sm" style={{ color: colors.color }}>{subject.title.slice(0, 1)}</div></div></div><div className="mt-9"><p className="mb-2 text-xs font-bold tracking-widest text-[hsl(var(--primary))]">اختر نوع المراجعة</p><h2 className="display-font text-2xl font-bold">من أين نبدأ؟</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><BranchCard subject={subject} branch="theory" /><BranchCard subject={subject} branch="clinical" /></div></div></div></Shell>;
}

function BranchCard({ subject, branch }: { subject: Subject; branch: Branch }) {
  const theory = branch === 'theory';
  const colors = accentMap[subject.accent];
  return <Link href={`/subject/${subject.id}/${branch}`} data-testid={`card-branch-${branch}`} className="selection-card ink-card group flex items-center justify-between rounded-2xl p-6 hover:border-[hsl(var(--primary)/.35)]"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ color: colors.color, background: colors.soft }}>{theory ? <BookOpen size={24} /> : <Stethoscope size={24} />}</span><div><h3 className="subject-english text-xl">{theory ? 'Theoretical' : 'Clinical'}</h3><p className="subject-arabic mt-1">{theory ? 'نظري' : 'سريري'}</p><p className="mt-3 text-xs font-semibold text-[hsl(var(--muted-foreground))]">{theory ? 'Lectures · Explanation · Summaries · Hints · MCQs · Review' : 'PDFs · Practical Application'}</p><span className="mt-3 inline-block text-xs font-bold" style={{ color: colors.color }}>{subject.topics[branch].length} topics</span></div></div><ArrowLeft className="text-[hsl(var(--muted-foreground))] transition group-hover:-translate-x-1" size={21} /></Link>;
}

function TopicsPage() {
  const params = useParams<{ subjectId: string; branchId: Branch }>();
  const subject = subjects.find((item) => item.id === params.subjectId) ?? subjects[0];
  const branch = params.branchId === 'clinical' ? 'clinical' : 'theory';
  const colors = accentMap[subject.accent];
  const [query, setQuery] = useState('');
  const [onlyImportant, setOnlyImportant] = useState(false);
  const { state } = useStudyState();
  const topics = useMemo(() => subject.topics[branch].filter((topic) => `${topic.title} ${topic.en}`.toLowerCase().includes(query.toLowerCase()) && (!onlyImportant || topic.tag || priorityTopicIds.has(topic.id))), [branch, onlyImportant, query, subject]);
  return <Shell><div className="mx-auto max-w-[1040px] px-5 pb-16 pt-9 lg:px-8 lg:pt-14"><Breadcrumbs items={[{ title: 'المواد', href: '/subjects' }, { title: subject.title, href: `/subject/${subject.id}` }, { title: branch === 'theory' ? 'نظري' : 'سريري' }]} /><div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest" style={{ color: colors.color }}><span className="h-2 w-2 rounded-full" style={{ background: colors.color }} />{branch === 'theory' ? 'THEORETICAL' : 'CLINICAL'}</div><h1 className="subject-english text-3xl">{subject.english}</h1><p className="subject-arabic mt-2">{subject.title}</p><p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">اختر موضوعاً لفتح محاضراته وملخصاته وأسئلته.</p></div><div className="text-left text-xs font-bold text-[hsl(var(--muted-foreground))]"><span className="text-2xl font-bold text-[hsl(var(--foreground))]">{topics.length}</span> / {subject.topics[branch].length} topics</div></div><div className="mb-6 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} data-testid="input-topic-search" placeholder="ابحث عن موضوع..." className="h-12 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pr-12 pl-4 text-sm shadow-sm placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.13)]" /></label><button type="button" onClick={() => setOnlyImportant((value) => !value)} data-testid="button-filter-important" className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-bold transition ${onlyImportant ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/.4)]'}`}><ListFilter size={17} />المهم فقط</button></div><div className="stagger space-y-3">{topics.map((item, index) => <Fragment key={item.id}>{item.group && (index === 0 || topics[index - 1]?.group !== item.group) && <div className="topic-group-label">{item.group}</div>}<TopicRow topic={item} subject={subject} branch={branch} index={index} done={state.completed.includes(`${subject.id}-${item.id}`)} progress={state.topicProgress[`${subject.id}-${item.id}`] ?? 0} /></Fragment>)}</div>{topics.length === 0 && <div className="ink-card rounded-2xl p-12 text-center"><Search className="mx-auto mb-3 text-[hsl(var(--muted-foreground))]" size={28} /><h3 className="display-font text-lg font-bold">لم نعثر على هذا الموضوع</h3><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">جرّب كلمة أخرى أو ألغِ الفلتر.</p><button type="button" onClick={() => { setQuery(''); setOnlyImportant(false); }} data-testid="button-clear-filter" className="mt-5 text-sm font-bold text-[hsl(var(--primary))]">مسح البحث</button></div>}</div></Shell>;
}

function TopicRow({ topic, subject, branch, index, done, progress }: { topic: Topic; subject: Subject; branch: Branch; index: number; done: boolean; progress: number }) {
  const colors = accentMap[subject.accent];
  return <Link href={`/subject/${subject.id}/${branch}/topic/${topic.id}`} data-testid={`card-topic-${topic.id}`} className="ink-card lift group flex items-center gap-4 rounded-2xl p-4 md:p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold" style={{ background: colors.soft, color: colors.color }}>{String(index + 1).padStart(2, '0')}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><div className="min-w-0"><h2 className="topic-english truncate">{topic.en}</h2><p className="topic-arabic mt-1 truncate">{topic.title}</p></div>{topic.tag && <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ color: colors.color, background: colors.soft }}>{topic.tag}</span>}{done && <span className="flex items-center gap-1 text-[10px] font-bold text-[hsl(158_46%_35%)]"><Check size={13} />مكتمل</span>}</div><div className="mt-3 flex items-center gap-3 text-[11px] text-[hsl(var(--muted-foreground))]"><span className="flex items-center gap-1"><FileText size={13} />{topic.count} محاضرة</span><span className="flex items-center gap-1"><Clock3 size={13} />{topic.duration}</span>{progress > 0 && <span className="font-bold" style={{ color: colors.color }}>{progress}% مراجعة</span>}</div></div><ArrowLeft size={20} className="shrink-0 text-[hsl(var(--muted-foreground))] transition group-hover:-translate-x-1" /></Link>;
}

function TopicPage() {
  const params = useParams<{ subjectId: string; branchId: Branch; topicId: string }>();
  const subject = subjects.find((item) => item.id === params.subjectId) ?? subjects[0];
  const branch = params.branchId === 'clinical' ? 'clinical' : 'theory';
  const topic = [...subject.topics.theory, ...subject.topics.clinical].find((item) => item.id === params.topicId) ?? subject.topics[branch][0];
  const topicKey = `${subject.id}-${topic.id}`;
  const { state, toggle, markProgress } = useStudyState();
  const [tab, setTab] = useState<Tab>('lectures');
  return <Shell><div className="mx-auto max-w-[1160px] px-5 pb-16 pt-8 lg:px-8 lg:pt-12"><Breadcrumbs items={[{ title: 'المواد', href: '/subjects' }, { title: subject.title, href: `/subject/${subject.id}` }, { title: branch === 'theory' ? 'نظري' : 'سريري', href: `/subject/${subject.id}/${branch}` }, { title: topic.title }]} /><div className="mb-7 flex flex-wrap items-start justify-between gap-4"><div><h1 className="topic-english text-2xl md:text-3xl">{topic.en}</h1><p className="topic-arabic mt-2">{topic.title}</p><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">مراجعة مركّزة · {topic.count} محاضرة</p></div><div className="flex gap-2"><button type="button" onClick={() => toggle('favorites', topicKey)} data-testid="button-favorite-topic" aria-label="حفظ الموضوع" className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${state.favorites.includes(topicKey) ? 'border-[hsl(29_85%_57%/.4)] bg-[hsl(29_85%_57%/.12)] text-[hsl(30_55%_34%)]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))]'}`}><Bookmark size={17} fill={state.favorites.includes(topicKey) ? 'currentColor' : 'none'} />{state.favorites.includes(topicKey) ? 'محفوظ' : 'حفظ'}</button><button type="button" onClick={() => toggle('completed', topicKey)} data-testid="button-complete-topic" className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold transition ${state.completed.includes(topicKey) ? 'bg-[hsl(158_46%_35%)] text-white' : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'}`}><Check size={17} />{state.completed.includes(topicKey) ? 'مكتمل' : 'أكملت الموضوع'}</button></div></div><div className="mb-7 rounded-2xl bg-[hsl(var(--secondary)/.7)] p-4"><div className="mb-2 flex items-center justify-between text-xs font-bold"><span>تقدم المراجعة</span><span style={{ color: accentMap[subject.accent].color }}>{state.topicProgress[topicKey] ?? 0}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--card))]"><div className="progress-bar h-full rounded-full" style={{ width: `${state.topicProgress[topicKey] ?? 0}%`, background: accentMap[subject.accent].color }} /></div></div><TopicTabs tab={tab} setTab={setTab} /><div className="page-in mt-6">{tab === 'lectures' && <Lectures topic={topic} topicKey={topicKey} completedIds={state.completed} onComplete={(lectureId) => toggle('completed', `lecture:${topicKey}:${lectureId}`)} />}{tab === 'explanation' && <Explanation topic={topic} />}{tab === 'summaries' && <Summaries topic={topic} />}{tab === 'hints' && <Hints />}{tab === 'mcqs' && <Quiz topicKey={topicKey} onProgress={(value) => markProgress(topicKey, value)} />}{tab === 'review' && <Review topic={topic} completed={state.completed.includes(topicKey)} onComplete={() => toggle('completed', topicKey)} />}</div></div></Shell>;
}

function TopicTabs({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: 'lectures', label: 'Lectures', icon: <PlayCircle size={16} /> }, { id: 'explanation', label: 'Explanation', icon: <Lightbulb size={16} /> }, { id: 'summaries', label: 'Summaries', icon: <FileText size={16} /> }, { id: 'hints', label: 'Hints', icon: <CircleHelp size={16} /> }, { id: 'mcqs', label: 'MCQs', icon: <ClipboardCheck size={16} /> }, { id: 'review', label: 'Review', icon: <Star size={16} /> },
  ];
  return <div className="no-scrollbar flex overflow-x-auto rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5" role="tablist" data-testid="topic-tabs">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)} key={item.id} data-testid={`tab-${item.id}`} className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition md:flex-1 md:justify-center ${tab === item.id ? 'bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] shadow-sm' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]'}`}>{item.icon}{item.label}</button>)}</div>;
}

function Lectures({ topic, topicKey, completedIds, onComplete }: { topic: Topic; topicKey: string; completedIds: string[]; onComplete: (lectureId: string) => void }) {
  const lectures = topic.lectures ?? [];
  const [selectedId, setSelectedId] = useState(lectures[0]?.id ?? '');
  useEffect(() => { setSelectedId(lectures[0]?.id ?? ''); }, [topic.id]);
  const selectedLecture = lectures.find((lecture) => lecture.id === selectedId) ?? null;
  const selectedCompletionKey = selectedLecture ? `lecture:${topicKey}:${selectedLecture.id}` : '';
  const selectedCompleted = selectedCompletionKey ? completedIds.includes(selectedCompletionKey) : false;

  if (topic.id === 'gastroenterology') {
    return <GastroLectures topic={topic} topicKey={topicKey} completedIds={completedIds} onComplete={onComplete} />;
  }

  return <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
    <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(213_42%_18%)] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-white">
        <div className="flex items-center gap-2 text-sm font-bold"><FileText size={17} className="text-[hsl(var(--sidebar-primary))]" />PDF Viewer</div>
        <span className="text-[10px] text-white/55">{selectedLecture?.title ?? topic.en}</span>
      </div>
      {selectedLecture ? <div>
        <iframe key={selectedLecture.id} title={selectedLecture.title} src={`${selectedLecture.pdf}#page=${selectedLecture.page ?? 1}`} className="h-[460px] w-full bg-white md:h-[540px]" data-testid="iframe-lecture-pdf" />
        <div className="flex flex-wrap gap-3 border-t border-white/10 p-4">
          <a href={selectedLecture.pdf} download data-testid="link-download-pdf" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--sidebar-primary))] px-4 py-3 text-xs font-bold text-[hsl(var(--sidebar-primary-foreground))] transition hover:-translate-y-0.5 sm:flex-none"><Download size={16} /><span className="text-right"><span className="block">Download PDF</span><span className="mt-0.5 block text-[10px] opacity-70">تحميل المحاضرة</span></span></a>
          <button type="button" onClick={() => onComplete(selectedLecture.id)} aria-pressed={selectedCompleted} data-testid={`button-complete-lecture-${selectedLecture.id}`} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition sm:flex-none ${selectedCompleted ? 'border-[hsl(158_46%_35%)] bg-[hsl(158_46%_35%)] text-white' : 'border-white/20 bg-white/10 text-white hover:bg-white/15'}`}><Check size={16} /><span className="text-right"><span className="block">Mark as Completed</span><span className="mt-0.5 block text-[10px] opacity-70">{selectedCompleted ? 'تمت القراءة' : 'أكملت القراءة'}</span></span></button>
        </div>
      </div> : <div className="pdf-placeholder flex min-h-[430px] flex-col items-center justify-center px-6 text-center text-white md:min-h-[540px]" data-testid="pdf-viewer-placeholder"><span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[hsl(var(--sidebar-primary)/.35)] bg-[hsl(var(--sidebar-primary)/.12)] text-[hsl(var(--sidebar-primary))]"><FileText size={30} /></span><h3 className="text-xl font-bold">PDF preview</h3><p className="mt-2 max-w-sm text-sm leading-7 text-white/65">Lecture materials for this topic will appear here.</p><a href={pdfUrl} target="_blank" rel="noreferrer" data-testid="link-open-pdf-fallback" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--sidebar-primary))] px-4 py-3 text-sm font-bold text-[hsl(var(--sidebar-primary-foreground))]">فتح الملف <ArrowLeft size={16} /></a></div>}
    </div>
    {lectures.length > 0 ? <aside className="ink-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold tracking-widest text-[hsl(var(--primary))]">{topic.en.toUpperCase()}</p><h2 className="display-font mt-2 text-lg font-bold">Lecture list</h2></div><span className="rounded-full bg-[hsl(var(--secondary))] px-3 py-2 text-xs font-bold">{lectures.length}</span></div>
      <div className="space-y-2">{lectures.map((lecture, index) => { const done = completedIds.includes(`lecture:${topicKey}:${lecture.id}`); const active = selectedLecture?.id === lecture.id; return <button type="button" key={lecture.id} onClick={() => setSelectedId(lecture.id)} data-testid={`card-lecture-${lecture.id}`} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-right transition ${active ? 'border-[hsl(var(--primary)/.45)] bg-[hsl(var(--secondary)/.75)]' : 'border-transparent hover:border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary)/.45)]'}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--secondary))] font-mono text-xs font-bold text-[hsl(var(--primary))]">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{lecture.title}</span><span className="mt-1 block text-[11px] text-[hsl(var(--muted-foreground))]">{lecture.pages} pages {done && '· مكتملة'}</span></span>{done && <Check size={16} className="shrink-0 text-[hsl(158_46%_35%)]" />}</button>; })}</div>
    </aside> : <aside className="ink-card rounded-2xl p-6"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><BookOpen size={20} /></span><h2 className="display-font mt-5 text-lg font-bold">طريقة المراجعة</h2><ol className="mt-4 space-y-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]"><li className="flex gap-3"><b className="font-mono text-[hsl(var(--primary))]">01</b><span>اقرأ العناوين أولاً لتكوين خريطة ذهنية.</span></li><li className="flex gap-3"><b className="font-mono text-[hsl(var(--primary))]">02</b><span>دوّن العلامات الفارقة والأرقام المهمة.</span></li><li className="flex gap-3"><b className="font-mono text-[hsl(var(--primary))]">03</b><span>اختبر نفسك من تبويب الأسئلة.</span></li></ol></aside>}
  </div>;
}

type GastroNoteBox = { label: string; title: string; items: string[]; tone?: 'teal' | 'sand' | 'navy' };
type GastroNote = {
  kicker: string;
  summary: string;
  objectives: string[];
  boxes: GastroNoteBox[];
  takeaway: string;
};

const gastroNotes: Record<string, GastroNote> = {
  'gastro-lec-01': {
    kicker: 'Foundation · functional anatomy',
    summary: 'A working map of the gastrointestinal tract: how structure, motility, secretion, digestion, and absorption cooperate from mouth to colon.',
    objectives: ['Trace the wall layers and enteric nervous system.', 'Relate each segment to its dominant function.', 'Recognise the vascular and lymphatic routes that matter clinically.'],
    boxes: [
      { label: '01', title: 'Route & roles', tone: 'teal', items: ['Stomach: reservoir, acid barrier, and initial protein digestion.', 'Small bowel: most digestion and nutrient absorption.', 'Colon: water recovery, fermentation, and stool storage.'] },
      { label: '02', title: 'Clinical anchor', tone: 'sand', items: ['Pain location follows embryologic origin and distension.', 'The mucosa renews rapidly, making it vulnerable to ischemia and cytotoxic injury.', 'Barrier failure turns a local problem into systemic inflammation.'] },
    ],
    takeaway: 'When a symptom is vague, first place it on the map: segment, layer, function, then likely mechanism.',
  },
  'gastro-lec-02': {
    kicker: 'Approach · investigations',
    summary: 'Choose investigations by the question you need answered, not by habit. Start with severity, anatomy, and the probability of changing management.',
    objectives: ['Separate screening, diagnosis, staging, and monitoring.', 'Match endoscopy, imaging, and laboratory tests to their strengths.', 'Interpret a test in the context of pre-test probability.'],
    boxes: [
      { label: '01', title: 'First pass', tone: 'teal', items: ['CBC, electrolytes, liver profile, inflammatory markers, and targeted stool tests frame urgency.', 'Endoscopy answers a mucosal question and permits biopsy or therapy.', 'Ultrasound, CT, and MRI answer different anatomical and complication questions.'] },
      { label: '02', title: 'Do not miss', tone: 'navy', items: ['Check haemodynamic stability before arranging a test.', 'A normal result does not erase a high-risk clinical picture.', 'Always ask: will this result change what I do today?'] },
    ],
    takeaway: 'The best investigation is the one that reduces uncertainty at the safest cost in time, risk, and delay.',
  },
  'gastro-lec-03': {
    kicker: 'Esophagus · motility and reflux',
    summary: 'GERD and achalasia can both produce dysphagia or chest discomfort, but their mechanisms and first-line pathways are fundamentally different.',
    objectives: ['Identify the reflux barrier and mechanisms of GERD.', 'Distinguish mechanical from motility-related dysphagia.', 'Recognise when endoscopy or manometry is required.'],
    boxes: [
      { label: '01', title: 'GERD pattern', tone: 'teal', items: ['Typical heartburn and regurgitation may respond to an empiric acid-suppression trial.', 'Alarm features—dysphagia, bleeding, weight loss, anaemia—move the patient to endoscopy.', 'Lifestyle measures support treatment but do not replace risk assessment.'] },
      { label: '02', title: 'Achalasia pattern', tone: 'sand', items: ['Failure of lower oesophageal sphincter relaxation causes progressive dysphagia to solids and liquids.', 'Barium swallow may show a bird-beak appearance; manometry confirms the diagnosis.', 'Treatment is aimed at disrupting the non-relaxing sphincter.'] },
    ],
    takeaway: 'Dysphagia to solids first suggests obstruction; dysphagia to solids and liquids from the start suggests a motility disorder.',
  },
  'gastro-lec-04': {
    kicker: 'Stomach · mucosal injury',
    summary: 'Gastritis is a pattern of mucosal inflammation, while H. pylori is a treatable cause with consequences that extend from dyspepsia to ulcer and malignancy risk.',
    objectives: ['Separate acute erosive injury from chronic gastritis.', 'Understand the H. pylori–ulcer–cancer relationship.', 'Use alarm features to guide endoscopic assessment.'],
    boxes: [
      { label: '01', title: 'Common drivers', tone: 'teal', items: ['NSAIDs weaken mucosal defence and can cause erosions or ulceration.', 'H. pylori changes the gastric environment and may persist silently.', 'Stress-related injury is mainly a concern in critically ill patients.'] },
      { label: '02', title: 'Practical plan', tone: 'navy', items: ['Test and treat H. pylori when the clinical context supports it.', 'Review NSAID exposure, bleeding risk, and acid suppression.', 'Confirm eradication when indicated rather than assuming treatment worked.'] },
    ],
    takeaway: 'Do not label every upper abdominal symptom as gastritis; identify the cause and the patient’s bleeding or cancer risk.',
  },
  'gastro-lec-05': {
    kicker: 'Small bowel · malabsorption',
    summary: 'Malabsorption is a syndrome, not a diagnosis. Localise the problem to digestion, mucosal uptake, transport, or lymphatic delivery.',
    objectives: ['Recognise the clinical pattern of malabsorption.', 'Build a focused differential for coeliac disease.', 'Use serology and biopsy in the correct sequence.'],
    boxes: [
      { label: '01', title: 'Clues', tone: 'teal', items: ['Weight loss, bulky stools, anaemia, low albumin, and vitamin deficiencies suggest impaired absorption.', 'Iron, folate, B12, calcium, and fat-soluble vitamins point toward extent and site.', 'A diet history is part of the diagnostic test.'] },
      { label: '02', title: 'Coeliac checkpoint', tone: 'sand', items: ['Test while the patient is still consuming gluten when possible.', 'Tissue transglutaminase IgA is paired with total IgA.', 'Duodenal biopsy and clinical response complete the diagnosis in the right context.'] },
    ],
    takeaway: 'The pattern of deficiency often tells you more about the affected bowel segment than the stool description alone.',
  },
  'gastro-lec-06': {
    kicker: 'Small bowel · bacterial overgrowth',
    summary: 'SIBO is a consequence of altered anatomy or motility. Treat the driver as well as the overgrowth, or recurrence is likely.',
    objectives: ['Recognise risk factors for stasis and bacterial proliferation.', 'Connect SIBO to bloating, diarrhoea, and nutrient deficiency.', 'Avoid mistaking a positive breath test for the whole diagnosis.'],
    boxes: [
      { label: '01', title: 'Why it happens', tone: 'teal', items: ['Blind loops, strictures, diverticula, and slow transit create bacterial reservoirs.', 'Bacteria consume nutrients and deconjugate bile acids.', 'B12 deficiency can occur with prolonged or severe disease.'] },
      { label: '02', title: 'Whipple disease', tone: 'navy', items: ['Think of it with weight loss, diarrhoea, arthralgia, lymphadenopathy, or neurological features.', 'Small-bowel biopsy with appropriate testing is central to diagnosis.', 'Antibiotic therapy must account for tissue and CNS penetration.'] },
    ],
    takeaway: 'Recurrent bloating deserves a mechanism-based assessment: motility, anatomy, medication, and diet all matter.',
  },
  'gastro-lec-07': {
    kicker: 'Functional bowel · IBS',
    summary: 'IBS is a disorder of gut–brain interaction diagnosed positively from a characteristic symptom pattern while screening for red flags.',
    objectives: ['Use recurrent abdominal pain and stool change to recognise IBS.', 'Identify alarm features and useful baseline tests.', 'Explain the role of diet, fibre, and gut-directed therapy.'],
    boxes: [
      { label: '01', title: 'Positive diagnosis', tone: 'teal', items: ['Pain related to defecation or associated with a change in stool frequency or form is central.', 'Bloating and urgency are common but not specific.', 'A normal examination and reassuring pattern are therapeutic information.'] },
      { label: '02', title: 'Red flags', tone: 'sand', items: ['Bleeding, iron-deficiency anaemia, nocturnal symptoms, fever, weight loss, and family history need a different pathway.', 'Avoid a broad, repeated test cascade without a clinical reason.', 'Shared decisions improve adherence to diet and symptom management.'] },
    ],
    takeaway: 'Validate the symptoms, name the pattern, and give the patient a plan they can actually follow.',
  },
  'gastro-lec-08': {
    kicker: 'Stomach & duodenum · ulcer disease',
    summary: 'Peptic ulcer disease reflects an imbalance between mucosal defence and acid–peptic injury, most often driven by H. pylori or NSAIDs.',
    objectives: ['Describe the major causes of peptic ulceration.', 'Recognise ulcer complications early.', 'Link treatment to the cause and confirm healing when needed.'],
    boxes: [
      { label: '01', title: 'Risk frame', tone: 'teal', items: ['Ask specifically about NSAIDs, aspirin, steroids, anticoagulants, and previous ulcer disease.', 'H. pylori testing changes long-term recurrence risk.', 'Gastric ulcers deserve attention to biopsy and follow-up.'] },
      { label: '02', title: 'Clinical signal', tone: 'navy', items: ['Epigastric pain can be absent in bleeding or perforation.', 'Sudden severe pain with guarding suggests perforation until proven otherwise.', 'Haematemesis, melena, or syncope changes the urgency immediately.'] },
    ],
    takeaway: 'Treat the acid injury, remove the cause, and never let a symptom response substitute for risk assessment.',
  },
  'gastro-lec-09': {
    kicker: 'Ulcer complications · dyspepsia',
    summary: 'Bleeding, perforation, obstruction, Zollinger–Ellison syndrome, and dyspepsia each require a different level of urgency and a different question.',
    objectives: ['Triage the major complications of peptic ulcer disease.', 'Recognise clues to gastrinoma and acid hypersecretion.', 'Use a safe, structured dyspepsia pathway.'],
    boxes: [
      { label: '01', title: 'Complication lens', tone: 'teal', items: ['Bleeding: resuscitate, risk-stratify, and arrange therapeutic endoscopy.', 'Perforation: urgent surgical assessment after initial stabilisation.', 'Gastric outlet obstruction: look for persistent vomiting, dehydration, and retained food.'] },
      { label: '02', title: 'ZES clue', tone: 'sand', items: ['Refractory or multiple ulcers, diarrhoea, and ulcers beyond the duodenal bulb raise suspicion.', 'Fasting gastrin is interpreted with gastric acidity and medication context.', 'Think about MEN1 when the wider clinical picture fits.'] },
    ],
    takeaway: 'Dyspepsia is common; complication physiology is not. Let instability and red flags set the pace.',
  },
  'gastro-lec-10': {
    kicker: 'Upper GI oncology',
    summary: 'Upper gastrointestinal tumours present late surprisingly often. A disciplined approach to alarm symptoms, staging, and nutrition changes the course.',
    objectives: ['Recognise presentations that require prompt endoscopy.', 'Differentiate tissue diagnosis from staging.', 'Include nutrition and performance status in the initial plan.'],
    boxes: [
      { label: '01', title: 'Alarm features', tone: 'teal', items: ['Progressive dysphagia, weight loss, anaemia, bleeding, persistent vomiting, and a palpable mass need urgent evaluation.', 'Biopsy establishes histology; imaging establishes spread and resectability.', 'Do not delay referral while pursuing low-yield symptomatic treatment.'] },
      { label: '02', title: 'Whole-patient care', tone: 'navy', items: ['Assess intake, weight trajectory, and swallowing safety early.', 'Multidisciplinary planning aligns surgery, oncology, radiology, and nutrition.', 'Staging is a decision tool, not just a number.'] },
    ],
    takeaway: 'For suspected upper GI cancer, the first goal is not to name the stage—it is to secure tissue, map disease, and protect the patient’s reserve.',
  },
  'gastro-lec-11': {
    kicker: 'IBD · Crohn disease',
    summary: 'Crohn disease is a transmural, discontinuous inflammatory process that can affect any part of the gastrointestinal tract and produce penetrating or stricturing complications.',
    objectives: ['Recognise the clinical spectrum of Crohn disease.', 'Separate inflammatory, stricturing, and penetrating behaviour.', 'Choose investigations that show both mucosa and bowel wall.'],
    boxes: [
      { label: '01', title: 'Pattern', tone: 'teal', items: ['Skip lesions, ileocaecal disease, perianal disease, and extraintestinal features are useful clues.', 'Diarrhoea, pain, weight loss, and fatigue may be subtle between flares.', 'Smoking worsens disease course and should be addressed directly.'] },
      { label: '02', title: 'Complication watch', tone: 'sand', items: ['Obstructive symptoms suggest a stricture; fever and a tender mass suggest abscess.', 'Cross-sectional imaging complements ileocolonoscopy.', 'Treat malnutrition and infection risk before escalating immunosuppression.'] },
    ],
    takeaway: 'Name the phenotype before choosing treatment: inflammation, narrowing, fistula, and abscess are not interchangeable.',
  },
  'gastro-lec-12': {
    kicker: 'IBD · ulcerative colitis',
    summary: 'Ulcerative colitis begins in the rectum and extends proximally in a continuous pattern. Severity is defined by stool, bleeding, systemic impact, and objective inflammation.',
    objectives: ['Recognise the continuous distribution of ulcerative colitis.', 'Assess severity and acute severe colitis.', 'Build a maintenance and surveillance mindset.'],
    boxes: [
      { label: '01', title: 'Clinical pattern', tone: 'teal', items: ['Bloody diarrhoea, urgency, tenesmus, and nocturnal stool are characteristic.', 'Extent and activity should be documented objectively.', 'Extraintestinal manifestations may track with bowel activity—or not.'] },
      { label: '02', title: 'Safety first', tone: 'navy', items: ['Acute severe colitis requires admission, infection exclusion, thromboprophylaxis, and early specialist input.', 'Avoid delay when systemic toxicity, tachycardia, or abdominal distension appears.', 'Long-term surveillance depends on duration, extent, and inflammatory burden.'] },
    ],
    takeaway: 'In IBD, the patient’s trajectory and objective inflammation matter more than a single reassuring symptom day.',
  },
  'gastro-lec-13': {
    kicker: 'Colon · polyps and cancer',
    summary: 'Colorectal cancer prevention is a story of adenoma biology, inherited risk, timely colonoscopy, and recognising symptoms before they become obstruction.',
    objectives: ['Understand the adenoma–carcinoma sequence.', 'Use family history and polyp features to frame risk.', 'Recognise the common presentations of colorectal cancer.'],
    boxes: [
      { label: '01', title: 'Risk signals', tone: 'teal', items: ['Age, family history, inherited syndromes, inflammatory bowel disease, and lifestyle shape risk.', 'Iron-deficiency anaemia may be the first clue to an occult right-sided lesion.', 'Change in bowel habit, bleeding, and weight loss need context—not dismissal.'] },
      { label: '02', title: 'Polyp logic', tone: 'sand', items: ['Number, size, histology, and dysplasia determine surveillance.', 'Complete resection and a high-quality examination are essential.', 'Screening is prevention when it finds and removes a precursor lesion.'] },
    ],
    takeaway: 'The colonoscopy is not just looking for cancer; it is interrupting the pathway that creates it.',
  },
  'gastro-lec-14': {
    kicker: 'Emergency · upper GI bleeding',
    summary: 'Upper GI bleeding is a resuscitation problem before it is an endoscopy problem. Stabilise first, then identify and treat the source.',
    objectives: ['Assess shock and ongoing blood loss rapidly.', 'Start a structured pre-endoscopy bundle.', 'Know when rebleeding requires escalation.'],
    boxes: [
      { label: '01', title: 'First minutes', tone: 'teal', items: ['Airway, breathing, circulation, large-bore access, blood tests, and crossmatch come first.', 'Review anticoagulants, antiplatelets, liver disease, and previous bleeding.', 'Use haemodynamics and comorbidity—not haemoglobin alone—to guide urgency.'] },
      { label: '02', title: 'Definitive control', tone: 'navy', items: ['Endoscopy provides diagnosis, risk stratification, and haemostasis.', 'High-risk stigmata need endoscopic therapy and appropriate acid suppression.', 'Rebleeding calls for repeat endoscopy, interventional radiology, or surgery according to the case.'] },
    ],
    takeaway: 'A calm, reproducible resuscitation sequence saves time when the history is incomplete and the bleeding is not.',
  },
  'gastro-lec-15': {
    kicker: 'Pancreas · acute inflammation',
    summary: 'Acute pancreatitis is diagnosed clinically and biochemically, then managed by repeated assessment of volume status, organ function, and the cause.',
    objectives: ['Apply the diagnostic criteria for acute pancreatitis.', 'Identify biliary, alcohol-related, and other triggers.', 'Recognise early organ failure and evolving complications.'],
    boxes: [
      { label: '01', title: 'Diagnosis', tone: 'teal', items: ['Typical upper abdominal pain, a significant lipase or amylase rise, and characteristic imaging form the diagnostic triad.', 'Two of three criteria are usually enough.', 'Ultrasound looks for gallstones; CT is reserved for the right clinical question.'] },
      { label: '02', title: 'Management rhythm', tone: 'sand', items: ['Give goal-directed fluids, analgesia, antiemetics, and early oral or enteral nutrition when appropriate.', 'Monitor oxygenation, urine output, renal function, and haematocrit.', 'Persistent organ failure defines severe disease and changes the care setting.'] },
    ],
    takeaway: 'Severity is dynamic. Reassess the patient’s physiology repeatedly rather than predicting the whole course from the first scan.',
  },
  'gastro-lec-16': {
    kicker: 'Infection · acute diarrhoea',
    summary: 'Most acute infectious diarrhoea is self-limited, but dehydration, dysentery, sepsis, travel, healthcare exposure, and host factors change the plan.',
    objectives: ['Triage severity and dehydration at the bedside.', 'Use history to select stool testing and treatment.', 'Prevent transmission while treating the patient.'],
    boxes: [
      { label: '01', title: 'History that changes care', tone: 'teal', items: ['Ask about travel, food, sick contacts, antibiotics, outbreaks, immunosuppression, and blood in stool.', 'Duration and fever help separate common self-limited illness from invasive disease.', 'Consider public-health implications in clusters and healthcare-associated cases.'] },
      { label: '02', title: 'Safe treatment', tone: 'navy', items: ['Oral rehydration is the centre of care; use IV fluids for shock or inability to drink.', 'Antibiotics are selective, not automatic, and depend on syndrome and host.', 'Hand hygiene, isolation advice, and safe food handling protect the next patient.'] },
    ],
    takeaway: 'In diarrhoea, the first prescription is fluid. The second is a targeted explanation of why this patient does—or does not—need more.',
  },
};

function GastroLectures({ topic, topicKey, completedIds, onComplete }: { topic: Topic; topicKey: string; completedIds: string[]; onComplete: (lectureId: string) => void }) {
  const lectures = topic.lectures ?? [];
  const [readerId, setReaderId] = useState<string | null>(null);
  const readerLecture = lectures.find((lecture) => lecture.id === readerId) ?? null;
  useEffect(() => { setReaderId(null); }, [topic.id]);

  if (readerLecture) {
    return <GastroReader lecture={readerLecture} index={lectures.findIndex((lecture) => lecture.id === readerLecture.id)} total={lectures.length} completed={completedIds.includes(`lecture:${topicKey}:${readerLecture.id}`)} onComplete={() => onComplete(readerLecture.id)} onBack={() => setReaderId(null)} />;
  }

  return <section className="gastro-lectures" aria-label="Gastroenterology lecture reader">
    <div className="gastro-study-intro">
      <div>
        <span className="gastro-overline">STAGIAIRE READER · GASTROENTEROLOGY</span>
        <h2>اقرأ المحاضرة كخريطة، لا كملف.</h2>
        <p>افتح أي محاضرة لصفحة قراءة مركّزة، ثم ارجع إلى القائمة من دون فقدان تقدّمك. يمكنك تنزيل ملف الـ PDF الأصلي من رمز التحميل.</p>
      </div>
      <div className="gastro-intro-stat"><strong>{String(lectures.length).padStart(2, '0')}</strong><span>lectures<br />in sequence</span></div>
    </div>
    <div className="gastro-lecture-list">
      <div className="gastro-list-heading"><div><span className="gastro-overline">THE COMPLETE SET</span><h3>Gastroenterology lectures</h3></div><span className="gastro-list-count">{lectures.length} / 16</span></div>
      <div className="gastro-rows">
        {lectures.map((lecture, index) => {
          const completed = completedIds.includes(`lecture:${topicKey}:${lecture.id}`);
          return <div key={lecture.id} role="button" tabIndex={0} onClick={() => setReaderId(lecture.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setReaderId(lecture.id); } }} className={`gastro-lecture-row ${completed ? 'is-complete' : ''}`} data-testid={`card-lecture-${lecture.id}`}>
            <span className="gastro-row-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="gastro-row-copy"><span className="gastro-row-title">{lecture.title}</span><span className="gastro-row-meta">{lecture.pages} pages <i /> {completed ? 'مكتملة' : 'Open HTML reader'}</span></span>
            <span className="gastro-row-actions">
              {completed && <Check size={16} className="gastro-complete-mark" aria-label="مكتملة" />}
              <a href={lecture.pdf} download onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} aria-label={`Download ${lecture.title} PDF`} data-testid={`link-download-${lecture.id}`} className="gastro-download"><Download size={17} /></a>
              <ArrowLeft size={18} className="gastro-row-arrow" aria-hidden="true" />
            </span>
          </div>;
        })}
      </div>
    </div>
  </section>;
}

function GastroReader({ lecture, index, total, completed, onComplete, onBack }: { lecture: Lecture; index: number; total: number; completed: boolean; onComplete: () => void; onBack: () => void }) {
  const note = gastroNotes[lecture.id] ?? { kicker: 'Study note', summary: 'A focused reading page for this lecture.', objectives: [], boxes: [], takeaway: 'Return to the lecture list to continue.' };
  return <article className="gastro-reader" dir="ltr" data-testid="gastro-reader">
    <header className="gastro-reader-header">
      <div className="gastro-reader-brand">
        <img src="/logo.png" alt="شعار ستاجير" className="gastro-reader-logo" />
        <img src="/brand_text.png" alt="ستاجير - كل ما تحتاجه في الطب" className="gastro-reader-brand-text" />
        <span className="gastro-reader-brand-label">STUDY READER</span>
      </div>
      <div className="gastro-reader-header-meta"><div className="gastro-reader-header-lecture"><span>GASTROENTEROLOGY</span><strong>{lecture.title}</strong></div><b>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</b></div>
    </header>
    <div className="gastro-reader-toolbar gastro-no-print">
      <button type="button" onClick={onBack} className="gastro-reader-back"><ChevronLeft size={18} /> <span>Back to lecture list</span></button>
      <div className="gastro-reader-actions">
        <button type="button" onClick={() => window.print()} className="gastro-print-button"><Printer size={17} /> <span>Export PDF / A4</span></button>
        <button type="button" onClick={onComplete} aria-pressed={completed} data-testid={`button-reader-complete-${lecture.id}`} className={`gastro-reader-complete ${completed ? 'is-complete' : ''}`}><Check size={17} /><span>{completed ? 'Completed' : 'Mark as Completed'}</span></button>
      </div>
    </div>
    <div className="gastro-reader-page">
      <div className="gastro-reader-main">
        <div className="gastro-reader-kicker">{note.kicker}</div>
        <h1>{lecture.title}</h1>
        <p className="gastro-reader-lede">{note.summary}</p>
        <div className="gastro-reader-rule" />
        <section className="gastro-reader-section">
          <div className="gastro-section-heading"><span>01</span><div><small>ORIENTATION</small><h2>What to carry forward</h2></div></div>
          <div className="gastro-objectives">{note.objectives.map((objective) => <p key={objective}><Check size={15} />{objective}</p>)}</div>
        </section>
        <section className="gastro-reader-section">
          <div className="gastro-section-heading"><span>02</span><div><small>CORE NOTES</small><h2>Build the clinical picture</h2></div></div>
          <div className="gastro-note-grid">{note.boxes.map((box) => <div key={box.label} className={`gastro-note-box ${box.tone ?? 'teal'}`}><div className="gastro-box-label">{box.label}</div><h3>{box.title}</h3><ul>{box.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>
        </section>
        <section className="gastro-takeaway"><span>CLINICAL TAKEAWAY</span><p>{note.takeaway}</p></section>
      </div>
      <aside className="gastro-reader-aside">
        <div className="gastro-aside-card gastro-aside-index"><span className="gastro-overline">IN THIS READER</span><div className="gastro-aside-line is-active"><b>01</b><span>Orientation</span></div><div className="gastro-aside-line"><b>02</b><span>Core notes</span></div><div className="gastro-aside-line"><b>03</b><span>Clinical takeaway</span></div></div>
        <div className="gastro-aside-card gastro-aside-meta"><span className="gastro-overline">LECTURE DETAILS</span><div><span>Sequence</span><b>{String(index + 1).padStart(2, '0')} of {total}</b></div><div><span>Source pages</span><b>{lecture.pages} pages</b></div><div><span>Format</span><b>HTML notes</b></div></div>
        <div className="gastro-aside-quote">“Small, clear passes beat one long, anxious read.”<span>— Stagiaire study desk</span></div>
      </aside>
    </div>
  </article>;
}

function Explanation({ topic }: { topic: Topic }) {
  return <div className="ink-card rounded-2xl p-6 md:p-9"><div className="mb-8 flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(177_44%_54%/.15)] text-[hsl(var(--primary))]"><Lightbulb size={21} /></div><div><h2 className="display-font text-xl font-bold">الفكرة المحورية</h2><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">شرح مبسّط يساعدك على ربط المعلومة بالحالة السريرية.</p></div></div><div className="grid gap-5 md:grid-cols-2"><InfoBlock number="01" title="ابدأ بالتعريف" text={`افهم إطار ${topic.title} قبل الانتقال إلى التفاصيل. اسأل نفسك: ما الآلية؟ وما العرض الذي سيقودني إلى التشخيص؟`} /><InfoBlock number="02" title="ابحث عن العلامة الفارقة" text="في الامتحان والممارسة، التفاصيل الصغيرة هي التي تميّز بين الاحتمالات. اربط كل علامة بسببها الفيزيولوجي." /><InfoBlock number="03" title="حوّلها إلى قرار" text="رتّب خطوات التقييم والعلاج بشكل متسلسل: استقرار المريض، جمع المعلومات، ثم التدخل المناسب." /><InfoBlock number="04" title="راجع بصوتك" text="اشرح الفكرة كأنك أمام زميل أو مريض. إذا استطعت تبسيطها، فأنت قريب من إتقانها." /></div></div>;
}
function InfoBlock({ number, title, text }: { number: string; title: string; text: string }) { return <div className="rounded-xl bg-[hsl(var(--secondary)/.55)] p-5"><span className="font-mono text-xs font-bold text-[hsl(var(--primary))]">{number}</span><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{text}</p></div>; }
function Summaries({ topic }: { topic: Topic }) { return <div className="grid gap-4 md:grid-cols-3"><SummaryCard title="تعريف سريع" text={`${topic.title} — مجموعة مفاهيم سريرية تحتاج إلى قراءة منظمة وربط مستمر.`} icon={<BookOpen size={19} />} /><SummaryCard title="نقاط عالية العائد" text="التعريف، عوامل الخطورة، العرض النموذجي، الفحص، وأول خطوة في التدبير." icon={<Target size={19} />} /><SummaryCard title="قبل الامتحان" text="راجع الحالات النموذجية، الفروقات التشخيصية، وموانع العلاج." icon={<ClipboardCheck size={19} />} /></div>; }
function SummaryCard({ title, text, icon }: { title: string; text: string; icon: ReactNode }) { return <div className="ink-card rounded-2xl p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]">{icon}</span><h3 className="display-font mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{text}</p></div>; }
function Hints() { return <div className="ink-card rounded-2xl p-6 md:p-9"><div className="mb-6 flex items-center gap-3"><Lightbulb className="text-[hsl(var(--accent))]" size={23} /><h2 className="display-font text-xl font-bold">ملاحظات سريعة</h2></div><div className="space-y-3"><p className="rounded-xl border-r-4 border-[hsl(var(--accent))] bg-[hsl(29_85%_57%/.1)] p-4 text-sm leading-7">لا تبدأ بحفظ القائمة. ابدأ بفهم لماذا تظهر العلامة، ثم اربطها بالتشخيص.</p><p className="rounded-xl border-r-4 border-[hsl(var(--primary))] bg-[hsl(177_44%_54%/.1)] p-4 text-sm leading-7">عند التردد بين إجابتين، عد إلى السؤال: ما الخطوة الأكثر أماناً والأكثر فائدة الآن؟</p><p className="rounded-xl border-r-4 border-[hsl(var(--sidebar))] bg-[hsl(213_42%_18%/.08)] p-4 text-sm leading-7">قسّم المحاضرة إلى جلسات قصيرة، واختبر استدعاءك بعد كل جزء.</p></div></div>; }

type Question = { question: string; options: string[]; answer: number; explanation: string };
function quizFor(topicKey: string): Question[] { return [{ question: `أي مما يلي يمثل الخطوة الأولى الأنسب عند تقييم مريض بـ ${topicKey.split('-').slice(1).join(' ')}؟`, options: ['تقييم الاستقرار والعلامات الحيوية', 'طلب كل الفحوصات المتاحة', 'بدء العلاج التجريبي مباشرة', 'تأجيل الفحص إلى ما بعد التصوير'], answer: 0, explanation: 'ابدأ دائماً بتقييم الاستقرار والوظائف الحيوية قبل الانتقال إلى التفاصيل التشخيصية.' }, { question: 'ما أفضل طريقة لترسيخ المعلومة السريرية؟', options: ['قراءة النص مرة واحدة', 'ربطها بعلامة وفارق تشخيصي', 'حفظ العناوين فقط', 'تجنب حل الأسئلة'], answer: 1, explanation: 'الربط بين الآلية والعلامة الفارقة يجعل الاستدعاء أسرع وأكثر ثباتاً.' }, { question: 'متى تكون المراجعة أكثر فاعلية؟', options: ['جلسة طويلة بلا فواصل', 'عند نسخ المحتوى فقط', 'بعد اختبار الاستدعاء الذاتي', 'عند تجاهل الأخطاء'], answer: 2, explanation: 'الاستدعاء النشط بعد القراءة يكشف الفجوات ويحوّل المعرفة إلى مهارة.' }]; }
function Quiz({ topicKey, onProgress }: { topicKey: string; onProgress: (value: number) => void }) {
  const questions = useMemo(() => quizFor(topicKey), [topicKey]);
  const [current, setCurrent] = useState(0); const [selected, setSelected] = useState<number | null>(null); const [score, setScore] = useState(0); const question = questions[current]; const finished = current >= questions.length;
  const choose = (index: number) => { if (selected !== null) return; setSelected(index); if (index === question.answer) setScore((value) => value + 1); };
  const next = () => { const nextIndex = current + 1; setCurrent(nextIndex); setSelected(null); onProgress(Math.round((nextIndex / questions.length) * 100)); };
  if (finished) return <div className="ink-card rounded-2xl p-10 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(158_46%_35%/.13)] text-[hsl(158_46%_35%)]"><Check size={27} /></span><h2 className="display-font mt-5 text-2xl font-bold">أحسنت، أنهيت الاختبار</h2><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">نتيجتك {score} من {questions.length}</p><div className="mx-auto mt-5 h-2 max-w-xs overflow-hidden rounded-full bg-[hsl(var(--secondary))]"><div className="h-full rounded-full bg-[hsl(158_46%_35%)]" style={{ width: `${(score / questions.length) * 100}%` }} /></div><button type="button" onClick={() => { setCurrent(0); setScore(0); setSelected(null); onProgress(0); }} data-testid="button-retry-quiz" className="mt-7 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))]">إعادة الاختبار</button></div>;
  return <div className="ink-card rounded-2xl p-6 md:p-9"><div className="mb-8 flex items-center justify-between"><div><p className="text-xs font-bold tracking-widest text-[hsl(var(--primary))]">اختبر فهمك</p><h2 className="display-font mt-2 text-xl font-bold">سؤال {current + 1} من {questions.length}</h2></div><span className="rounded-full bg-[hsl(var(--secondary))] px-3 py-2 text-xs font-bold">النتيجة: {score}</span></div><div className="mb-8 h-2 overflow-hidden rounded-full bg-[hsl(var(--secondary))]"><div className="progress-bar h-full rounded-full bg-[hsl(var(--primary))]" style={{ width: `${((current + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }} /></div><h3 className="max-w-2xl text-lg font-bold leading-9">{question.question}</h3><div className="mt-6 grid gap-3">{question.options.map((option, index) => { const isCorrect = selected !== null && index === question.answer; const isWrong = selected === index && index !== question.answer; return <button type="button" key={option} onClick={() => choose(index)} disabled={selected !== null} data-testid={`button-answer-${index}`} className={`flex items-center justify-between rounded-xl border p-4 text-right text-sm font-bold transition ${isCorrect ? 'border-[hsl(158_46%_35%)] bg-[hsl(158_46%_35%/.1)] text-[hsl(158_46%_35%)]' : isWrong ? 'border-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/.08)] text-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/.45)] hover:bg-[hsl(var(--secondary)/.55)]'}`}><span className="flex items-center gap-3"><span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{String.fromCharCode(65 + index)}</span>{option}</span>{isCorrect && <Check size={18} />}{isWrong && <X size={18} />}</button>; })}</div>{selected !== null && <div className={`mt-6 rounded-xl p-4 text-sm leading-7 ${selected === question.answer ? 'bg-[hsl(158_46%_35%/.1)] text-[hsl(158_46%_35%)]' : 'bg-[hsl(var(--destructive)/.08)] text-[hsl(var(--destructive))]'}`}><b>{selected === question.answer ? 'إجابة صحيحة. ' : 'ليست الإجابة الصحيحة. '}</b>{question.explanation}</div>}{selected !== null && <button type="button" onClick={next} data-testid="button-next-question" className="mt-6 flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))]">{current === questions.length - 1 ? 'عرض النتيجة' : 'السؤال التالي'}<ArrowLeft size={17} /></button>}</div>;
}

function Review({ topic, completed, onComplete }: { topic: Topic; completed: boolean; onComplete: () => void }) { return <div className="grid gap-5 md:grid-cols-[1fr_.8fr]"><div className="ink-card rounded-2xl p-6 md:p-8"><div className="flex items-center gap-3"><Star className="text-[hsl(var(--accent))]" size={23} /><div><h2 className="topic-english text-xl">Review · {topic.en}</h2><p className="topic-arabic mt-1">{topic.title}</p></div></div><p className="mt-5 text-sm leading-8 text-[hsl(var(--muted-foreground))]">أغلقت دائرة المراجعة عندما قرأت، فهمت، لخّصت، ثم اختبرت نفسك. سجّل الموضوع كمكتمل لتعود إليه ضمن إنجازاتك.</p><button type="button" onClick={onComplete} data-testid="button-review-complete" className={`mt-6 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold ${completed ? 'bg-[hsl(158_46%_35%)] text-white' : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'}`}><Check size={17} />{completed ? 'هذا الموضوع مكتمل' : 'تحديد كمكتمل'}</button></div><div className="rounded-2xl bg-[hsl(var(--sidebar))] p-6 text-[hsl(var(--sidebar-foreground))]"><HeartPulse className="text-[hsl(var(--sidebar-primary))]" size={25} /><h3 className="display-font mt-5 text-lg font-bold">نصيحة سريرية</h3><p className="mt-3 text-sm leading-8 text-white/65">المعرفة الطبية تصبح أقوى عندما تشرحها وتطبقها، لا عندما تمر عليها بعينيك فقط.</p></div></div>; }

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/subjects" component={SubjectsPage} /><Route path="/review" component={ReviewPage} /><Route path="/subject/:subjectId" component={SubjectPage} /><Route path="/subject/:subjectId/:branchId" component={TopicsPage} /><Route path="/subject/:subjectId/:branchId/topic/:topicId" component={TopicPage} /><Route component={Home} /></Switch>; }
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function App() { const queryClient = useMemo(() => new QueryClient(), []); return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Router /></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;
