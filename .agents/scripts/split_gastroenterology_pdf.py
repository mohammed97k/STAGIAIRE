from pathlib import Path
import fitz


SOURCE = Path("attached_assets/Git_1788184953298.pdf")
OUTPUT = Path("artifacts/stagier-sixth-stage/public/lectures/Gastroenterology")

SECTIONS = [
    ("01-anatomy-physiology-gi-tract.pdf", 48, 54),
    ("02-investigations-git-system.pdf", 93, 105),
    ("03-esophagus-gerd-achalasia.pdf", 61, 73),
    ("04-acute-chronic-gastritis-h-pylori.pdf", 106, 111),
    ("05-malabsorption-celiac-disease.pdf", 112, 122),
    ("06-small-bowel-diseases-sibo-whipple.pdf", 129, 137),
    ("07-irritable-bowel-syndrome-ibs.pdf", 35, 40),
    ("08-peptic-ulcer-disease-pud.pdf", 123, 128),
    ("09-pud-complications-zes-dyspepsia.pdf", 15, 20),
    ("10-esophageal-gastric-tumors.pdf", 21, 34),
    ("11-inflammatory-bowel-disease-part-1.pdf", 138, 151),
    ("12-inflammatory-bowel-disease-part-2.pdf", 74, 83),
    ("13-colorectal-cancer-polyps.pdf", 84, 92),
    ("14-acute-upper-git-bleeding.pdf", 55, 60),
    ("15-pancreatic-diseases-pancreatitis.pdf", 1, 14),
    ("16-acute-infectious-diarrhoea.pdf", 41, 47),
]


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    source = fitz.open(SOURCE)
    for filename, first_page, last_page in SECTIONS:
        destination = OUTPUT / filename
        section = fitz.open()
        section.insert_pdf(source, from_page=first_page - 1, to_page=last_page - 1)
        section.save(destination)
        section.close()
        print(f"{filename}: pages {first_page}-{last_page} -> {last_page - first_page + 1} pages")
    source.close()


if __name__ == "__main__":
    main()