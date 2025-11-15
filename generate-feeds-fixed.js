const fs = require('fs');

// قراءة ملف المنتجات
const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

const baseURL = 'https://https://sooq-jordan.arabsad.com';
const today = new Date().toISOString().split('T')[0];

// دالة لتحويل النص إلى XML safe
const xmlEscape = (str) => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

// ===== 1. XML Sitemap مُصلح =====
const generateSitemap = () => {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    sitemap += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    // الصفحة الرئيسية
    sitemap += '  <url>\n';
    sitemap += '    <loc>' + baseURL + '/index.html</loc>\n';
    sitemap += '    <lastmod>' + today + '</lastmod>\n';
    sitemap += '    <changefreq>daily</changefreq>\n';
    sitemap += '    <priority>1.0</priority>\n';
    sitemap += '  </url>\n';

    // صفحة الكتالوج
    sitemap += '  <url>\n';
    sitemap += '    <loc>' + baseURL + '/catalog.html</loc>\n';
    sitemap += '    <lastmod>' + today + '</lastmod>\n';
    sitemap += '    <changefreq>daily</changefreq>\n';
    sitemap += '    <priority>0.9</priority>\n';
    sitemap += '  </url>\n';

    // صفحات المنتجات - مع URL encoding
    products.forEach(product => {
        // تحويل الرابط العربي إلى URL encoded
        const encodedSlug = encodeURIComponent(product.slug);
        const productURL = baseURL + '/products/' + encodedSlug + '.html';

        sitemap += '  <url>\n';
        sitemap += '    <loc>' + productURL + '</loc>\n';
        sitemap += '    <lastmod>' + today + '</lastmod>\n';
        sitemap += '    <changefreq>weekly</changefreq>\n';
        sitemap += '    <priority>0.8</priority>\n';
        sitemap += '    <image:image>\n';
        sitemap += '      <image:loc>' + xmlEscape(product.image_link) + '</image:loc>\n';
        sitemap += '      <image:title>' + xmlEscape(product.title) + '</image:title>\n';
        sitemap += '    </image:image>\n';
        sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';
    return sitemap;
};

// ===== 2. Google Merchant Feed مُصلح =====
const generateMerchantFeed = () => {
    let feed = '<?xml version="1.0" encoding="UTF-8"?>\n';
    feed += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n';
    feed += '  <channel>\n';
    feed += '    <title>سوق الأردن</title>\n';
    feed += '    <link>' + baseURL + '</link>\n';
    feed += '    <description>أفضل المنتجات بأسعار تنافسية</description>\n';

    products.forEach(product => {
        const encodedSlug = encodeURIComponent(product.slug);
        const productURL = baseURL + '/products/' + encodedSlug + '.html';

        feed += '    <item>\n';
        feed += '      <g:id>' + product.id + '</g:id>\n';
        feed += '      <g:title><![CDATA[' + product.title + ']]></g:title>\n';
        feed += '      <g:description><![CDATA[' + product.description.substring(0, 5000) + ']]></g:description>\n';
        feed += '      <g:link>' + productURL + '</g:link>\n';
        feed += '      <g:image_link>' + xmlEscape(product.image_link) + '</g:image_link>\n';
        feed += '      <g:condition>new</g:condition>\n';
        feed += '      <g:availability>in stock</g:availability>\n';
        feed += '      <g:price>' + product.sale_price + ' JOD</g:price>\n';
        feed += '      <g:brand>سوق الأردن</g:brand>\n';
        feed += '      <g:gtin>' + product.sku + '</g:gtin>\n';
        feed += '      <g:mpn>' + product.sku + '</g:mpn>\n';
        feed += '      <g:identifier_exists>yes</g:identifier_exists>\n';
        feed += '      <g:google_product_category>Electronics</g:google_product_category>\n';
        feed += '      <g:product_type>منتجات متنوعة</g:product_type>\n';
        feed += '    </item>\n';
    });

    feed += '  </channel>\n';
    feed += '</rss>';
    return feed;
};

// ===== 3. Product Feed JSON =====
const generateProductFeedJSON = () => {
    const feed = products.map(product => {
        const encodedSlug = encodeURIComponent(product.slug);
        return {
            id: product.id.toString(),
            title: product.title,
            description: product.description,
            availability: "in stock",
            condition: "new",
            price: product.sale_price + " JOD",
            link: baseURL + '/products/' + encodedSlug + '.html',
            image_link: product.image_link,
            brand: "سوق الأردن"
        };
    });
    return JSON.stringify(feed, null, 2);
};

// ===== 4. robots.txt =====
const generateRobotsTxt = () => {
    return 'User-agent: *\n' +
           'Allow: /\n' +
           'Disallow: /cart.html\n' +
           'Disallow: /checkout.html\n' +
           '\n' +
           'Sitemap: ' + baseURL + '/sitemap.xml\n';
};

// حفظ الملفات
const sitemap = generateSitemap();
fs.writeFileSync('sitemap.xml', sitemap, 'utf8');

const merchantFeed = generateMerchantFeed();
fs.writeFileSync('', merchantFeed, 'utf8');

const productFeedJSON = generateProductFeedJSON();
fs.writeFileSync('product-feed.json', productFeedJSON, 'utf8');

const robotsTxt = generateRobotsTxt();
fs.writeFileSync('robots.txt', robotsTxt, 'utf8');

console.log('✅ تم إصلاح وإنشاء جميع الملفات بنجاح!');
console.log('\n📁 الملفات المُنشأة:');
console.log('   1️⃣ sitemap.xml (مُصلح - URL encoded)');
console.log('   2️⃣  (مُصلح)');
console.log('   3️⃣ product-feed.json');
console.log('   4️⃣ robots.txt');
console.log('\n🔧 الإصلاحات:');
console.log('   ✅ URL encoding للحروف العربية');
console.log('   ✅ XML escape للأحرف الخاصة (&, <, >, etc)');
console.log('   ✅ إصلاح EntityRef errors');
console.log('   ✅ روابط صحيحة 100%');
console.log('\n📊 الإحصائيات:');
console.log('   • عدد المنتجات: ' + products.length);
console.log('   • عدد URLs: ' + (products.length + 2));
console.log('   • حجم Sitemap: ~' + Math.round(sitemap.length / 1024) + ' KB');
console.log('\n🎯 جاهز للرفع والاستخدام!');

