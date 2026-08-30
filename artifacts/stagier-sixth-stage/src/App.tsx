import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft, BookOpen, Bookmark, Check, ChevronLeft, CircleHelp,
  ClipboardCheck, Clock3, FileText, HeartPulse, Home as HomeIcon, Lightbulb,
  ListFilter, PlayCircle, Search, Star, Stethoscope, Target, X,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';

type Accent = 'navy' | 'green' | 'orange' | 'purple';
type Branch = 'theory' | 'clinical';
type Tab = 'lectures' | 'explanation' | 'summaries' | 'hints' | 'mcqs' | 'review';
type Topic = { id: string; title: string; en: string; count: number; duration: string; tag?: string; group?: string };
type Subject = { id: string; title: string; english: string; accent: Accent; icon: string; description: string; topics: Record<Branch, Topic[]> };

const topic = (id: string, en: string, title: string, group?: string): Topic => ({
  id, en, title, count: 12, duration: 'ساعتان', ...(group ? { group } : {}),
});

const internalMedicineTopics = [
  topic('cardiology', 'Cardiology', 'أمراض القلب'),
  topic('respiratory', 'Respiratory Medicine', 'الأمراض التنفسية'),
  topic('gastroenterology', 'Gastroenterology', 'أمراض الجهاز الهضمي'),
  topic('endocrinology', 'Endocrinology', 'الغدد الصماء'),
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '8px 16px', direction: 'ltr' }}>
        <button type="button" style={{ background: 'none', border: 'none', fontSize: '24px', color: '#0F2942', cursor: 'pointer', lineHeight: 1 }} data-testid="button-mobile-menu" aria-label="فتح القائمة">☰</button>
        <Link href="/" data-testid="link-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', direction: 'rtl' }}>
          <div className="brand-badge" style={{ width: '46px', height: '46px', minWidth: '46px', borderRadius: '14px', background: '#0F2942', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(15, 41, 66, 0.2)' }} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M8 5a4 4 0 0 1 8 0c0 3-8 5-8 8a4 4 0 0 0 8 0M8 5C4 5 2 7 2 9c0 3 4 4 10 4M16 5c4 0 6 2 6 4c0 3-4 4-10 4" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
            <span className="brand-name" style={{ fontFamily: "'Aref Ruqaa', 'Amiri', serif", fontSize: '28px', fontWeight: 700, color: '#0F2942', lineHeight: 1.1 }}>ستاجير</span>
            <span className="brand-subtitle" style={{ fontFamily: "'Amiri', serif", fontSize: '13px', color: '#5A6E85', fontWeight: 600, lineHeight: 1 }}>كُلّ مَا تَحْتَاجَهُ فِي الطِّبّ</span>
          </div>
        </Link>
        <div style={{ width: '24px' }} aria-hidden="true" />
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
  return <Shell><div className="mx-auto max-w-[1160px] px-5 pb-16 pt-8 lg:px-8 lg:pt-12"><Breadcrumbs items={[{ title: 'المواد', href: '/subjects' }, { title: subject.title, href: `/subject/${subject.id}` }, { title: branch === 'theory' ? 'نظري' : 'سريري', href: `/subject/${subject.id}/${branch}` }, { title: topic.title }]} /><div className="mb-7 flex flex-wrap items-start justify-between gap-4"><div><h1 className="topic-english text-2xl md:text-3xl">{topic.en}</h1><p className="topic-arabic mt-2">{topic.title}</p><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">مراجعة مركّزة · {topic.count} محاضرة</p></div><div className="flex gap-2"><button type="button" onClick={() => toggle('favorites', topicKey)} data-testid="button-favorite-topic" aria-label="حفظ الموضوع" className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${state.favorites.includes(topicKey) ? 'border-[hsl(29_85%_57%/.4)] bg-[hsl(29_85%_57%/.12)] text-[hsl(30_55%_34%)]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))]'}`}><Bookmark size={17} fill={state.favorites.includes(topicKey) ? 'currentColor' : 'none'} />{state.favorites.includes(topicKey) ? 'محفوظ' : 'حفظ'}</button><button type="button" onClick={() => toggle('completed', topicKey)} data-testid="button-complete-topic" className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold transition ${state.completed.includes(topicKey) ? 'bg-[hsl(158_46%_35%)] text-white' : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'}`}><Check size={17} />{state.completed.includes(topicKey) ? 'مكتمل' : 'أكملت الموضوع'}</button></div></div><div className="mb-7 rounded-2xl bg-[hsl(var(--secondary)/.7)] p-4"><div className="mb-2 flex items-center justify-between text-xs font-bold"><span>تقدم المراجعة</span><span style={{ color: accentMap[subject.accent].color }}>{state.topicProgress[topicKey] ?? 0}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--card))]"><div className="progress-bar h-full rounded-full" style={{ width: `${state.topicProgress[topicKey] ?? 0}%`, background: accentMap[subject.accent].color }} /></div></div><TopicTabs tab={tab} setTab={setTab} /><div className="page-in mt-6">{tab === 'lectures' && <Lectures topic={topic} />}{tab === 'explanation' && <Explanation topic={topic} />}{tab === 'summaries' && <Summaries topic={topic} />}{tab === 'hints' && <Hints />}{tab === 'mcqs' && <Quiz topicKey={topicKey} onProgress={(value) => markProgress(topicKey, value)} />}{tab === 'review' && <Review topic={topic} completed={state.completed.includes(topicKey)} onComplete={() => toggle('completed', topicKey)} />}</div></div></Shell>;
}

function TopicTabs({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: 'lectures', label: 'Lectures', icon: <PlayCircle size={16} /> }, { id: 'explanation', label: 'Explanation', icon: <Lightbulb size={16} /> }, { id: 'summaries', label: 'Summaries', icon: <FileText size={16} /> }, { id: 'hints', label: 'Hints', icon: <CircleHelp size={16} /> }, { id: 'mcqs', label: 'MCQs', icon: <ClipboardCheck size={16} /> }, { id: 'review', label: 'Review', icon: <Star size={16} /> },
  ];
  return <div className="no-scrollbar flex overflow-x-auto rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5" role="tablist" data-testid="topic-tabs">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)} key={item.id} data-testid={`tab-${item.id}`} className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition md:flex-1 md:justify-center ${tab === item.id ? 'bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] shadow-sm' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))]'}`}>{item.icon}{item.label}</button>)}</div>;
}

