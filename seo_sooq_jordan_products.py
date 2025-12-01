#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكربت سكيما وSEO لكل المنتجات في مجلد products
ريبو: sooq-Jordan
"""

import sys
import re
from pathlib import Path
from datetime import datetime, timedelta

def extract_title(html: str) -> str:
    """استخراج عنوان المنتج من <title> أو <h1>"""
    m = re.search(r'<title[^>]*>([^<]+)</title>', html, re.IGNORECASE)
    if m:
        txt = m.group(1).strip()
        if '|' in txt:
            txt = txt.split('|')[0].strip()
        return txt if txt else "منتج من سوق الأردن"
    m = re.search(r'<h1[^>]*>([^<]+)</h1>', html, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return "منتج من سوق الأردن"

def extract_image(html: str) -> str:
    """استخراج أول صورة من الصفحة"""
    m = re.search(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', html, re.IGNORECASE)
    if m:
        src = m.group(1).strip()
        if src.startswith('http'):
            return src
        return f"https://sherow1982.github.io/sooq-Jordan/{src.lstrip('/')}"
    return "https://sherow1982.github.io/sooq-Jordan/logo.png"

def extract_price(html: str) -> float:
    """محاولة استخراج السعر من النص"""
    patterns = [
        r'(\d+[\.,]?\d*)\s*(JOD|دينار|د\.ا|د\.أ|د.ا|د.أ)',
        r'price["\']?\s*[:=]\s*["\']?(\d+[\.,]?\d*)'
    ]
    for pattern in patterns:
        m = re.search(pattern, html, re.IGNORECASE)
        if m:
            val = m.group(1).replace(',', '.')
            try:
                return float(val)
            except:
                continue
    return 0.0

def build_product_url(file_path: Path) -> str:
    """بناء رابط GitHub Pages للمنتج"""
    name = file_path.name
    return f"https://sherow1982.github.io/sooq-Jordan/products/{name}"

def create_product_schema(title: str, image: str, url: str, price: float) -> str:
    """إنشاء Product Schema كنص JSON-LD"""
    import json
    if not price:
        price = 0.0
    price_valid_until = (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%d')
    schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": title,
        "image": [image],
        "description": f"{title} - منتجات أصلية من سوق الأردن مع توصيل سريع.",
        "brand": {
            "@type": "Brand",
            "name": "سوق الأردن"
        },
        "offers": {
            "@type": "Offer",
            "url": url,
            "priceCurrency": "JOD",
            "price": str(price),
            "priceValidUntil": price_valid_until,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "سوق الأردن"
            }
        }
    }
    return json.dumps(schema, ensure_ascii=False, indent=2)

def create_local_business_schema() -> str:
    """إنشاء LocalBusiness Schema لسوق الأردن"""
    import json
    schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "سوق الأردن",
        "image": "https://sherow1982.github.io/sooq-Jordan/logo.png",
        "url": "https://sherow1982.github.io/sooq-Jordan/",
        "telephone": "+201110760081",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "المملكة الأردنية الهاشمية",
            "addressLocality": "عمّان",
            "addressRegion": "عمّان",
            "postalCode": "11941",
            "addressCountry": "JO"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "31.963158",
            "longitude": "35.930359"
        },
        "openingHours": "Su-Sa 08:00-23:00",
        "priceRange": "$$"
    }
    return json.dumps(schema, ensure_ascii=False, indent=2)

def create_meta_tags(title: str, image: str, url: str, price: float) -> str:
    """إنشاء Meta + OG + Twitter tags محسنة"""
    desc = f"{title} - منتجات أصلية من سوق الأردن مع توصيل لجميع المحافظات."
    if len(desc) > 155:
        desc = desc[:152] + "..."
    meta = f"""
    <!-- SEO Meta Tags (Auto) -->
    <meta charset="UTF-8">
    <title>{title} - سوق الأردن | تسوق أونلاين</title>
    <meta name="description" content="{desc}">
    <meta name="keywords" content="{title}, سوق الأردن, تسوق, منتجات, عروض, الأردن, عمّان">
    <meta name="robots" content="index, follow">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="geo.region" content="JO">
    <meta name="geo.placename" content="الأردن">
    <meta name="geo.position" content="31.963158;35.930359">
    <link rel="canonical" href="{url}">
    <!-- Open Graph -->
    <meta property="og:title" content="{title} - سوق الأردن">
    <meta property="og:description" content="{desc}">
    <meta property="og:image" content="{image}">
    <meta property="og:url" content="{url}">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="سوق الأردن">
    <meta property="og:locale" content="ar_JO">
    <meta property="product:price:amount" content="{price}">
    <meta property="product:price:currency" content="JOD">
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title} - سوق الأردن">
    <meta name="twitter:description" content="{desc}">
    <meta name="twitter:image" content="{image}">
    """
    return meta

def inject_seo(html: str, title: str, image: str, url: str, price: float) -> str:
    """حقن الميتا والسكيما في <head>"""
    # ضمان وجود </head>
    if '</head>' not in html:
        if '<body' in html.lower():
            html = html.replace('<body', '</head><body', 1)
        else:
            html = html + '</head>'
    # إزالة أي سكيما JSON-LD قديم
    html = re.sub(
        r'<script\s+type=["\']?application/ld\+json["\']?\s*>.*?</script>',
        '',
        html,
        flags=re.DOTALL | re.IGNORECASE
    )
    meta = create_meta_tags(title, image, url, price)
    product_schema = create_product_schema(title, image, url, price)
    local_schema = create_local_business_schema()
    injection = f"""
{meta}

