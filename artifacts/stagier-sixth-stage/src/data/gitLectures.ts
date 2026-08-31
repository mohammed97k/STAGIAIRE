export interface LectureData {
  id: number;
  title: string;
  doctor: string;
  system: string;
  readTime: string;
  content: {
    sectionTitle: string;
    items?: string[];
    boxes?: { subtitle: string; details: string }[];
    callout?: { title: string; points: string[] };
  }[];
}

export const gitLecturesData: Record<number, LectureData> = {
  1: {
    id: 1,
    title: "Anatomy & Physiology of the GI Tract",
    doctor: "Dr. Mohammed Harith",
    system: "Gastroenterology",
    readTime: "12 min",
    content: [
      {
        sectionTitle: "1. Clinical Examination & Overview",
        items: [
          "Diseases of the GI tract account for ~10% of all primary care consultations.",
          "GI examination covers Head & Neck (pallor, jaundice, glossitis, Virchow's node), Hands (clubbing, koilonychia), Abdomen (distension, tenderness, masses), Groin, and Perineum/PR.",
          "Common abdominal mass locations: Epigastric (gastric/pancreatic ca, aortic aneurysm), RIF (caecal ca, Crohn's, appendix mass), LIF (sigmoid ca, diverticular mass).",
        ],
      },
      {
        sectionTitle: "2. Functional Anatomy & Secretions",
        items: [
          "Oesophagus: 25 cm muscular tube with upper and lower sphincters; swallowing wave propels food bolus.",
          "Stomach: Acts as a hopper; G cells secrete Gastrin (stimulates acid & mucosal growth), D cells secrete Somatostatin (inhibits acid), Oxyntic glands secrete Ghrelin (stimulates appetite & acid).",
          "Small Intestine: Extends from Ligament of Treitz to ileocaecal valve; primary site for digestion, absorption, and immune defense via MALT (25% of total body lymphoid tissue producing IgA).",
        ],
      },
      {
        sectionTitle: "3. Key Gut Hormones & Peptides",
        boxes: [
          { subtitle: "Gastrin (G cells - Antrum)", details: "Stimulated by protein digestion; increases gastric acid secretion and mucosal growth." },
          { subtitle: "Somatostatin (D cells - Whole GIT)", details: "Inhibits gastrin, insulin, and acid secretion; decreases GI motility and absorption." },
          { subtitle: "CCK (I cells - Duodenum/Jejunum)", details: "Stimulated by fats/peptides; induces gallbladder contraction and pancreatic enzyme release; relaxes sphincter of Oddi." },
          { subtitle: "Secretin (S cells - Duodenum)", details: "Stimulated by duodenal acid; stimulates pancreatic fluid & bicarbonate secretion to neutralize acid." },
        ],
      },
    ],
  },
  2: {
    id: 2,
    title: "Investigations of the GIT System",
    doctor: "Dr. Mohammed Harith",
    system: "Gastroenterology",
    readTime: "15 min",
    content: [
      {
        sectionTitle: "1. Diagnostic Imaging Modalities",
        items: [
          "Plain Radiographs: Detect obstruction (dilated loops + fluid levels), perforation (free air under diaphragm on erect CXR), and calcifications (pancreatic stones, gallstones).",
          "Contrast Studies: Barium swallow/meal/enema assess anatomical defects and motility (achalasia, strictures), but carry aspiration risk and inferior mucosal resolution compared to endoscopy.",
          "Cross-Sectional: US is operator-dependent; CT/MRI are critical for retroperitoneum, staging, and collections; PET-CT evaluates metabolic activity in malignancies.",
        ],
      },
      {
        sectionTitle: "2. Endoscopic Procedures & Techniques",
        boxes: [
          { subtitle: "Upper GI Endoscopy (OGD)", details: "Evaluates oesophagus to second part of duodenum; diagnostic for ulcers, tumors, varices; therapeutic for clipping, band ligation, and stenting." },
          { subtitle: "Colonoscopy & Sigmoidoscopy", details: "Visualizes the entire colon up to terminal ileum; gold standard for IBD, polyps, bleeding, and colorectal cancer screening." },
          { subtitle: "Endoscopic Ultrasound (EUS)", details: "Combines endoscopy with high-resolution US; allows transmural imaging and FNA biopsy of pancreatic and sub-epithelial lesions." },
          { subtitle: "Capsule & Double Balloon Enteroscopy", details: "Wireless capsule evaluates obscure small bowel bleeding/Crohn's; Double Balloon allows deep small bowel therapy." },
        ],
      },
    ],
  },
  3: {
    id: 3,
    title: "Disorders of the Esophagus (GERD & Achalasia)",
    doctor: "Dr. Abdullah Alyouzbaki",
    system: "Gastroenterology",
    readTime: "18 min",
    content: [
      {
        sectionTitle: "1. Gastro-Oesophageal Reflux Disease (GERD)",
        items: [
          "Pathophysiology: Reduced LES tone, inappropriate transient LES relaxations, hiatus hernia, and delayed esophageal clearance.",
          "Clinical Features: Heartburn, acid regurgitation, water brash, dysphagia, atypical chest pain, chronic cough, and laryngitis.",
          "Complications: Erosive oesophagitis, peptic strictures, iron deficiency anaemia (Cameron lesions), and Barrett's oesophagus.",
        ],
        callout: {
          title: "Barrett's Oesophagus & Management",
          points: [
            "Premalignant change: Stratified squamous epithelium replaced by specialized columnar/intestinal metaplasia.",
            "Increases adenocarcinoma risk 40-120 fold; managed by regular endoscopic surveillance and radiofrequency ablation (RFA) or resection for dysplasia.",
          ],
        },
      },
      {
        sectionTitle: "2. Achalasia of the Oesophagus",
        items: [
          "Pathophysiology: Loss of ganglion cells in myenteric plexus & defective nitric oxide release leading to failure of LES relaxation and aperistalsis.",
          "Presentation: Progressive dysphagia for both solids and liquids, regurgitation of undigested food, chest pain, and weight loss.",
          "Diagnosis & Treatment: Barium swallow shows classic 'bird's beak' tapering; high-resolution manometry is confirmatory. Treated by pneumatic balloon dilatation, POEM, or surgical Heller's myotomy + partial fundoplication.",
        ],
      },
    ],
  },
  4: {
    id: 4,
    title: "Acute & Chronic Gastritis (H. pylori)",
    doctor: "Dr. Abdullah Alyouzbaki",
    system: "Gastroenterology",
    readTime: "12 min",
    content: [
      {
        sectionTitle: "1. Acute Gastritis",
        items: [
          "Pathophysiology: Imbalance between mucosal defenses (mucus, bicarbonate, prostaglandins) and aggressive factors (acid, NSAIDs, bile, ischemia).",
          "Major Causes: NSAIDs/Aspirin (COX inhibition), acute H. pylori infection, alcohol, stress/burns (Curling's ulcer), and trauma/shock.",
          "Endoscopic Types: Erythematous, erosive, hemorrhagic (friable with active oozing), and biliary.",
        ],
      },
      {
        sectionTitle: "2. Chronic Gastritis Subtypes",
        boxes: [
          { subtitle: "Type B (H. pylori-Related)", details: "Most common; predominantly affects the antrum; can lead to hypergastrinemia, peptic ulceration, or corpus-predominant atrophic gastritis." },
          { subtitle: "Type A (Autoimmune Gastritis)", details: "Affects gastric body/fundus sparing the antrum; anti-parietal and anti-IF antibodies cause achlorhydria and pernicious anaemia." },
          { subtitle: "Ménétrier's Disease", details: "Giant mucosal rugal hypertrophy with protein-losing enteropathy, excessive TGF-alpha, and hypochlorhydria." },
        ],
      },
    ],
  },
  5: {
    id: 5,
    title: "Malabsorption & Celiac Disease",
    doctor: "Dr. Mohammed Harith",
    system: "Gastroenterology",
    readTime: "14 min",
    content: [
      {
        sectionTitle: "1. Presentation & Approach to Malabsorption",
        items: [
          "Features: Chronic voluminous diarrhea, steatorrhea (pale, bulky, floating stools), weight loss, abdominal distension, borborygmi, and lethargy.",
          "Nutritional Deficiencies: Iron/folate/B12 (anaemia), calcium/Vit D (osteomalacia, tetany), Vit K (easy bruising/prolonged PT).",
        ],
      },
      {
        sectionTitle: "2. Coeliac Disease (Gluten-Sensitive Enteropathy)",
        items: [
          "Pathology: T-cell mediated autoimmune response to gluten (wheat, barley, rye) associated with HLA-DQ2 / HLA-DQ8.",
          "Diagnosis: Anti-tissue transglutaminase (anti-tTG IgA) and anti-endomysial antibodies; confirmation by Duodenal Biopsy (villous atrophy, crypt hyperplasia, intraepithelial lymphocytosis).",
          "Treatment & Complications: Strict lifelong Gluten-Free Diet (GFD). Complications include enteropathy-associated T-cell lymphoma (EATL), small bowel adenocarcinoma, and refractory sprue.",
        ],
        callout: {
          title: "Dermatitis Herpetiformis",
          points: [
            "Intensely pruritic vesicular rash over extensor surfaces (elbows, knees, buttocks) showing granular IgA deposition at dermal papillae.",
            "Responds directly to gluten-free diet + dapsone.",
          ],
        },
      },
    ],
  },
  6: {
    id: 6,
    title: "Small Bowel Diseases (SIBO, Whipple, Bile Acid Diarrhea)",
    doctor: "Dr. Mohammed Harith",
    system: "Gastroenterology",
    readTime: "14 min",
    content: [
      {
        sectionTitle: "1. Small Intestinal Bacterial Overgrowth (SIBO)",
        items: [
          "Etiology: Loss of gastric acid barrier, impaired motility (diabetic neuropathy, scleroderma), or anatomical blind loops (Roux-en-Y).",
          "Diagnosis: Glucose/Lactulose Hydrogen Breath Test or small bowel aspirate culture (>10^5 CFU/mL).",
          "Management: Broad-spectrum antibiotics (Rifaximin, ciprofloxacin, or metronidazole for 2 weeks) + Vitamin B12 replacement.",
        ],
      },
      {
        sectionTitle: "2. Whipple's Disease & Other Small Bowel Disorders",
        boxes: [
          { subtitle: "Whipple's Disease", details: "Caused by Tropheryma whipplei; PAS-positive foamy macrophages in duodenal lamina propria. Treated with IV Ceftriaxone (2 weeks) followed by oral Co-trimoxazole for 1 year." },
          { subtitle: "Bile Acid Diarrhoea", details: "Occurs after terminal ileal resection; unabsorbed bile acids irritate colon. Treated with Cholestyramine resin." },
          { subtitle: "Short Bowel Syndrome", details: "Malabsorptive state following extensive intestinal resection; requires total parenteral nutrition (TPN) and GLP-2 analogues (Teduglutide)." },
        ],
      },
    ],
  },
  7: {
    id: 7,
    title: "Irritable Bowel Syndrome (IBS)",
    doctor: "Dr. Mohammed Harith",
    system: "Gastroenterology",
    readTime: "12 min",
    content: [
      {
        sectionTitle: "1. Definition & Rome IV Criteria",
        items: [
          "Recurrent abdominal pain on average at least 1 day/week in the last 3 months, associated with 2 or more: related to defecation, change in stool frequency, change in stool form.",
          "Subtypes: IBS-Diarrhoea (IBS-D), IBS-Constipation (IBS-C), Mixed (IBS-M), and Unclassified (IBS-U).",
        ],
        callout: {
          title: "Alarm Features (Must Exclude Organic Pathology)",
          points: [
            "Age > 50 years, nocturnal symptoms, unintentional weight loss, overt rectal bleeding, anaemia, palpable abdominal mass, family history of colorectal cancer/IBD.",
          ],
        },
      },
      {
        sectionTitle: "2. Management Algorithm",
        items: [
          "Dietary: Regular meals, low FODMAP diet, avoidance of artificial sweeteners and insoluble fiber.",
          "IBS-D: Loperamide, Colestyramine, Rifaximin, TCAs (Amitriptyline 10-25 mg at bedtime).",
          "IBS-C: Soluble fiber (psyllium/ispaghula), Osmotic laxatives (macrogol), Prucalopride, Linaclotide.",
          "Antispasmodics for pain: Mebeverine, Hyoscine, Peppermint oil.",
        ],
      },
    ],
  },
  8: {
    id: 8,
    title: "Peptic Ulcer Disease (PUD)",
    doctor: "Dr. Abdullah Alyouzbaki",
    system: "Gastroenterology",
    readTime: "14 min",
    content: [
      {
        sectionTitle: "1. Epidemiology & Pathophysiology",
        items: [
          "Duodenal Ulcers (DU) are 90% associated with H. pylori and antral-predominant gastritis with acid hypersecretion.",
          "Gastric Ulcers (GU) are 70% associated with H. pylori and 30% NSAIDs, resulting from impaired mucosal protection.",
          "Smoking increases risk of ulceration, delays healing, and promotes recurrence.",
        ],
      },
      {
        sectionTitle: "2. H. pylori Eradication Regimens",
        boxes: [
          { subtitle: "Standard Triple Therapy (10-14 days)", details: "PPI standard dose twice daily + Amoxicillin 1g BD + Clarithromycin 500mg BD (or Metronidazole 500mg BD)." },
          { subtitle: "Bismuth Quadruple Therapy (High Resistance Areas)", details: "PPI twice daily + Bismuth subcitrate + Metronidazole + Tetracycline for 10-14 days." },
        ],
      },
    ],
  },
  9: {
    id: 9,
    title: "PUD Complications, ZES & Functional Dyspepsia",
    doctor: "Dr. Abdullah Alyouzbaki",
    system: "Gastroenterology",
    readTime: "15 min",
    content: [
      {
        sectionTitle: "1. Major PUD Complications",
        items: [
          "Perforation: Sudden severe generalized abdominal pain radiating to shoulder tip; 'board-like' rigidity, free gas under diaphragm on erect CXR; requires emergency laparotomy/laparoscopy.",
          "Gastric Outlet Obstruction (Pyloric Stenosis): Recurrent projectile vomiting of undigested food eaten >24h earlier, succussion splash, hypochloraemic hypokalaemic metabolic alkalosis with paradoxical aciduria.",
        ],
      },
      {
        sectionTitle: "2. Zollinger-Ellison Syndrome (ZES)",
        items: [
          "Triad: Severe/refractory peptic ulceration, massive gastric acid hypersecretion, and gastrinoma (pancreas/duodenum). 25% associated with MEN 1.",
          "Diagnosis: Fasting serum gastrin markedly elevated (>10-1000 fold); Paradoxical rise in gastrin following Secretin stimulation test.",
          "Treatment: High-dose PPIs (double standard dose) and surgical excision if localized.",
        ],
      },
    ],
  },
  10: {
    id: 10,
    title: "Esophageal & Gastric Tumors",
    doctor: "Dr. Aliaa",
    system: "Gastroenterology",
    readTime: "16 min",
    content: [
      {
        sectionTitle: "1. Esophageal Carcinoma",
        items: [
          "Squamous Cell Carcinoma: Upper & mid-oesophagus; risk factors include smoking, alcohol, achalasia, tylosis, caustic strictures.",
          "Adenocarcinoma: Lower third arising from Barrett's oesophagus; risk factors include long-standing GERD, obesity.",
          "Clinical Features: Progressive painless dysphagia (solids then liquids), rapid weight loss, hoarseness (recurrent laryngeal nerve invasion).",
        ],
      },
      {
        sectionTitle: "2. Gastric Adenocarcinoma & Lymphoma",
        items: [
          "Adenocarcinoma: Strongly linked to chronic H. pylori infection (CagA strains), atrophic gastritis, smoking, dietary nitrates. Signs of metastasis: Virchow's node (Troisier's sign), Sister Mary Joseph nodule (umbilicus), Krukenberg tumour (ovary).",
          "Gastric MALT Lymphoma: Low-grade B-cell lymphoma associated with H. pylori; completely regresses in early stages with H. pylori eradication therapy alone.",
        ],
      },
    ],
  },
  11: {
    id: 11,
    title: "Inflammatory Bowel Disease (IBD - Part 1: Pathology & Clinical)",
    doctor: "Dr. Abdullah Alyouzbaki",
    system: "Gastroenterology",
    readTime: "15 min",
    content: [
      {
        sectionTitle: "1. Comparison: Ulcerative Colitis vs Crohn's Disease",
        boxes: [
          { subtitle: "Ulcerative Colitis (UC)", details: "Continuous inflammation strictly confined to mucosa/submucosa; starts at rectum (proctitis) and extends proximally; crypt abscesses, bleeding, pseudopolyps. Non-smokers at higher risk." },
          { subtitle: "Crohn's Disease (CD)", details: "Transmural patchy ('skip lesions') inflammation affecting any part of GIT from mouth to anus (terminal ileum most common); deep fissure ulcers, cobblestone mucosa, fistulae, non-caseating granulomas. Smokers at 3x higher risk." },
        ],
      },
      {
        sectionTitle: "2. Clinical Presentations & Complications",
        items: [
          "UC: Bloody diarrhoea with mucus, tenesmus, rectal bleeding, toxic megacolon (transverse colon >6 cm with high perforation risk).",
          "CD: Abdominal pain, watery non-bloody diarrhoea, weight loss, perianal disease (fissures, skin tags, complex fistulae), strictures with bowel obstruction.",
        ],
      },
    ],
  },
  12: {
    id: 12,
    title: "Inflammatory Bowel Disease (IBD - Part 2: Management & Surgery)",
    doctor: "Dr. Abdullah Alyouzbaki",
    system: "Gastroenterology",
    readTime: "16 min",
    content: [
      {
        sectionTitle: "1. Medical Management Strategy",
        items: [
          "Induction of Remission in UC: 5-ASAs (oral/topical Mesalazine) -> Oral Prednisolone -> IV Methylprednisolone -> Rescue therapy (Infliximab or Ciclosporin) for steroid-refractory acute severe colitis.",
          "Induction of Remission in CD: Oral Budesonide (for ileal/ileocaecal) or Prednisolone; Enteral nutrition (especially in children); Biologics (Infliximab / Adalimumab).",
          "Maintenance: Thiopurines (Azathioprine / 6-Mercaptopurine), Biologics (Anti-TNF, Vedolizumab, Ustekinumab). Steroids are NEVER used for maintenance.",
        ],
      },
      {
        sectionTitle: "2. Surgical Interventions",
        items: [
          "UC: Panproctocolectomy with ileal pouch-anal anastomosis (IPAA) or end ileostomy is curative.",
          "CD: Conservative resections, stricturoplasty; surgery is non-curative due to recurrent disease at anastomotic sites. Smoking cessation is mandatory.",
        ],
      },
    ],
  },
  13: {
    id: 13,
    title: "Colorectal Cancer & Polyps",
    doctor: "Dr. Alya A. Al Zobair",
    system: "Gastroenterology",
    readTime: "16 min",
    content: [
      {
        sectionTitle: "1. Genetic Syndromes & Risk Factors",
        boxes: [
          { subtitle: "FAP (Familial Adenomatous Polyposis)", details: "Autosomal dominant mutation in APC gene; 1000s of adenomatous polyps; 100% risk of colorectal cancer by age 40 if untreated by prophylactic colectomy." },
          { subtitle: "HNPCC (Lynch Syndrome)", details: "DNA mismatch repair (MMR) defect; early onset right-sided colon cancers and extracolonic tumours (endometrial, ovarian)." },
        ],
      },
      {
        sectionTitle: "2. Clinical Features, Staging & Management",
        items: [
          "Left-sided tumours: Early bowel obstruction, fresh rectal bleeding, altered bowel habits.",
          "Right-sided tumours: Occult bleeding, iron deficiency anaemia, palpable RIF mass; obstruction occurs late.",
          "Treatment: Surgical resection + regional lymphadenectomy. Adjuvant chemotherapy (FOLFOX / CapeOX) for Stage III (node positive); Neoadjuvant chemoradiation for rectal cancers.",
        ],
      },
    ],
  },
  14: {
    id: 14,
    title: "Acute Upper Gastrointestinal Bleeding",
    doctor: "Dr. Mohammed Harith",
    system: "Gastroenterology",
    readTime: "15 min",
    content: [
      {
        sectionTitle: "1. Causes & Stratification",
        items: [
          "Most Common Causes: Peptic ulcer disease (35-50%), Gastric erosions (10-20%), Oesophagitis (10%), Oesophageal varices (2-9%), Mallory-Weiss tears (5%).",
          "Glasgow-Blatchford Score (GBS): Assesses need for intervention pre-endoscopy based on urea, Hb, systolic BP, tachycardia, melena, syncope, and hepatic disease. Score <=1 = low risk.",
        ],
      },
      {
        sectionTitle: "2. Resuscitation & Endoscopic Intervention",
        items: [
          "Immediate Resuscitation: Wide-bore IV cannulae (16-18G), IV crystalloids, blood cross-match, correction of coagulopathy.",
          "Endoscopy within 24h: Dual endoscopic haemostasis (Adrenaline injection + heater probe / hemoclips) + IV high-dose PPI infusion.",
          "Variceal Bleeding: IV Terlipressin/Octreotide + prophylactic broad-spectrum antibiotics + endoscopic variceal band ligation (EVL).",
        ],
      },
    ],
  },
  15: {
    id: 15,
    title: "Pancreatic Diseases (Acute & Chronic Pancreatitis)",
    doctor: "Dr. Mohammed Harith",
    system: "Gastroenterology",
    readTime: "18 min",
    content: [
      {
        sectionTitle: "1. Acute Pancreatitis",
        items: [
          "Etiology (I GET SMASHED): Gallstones (most common), Ethanol/Alcohol, Trauma, Steroids, Mumps/Malignancy, Autoimmune, Scorpion sting, Hypercalcemia/Hypertriglyceridemia, ERCP, Drugs (Azathioprine, thiazides, valproate).",
          "Diagnosis: Requires 2 of 3: Characteristic epigastric pain radiating to back relieved by leaning forward, Serum amylase or lipase >=3x ULN, Characteristic findings on CT/US.",
          "Signs of Severity: Cullen's sign (periumbilical ecchymosis), Grey Turner's sign (flank ecchymosis), Glasgow score >=3, CRP >150 mg/L.",
        ],
      },
      {
        sectionTitle: "2. Chronic Pancreatitis",
        items: [
          "Pathophysiology: Irreversible fibrosis and loss of exocrine/endocrine pancreatic tissue, predominantly due to long-standing alcoholism (60-90%).",
          "Features: Intractable abdominal pain, malabsorption with steatorrhea, weight loss, pancreatogenic diabetes mellitus, pancreatic calcifications on imaging.",
          "Management: Alcohol and smoking cessation, oral pancreatic enzyme replacement (Creon) with meals, insulin therapy, analgesia, and endoscopic stenting/lithotripsy.",
        ],
      },
    ],
  },
  16: {
    id: 16,
    title: "Acute Infectious Diarrhoea & Gastroenteritis",
    doctor: "Dr. Abdullah Alyouzbaki",
    system: "Gastroenterology",
    readTime: "12 min",
    content: [
      {
        sectionTitle: "1. Pathogenesis & Clinical Presentation",
        items: [
          "Toxin-mediated (<6-18h incubation): B. cereus, S. aureus, V. cholerae -> Profuse watery diarrhea, severe vomiting, no fever/blood.",
          "Invasive/Cytotoxic: Shigella, Campylobacter, EHEC, Salmonella -> Mucosal ulceration, fever, systemic upset, and dysentery (bloody diarrhea).",
        ],
      },
      {
        sectionTitle: "2. Rehydration & Therapeutics",
        items: [
          "Oral Rehydration Salts (ORS): Contains glucose and electrolytes utilizing sodium-glucose cotransport across enterocytes.",
          "Deficit Replacement: 1-1.5 L ORS/Saline in first 2-4 hours + 200 mL per loose stool.",
          "Avoid antibiotics in EHEC (prevents precipitation of HUS); avoid antimotility agents (Loperamide) in acute bacterial dysentery.",
        ],
      },
    ],
  },
};