"""Generates the Photo & Media Consent Form PDF for S. Butshingi Academy.
Run with: python scripts/generate_consent_form.py
Output: public/documents/photo-media-consent-form.pdf
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

NAVY = HexColor("#1B2A4A")
GOLD = HexColor("#BF9B30")
INK = HexColor("#1C2233")
MUTED = HexColor("#5B6270")
PAGE_W, PAGE_H = A4

OUT_PATH = "public/documents/photo-media-consent-form.pdf"


def checkbox(c, x, y, size=4.2 * mm):
    c.setStrokeColor(INK)
    c.setLineWidth(0.8)
    c.rect(x, y, size, size)


def wrap_text(c, text, x, y, max_width, font="Helvetica", size=9.5, leading=13, color=INK):
    c.setFont(font, size)
    c.setFillColor(color)
    words = text.split(" ")
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        if c.stringWidth(test, font, size) > max_width:
            c.drawString(x, y, line)
            y -= leading
            line = word
        else:
            line = test
    if line:
        c.drawString(x, y, line)
        y -= leading
    return y


def build():
    c = canvas.Canvas(OUT_PATH, pagesize=A4)
    margin = 20 * mm
    content_w = PAGE_W - 2 * margin

    # Header bar
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - 28 * mm, PAGE_W, 28 * mm, fill=1, stroke=0)
    c.setFillColor(HexColor("#F6F7F9"))
    c.setFont("Helvetica-Bold", 16)
    c.drawString(margin, PAGE_H - 13 * mm, "S. BUTSHINGI ACADEMY")
    c.setFont("Helvetica", 9)
    c.setFillColor(HexColor("#C7D0E0"))
    c.drawString(margin, PAGE_H - 19 * mm, "Mqonci, Chris Hani District, Eastern Cape  |  Registered NPO 2020/119065/07")

    y = PAGE_H - 40 * mm

    # Title
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(margin, y, "Photo & Media Consent Form")
    y -= 10 * mm

    intro = (
        "From time to time we take photos and video of learners at S. Butshingi Academy for "
        "school celebrations, achievements and everyday academy life. This form asks for your "
        "consent, as a parent or legal guardian, before any photo or video of your child is "
        "used publicly. Giving or withholding this consent is entirely your choice and is never "
        "a condition of your child's admission or continued enrolment at the Academy."
    )
    y = wrap_text(c, intro, margin, y, content_w, size=10, leading=14.5)
    y -= 6 * mm

    # Learner details
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(NAVY)
    c.drawString(margin, y, "Learner details")
    y -= 7 * mm
    c.setFont("Helvetica", 9.5)
    c.setFillColor(INK)
    c.drawString(margin, y, "Full name:")
    c.line(margin + 25 * mm, y - 1, margin + content_w * 0.55, y - 1)
    c.drawString(margin + content_w * 0.6, y, "Grade:")
    c.line(margin + content_w * 0.6 + 14 * mm, y - 1, margin + content_w, y - 1)
    y -= 10 * mm
    c.drawString(margin, y, "Date of birth:")
    c.line(margin + 25 * mm, y - 1, margin + content_w, y - 1)
    y -= 12 * mm

    # Guardian details
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(NAVY)
    c.drawString(margin, y, "Parent / legal guardian details")
    y -= 7 * mm
    c.setFont("Helvetica", 9.5)
    c.setFillColor(INK)
    c.drawString(margin, y, "Full name:")
    c.line(margin + 25 * mm, y - 1, margin + content_w, y - 1)
    y -= 10 * mm
    c.drawString(margin, y, "Relationship to learner:")
    c.line(margin + 42 * mm, y - 1, margin + content_w * 0.6, y - 1)
    c.drawString(margin + content_w * 0.65, y, "Phone:")
    c.line(margin + content_w * 0.65 + 13 * mm, y - 1, margin + content_w, y - 1)
    y -= 14 * mm

    # Consent options
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(NAVY)
    c.drawString(margin, y, "I consent to photos/video of my child being used in:")
    y -= 9 * mm

    options = [
        "The school website (sbutshingiacademy.co.za)",
        "The school's official social media pages",
        "Printed materials (newsletters, posters, prospectus)",
    ]
    for opt in options:
        checkbox(c, margin, y - 3.2 * mm, )
        checkbox(c, margin + 22 * mm, y - 3.2 * mm)
        c.setFont("Helvetica", 9)
        c.setFillColor(MUTED)
        c.drawString(margin + 6.5 * mm, y - 3, "Yes")
        c.drawString(margin + 28.5 * mm, y - 3, "No")
        c.setFont("Helvetica", 9.5)
        c.setFillColor(INK)
        c.drawString(margin + 44 * mm, y - 3, opt)
        y -= 9 * mm

    y -= 3 * mm
    c.setFont("Helvetica", 9.5)
    c.setFillColor(INK)
    c.drawString(margin, y, "May we use my child's first name alongside their photo?")
    checkbox(c, margin + content_w - 30 * mm, y - 3.2 * mm)
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawString(margin + content_w - 25 * mm, y - 3, "Yes")
    checkbox(c, margin + content_w - 15 * mm, y - 3.2 * mm)
    c.drawString(margin + content_w - 10 * mm, y - 3, "No")
    y -= 12 * mm

    # Rights note
    note = (
        "You may change or withdraw this consent at any time by contacting the Academy "
        "(details below). See our Privacy Policy at sbutshingiacademy.co.za/privacy-policy "
        "for full details on how we collect, use and protect personal information under "
        "the Protection of Personal Information Act (POPIA)."
    )
    c.setFillColor(HexColor("#F6EFDC"))
    c.rect(margin, y - 20 * mm, content_w, 20 * mm, fill=1, stroke=0)
    wrap_text(c, note, margin + 4 * mm, y - 6 * mm, content_w - 8 * mm, size=9, leading=12.5, color=INK)
    y -= 28 * mm

    # Signature
    c.setFont("Helvetica", 9.5)
    c.setFillColor(INK)
    c.drawString(margin, y, "Signature:")
    c.line(margin + 22 * mm, y - 1, margin + content_w * 0.55, y - 1)
    c.drawString(margin + content_w * 0.6, y, "Date:")
    c.line(margin + content_w * 0.6 + 12 * mm, y - 1, margin + content_w, y - 1)

    # Footer
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(margin, 15 * mm, "S. Butshingi Academy  |  073 587 5718  |  khanyabutshingi22@gmail.com")
    c.setStrokeColor(HexColor("#E7E9EE"))
    c.line(margin, 18 * mm, PAGE_W - margin, 18 * mm)

    c.showPage()
    c.save()


if __name__ == "__main__":
    build()
    print(f"Written to {OUT_PATH}")