<!-- Product Schema JSON-LD (Auto) -->
<script type="application/ld+json">
{product_schema}
</script>

<!-- LocalBusiness Schema JSON-LD (Auto) -->
<script type="application/ld+json">
{local_schema}
</script>

</head>"""
    return html.replace('</head>', injection, 1)

def process_file(file_path: Path) -> bool:
    """معالجة ملف HTML واحد"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            html = f.read()
        title = extract_title(html)
        image = extract_image(html)
        price = extract_price(html)
        url = build_product_url(file_path)
        updated = inject_seo(html, title, image, url, price)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated)
        print(f"   ✅ تم تحديث: {file_path.name}")
        return True
    except Exception as e:
        print(f"   ❌ خطأ في {file_path.name}: {e}")
        return False

def main():
    print("\n" + "="*70)
    print("🏷️ سكربت SEO + سكيما لجميع منتجات سوق الأردن (sooq-Jordan) 🏷️")
    print("="*70 + "\n")

    root = Path(".")
    products_dir = root / "products"

    if not products_dir.exists():
        print(f"❌ مجلد products غير موجود في: {root.resolve()}")
        sys.exit(1)

    html_files = sorted(products_dir.glob("*.html"))
    if not html_files:
        print("❌ لا يوجد أي ملفات HTML داخل products/")
        sys.exit(1)

    print(f"📦 تم العثور على {len(html_files)} صفحة منتج في products/\n")

    ok = 0
    fail = 0

    for i, fp in enumerate(html_files, 1):
        print(f"[{i}/{len(html_files)}] معالجة: {fp.name} ...")
        if process_file(fp):
            ok += 1
        else:
            fail += 1

    print("\n" + "="*70)
    print("📊 النتائج النهائية:")
    print("="*70)
    print(f"✅ نجح: {ok} ملف")
    print(f"❌ فشل: {fail} ملف")
    print(f"📈 نسبة النجاح: {(ok/len(html_files)*100):.1f}%")
    print("="*70)
    print("\n✨ انتهى التنفيذ! كل صفحة منتج أصبح بها سكيما JSON-LD + Meta كاملة.\n")

if __name__ == "__main__":
    main()
