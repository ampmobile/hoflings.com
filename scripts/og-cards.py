#!/usr/bin/env python3
"""
Generate the Open Graph / Twitter card images for hoflings.com.

One 1200x630 PNG per public page, plus a 180x180 Apple touch icon. The art
direction follows the site's "Night Dispatch" theme: near-black ground,
dispatch-lane grid, amber accent, mint route tag, SF Pro for display type and
SF Mono for the technical labels.

Requires Pillow. Run from the repo root:

    python3 scripts/og-cards.py

Output: public/og/<slug>.png, public/apple-touch-icon.png
"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
BG = (5, 7, 12)
LANE = (13, 20, 32)
AMBER = (255, 180, 31)
MINT = (59, 232, 176)
WHITE = (244, 246, 250)
DIM = (122, 132, 150)
RULE = (26, 34, 49)

SANS = '/System/Library/Fonts/SFNS.ttf'
MONO = '/System/Library/Fonts/SFNSMono.ttf'

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'og')
ICON = os.path.join(ROOT, 'public', 'apple-touch-icon.png')

PAGES = [
    ('index',     'HOFLINGS',  'AI recruiting and onboarding for the freight economy'),
    ('services',  'SERVICES',  'Recruiting, onboarding and HR services for transportation'),
    ('platform',  'PLATFORM',  'One operating system for transportation hiring'),
    ('industries','INDUSTRIES','Hiring and HR programs built for freight'),
    ('hrbridge',  'HRBRIDGE',  'Fully automated AI recruiting for delivery fleets'),
    ('about',     'ABOUT',     'Built for the hiring problems of freight operators'),
    ('contact',   'CONTACT',   'Bring a live requisition. We will run it for you'),
    ('privacy',   'PRIVACY',   'How Hoflings Ltd handles personal information'),
    ('terms',     'TERMS',     'The agreement covering our services and fees'),
]


def font(path, size, variation=None):
    f = ImageFont.truetype(path, size)
    if variation:
        try:
            f.set_variation_by_name(variation)
        except Exception:
            pass
    return f


def tracked(draw, xy, text, f, fill, tracking=0):
    """Draw text with extra letter spacing. Returns the advance width."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=f, fill=fill)
        x += f.getlength(ch) + tracking
    return x - tracking


def wrap(text, f, max_width):
    words, lines, line = text.split(), [], ''
    for w in words:
        trial = f'{line} {w}'.strip()
        if f.getlength(trial) <= max_width or not line:
            line = trial
        else:
            lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


def glow(img, center, radius, color, alpha):
    """Soft radial wash, composited under the content."""
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    steps = 90
    for i in range(steps, 0, -1):
        r = radius * i / steps
        a = int(alpha * (1 - i / steps) ** 2)
        d.ellipse([center[0] - r, center[1] - r, center[0] + r, center[1] + r],
                  fill=color + (a,))
    img.alpha_composite(layer)


def logomark(draw, x, y, size, color):
    """The Hoflings dispatch mark: a rising route line with a start node."""
    s = size / 24
    pts = [(3, 17), (8, 8), (12, 13), (15, 9), (21, 17)]
    pts = [(x + px * s, y + py * s) for px, py in pts]
    draw.line(pts, fill=color, width=max(2, int(s * 0.75)), joint='curve')
    r = 1.5 * s
    cx, cy = pts[0]
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)


def build_card(slug, eyebrow, title):
    img = Image.new('RGBA', (W, H), BG + (255,))
    d = ImageDraw.Draw(img)

    # Dispatch-lane grid.
    for gx in range(0, W + 1, 96):
        d.line([(gx, 0), (gx, H)], fill=LANE, width=1)

    glow(img, (1080, 90), 620, AMBER, 30)

    # Brand row.
    logomark(d, 72, 62, 52, AMBER)
    tracked(d, (142, 68), 'HOFLINGS', font(SANS, 30, 'Semibold'), WHITE, 7)

    # Eyebrow.
    tracked(d, (74, 196), eyebrow, font(MONO, 21, 'Medium'), AMBER, 4)

    # Title.
    tf = font(SANS, 64, 'Bold')
    lines = wrap(title, tf, W - 148)
    while len(lines) > 3:
        tf = font(SANS, 56, 'Bold')
        lines = wrap(title, tf, W - 148)
    y = 244
    for line in lines:
        d.text((72, y), line, font=tf, fill=WHITE)
        y += int(tf.size * 1.14)

    # Footer rule + route tag.
    d.line([(72, 520), (W - 72, 520)], fill=RULE, width=1)
    tracked(d, (74, 546), 'hoflings.com', font(MONO, 22, 'Medium'), MINT, 2)
    path = '/' if slug == 'index' else f'/{slug}'
    w = font(MONO, 22, 'Regular').getlength(path)
    tracked(d, (W - 74 - w, 546), path, font(MONO, 22, 'Regular'), DIM, 2)

    return img.convert('RGB')


def build_icon():
    """180x180 Apple touch icon: the dispatch mark on the ground colour."""
    size = 180
    img = Image.new('RGBA', (size, size), BG + (255,))
    d = ImageDraw.Draw(img)
    logomark(d, 34, 34, 112, AMBER)
    return img.convert('RGB')


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for slug, eyebrow, title in PAGES:
        card = build_card(slug, eyebrow, title)
        path = os.path.join(OUT, f'{slug}.png')
        card.save(path, 'PNG', optimize=True)
        print(f'og: {os.path.relpath(path, ROOT)}  {card.size[0]}x{card.size[1]}')
    icon = build_icon()
    icon.save(ICON, 'PNG', optimize=True)
    print(f'icon: {os.path.relpath(ICON, ROOT)}  {icon.size[0]}x{icon.size[1]}')