function Lectures({ topic }: { topic: Topic }) {
  return <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]"><div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(213_42%_18%)] shadow-lg"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-white"><div className="flex items-center gap-2 text-sm font-bold"><FileText size={17} className="text-[hsl(var(--sidebar-primary))]" />PDF Viewer</div><span className="text-[10px] text-white/55">{topic.en}</span></div><div className="pdf-placeholder flex min-h-[430px] flex-col items-center justify-center px-6 text-center text-white md:min-h-[540px]" data-testid="pdf-viewer-placeholder"><span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[hsl(var(--sidebar-primary)/.35)] bg-[hsl(var(--sidebar-primary)/.12)] text-[hsl(var(--sidebar-primary))]"><FileText size={30} /></span><h3 className="text-xl font-bold">PDF preview</h3><p className="mt-2 max-w-sm text-sm leading-7 text-white/65">Lecture materials for this topic will appear here.</p><a href={pdfUrl} target="_blank" rel="noreferrer" data-testid="link-open-pdf-fallback" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--sidebar-primary))] px-4 py-3 text-sm font-bold text-[hsl(var(--sidebar-primary-foreground))]">فتح الملف <ArrowLeft size={16} /></a></div></div><aside className="ink-card rounded-2xl p-6"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><BookOpen size={20} /></span><h2 className="display-font mt-5 text-lg font-bold">طريقة المراجعة</h2><ol className="mt-4 space-y-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]"><li className="flex gap-3"><b className="font-mono text-[hsl(var(--primary))]">01</b><span>اقرأ العناوين أولاً لتكوين خريطة ذهنية.</span></li><li className="flex gap-3"><b className="font-mono text-[hsl(var(--primary))]">02</b><span>دوّن العلامات الفارقة والأرقام المهمة.</span></li><li className="flex gap-3"><b className="font-mono text-[hsl(var(--primary))]">03</b><span>اختبر نفسك من تبويب الأسئلة.</span></li></ol></aside></div>;
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
