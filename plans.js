// این فایل به‌صورت خودکار از config.py ساخته می‌شه.
// برای بروزرسانی، پلن‌ها رو در config.py (متغیر PLANS) ویرایش کن و
// اسکریپت tools/generate_plans.py رو اجرا کن تا این فایل دوباره ساخته بشه.
window.VPN_PLANS = [
  {
    "id": "p1",
    "title": "۱ ماهه - ۳۰ گیگ",
    "days": 30,
    "gb": 30,
    "price_toman": 90000
  },
  {
    "id": "p2",
    "title": "۱ ماهه - نامحدود",
    "days": 30,
    "gb": 0,
    "price_toman": 150000,
    "badge": "پرفروش‌ترین"
  },
  {
    "id": "p3",
    "title": "۳ ماهه - ۱۰۰ گیگ",
    "days": 90,
    "gb": 100,
    "price_toman": 240000
  },
  {
    "id": "p4",
    "title": "۳ ماهه - نامحدود",
    "days": 90,
    "gb": 0,
    "price_toman": 400000,
    "badge": "بهترین ارزش"
  }
];
