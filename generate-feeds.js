const fs = require('fs');

// قراءة ملف المنتجات
const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

const baseURL = 'https://https://sooq-jordan.arabsad.com';
const today = new Date().toISOString().split('T')[0];

// ===== 1. XML Sitemap =====
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

    // صفحات المنتجات
    products.forEach(product => {
        sitemap += '  <url>\n';
        sitemap += '    <loc>' + baseURL + '/products/' + product.slug + '.html</loc>\n';
        sitemap += '    <lastmod>' + today + '</lastmod>\n';
        sitemap += '    <changefreq>weekly</changefreq>\n';
        sitemap += '    <priority>0.8</priority>\n';
        sitemap += '    <image:image>\n';
        sitemap += '      <image:loc>' + product.image_link + '</image:loc>\n';
        sitemap += '      <image:title>' + product.title + '</image:title>\n';
        sitemap += '    </image:image>\n';
        sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';
    return sitemap;
};

// ===== 2. Google Merchant Feed (XML) =====
const generateMerchantFeed = () => {
    let feed = '<?xml version="1.0" encoding="UTF-8"?>\n';
    feed += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n';
    feed += '  <channel>\n';
    feed += '    <title>سوق الأردن</title>\n';
    feed += '    <link>' + baseURL + '</link>\n';
    feed += '    <description>أفضل المنتجات بأسعار تنافسية</description>\n';

    products.forEach(product => {
        const productURL = baseURL + '/products/' + product.slug + '.html';

        feed += '    <item>\n';
        feed += '      <g:id>' + product.id + '</g:id>\n';
        feed += '      <g:title><![CDATA[' + product.title + ']]></g:title>\n';
        feed += '      <g:description><![CDATA[' + product.description.substring(0, 5000) + ']]></g:description>\n';
        feed += '      <g:link>' + productURL + '</g:link>\n';
        feed += '      <g:image_link>' + product.image_link + '</g:image_link>\n';
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

// ===== 3. Product Feed (JSON for Facebook/Meta) =====
const generateProductFeedJSON = () => {
    const feed = products.map(product => ({
        id: product.id.toString(),
        title: product.title,
        description: product.description,
        availability: "in stock",
        condition: "new",
        price: product.sale_price + " JOD",
        link: baseURL + '/products/' + product.slug + '.html',
        image_link: product.image_link,
        brand: "سوق الأردن",
        google_product_category: "Electronics",
        product_type: "منتجات متنوعة"
    }));

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

console.log('✅ تم إنشاء جميع الملفات بنجاح!');
console.log('\n📁 الملفات المُنشأة:');
console.log('   1️⃣ sitemap.xml (' + products.length + ' منتج + 2 صفحة)');
console.log('   2️⃣  (Google Shopping)');
console.log('   3️⃣ product-feed.json (Facebook/Meta Catalog)');
console.log('   4️⃣ robots.txt');
console.log('\n🎯 الخطوات التالية:');
console.log('   1. ارفع جميع الملفات على GitHub');
console.log('   2. افتح Google Search Console');
console.log('   3. أضف Sitemap: ' + baseURL + '/sitemap.xml');
console.log('   4. افتح Google Merchant Center');
console.log('   5. أضف Feed: ' + baseURL + '/');
console.log('\n📊 الإحصائيات:');
console.log('   • عدد المنتجات: ' + products.length);
console.log('   • عدد URLs في Sitemap: ' + (products.length + 2));
console.log('   • حجم Google Feed: ~' + Math.round(merchantFeed.length / 1024) + ' KB');

