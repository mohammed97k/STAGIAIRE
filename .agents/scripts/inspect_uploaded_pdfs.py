from pathlib import Path
import sys

import fitz


def main() -> None:
    output_dir = Path("/tmp/stagier-pdf-previews")
    output_dir.mkdir(parents=True, exist_ok=True)
    for source in sorted(Path(sys.argv[1]).glob("*.pdf")):
        document = fitz.open(source)
        page = document[0]
        preview_path = output_dir / f"{source.stem}.png"
        page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False).save(preview_path)
        print(f"{source.name}: {len(document)} pages -> {preview_path}")
        document.close()


if __name__ == "__main__":
    main()