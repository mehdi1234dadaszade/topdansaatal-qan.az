NOTE (v11): TOPDAN (wholesale) CUSTOMERS PAGE + red/black design.
  1. Home page: the button "Saatlara bax" is replaced by "Topdan müştərilər üçün". Pressing it asks for a PASSWORD; after the right password the customer
     opens the topdan pages (folder /topdan/: index, albums, products, product, cart, contact, account). The default password is given to you in the chat
     (it is NOT written here, because README.txt is public on GitHub Pages). Change it any time: Admin > "Topdan mallar" > "Topdan səhifəsinə giriş parolu".
     The button "Albomlara bax" now says "Premium modelləri gör" (it still opens the Albums page).
  2. The topdan pages are RED + BLACK. They have everything the main site has: albums, search, sorting, product page, basket, orders (sent to your WhatsApp,
     marked "TOPDAN" in the message and in Admin > Orders), customer account (same phone-number account as the main site), discounts and promo codes.
     The basket of the main site and the basket of the topdan site are separate.
  3. Admin > "Topdan mallar": add topdan products (price = topdan price), topdan albums with cover photos, choose the watches shown on the topdan home page,
     change the topdan title/text and the access password. Goods added here are shown ONLY on the topdan pages.
     Admin > Discounts: choose at the top whether the discount is for the main site or for the topdan site.
     Photo files for topdan products: images/topdan/product-ID.jpg (or upload in the admin).
  4. The top bar of the home page no longer shows the account / login buttons (they are still in the Menu and on the other pages).
  5. The topdan password is checked inside the browser: it keeps casual visitors out but it is not real security (the topdan data is stored in the same public
     online database). Topdan orders are saved in the same place as normal orders, so the Firebase rules from the steps below need no change.
  IMPORTANT: README.txt contains your admin code and is public if you upload it to GitHub. Do not upload README.txt (keep it only on your computer).

NOTE (v10): CUSTOMER SIGN UP has NO password now: phone number + name + address only. A registered customer stays logged in on that device for good
  (there is no log-out button). From the basket, a new customer signs up on the page whose button says "Sifarişə davam et"; pressing it saves the order
  and opens the admin's WhatsApp chat with the basket inside. Registered customers press "Sifarişi tamamla" and go straight to WhatsApp.
  Old customers who registered earlier WITH a password cannot log in again with only the phone number - delete that user in Firebase > Authentication > Users.
ADMIN LOGIN: Admin > "Admin hesabı" tab changes the admin username and code (default: admin / cosqun1998). With the online database the code is the
  Firebase password of the admin e-mail, so it is changed there too. If you forget it, reset the password in Firebase > Authentication > Users.

NOTE: the whole website and the admin panel are now in Azerbaijani only (no language switcher). There is no Facebook button or link anywhere.

topdansaatalışqan.az - watch store website

=== NEW IN THIS VERSION: WATCH STORE, DARK DESIGN, VIDEO HOME PAGE ===
  1. Home page: full-screen background video (videos/store.mp4), muted + looping. Put your mp4 in the "videos" folder named store.mp4.
     Until the file is there, a dark purple glow is shown instead. Top right: "Menu" button (opens Home, Products, Albums, Contact, Account,
     language choice and social buttons), plus Log in / Sign up buttons. Bottom left: social buttons, bottom right: Contact.
  2. Colours: black + purple/blue glow, white buttons (like your reference site). Change any colour in Admin > Colors.
  3. Product page: the gold logo picture (images/product-bg.png) is the background; the watch, name and price are on it, and the details,
     table, basket button and related watches are under it.
  4. Store name is topdansaatalışqan.az. The 30 sample products are now sample WATCHES (men, women, smart, sport, luxury, budget).
  5. Admin (same as before) got a new tab "Design": home video file/link (or YouTube link as background), poster photo, darkness over the video,
     product page background photo, logo. Admin > Colors has more colours (buttons, cards, glow). Admin > Contact has WhatsApp, YouTube.
  6. Nothing was removed: basket, orders, accounts, discounts, 4 languages, albums, search, gallery, slider (Design > "Classic" style) all remain.
  IF YOUR SITE ALREADY HAS ONLINE DATA (Firebase / store.json) with the old cosmetics products or the old store name:
     Admin > Data > "Reset to the 30 sample products" (loads the watches), then Admin > Contact > Store name (clear it or type the new name) > Save.
  AUTO-FIX: if the site finds old makeup/cosmetics data (in the browser or online), it shows the watch albums + 30 sample watches
     automatically. Open /admin/ once and log in so the fix is saved online for everybody.
  CONTACT: Instagram, TikTok, WhatsApp (+994501005444), address and Google Maps link are pre-filled (once). Change them any time in Admin > Contact.
     The home page social row shows Instagram, TikTok, WhatsApp and Google Maps (the YouTube button only appears if you add a YouTube link).
  WHATSAPP AFTER ORDER: when a customer finishes an order, the confirmation page asks him to send the order to the store WhatsApp
     (number from Admin > Contact > WhatsApp). The message has the product names, quantities, prices and a photo/product link.
     On phones a second button shares the real product photos (the customer picks your WhatsApp chat). Until he presses the button,
     the "My orders" / "Continue" buttons are locked and a green reminder bar shows on every page. WhatsApp itself cannot be forced to send.
  Social buttons without a link are shown dimmed - add your links in Admin > Contact.

