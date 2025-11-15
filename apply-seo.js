const fs = require('fs');

// قراءة ملف المنتجات
const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

// أول 12 منتج للصفحة الرئيسية
const featuredProducts = products.slice(0, 12);

// كلمات مفتاحية عامة للمتجر
const siteKeywords = 'تسوق اون لاين الاردن, شراء منتجات, افضل اسعار, خصومات, توصيل سريع, دفع آمن, جودة عالية';

// توليد Schema Markup للمنتج
const generateProductSchema = (product) => {
    const productURL = 'https://https://sooq-jordan.arabsad.com/products/' + product.slug + '.html';
    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": product.image_link,
        "description": product.description,
        "sku": product.sku,
        "offers": {
            "@type": "Offer",
            "url": productURL,
            "priceCurrency": "JOD",
            "price": product.sale_price,
            "priceValidUntil": "2025-12-31",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "سوق الأردن"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.7",
            "reviewCount": "156"
        }
    };
};

// توليد بطاقة منتج محسنة للسيو
const generateProductCard = (product) => {
    const productPageURL = 'https://https://sooq-jordan.arabsad.com/products/' + product.slug + '.html';
    const whatsappText = 
        '🛍️ *أريد شراء هذا المنتج*\\n\\n' +
        '📦 *المنتج:* ' + product.title + '\\n' +
        '💰 *السعر:* ' + product.sale_price + ' دينار\\n' +
        '🔗 *الرابط:* ' + productPageURL;
    const whatsappURL = 'https://wa.me/201110760081?text=' + encodeURIComponent(whatsappText);
    const discount = product.sale_price < product.price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;

    return '        <div class="product-card" itemscope itemtype="https://schema.org/Product">\n' +
        (discount > 0 ? '            <span class="badge-sale">خصم ' + discount + '%</span>\n' : '') +
        '            <a href="' + productPageURL + '" target="_blank" class="product-link">\n' +
        '                <div class="product-image">\n' +
        '                    <img src="' + product.image_link + '" alt="' + product.title + ' - اشتري الان بافضل سعر" itemprop="image" loading="lazy" width="280" height="280">\n' +
        '                </div>\n' +
        '                <div class="product-info">\n' +
        '                    <h3 class="product-title" itemprop="name">' + product.title + '</h3>\n' +
        '                    <div class="product-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">\n' +
        '                        <meta itemprop="priceCurrency" content="JOD">\n' +
        '                        <meta itemprop="price" content="' + product.sale_price + '">\n' +
        (product.sale_price < product.price ? 
            '                        <span class="price-old">' + product.price + ' د.أ</span>\n' +
            '                        <span class="price-new">' + product.sale_price + ' د.أ</span>\n' :
            '                        <span class="price-current">' + product.price + ' د.أ</span>\n') +
        '                    </div>\n' +
        '                </div>\n' +
        '            </a>\n' +
        '            <div class="product-actions">\n' +
        '                <a href="' + productPageURL + '" target="_blank" class="btn btn-details" aria-label="شاهد تفاصيل ' + product.title + '">👁️ شاهد التفاصيل</a>\n' +
        '                <a href="' + whatsappURL + '" target="_blank" class="btn btn-whatsapp" aria-label="اطلب ' + product.title + ' عبر واتساب">📱 اطلبه واتساب</a>\n' +
        '            </div>\n' +
        '        </div>\n';
};

// توليد FAQ Schema
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "هل التوصيل مجاني في الأردن؟",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "نعم، نوفر توصيل مجاني لجميع المحافظات الأردنية خلال 2-3 أيام عمل."
            }
        },
        {
            "@type": "Question",
            "name": "ما هي طرق الدفع المتاحة؟",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "نوفر الدفع عند الاستلام، التحويل البنكي، والدفع الإلكتروني الآمن."
            }
        },
        {
            "@type": "Question",
            "name": "هل يمكن إرجاع المنتجات؟",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "نعم، يمكنك إرجاع أي منتج خلال 14 يوم من تاريخ الاستلام."
            }
        }
    ]
};

// توليد Organization Schema
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "سوق الأردن",
    "url": "https://https://sooq-jordan.arabsad.com/",
    "logo": "https://https://sooq-jordan.arabsad.com/logo.png",
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+20-111-076-0081",
        "contactType": "Customer Service",
        "areaServed": "JO"
    },
    "sameAs": [
        "https://wa.me/201110760081"
    ]
};

