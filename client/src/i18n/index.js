import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LANGUAGE_STORAGE_KEY } from "../lib/storage";

const resources = {
  en: {
    translation: {
      brand: {
        name: "Sleepora",
        tagline: "Better Sleep Starts Tonight"
      },
      meta: {
        home: "Sleepora - Better Sleep Starts Tonight",
        products: "Products - Sleepora",
        product: "Product - Sleepora",
        cart: "Cart - Sleepora",
        checkout: "Checkout - Sleepora",
        login: "Login - Sleepora",
        register: "Register - Sleepora",
        policy: "Policy - Sleepora",
        admin: "Admin - Sleepora"
      },
      language: {
        en: "EN",
        fr: "FR",
        ar: "AR"
      },
      theme: {
        light: "Light",
        dark: "Dark"
      },
      nav: {
        products: "Products",
        cart: "Cart",
        login: "Login",
        register: "Register",
        contact: "Contact"
      },
      home: {
        heroTitle: "Better Sleep Starts Tonight",
        heroSubtitle: "Premium sleep products designed for deeper rest and comfort.",
        shopNow: "Shop Now",
        featuredLabel: "FEATURED PRODUCT",
        featuredTitle: "Ergonomic Memory Foam Neck Pillow",
        featuredDescription:
          "Built for long nights and calm mornings, this premium contour pillow supports your neck naturally while reducing pressure.",
        buyNow: "Buy Now",
        collectionTitle: "Product Collection",
        trustTitle: "Why Sleepora",
        trust1: "30-Day Guarantee",
        trust2: "Premium Quality Materials",
        trust3: "Fast Worldwide Shipping"
      },
      product: {
        benefits: "Benefits",
        addToCart: "Add to Cart",
        buyNow: "Buy Now",
        detailsTitle: "Description",
        detailsBody:
          "Every Sleepora product is designed with premium materials to create a calmer sleep environment and better overnight recovery.",
        notFound: "Product not found"
      },
      products: {
        title: "Sleep Essentials",
        subtitle: "A curated collection made for deep rest and nightly comfort.",
        price: "Price"
      },
      cart: {
        title: "Your Cart",
        empty: "Your cart is empty.",
        continue: "Continue Shopping",
        quantity: "Quantity",
        total: "Total",
        checkout: "Checkout",
        remove: "Remove"
      },
      checkout: {
        title: "Checkout",
        subtitle: "Complete your order securely.",
        fullName: "Full name",
        email: "Email",
        phone: "Phone",
        address: "Address",
        paySecurely: "Pay Securely",
        secureSoon: "Secure payment setup coming soon",
        success: "Order received. We will contact you shortly."
      },
      auth: {
        loginTitle: "Login",
        registerTitle: "Create Account",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        password: "Password",
        signIn: "Sign In",
        create: "Create",
        createAccount: "Create account",
        already: "Already have an account?",
        noAccount: "Don't have an account?"
      },
      contact: {
        title: "Contact Sleepora",
        subtitle: "Send us your message and we will reply soon.",
        email: "Email",
        message: "Message",
        send: "Send",
        success: "Message sent successfully."
      },
      footer: {
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        refundPolicy: "Refund Policy",
        shippingPolicy: "Shipping Policy",
        rights: "(c) 2026 Sleepora. All rights reserved."
      },
      policy: {
        back: "Back to store",
        privacyPolicy: {
          title: "Privacy Policy",
          body: "We collect only the information needed to process orders and support customer service."
        },
        termsOfService: {
          title: "Terms of Service",
          body: "By using Sleepora, you agree to our terms for orders, payments, and product use."
        },
        refundPolicy: {
          title: "Refund Policy",
          body: "Eligible products can be refunded within our return window according to condition rules."
        },
        shippingPolicy: {
          title: "Shipping Policy",
          body: "Orders are processed quickly and shipped worldwide with tracking when available."
        }
      },
      admin: {
        setupTitle: "Admin Setup",
        setupSubtitle: "Create owner credentials for secure /admin access.",
        username: "Username",
        password: "Password",
        confirmPassword: "Confirm Password",
        saveSetup: "Save Credentials",
        loginTitle: "Admin Login",
        loginSubtitle: "Owner access only",
        loginButton: "Access Admin",
        logout: "Logout",
        dashboardTitle: "Sleepora Admin",
        dashboardSubtitle: "Manage products and orders from any device",
        addProduct: "Add Product",
        editProduct: "Edit Product",
        name: "Name",
        price: "Price",
        description: "Description",
        featured: "Featured",
        image: "Product Image",
        imagePath: "Image Path",
        imageHelp: "Accepted: jpg, jpeg, png, webp. Max size 5 MB.",
        chooseFile: "Choose image file",
        saveProduct: "Save Product",
        updateProduct: "Update Product",
        cancelEdit: "Cancel Edit",
        deleteProduct: "Delete",
        products: "Products",
        noProducts: "No products found.",
        preview: "Preview",
        setupSaved: "Admin credentials saved.",
        passwordsMismatch: "Passwords do not match.",
        invalidLogin: "Invalid username or password.",
        saved: "Changes saved.",
        deleted: "Product deleted.",
        uploadError: "Image upload failed.",
        validationError: "Please complete required fields.",
        localApiError: "Admin product API is unavailable. Verify deployment and environment variables."
      },
      common: {
        loading: "Loading...",
        unavailable: "Unavailable",
        missingImage: "Image not available"
      }
    }
  },
  fr: {
    translation: {
      brand: {
        name: "Sleepora",
        tagline: "Better Sleep Starts Tonight"
      },
      meta: {
        home: "Sleepora - Better Sleep Starts Tonight",
        products: "Produits - Sleepora",
        product: "Produit - Sleepora",
        cart: "Panier - Sleepora",
        checkout: "Paiement - Sleepora",
        login: "Connexion - Sleepora",
        register: "Inscription - Sleepora",
        policy: "Politique - Sleepora",
        admin: "Admin - Sleepora"
      },
      language: {
        en: "EN",
        fr: "FR",
        ar: "AR"
      },
      theme: {
        light: "Clair",
        dark: "Sombre"
      },
      nav: {
        products: "Produits",
        cart: "Panier",
        login: "Connexion",
        register: "Inscription",
        contact: "Contact"
      },
      home: {
        heroTitle: "Better Sleep Starts Tonight",
        heroSubtitle: "Des produits de sommeil premium pour un repos plus profond et confortable.",
        shopNow: "Acheter",
        featuredLabel: "PRODUIT VEDETTE",
        featuredTitle: "Oreiller cervical ergonomique a memoire de forme",
        featuredDescription:
          "Concu pour les longues nuits, cet oreiller premium soutient naturellement la nuque et reduit la pression.",
        buyNow: "Acheter",
        collectionTitle: "Collection Produits",
        trustTitle: "Pourquoi Sleepora",
        trust1: "Garantie 30 jours",
        trust2: "Materiaux premium",
        trust3: "Livraison rapide mondiale"
      },
      product: {
        benefits: "Benefices",
        addToCart: "Ajouter au panier",
        buyNow: "Acheter",
        detailsTitle: "Description",
        detailsBody:
          "Chaque produit Sleepora est concu avec des materiaux premium pour un sommeil plus calme et une meilleure recuperation.",
        notFound: "Produit introuvable"
      },
      products: {
        title: "Essentiels Sommeil",
        subtitle: "Une collection soignee pour un repos profond.",
        price: "Prix"
      },
      cart: {
        title: "Votre panier",
        empty: "Votre panier est vide.",
        continue: "Continuer les achats",
        quantity: "Quantite",
        total: "Total",
        checkout: "Paiement",
        remove: "Supprimer"
      },
      checkout: {
        title: "Paiement",
        subtitle: "Finalisez votre commande en securite.",
        fullName: "Nom complet",
        email: "Email",
        phone: "Telephone",
        address: "Adresse",
        paySecurely: "Payer en securite",
        secureSoon: "Mise en place du paiement securise bientot disponible",
        success: "Commande recue. Nous vous contacterons rapidement."
      },
      auth: {
        loginTitle: "Connexion",
        registerTitle: "Creer un compte",
        firstName: "Prenom",
        lastName: "Nom",
        email: "Email",
        password: "Mot de passe",
        signIn: "Se connecter",
        create: "Creer",
        createAccount: "Creer un compte",
        already: "Vous avez deja un compte ?",
        noAccount: "Vous n'avez pas de compte ?"
      },
      contact: {
        title: "Contacter Sleepora",
        subtitle: "Envoyez votre message et nous vous repondrons rapidement.",
        email: "Email",
        message: "Message",
        send: "Envoyer",
        success: "Message envoye avec succes."
      },
      footer: {
        privacyPolicy: "Politique de confidentialite",
        termsOfService: "Conditions de service",
        refundPolicy: "Politique de remboursement",
        shippingPolicy: "Politique de livraison",
        rights: "(c) 2026 Sleepora. Tous droits reserves."
      },
      policy: {
        back: "Retour boutique",
        privacyPolicy: {
          title: "Politique de confidentialite",
          body: "Nous collectons uniquement les donnees necessaires pour traiter les commandes."
        },
        termsOfService: {
          title: "Conditions de service",
          body: "En utilisant Sleepora, vous acceptez les conditions de commande et de paiement."
        },
        refundPolicy: {
          title: "Politique de remboursement",
          body: "Les produits eligibles peuvent etre rembourses selon les conditions de retour."
        },
        shippingPolicy: {
          title: "Politique de livraison",
          body: "Les commandes sont expediees rapidement avec suivi lorsque disponible."
        }
      },
      admin: {
        setupTitle: "Configuration Admin",
        setupSubtitle: "Creez des identifiants proprietaire pour l'acces securise a /admin.",
        username: "Nom d'utilisateur",
        password: "Mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        saveSetup: "Enregistrer",
        loginTitle: "Connexion Admin",
        loginSubtitle: "Acces proprietaire uniquement",
        loginButton: "Acceder a l'admin",
        logout: "Se deconnecter",
        dashboardTitle: "Admin Sleepora",
        dashboardSubtitle: "Gerer les produits et commandes depuis n'importe quel appareil",
        addProduct: "Ajouter produit",
        editProduct: "Modifier produit",
        name: "Nom",
        price: "Prix",
        description: "Description",
        featured: "Vedette",
        image: "Image produit",
        imagePath: "Chemin image",
        imageHelp: "Formats: jpg, jpeg, png, webp. Taille max 5 Mo.",
        chooseFile: "Choisir un fichier image",
        saveProduct: "Enregistrer",
        updateProduct: "Mettre a jour",
        cancelEdit: "Annuler",
        deleteProduct: "Supprimer",
        products: "Produits",
        noProducts: "Aucun produit.",
        preview: "Apercu",
        setupSaved: "Identifiants admin enregistres.",
        passwordsMismatch: "Les mots de passe ne correspondent pas.",
        invalidLogin: "Identifiants invalides.",
        saved: "Modifications enregistrees.",
        deleted: "Produit supprime.",
        uploadError: "Echec du telechargement de l'image.",
        validationError: "Veuillez remplir les champs obligatoires.",
        localApiError: "L'API admin produits est indisponible. Verifiez le deploiement et les variables d'environnement."
      },
      common: {
        loading: "Chargement...",
        unavailable: "Indisponible",
        missingImage: "Image indisponible"
      }
    }
  },
  ar: {
    translation: {
      brand: {
        name: "Sleepora",
        tagline: "Better Sleep Starts Tonight"
      },
      meta: {
        home: "Sleepora - Better Sleep Starts Tonight",
        products: "المنتجات - Sleepora",
        product: "المنتج - Sleepora",
        cart: "السلة - Sleepora",
        checkout: "الدفع - Sleepora",
        login: "تسجيل الدخول - Sleepora",
        register: "إنشاء حساب - Sleepora",
        policy: "السياسات - Sleepora",
        admin: "الإدارة - Sleepora"
      },
      language: {
        en: "EN",
        fr: "FR",
        ar: "AR"
      },
      theme: {
        light: "فاتح",
        dark: "داكن"
      },
      nav: {
        products: "المنتجات",
        cart: "السلة",
        login: "دخول",
        register: "تسجيل",
        contact: "اتصال"
      },
      home: {
        heroTitle: "Better Sleep Starts Tonight",
        heroSubtitle: "منتجات نوم فاخرة تمنحك راحة أعمق ونوما أكثر هدوءا.",
        shopNow: "تسوق الآن",
        featuredLabel: "المنتج المميز",
        featuredTitle: "وسادة رقبة ميموري فوم مريحة",
        featuredDescription: "مصممة لدعم الرقبة بشكل طبيعي وتقليل الضغط من أجل نوم أكثر عمقا.",
        buyNow: "اشتر الآن",
        collectionTitle: "مجموعة المنتجات",
        trustTitle: "لماذا Sleepora",
        trust1: "ضمان 30 يوما",
        trust2: "مواد عالية الجودة",
        trust3: "شحن عالمي سريع"
      },
      product: {
        benefits: "الفوائد",
        addToCart: "أضف إلى السلة",
        buyNow: "اشتر الآن",
        detailsTitle: "الوصف",
        detailsBody: "كل منتج من Sleepora مصمم بمواد فاخرة لراحة أكبر وتعافٍ أفضل أثناء النوم.",
        notFound: "المنتج غير موجود"
      },
      products: {
        title: "أساسيات النوم",
        subtitle: "مجموعة مختارة لنوم عميق وراحة يومية.",
        price: "السعر"
      },
      cart: {
        title: "سلتك",
        empty: "السلة فارغة.",
        continue: "متابعة التسوق",
        quantity: "الكمية",
        total: "الإجمالي",
        checkout: "الدفع",
        remove: "حذف"
      },
      checkout: {
        title: "الدفع",
        subtitle: "أكمل طلبك بأمان.",
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        address: "العنوان",
        paySecurely: "ادفع بأمان",
        secureSoon: "إعداد الدفع الآمن قادم قريبا",
        success: "تم استلام طلبك وسنتواصل معك قريبا."
      },
      auth: {
        loginTitle: "تسجيل الدخول",
        registerTitle: "إنشاء حساب",
        firstName: "الاسم الأول",
        lastName: "اسم العائلة",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        signIn: "دخول",
        create: "إنشاء",
        createAccount: "إنشاء حساب",
        already: "لديك حساب بالفعل؟",
        noAccount: "ليس لديك حساب؟"
      },
      contact: {
        title: "تواصل مع Sleepora",
        subtitle: "أرسل رسالتك وسنرد عليك قريبا.",
        email: "البريد الإلكتروني",
        message: "الرسالة",
        send: "إرسال",
        success: "تم إرسال الرسالة بنجاح."
      },
      footer: {
        privacyPolicy: "سياسة الخصوصية",
        termsOfService: "شروط الخدمة",
        refundPolicy: "سياسة الاسترجاع",
        shippingPolicy: "سياسة الشحن",
        rights: "(c) 2026 Sleepora. جميع الحقوق محفوظة."
      },
      policy: {
        back: "العودة للمتجر",
        privacyPolicy: {
          title: "سياسة الخصوصية",
          body: "نجمع فقط البيانات اللازمة لمعالجة الطلبات وخدمة العملاء."
        },
        termsOfService: {
          title: "شروط الخدمة",
          body: "باستخدام Sleepora فإنك توافق على شروط الطلبات والدفع والاستخدام."
        },
        refundPolicy: {
          title: "سياسة الاسترجاع",
          body: "يمكن استرجاع المنتجات المؤهلة وفقا لشروط الإرجاع وحالة المنتج."
        },
        shippingPolicy: {
          title: "سياسة الشحن",
          body: "نقوم بالشحن بسرعة إلى مختلف الدول مع رقم تتبع عند توفره."
        }
      },
      admin: {
        setupTitle: "إعداد الإدارة",
        setupSubtitle: "أنشئ بيانات مالك للوصول الآمن إلى /admin",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        confirmPassword: "تأكيد كلمة المرور",
        saveSetup: "حفظ البيانات",
        loginTitle: "دخول الإدارة",
        loginSubtitle: "وصول خاص بالمالك فقط",
        loginButton: "دخول الإدارة",
        logout: "تسجيل الخروج",
        dashboardTitle: "لوحة إدارة Sleepora",
        dashboardSubtitle: "إدارة المنتجات والطلبات من أي جهاز",
        addProduct: "إضافة منتج",
        editProduct: "تعديل المنتج",
        name: "الاسم",
        price: "السعر",
        description: "الوصف",
        featured: "مميز",
        image: "صورة المنتج",
        imagePath: "مسار الصورة",
        imageHelp: "الصيغ المقبولة: jpg, jpeg, png, webp. الحد الأقصى 5MB.",
        chooseFile: "اختر صورة",
        saveProduct: "حفظ المنتج",
        updateProduct: "تحديث المنتج",
        cancelEdit: "إلغاء التعديل",
        deleteProduct: "حذف",
        products: "المنتجات",
        noProducts: "لا توجد منتجات.",
        preview: "معاينة",
        setupSaved: "تم حفظ بيانات الإدارة.",
        passwordsMismatch: "كلمتا المرور غير متطابقتين.",
        invalidLogin: "بيانات الدخول غير صحيحة.",
        saved: "تم حفظ التغييرات.",
        deleted: "تم حذف المنتج.",
        uploadError: "فشل رفع الصورة.",
        validationError: "يرجى إكمال الحقول المطلوبة.",
        localApiError: "واجهة إدارة المنتجات غير متاحة. تحقق من النشر ومتغيرات البيئة."
      },
      common: {
        loading: "جار التحميل...",
        unavailable: "غير متاح",
        missingImage: "الصورة غير متاحة"
      }
    }
  }
};

