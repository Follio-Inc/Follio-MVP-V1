import re
import json
import os
import sys
import fitz
from readers.pdf_reader import read_pdf
from readers.docx_reader import read_docx

# --- New Helper Functions for Advanced PDF Parsing ---

def get_dominant_font_info(metadata):
    """Finds the most common font size and name for body text."""
    if not metadata:
        return 10, "default"
    
    sizes = [span['size'] for span in metadata if span['text'].strip()]
    fonts = [span['font'] for span in metadata if span['text'].strip()]
    
    dominant_size = max(set(sizes), key=sizes.count) if sizes else 10
    dominant_font = max(set(fonts), key=fonts.count) if fonts else "default"
    
    return dominant_size, dominant_font

def is_header(span, body_size):
    """Determines if a text span is likely a section header."""
    text = span['text'].strip()
    if not text:
        return False

    # Rule 1: Larger than body text or bold
    is_formatted = span['size'] > (body_size + 1) or "bold" in span['font'].lower()
    
    # Rule 2: Short, and likely a keyword or all caps
    is_header_like_content = (
        len(text.split()) < 5 or
        text.isupper()
    )
    
    return is_formatted and is_header_like_content

def read_resume(file_path):
    """
    Reads resume content. For PDFs, it returns rich metadata.
    For other types, it returns plain text.
    """
    try:
        if file_path.endswith('.pdf'):
            doc = fitz.open(file_path)
            metadata = []
            raw_text = ""
            for page_num, page in enumerate(doc):
                raw_text += page.get_text() + "\n"
                page_data = page.get_text("dict")
                for block in page_data.get("blocks", []):
                    if block['type'] == 0:  # Text block
                        for line in block.get("lines", []):
                            for span in line.get("spans", []):
                                metadata.append({
                                    "text": span["text"],
                                    "size": span["size"],
                                    "font": span["font"],
                                    "bbox": span["bbox"],
                                    "page": page_num
                                })
            doc.close()
            return {"raw_text": raw_text, "metadata": metadata}
        
        elif file_path.endswith('.docx'):
            text = read_docx(file_path)
            return {"raw_text": text, "metadata": None}
        
        else:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
                return {"raw_text": text, "metadata": None}

    except Exception as e:
        print(f"An error occurred while reading the file '{file_path}': {e}")
        return None

def parse_personal_info(text):
    """Parses personal information like name, email, and phone number."""
    info = {}
    
    # Regex for email
    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    info['email'] = email_match.group(0) if email_match else None
    
    # Regex for phone number (handles various formats)
    phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    info['phone'] = phone_match.group(0) if phone_match else None
    
    # Simple approach for name: assume it's the first line
    info['name'] = text.split('\n')[0].strip()
    
    return info

def parse_sections(text, metadata=None):
    """
    Parse resume sections. Lines that contain any keyword (substring match)
    and look like a header (short, all-caps, ends with colon, or starts with the keyword)
    will start a new section. Multiple occurrences of the same canonical section
    (e.g., several "education" headings) will be merged into a single section.
    """
    sections = {}
    # groups of keywords mapped to canonical section titles
    groups = [
        (['summary', 'profile', 'objective'], 'Summary'),
        (['experience', 'professional experience', 'work experience', 'work history', 'employment'], 'Experience'),
        (['education', 'educational', 'educational history', 'degree', 'school', 'institution', 'university', 'college'], 'Education'),
        (['skills', 'competencies', 'ability', 'abilities'], 'Skills'),
        (['projects', 'portfolio'], 'Projects'),
        (['certifications', 'certificates', 'license', 'licenses'], 'Certifications'),
        (['award', 'awards', 'honors', 'achievements'], 'Awards'),
        (['publications'], 'Publications'),
    ]

     # --- Advanced PDF Parsing using Metadata ---
    if metadata:
        body_size, _ = get_dominant_font_info(metadata)
        
        # Find all headers and their original index
        headers = []
        for i, span in enumerate(metadata):
            span_text_lower = span['text'].strip().lower()
            if not span_text_lower:
                continue
            
            for keywords, canonical in groups:
                if any(kw in span_text_lower for kw in keywords) and is_header(span, body_size):
                    headers.append({
                        "canonical": canonical,
                        "bbox": span['bbox'],
                        "page": span['page'],
                        "index": i
                    })
                    break # Move to next span once a header is found
        
        # Sort headers by page and vertical position
        headers.sort(key=lambda h: (h['page'], h['bbox'][1]))
        
        sections = {}
        for i, header in enumerate(headers):
            start_index = header['index'] + 1
            end_index = len(metadata)
            
            # Find the end of the section (start of the next header)
            if i + 1 < len(headers):
                end_index = headers[i+1]['index']
            
            # Collect all text spans within this section
            content_spans = metadata[start_index:end_index]
            section_text = ' '.join(span['text'] for span in content_spans).strip()
            
            # Merge content if section already exists
            canonical_name = header['canonical']
            if canonical_name in sections:
                sections[canonical_name] += "\n" + section_text
            else:
                sections[canonical_name] = section_text
        
        return sections

    # --- Fallback to Text-Based Parsing ---
    else:
        sections = {}
        lines = text.splitlines()
        current = None
        buffer = []

        def save_current():
            nonlocal sections, current, buffer
            if not current: return
            content = '\n'.join(buffer).strip()
            if not content:
                buffer = []
                return
            if current in sections and sections[current]:
                sections[current] = sections[current].rstrip() + '\n' + content
            else:
                sections[current] = content
            buffer = []

        for line in lines:
            cleaned = line.strip()
            if not cleaned:
                if current: buffer.append('')
                continue

            lw = cleaned.lower()
            matched_title = None
            for kws, canon in groups:
                if any(kw in lw for kw in kws):
                    words = cleaned.split()
                    if len(words) <= 5 or cleaned.isupper() or cleaned.endswith(':'):
                        matched_title = canon
                        break
            
            if matched_title:
                save_current()
                current = matched_title
                buffer = []
            elif current:
                buffer.append(cleaned)

        save_current()
        return sections

def save_to_file(data, output_filename):
    """Saves the extracted data to a JSON file."""
    try:
        with open(output_filename, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4)
        print(f"Successfully saved parsed data to '{output_filename}'")
    except Exception as e:
        print(f"An error occurred while saving the file: {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python data_parse.py <resume_file> [output.json]")
        sys.exit(1)

    in_path = sys.argv[1]
    if not os.path.isfile(in_path):
        print(f"Error: '{in_path}' not found.")
        sys.exit(1)

    out_path = sys.argv[2] if len(sys.argv) >= 3 else (os.path.splitext(in_path)[0] + "_parsed.json")

    resume_data = read_resume(in_path)
    if not resume_data or not resume_data['raw_text']:
        print("Error: no text extracted from the resume.")
        sys.exit(1)

    personal_info = parse_personal_info(resume_data['raw_text'])
    sections = parse_sections(resume_data['raw_text'], resume_data.get('metadata'))

    data = {"personal_info": personal_info, "sections": sections}
    save_to_file(data, out_path)
    print(f"Parsed -> {out_path}")

if __name__ == "__main__":
    main()