export interface Lecture {
  id: string;
  title: string;
  description?: string;
  fileUrl?: string; // رابط ملف الـ PDF أو المحاضرة
  duration?: string;
}

export interface MedicalSystem {
  id: string;
  name: string;
  arabicName: string;
  icon: string;
  description: string;
  lectures: Lecture[];
}

export const medicalSystems: MedicalSystem[] = [
  {
    id: 'internal-medicine',
    name: 'Internal Medicine',
    arabicName: 'الباطنية',
    icon: 'heart',
    description: 'منهج سريري متكامل لفهم التشخيص والتدبير',
    lectures: [
      {
        id: 'im-1',
        title: 'Cardiology: Heart Failure Management',
        description: 'مقاربة شاملة لعلاج قصور القلب والتشخيص السريري',
        fileUrl: '#',
      },
      {
        id: 'im-2',
        title: 'Gastroenterology: Chronic Liver Disease',
        description: 'مضاعفات أمراض الكبد المزمنة وإدارة نزيف الجهاز الهضمي',
        fileUrl: '#',
      },
    ],
  },
  {
    id: 'surgery',
    name: 'Surgery',
    arabicName: 'الجراحة',
    icon: 'scalpel',
    description: 'خطوات عملية مرتبة من التقييم إلى غرفة العمليات',
    lectures: [
      {
        id: 'surg-1',
        title: 'Acute Abdomen & Appendicitis',
        description: 'التشخيص التفريقي للبطن الحاد والتدخل الجراحي',
        fileUrl: '#',
      },
    ],
  },
  // يمكنك إضافة بقية السستمات بنفس الطريقة (النسائية، الأطفال، إلخ)
];
