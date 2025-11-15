(function() {
    try {
        // تحديد المسار الأساسي
        const basePath = window.location.pathname.includes('/products/') ? '../' : '';
        
        const headerHTML = `
        <header style="background:linear-gradient(135deg,#667eea,#764ba2); color:white; padding:18px 0; text-align:center; direction:rtl;">
            <div style="font-weight:700; font-size:2em; margin-bottom:10px;"><a href="${basePath}index.html" style="color:white; text-decoration:none;">سوق الأردن</a></div>
            <nav style="margin-top:8px; font-size:1.05em;">
                <a href="${basePath}index.html" style="color:white; text-decoration:none; margin:0 10px;">الرئيسية</a> |
                <a href="${basePath}about-us.html" style="color:white; text-decoration:none; margin:0 10px;">من نحن</a> |
                <a href="${basePath}catalog.html" style="color:white; text-decoration:none; margin:0 10px;">المنتجات</a> |
                <a href="${basePath}terms-of-service.html" style="color:white; text-decoration:none; margin:0 10px;">الشروط</a> |
                <a href="${basePath}privacy-policy.html" style="color:white; text-decoration:none; margin:0 10px;">الخصوصية</a> |
                <a href="${basePath}shipping-policy.html" style="color:white; text-decoration:none; margin:0 10px;">الشحن</a> |
                <a href="${basePath}return-refund-policy.html" style="color:white; text-decoration:none; margin:0 10px;">الاسترجاع</a> |
                <a href="${basePath}contact-us.html" style="color:white; text-decoration:none; margin:0 10px;">اتصل بنا</a>
            </nav>
        </header>`;
        
        if (document.body) {
            const headerDiv = document.createElement('div');
            headerDiv.innerHTML = headerHTML;
            document.body.insertBefore(headerDiv.firstChild, document.body.firstChild);
        }
    } catch(e) {
        console.error('Header error:', e);
    }
})();