const languageOptions = {
  en: "EN",
  fr: "FR",
  ar: "AR",
  es: "ES",
  de: "DE",
  it: "IT"
};

const navDictionary = {
  en: { products: "Products", machines: "Machines", accessories: "Accessories", pillows: "Pillows", cart: "Cart" },
  fr: { products: "Produits", machines: "Machines", accessories: "Accessoires", pillows: "Oreillers", cart: "Panier" },
  ar: { products: "المنتجات", machines: "الأجهزة", accessories: "الإكسسوارات", pillows: "الوسائد", cart: "السلة" },
  es: { products: "Productos", machines: "Maquinas", accessories: "Accesorios", pillows: "Almohadas", cart: "Carrito" },
  de: { products: "Produkte", machines: "Maschinen", accessories: "Zubehor", pillows: "Kissen", cart: "Warenkorb" },
  it: { products: "Prodotti", machines: "Macchine", accessories: "Accessori", pillows: "Cuscini", cart: "Carrello" }
};

for (const key of Object.keys(resources)) {
  const translation = resources[key]?.translation || {};
  translation.language = { ...(translation.language || {}), ...languageOptions };
  translation.nav = {
    ...(translation.nav || {}),
    ...(navDictionary[key] || navDictionary.en)
  };
  translation.product = {
    ...(translation.product || {}),
    colorsTitle: translation.product?.colorsTitle || "Available colors",
    selectedColor: translation.product?.selectedColor || "Selected",
    reelsTitle: translation.product?.reelsTitle || "Reels"
  };
  translation.checkout = {
    ...(translation.checkout || {}),
    city: translation.checkout?.city || "City",
    state: translation.checkout?.state || "State",
    zip: translation.checkout?.zip || "ZIP Code",
    country: translation.checkout?.country || "Country",
    payWithPaypal: translation.checkout?.payWithPaypal || "Pay with PayPal or Card",
    checkoutWithPaypal: translation.checkout?.checkoutWithPaypal || "Checkout with PayPal",
    redirectHint:
      translation.checkout?.redirectHint || "After clicking checkout, PayPal will ask for your PayPal/card details securely.",
    retryPaypal: translation.checkout?.retryPaypal || "Retry PayPal",
    loadingGateway: translation.checkout?.loadingGateway || "Loading secure payment gateway...",
    paypalUnavailable: translation.checkout?.paypalUnavailable || "PayPal is currently unavailable.",
    paymentFailed: translation.checkout?.paymentFailed || "Payment failed. Please try again.",
    validationError: translation.checkout?.validationError || "Please complete all checkout fields.",
    orderSummary: translation.checkout?.orderSummary || "Order Summary",
    subtotal: translation.checkout?.subtotal || "Subtotal",
    backToCart: translation.checkout?.backToCart || "Back to Cart",
    successTitle: translation.checkout?.successTitle || "Payment completed",
    cancelTitle: translation.checkout?.cancelTitle || "Payment cancelled",
    cancelled: translation.checkout?.cancelled || "Payment was cancelled. You can try again.",
    orderRef: translation.checkout?.orderRef || "Order reference",
    cardSupportNote: translation.checkout?.cardSupportNote || "You can pay with PayPal, Visa, or Mastercard."
  };
  translation.admin = {
    ...(translation.admin || {}),
    colors: translation.admin?.colors || "Available Colors",
    colorsHelp: translation.admin?.colorsHelp || "Comma separated values, e.g. White, Black, #d9c7a8",
    category: translation.admin?.category || "Category",
    variants: translation.admin?.variants || "Color/Image Variants",
    variant: translation.admin?.variant || "Variant",
    addVariant: translation.admin?.addVariant || "Add Variant",
    removeVariant: translation.admin?.removeVariant || "Remove",
    variantColor: translation.admin?.variantColor || "Color",
    variantImage: translation.admin?.variantImage || "Image path",
    variantHelp: translation.admin?.variantHelp || "Each variant should have a color and image. You can upload many images per product.",
    imageUploaded: translation.admin?.imageUploaded || "Image uploaded.",
    mediaUploaded: translation.admin?.mediaUploaded || "Media uploaded.",
    reels: translation.admin?.reels || "Product Reels",
    reel: translation.admin?.reel || "Reel",
    addReel: translation.admin?.addReel || "Add Reel",
    removeReel: translation.admin?.removeReel || "Remove Reel",
    reelUrl: translation.admin?.reelUrl || "Reel URL",
    reelPoster: translation.admin?.reelPoster || "Poster image URL",
    reelHelp: translation.admin?.reelHelp || "Add direct video links or upload clips for this product.",
    videoUpload: translation.admin?.videoUpload || "Upload video",
    videoHelp: translation.admin?.videoHelp || "Accepted: mp4, webm, mov, m4v. Max size 30 MB.",
    logoutSuccess: translation.admin?.logoutSuccess || "Logged out.",
    copied: translation.admin?.copied || "Copied.",
    copyFailed: translation.admin?.copyFailed || "Copy failed.",
    ordersLoadError: translation.admin?.ordersLoadError || "Unable to load paid orders.",
    apiUnavailable:
      translation.admin?.apiUnavailable || "Admin API is unavailable. Verify Vercel Root Directory is set to repository root.",
    ordersTitle: translation.admin?.ordersTitle || "Paid Orders",
    refreshOrders: translation.admin?.refreshOrders || "Refresh",
    paidBadge: translation.admin?.paidBadge || "Paid",
    customerName: translation.admin?.customerName || "Name",
    customerEmail: translation.admin?.customerEmail || "Email",
    customerPhone: translation.admin?.customerPhone || "Phone",
    customerAddress: translation.admin?.customerAddress || "Address",
    copyEmail: translation.admin?.copyEmail || "Copy Email",
    copyPhone: translation.admin?.copyPhone || "Copy Phone",
    copyAddress: translation.admin?.copyAddress || "Copy Address",
    copyEmailSuccess: translation.admin?.copyEmailSuccess || "Email copied.",
    copyPhoneSuccess: translation.admin?.copyPhoneSuccess || "Phone copied.",
    copyAddressSuccess: translation.admin?.copyAddressSuccess || "Address copied.",
    orderItems: translation.admin?.orderItems || "Items",
    noOrderItems: translation.admin?.noOrderItems || "No items.",
    orderTotal: translation.admin?.orderTotal || "Total",
    noOrders: translation.admin?.noOrders || "No paid orders yet."
  };
  resources[key].translation = translation;
}

const baseTranslation = JSON.parse(JSON.stringify(resources.en.translation));
for (const extraCode of ["es", "de", "it"]) {
  if (!resources[extraCode]) {
    resources[extraCode] = {
      translation: {
        ...baseTranslation,
        language: { ...languageOptions }
      }
    };
  }

  resources[extraCode].translation.nav = {
    ...(resources[extraCode].translation.nav || {}),
    ...(navDictionary[extraCode] || navDictionary.en)
  };
}
const defaultLanguage = "en";
let initialLanguage = defaultLanguage;

if (typeof window !== "undefined") {
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved && ["en", "fr", "ar", "es", "de", "it"].includes(saved)) {
    initialLanguage = saved;
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: defaultLanguage,
  interpolation: { escapeValue: false }
});

export default i18n;


