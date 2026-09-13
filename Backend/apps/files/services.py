import pymupdf  # PyMuPDF
import docx
import pytesseract
from PIL import Image


def extract_text_from_pdf(file_path):
    text_parts = []
    doc = pymupdf.open(file_path)
    for page in doc:
        text_parts.append(page.get_text())
    doc.close()
    return "\n".join(text_parts)


def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join(p.text for p in doc.paragraphs)


def extract_text_from_image(file_path):
    image = Image.open(file_path)
    return pytesseract.image_to_string(image)


def extract_text(file_instance):
    """
    Dispatches to the right extractor based on file_type.
    Returns (extracted_text, ocr_status).
    """
    path = file_instance.file.path
    file_type = file_instance.file_type

    try:
        if file_type == 'pdf':
            return extract_text_from_pdf(path), 'not_required'
        elif file_type == 'docx':
            return extract_text_from_docx(path), 'not_required'
        elif file_type == 'image':
            return extract_text_from_image(path), 'completed'
        elif file_type == 'text':
            with open(path, 'r', errors='ignore') as f:
                return f.read(), 'not_required'
        else:
            return "", 'not_required'
    except Exception as e:
        print("FILE EXTRACTION ERROR:", repr(e))
        return "", 'failed'
