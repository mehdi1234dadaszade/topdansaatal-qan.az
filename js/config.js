/* ONLINE DATABASE (Firebase) - connected. Products, orders and customer accounts are shared by all devices. */
window.TK_CLOUD = {
  databaseURL: 'https://mehdi-ce572-default-rtdb.firebaseio.com',
  apiKey: 'AIzaSyAhThpYx15hZ7NhQkBGVyZ-M6oZed7FdH0',
  adminEmail: 'mehdi2dadaszade@gmail.com'   // must be EXACTLY the e-mail of the user in Firebase > Authentication > Users
};

/* IMAGE HOSTING (Cloudinary). Photos uploaded in the admin go here; only a short link is saved in Firebase. */
window.TK_IMG = { cloud: 'cjhayoce', preset: 'mehdidadaszade' };
