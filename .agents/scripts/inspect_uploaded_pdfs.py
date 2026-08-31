from pathlib import Path
import sys

import fitz


def main() -> None:
    output_dir = Path("/tmp/stagier-pdf-previews")
    output_dir.mkdir(parents=True, exist_ok=True)
    input_path = Path(sys.argv[1])
    sources = [input_path] if input_path.is_file() else sorted(input_path.glob("*.pdf"))
    for source in sources:
        document = fitz.open(source)
        page = document[0]
        preview_path = output_dir / f"{source.stem}.png"
        page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False).save(preview_path)
        print(f"{source.name}: {len(document)} pages -> {preview_path}")
        for page_number in range(min(len(document), 5)):
            text = " ".join(document[page_number].get_text("text").split())
            print(f"  page {page_number + 1}: {text[:240]}")
        document.close()


if __name__ == "__main__":
    main()