FILES
  index.html, albums.html, products.html, product.html, contact.html   (website pages)
  css/style.css   js/data.js   js/i18n.js   js/app.js
  admin/          (admin panel: open yourdomain/admin/ ; username: admin ; code: cosqun1998)

PUBLISH ON GITHUB PAGES
  1. Create a repository, upload ALL files and folders keeping the same structure.
  2. Settings > Pages > Deploy from branch > main > / (root).
  3. Website:  https://USERNAME.github.io/REPO/     Admin:  https://USERNAME.github.io/REPO/admin/

SHARED DATABASE (Firebase)  <-- do this once, so every device sees the same products
  Why: GitHub Pages has no database. Without this, admin edits stay only in the browser of the admin.
  1. Go to https://console.firebase.google.com > Add project (free, no card needed).
  2. Build > Realtime Database > Create database (choose any location, start in LOCKED mode).
     Copy the database address shown at the top, e.g. https://xxxx-default-rtdb.europe-west1.firebasedatabase.app
  3. Realtime Database > Rules > paste this (replace ADMIN_EMAIL with the SAME e-mail you create in step 4, in small letters) and press Publish:
        { "rules": {
          "store": { ".read": true, ".write": "auth != null && auth.token.email == 'ADMIN_EMAIL'" },
          "customers": {
            ".read": "auth != null && auth.token.email == 'ADMIN_EMAIL'",
            "$phone": {
              ".read":  "auth != null && (auth.token.email == 'ADMIN_EMAIL' || auth.token.email == 'u' + $phone + '@users.topdansaatalishqan.az')",
              ".write": "auth != null && (auth.token.email == 'ADMIN_EMAIL' || auth.token.email == 'u' + $phone + '@users.topdansaatalishqan.az')"
            } } } }
     IMPORTANT: customers are now real Firebase users too, so the store may be changed ONLY by the admin e-mail, and every customer can
     read / write only his own account and orders. (Old rule "auth != null" would let any customer change your store - do not use it.)
  4. Build > Authentication > Get started > Sign-in method > Email/Password > Enable.
     Then Users > Add user:  e-mail = any e-mail you like (for example admin@example.com),  password = cosqun1998
     (the same code you type in the admin login. If you change the code in admin/admin.js, change it here too.)
  5. Project settings (gear icon) > General > "Web API Key": copy it.
  6. Open js/config.js (it is empty now = no database connected) and fill the 3 values:  databaseURL, apiKey, adminEmail.  Upload the file to GitHub.
  7. Open /admin/, log in, add or change a product -> it is saved online and appears on every device.
     The first time you log in, the data from your browser (or the sample products) is uploaded automatically.
     Admin > Data shows "Online database is ON" when it works.

HOW ADMIN CHANGES REACH VISITORS
  With the shared database (above): instantly, nothing to download or upload.
  Without it (old way): Admin > Data > "Download store.json" > upload it to the main folder of the repository.

CUSTOMER SIGN UP / LOG IN (real backend = Firebase Authentication)
  Sign up: name + phone + location (box shows the example "Nərimanov Saat Dükanı") + password (min 6). Log in: phone + password.
  The phone number is turned into a hidden login e-mail (u<number>@users.topdansaatalishqan.az), the password is kept by Firebase (never by the website).
  With the shared database ON, ordering needs a logged-in customer. Without Firebase (config.js empty) the site works in the old browser-only mode.
  Admin > Customers and Orders now also show the customer's location.
  Phone numbers are not SMS-verified.

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
