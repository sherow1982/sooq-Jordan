(function() {
    try {
        const basePath = window.location.pathname.includes('/products/') ? '../' : '';
        
        const footerHTML = `
        <footer style="background:#222; color:#fff; padding:30px 0; text-align:center; direction:rtl; margin-top:50px;">
            <div style="margin-bottom:20px; font-size:1em;">
                <a href="${basePath}about-us.html" style="color:#fff; text-decoration:none; margin:0 10px;">من نحن</a> |
                <a href="${basePath}terms-of-service.html" style="color:#fff; text-decoration:none; margin:0 10px;">الشروط</a> |
                <a href="${basePath}privacy-policy.html" style="color:#fff; text-decoration:none; margin:0 10px;">الخصوصية</a> |
                <a href="${basePath}shipping-policy.html" style="color:#fff; text-decoration:none; margin:0 10px;">الشحن</a> |
                <a href="${basePath}return-refund-policy.html" style="color:#fff; text-decoration:none; margin:0 10px;">الاسترجاع</a> |
                <a href="${basePath}contact-us.html" style="color:#fff; text-decoration:none; margin:0 10px;">اتصل بنا</a>
            </div>
            <div style="font-size:.9em; color:#bbb; border-top:1px solid #444; padding-top:15px;">
                <p>جميع الحقوق محفوظة &copy; 2025 سوق الأردن</p>
                <p style="font-size:0.85em; margin-top:5px;">البريد: <a href="mailto:sooqjordan750@gmail.com" style="color:#667eea;">sooqjordan750@gmail.com</a></p>
            </div>
        </footer>`;
        
        if (document.body) {
            const footerDiv = document.createElement('div');
            footerDiv.innerHTML = footerHTML;
            document.body.appendChild(footerDiv.firstChild);
        }
    } catch(e) {
        console.error('Footer error:', e);
    }
})();