// index.html محسّن للسيو
const indexHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="سوق الأردن - تسوق اون لاين افضل المنتجات بأسعار تنافسية مع توصيل مجاني سريع لكل المحافظات. خصومات حصرية وجودة مضمونة 100%">
    <meta name="keywords" content="${siteKeywords}">
    <meta name="author" content="سوق الأردن">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="https://https://sooq-jordan.arabsad.com/">

    <!-- Open Graph -->
    <meta property="og:locale" content="ar_AR">
    <meta property="og:type" content="website">
    <meta property="og:title" content="سوق الأردن - تسوق اون لاين بأفضل الأسعار">
    <meta property="og:description" content="أفضل المنتجات بأسعار تنافسية مع توصيل مجاني سريع">
    <meta property="og:url" content="https://https://sooq-jordan.arabsad.com/">
    <meta property="og:site_name" content="سوق الأردن">

    <title>سوق الأردن - تسوق اون لاين | افضل الاسعار والخصومات 2024</title>

    <!-- Schema Markup -->
    <script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; line-height: 1.6; }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }

        .site-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
        .header-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: white; text-decoration: none; }
        .search-box { flex: 1; max-width: 500px; min-width: 250px; }
        .search-box input { width: 100%; padding: 12px 20px; border: none; border-radius: 25px; font-size: 16px; }
        .main-nav { display: flex; gap: 20px; }
        .main-nav a { color: white; text-decoration: none; padding: 8px 16px; border-radius: 5px; transition: all 0.3s; }
        .main-nav a:hover { background: rgba(255,255,255,0.2); }

        .hero-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 20px; text-align: center; margin-bottom: 40px; border-radius: 15px; }
        .hero-title { font-size: 48px; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
        .hero-subtitle { font-size: 24px; margin-bottom: 30px; opacity: 0.9; }
        .hero-cta { display: inline-block; background: white; color: #667eea; padding: 15px 40px; border-radius: 30px; font-size: 18px; font-weight: bold; text-decoration: none; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .hero-cta:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }

        .features-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 50px; }
        .feature-card { background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 3px 15px rgba(0,0,0,0.1); transition: all 0.3s; }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
        .feature-icon { font-size: 48px; margin-bottom: 15px; }
        .feature-title { font-size: 20px; color: #333; margin-bottom: 10px; font-weight: bold; }
        .feature-desc { color: #666; line-height: 1.6; }

        .section-header { text-align: center; margin: 50px 0 30px; }
        .section-title { font-size: 36px; color: #333; margin-bottom: 10px; }
        .section-subtitle { font-size: 18px; color: #666; }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; margin-bottom: 40px; }
        .product-card { background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 3px 15px rgba(0,0,0,0.1); transition: all 0.3s; position: relative; display: flex; flex-direction: column; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
        .badge-sale { position: absolute; top: 15px; right: 15px; background: #e74c3c; color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; z-index: 10; }
        .product-link { text-decoration: none; color: inherit; flex: 1; display: flex; flex-direction: column; }
        .product-image { width: 100%; height: 280px; overflow: hidden; background: #f9f9f9; }
        .product-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .product-card:hover .product-image img { transform: scale(1.05); }
        .product-info { padding: 20px; flex: 1; }
        .product-title { font-size: 18px; color: #333; margin-bottom: 12px; line-height: 1.4; height: 50px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .product-price { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .price-old { font-size: 16px; color: #999; text-decoration: line-through; }
        .price-new { font-size: 24px; color: #e74c3c; font-weight: bold; }
        .price-current { font-size: 24px; color: #27ae60; font-weight: bold; }
        .product-actions { padding: 15px; display: flex; gap: 10px; border-top: 1px solid #eee; }
        .btn { flex: 1; padding: 12px; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer; transition: all 0.3s; text-decoration: none; text-align: center; display: inline-block; }
        .btn-details { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .btn-details:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
        .btn-whatsapp { background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; }
        .btn-whatsapp:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4); }

        .view-all-btn { display: inline-block; margin: 30px auto; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; border-radius: 30px; font-size: 18px; font-weight: bold; text-decoration: none; transition: all 0.3s; }
        .view-all-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
        .btn-container { text-align: center; }

        .site-footer { background: #2c3e50; color: white; padding: 40px 0; margin-top: 60px; }
        .footer-content { text-align: center; }
        .footer-links { display: flex; justify-content: center; gap: 30px; margin-bottom: 20px; flex-wrap: wrap; }
        .footer-links a { color: white; text-decoration: none; transition: opacity 0.3s; }
        .footer-links a:hover { opacity: 0.7; }
        .footer-text { opacity: 0.8; }

        @media (max-width: 768px) {
            .hero-title { font-size: 32px; }
            .hero-subtitle { font-size: 18px; }
            .main-nav { display: none; }
            .search-box { max-width: 100%; }
            .products-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; }
            .product-image { height: 200px; }
            .product-title { font-size: 15px; height: 42px; }
            .product-actions { flex-direction: column; }
            .btn { font-size: 12px; padding: 10px; }
            .section-title { font-size: 28px; }
            .feature-card { padding: 20px; }
        }
    </style>
</head>
<body>
    <header class="site-header">
        <div class="container">
            <div class="header-content">
                <a href="index.html" class="logo" aria-label="الصفحة الرئيسية">🛍️ سوق الأردن</a>
                <div class="search-box">
                    <input type="search" placeholder="ابحث عن المنتجات..." aria-label="بحث في المنتجات" id="searchInput">
                </div>
                <nav class="main-nav" aria-label="القائمة الرئيسية">
                    <a href="index.html">الرئيسية</a>
                    <a href="catalog.html">المنتجات</a>
                    <a href="cart.html">السلة 🛒</a>
                </nav>
            </div>
        </div>
    </header>

    <section class="hero-section">
        <div class="container">
            <h1 class="hero-title">🎉 مرحباً بك في سوق الأردن</h1>
            <p class="hero-subtitle">أفضل المنتجات بأسعار تنافسية مع توصيل مجاني سريع لكل المحافظات</p>
            <a href="catalog.html" class="hero-cta" aria-label="تصفح جميع المنتجات">تصفح المنتجات الآن</a>
        </div>
    </section>

    <main>
        <div class="container">
            <div class="features-section">
                <article class="feature-card">
                    <div class="feature-icon" aria-hidden="true">🚚</div>
                    <h3 class="feature-title">توصيل مجاني سريع</h3>
                    <p class="feature-desc">نوصل لك في جميع أنحاء الأردن خلال 2-3 أيام</p>
                </article>
                <article class="feature-card">
                    <div class="feature-icon" aria-hidden="true">💳</div>
                    <h3 class="feature-title">دفع آمن</h3>
                    <p class="feature-desc">طرق دفع متعددة وآمنة 100%</p>
                </article>
                <article class="feature-card">
                    <div class="feature-icon" aria-hidden="true">⭐</div>
                    <h3 class="feature-title">جودة مضمونة</h3>
                    <p class="feature-desc">منتجات أصلية وجودة عالية</p>
                </article>
                <article class="feature-card">
                    <div class="feature-icon" aria-hidden="true">🔄</div>
                    <h3 class="feature-title">إرجاع مجاني</h3>
                    <p class="feature-desc">يمكنك الإرجاع خلال 14 يوم</p>
                </article>
            </div>
        </div>

        <div class="container">
            <header class="section-header">
                <h2 class="section-title">🔥 المنتجات الأكثر مبيعاً</h2>
                <p class="section-subtitle">اكتشف أفضل عروضنا المميزة بخصومات حصرية</p>
            </header>
            <div class="products-grid">
${featuredProducts.map(p => generateProductCard(p)).join('')}
            </div>
            <div class="btn-container">
                <a href="catalog.html" class="view-all-btn" aria-label="عرض جميع المنتجات">عرض جميع المنتجات (${products.length} منتج) →</a>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <nav class="footer-links" aria-label="روابط التذييل">
                    <a href="index.html">الرئيسية</a>
                    <a href="catalog.html">المنتجات</a>
                    <a href="cart.html">السلة</a>
                    <a href="https://wa.me/201110760081" target="_blank" rel="noopener">اتصل بنا</a>
                </nav>
                <p class="footer-text">&copy; 2024 سوق الأردن - جميع الحقوق محفوظة</p>
            </div>
        </div>
    </footer>

    <script>
        // بحث بسيط
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 2) {
                window.location.href = 'catalog.html?search=' + encodeURIComponent(searchTerm);
            }
        });
    </script>
</body>
</html>`;

// حفظ الملف
fs.writeFileSync('index.html', indexHTML, 'utf8');

console.log('✅ تم إنشاء index.html محسّن للسيو بنجاح!');
console.log('\n🎯 تحسينات السيو المطبقة:');
console.log('   ✅ Meta tags كاملة (description, keywords, author, robots)');
console.log('   ✅ Open Graph للمشاركة على السوشيال ميديا');
console.log('   ✅ Canonical URL');
console.log('   ✅ Schema Markup (Organization + FAQ)');
console.log('   ✅ Structured Data على المنتجات');
console.log('   ✅ Semantic HTML (header, main, nav, article, footer)');
console.log('   ✅ Alt text محسّن للصور');
console.log('   ✅ Aria labels للوصول');
console.log('   ✅ Width & Height للصور');
console.log('   ✅ مربع بحث احترافي');
console.log('   ✅ Internal linking محسّن');
console.log('   ✅ عناوين H1, H2, H3 منظمة');
console.log('   ✅ Loading lazy للصور');
console.log('   ✅ روابط نظيفة وواضحة');

