Vẫn ko cuộn được, dù đã đổi qua instant vẫn ko cuộn được.

Nguyên nhân thực sự không phải overflow: hidden trên body hay html — mà là:

```css
:not(body):has(> .driver-active-element) {
  overflow: hidden !important;
}
```

Driver.js lock parent trực tiếp của element đang được highlight, không phải body/html. Vì thế việc xóa document.body.style.overflow hay document.documentElement.style.overflow hoàn toàn vô hiệu. Cần tìm đúng parent đó và unlock nó.
