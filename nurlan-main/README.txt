TREND KOSMETİKA - cosmetics store website

FILES
  index.html, albums.html, products.html, product.html, contact.html   (website pages)
  css/style.css   js/data.js   js/i18n.js   js/app.js
  admin/          (admin panel: open yourdomain/admin/ ; username: mehdi ; code: 1234raet)

PUBLISH ON GITHUB PAGES
  1. Create a repository, upload ALL files and folders keeping the same structure.
  2. Settings > Pages > Deploy from branch > main > / (root).
  3. Website:  https://USERNAME.github.io/REPO/     Admin:  https://USERNAME.github.io/REPO/admin/

SHARED DATABASE (Firebase)  <-- do this once, so every device sees the same products
  Why: GitHub Pages has no database. Without this, admin edits stay only in the browser of the admin.
  1. Go to https://console.firebase.google.com > Add project (free, no card needed).
  2. Build > Realtime Database > Create database (choose any location, start in LOCKED mode).
     Copy the database address shown at the top, e.g. https://xxxx-default-rtdb.europe-west1.firebasedatabase.app
  3. Realtime Database > Rules > paste this and press Publish:
        { "rules": { "store": { ".read": true, ".write": "auth != null" },
          "customers": { ".read": "auth != null", "$phone": { ".read": true, ".write": true } } } }
     (everybody can read the store, only the logged-in admin can change it. "customers" holds accounts and orders: the admin can
      list all of them; a visitor can only open the account of the phone number he types - this is how phone-only login works.)
  4. Build > Authentication > Get started > Sign-in method > Email/Password > Enable.
     Then Users > Add user:  e-mail = any e-mail you like (for example admin@trend.az),  password = 1234raet
     (the same code you type in the admin login. If you change the code in admin/admin.js, change it here too.)
  5. Project settings (gear icon) > General > "Web API Key": copy it.
  6. Open js/config.js and fill the 3 values:  databaseURL, apiKey, adminEmail.  Upload the file to GitHub.
  7. Open /admin/, log in, add or change a product -> it is saved online and appears on every device.
     The first time you log in, the data from your browser (or the sample products) is uploaded automatically.
     Admin > Data shows "Online database is ON" when it works.

HOW ADMIN CHANGES REACH VISITORS
  With the shared database (above): instantly, nothing to download or upload.
  Without it (old way): Admin > Data > "Download store.json" > upload it to the main folder of the repository.

PHOTOS & VIDEO
  Photos: save a photo as images/products/product-1.jpg (number = product id, 1 to 30). It shows automatically.
          Or use Admin > Edit product > upload / image URL.
  Video:  put videos/store.mp4 in the videos folder, or paste a YouTube link in Admin > Data.

HOME PAGE EDITING
  Admin > "Home page" tab: change the title, the text, the big picture and the brands bar. Then download store.json (Data tab) and upload it to GitHub.

MORE ADMIN TABS
  Colors (palettes or your own), Contact (name, phone, address, map, Instagram, TikTok), Texts (every word in every language).

NEW IN THIS VERSION
  Website: modern design, photo slider on the home page (split or full-width), photo gallery with big-photo view, album cover photos,
           product search, "Out of stock" labels, related products, footer with contact + social icons, smooth animations.
  Admin > Home page: slider photos (upload many at once, captions in 3 languages, move up/down, remove), single top photo, gallery photos,
           bottom banner photo, slider layout + speed, brands bar, choose featured products, show/hide every home section.
  Admin > Albums: upload a cover photo for every album.
  Admin > Data: shows how full the browser storage is. Photos can also be placed in images/home/ on GitHub and used by path (images/home/slide-1.jpg).
  Admin > Texts: includes the new words (gallery title, search, out of stock ...).

ADMIN LANGUAGE
  The admin panel has a language switcher (English / Azərbaycan dili) in the top bar and on the login screen. The choice is remembered.
  All admin translations are in admin/lang.js (English text = key, Azerbaijani = value), so you can edit any wording there.

WEBSITE LANGUAGES
  English, Azərbaycan dili, Русский, Türkçe - each with a flag. The choice is remembered. Texts are in js/i18n.js
  (Admin > Texts can override any word in every language). Album names have fields for all 4 languages.

BASKET, ORDERS, ACCOUNTS, DISCOUNTS
  Website: "Add to basket" on every product; a basket button (bottom right) appears after the first item and opens cart.html
           (quantities, remove, save for later, promo code, sale savings, totals, Finish order -> name + phone).
  Account: account.html - the customer types his phone number to log in (new numbers create an account) and sees all previous
           orders with date/time and status; "Order again" refills the basket. The phone number is remembered on that device.
  Admin:   tab Orders (contact details above every order, change status, delete), tab Customers (every registered account),
           tab Discounts (Sale % on chosen products/all, promo code % or fixed AZN, minimum order, dates, on/off).
  Orders and accounts need the shared database (Firebase steps above) so they reach the admin from other devices.
  Note: discount codes are stored in the public store data, so a very curious visitor could read them.
