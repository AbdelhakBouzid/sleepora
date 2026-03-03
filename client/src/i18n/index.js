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
  translation.auth = {
    ...(translation.auth || {}),
    missingFields: translation.auth?.missingFields || "Please fill all required fields.",
    requestFailed: translation.auth?.requestFailed || "Request failed. Please try again.",
    registerSuccess: translation.auth?.registerSuccess || "Account created successfully. Please sign in.",
    loginSuccess: translation.auth?.loginSuccess || "Signed in successfully.",
    forgotPassword: translation.auth?.forgotPassword || "Forgot password?",
    gender: translation.auth?.gender || "Gender",
    selectGender: translation.auth?.selectGender || "Select gender",
    male: translation.auth?.male || "Male",
    female: translation.auth?.female || "Female",
    age: translation.auth?.age || "Age",
    phone: translation.auth?.phone || "Phone Number",
    countryPhone: translation.auth?.countryPhone || "Country / Dial Code",
    confirmPassword: translation.auth?.confirmPassword || "Confirm Password",
    passwordsMismatch: translation.auth?.passwordsMismatch || "Passwords do not match.",
    passwordPolicy:
      translation.auth?.passwordPolicy || "Password must include upper and lower letters, a number, and a symbol.",
    otpMethod: translation.auth?.otpMethod || "OTP delivery method",
    otpByEmail: translation.auth?.otpByEmail || "Email",
    otpByPhone: translation.auth?.otpByPhone || "Phone (SMS)",
    sendOtp: translation.auth?.sendOtp || "Send OTP",
    otpSent: translation.auth?.otpSent || "OTP sent successfully.",
    otpCode: translation.auth?.otpCode || "OTP Code",
    newPassword: translation.auth?.newPassword || "New Password",
    resetPassword: translation.auth?.resetPassword || "Reset Password",
    passwordResetSuccess: translation.auth?.passwordResetSuccess || "Password updated successfully."
  };
  translation.checkout = {
    ...(translation.checkout || {}),
    city: translation.checkout?.city || "City",
    state: translation.checkout?.state || "State",
    zip: translation.checkout?.zip || "ZIP Code",
    country: translation.checkout?.country || "Country",
    payWithPaypal: translation.checkout?.payWithPaypal || "Pay with PayPal or Card",
    checkoutWithPaypal: translation.checkout?.checkoutWithPaypal || "Checkout with PayPal",
    chooseMethod: translation.checkout?.chooseMethod || "Choose one payment method below:",
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
    selectColor: translation.admin?.selectColor || "Select color",
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

const localizedEnhancements = {
  en: {
    home: {
      collectionSubtitle: "Sleep tools selected for calm nights and deep recovery."
    }
  },
  fr: {
    nav: {
      products: "Produits",
      machines: "Machines",
      accessories: "Accessoires",
      pillows: "Oreillers",
      cart: "Panier"
    },
    home: {
      collectionSubtitle: "Des produits choisis pour des nuits calmes et une meilleure recuperation."
    },
    product: {
      colorsTitle: "Couleurs disponibles",
      selectedColor: "Selectionne",
      reelsTitle: "Reels",
      defaultBenefit1: "Soulage les douleurs du cou",
      defaultBenefit2: "Ameliore la posture du sommeil",
      defaultBenefit3: "Confort premium",
      defaultBenefit4: "Concu pour un sommeil profond"
    },
    auth: {
      forgotPassword: "Mot de passe oublie ?",
      gender: "Genre",
      selectGender: "Choisir le genre",
      male: "Homme",
      female: "Femme",
      age: "Age",
      phone: "Numero de telephone",
      countryPhone: "Pays / Indicatif",
      confirmPassword: "Confirmer le mot de passe",
      passwordPolicy: "Le mot de passe doit contenir majuscule, minuscule, chiffre et symbole.",
      otpMethod: "Methode d'envoi OTP",
      otpByEmail: "Email",
      otpByPhone: "Telephone (SMS)",
      sendOtp: "Envoyer OTP",
      otpSent: "OTP envoye avec succes.",
      otpCode: "Code OTP",
      newPassword: "Nouveau mot de passe",
      resetPassword: "Reinitialiser le mot de passe",
      passwordResetSuccess: "Mot de passe mis a jour avec succes."
    },
    checkout: {
      payWithPaypal: "Payer avec PayPal ou carte",
      chooseMethod: "Choisissez un moyen de paiement ci-dessous :",
      redirectHint: "Apres le clic, PayPal demandera vos informations PayPal/carte de maniere securisee.",
      cardSupportNote: "Vous pouvez payer avec PayPal, Visa ou Mastercard."
    },
    admin: {
      selectColor: "Choisir une couleur"
    }
  },
  ar: {
    nav: {
      products: "المنتجات",
      machines: "الأجهزة",
      accessories: "الإكسسوارات",
      pillows: "الوسائد",
      cart: "السلة"
    },
    home: {
      trustTitle: "لماذا Sleepora",
      collectionSubtitle: "منتجات نوم مختارة لليال هادئة واستشفاء افضل."
    },
    product: {
      colorsTitle: "الالوان المتوفرة",
      selectedColor: "اللون المحدد",
      reelsTitle: "ريلز",
      defaultBenefit1: "يخفف الم الرقبة",
      defaultBenefit2: "يحسن وضعية النوم",
      defaultBenefit3: "راحة فائقة",
      defaultBenefit4: "مصمم لنوم عميق"
    },
    auth: {
      loginTitle: "تسجيل الدخول",
      registerTitle: "انشاء حساب",
      firstName: "الاسم الاول",
      lastName: "اسم العائلة",
      email: "البريد الالكتروني",
      password: "كلمة المرور",
      signIn: "دخول",
      create: "انشاء",
      createAccount: "انشاء حساب",
      already: "لديك حساب بالفعل؟",
      noAccount: "ليس لديك حساب؟",
      forgotPassword: "نسيت كلمة السر؟",
      gender: "الجنس",
      selectGender: "اختر الجنس",
      male: "ذكر",
      female: "انثى",
      age: "العمر",
      phone: "رقم الهاتف",
      countryPhone: "الدولة / رمز الاتصال",
      confirmPassword: "تاكيد كلمة المرور",
      missingFields: "يرجى ملء جميع الحقول المطلوبة.",
      requestFailed: "فشل الطلب. حاول مرة اخرى.",
      registerSuccess: "تم انشاء الحساب بنجاح. قم بتسجيل الدخول.",
      loginSuccess: "تم تسجيل الدخول بنجاح.",
      passwordsMismatch: "كلمتا المرور غير متطابقتين.",
      passwordPolicy: "يجب ان تحتوي كلمة المرور على حروف كبيرة وصغيرة ورقم ورمز.",
      otpMethod: "طريقة ارسال OTP",
      otpByEmail: "البريد الالكتروني",
      otpByPhone: "الهاتف (SMS)",
      sendOtp: "ارسال OTP",
      otpSent: "تم ارسال OTP بنجاح.",
      otpCode: "رمز OTP",
      newPassword: "كلمة المرور الجديدة",
      resetPassword: "اعادة تعيين كلمة المرور",
      passwordResetSuccess: "تم تحديث كلمة المرور بنجاح."
    },
    checkout: {
      title: "الدفع",
      subtitle: "اكمل طلبك بامان.",
      fullName: "الاسم الكامل",
      email: "البريد الالكتروني",
      phone: "الهاتف",
      address: "العنوان",
      city: "المدينة",
      state: "المنطقة",
      zip: "الرمز البريدي",
      country: "الدولة",
      payWithPaypal: "الدفع عبر بايبال او البطاقة",
      chooseMethod: "اختر طريقة دفع من الاسفل:",
      redirectHint: "بعد الضغط على الدفع، سيطلب بايبال بيانات بايبال/البطاقة بشكل امن.",
      retryPaypal: "اعادة محاولة بايبال",
      loadingGateway: "جاري تحميل بوابة الدفع الامنة...",
      paypalUnavailable: "بايبال غير متاح حاليا.",
      paymentFailed: "فشلت عملية الدفع. حاول مرة اخرى.",
      validationError: "يرجى اكمال جميع حقول الدفع.",
      orderSummary: "ملخص الطلب",
      subtotal: "المجموع الفرعي",
      backToCart: "العودة للسلة",
      cardSupportNote: "يمكنك الدفع عبر بايبال او فيزا او ماستركارد."
    },
    admin: {
      selectColor: "اختر اللون"
    }
  }
};

for (const [lang, sections] of Object.entries(localizedEnhancements)) {
  const translation = resources[lang]?.translation;
  if (!translation) continue;
  for (const [section, value] of Object.entries(sections)) {
    translation[section] = {
      ...(translation[section] || {}),
      ...value
    };
  }
  resources[lang].translation = translation;
}

const policyEnhancements = {
  en: {
    policy: {
      back: "Back to store",
      privacyPolicy: {
        title: "Privacy Policy",
        body:
          "This Privacy Policy explains how Sleepora collects, uses, and protects your personal information when you browse our website, create an account, place an order, contact support, or otherwise interact with our services.\n\nWe may collect information such as your name, email address, phone number, shipping address, billing-related information, account details, order history, and any information you submit through forms or customer support messages. We may also collect technical data such as browser type, device information, IP address, pages visited, and general website activity to improve store performance and security.\n\nWe use your information to process and deliver orders, confirm payments, communicate about your purchase, provide support, manage your account, prevent fraud, improve our products and services, and comply with legal obligations. We do not sell your personal information.\n\nYour information may be shared only with trusted third-party providers that help us operate the store, such as payment processors, shipping carriers, hosting services, analytics providers, fraud prevention tools, and email service providers, and only to the extent necessary for them to perform their services.\n\nWe retain personal information for as long as reasonably necessary to fulfill orders, maintain business records, comply with legal requirements, resolve disputes, and enforce our agreements. We use reasonable safeguards to protect your information, but no method of transmission or storage online is completely secure.\n\nIf you would like to access, correct, or request deletion of your personal information, you may contact us through the contact details shown on the website. Depending on your country, you may have additional privacy rights under applicable law."
      },
      termsOfService: {
        title: "Terms of Service",
        body:
          "By visiting Sleepora or purchasing from our website, you agree to these Terms of Service. If you do not agree, you should not access or use the website.\n\nYou agree to provide current, complete, and accurate information for purchases, account registration, and customer communication. You are responsible for keeping your login credentials secure and for all activity that occurs under your account.\n\nAll product listings, descriptions, prices, promotions, availability, and website content may be changed, updated, or removed at any time without prior notice. We reserve the right to limit, refuse, or cancel any order in cases including suspected fraud, pricing errors, stock issues, or misuse of the website.\n\nYou may not use the website for any unlawful purpose, interfere with the operation or security of the site, attempt unauthorized access, or reproduce and exploit site content without our prior written permission.\n\nOrders are not considered accepted until payment has been successfully completed and the order has passed our internal review. Delivery estimates are provided for convenience only and may be affected by destination, customs, carriers, local conditions, or other external factors.\n\nTo the maximum extent permitted by law, Sleepora shall not be liable for indirect, incidental, or consequential losses arising from use of the website, delayed shipments, third-party service failures, or circumstances outside our reasonable control."
      },
      refundPolicy: {
        title: "Refund Policy",
        body:
          "We want you to shop with confidence at Sleepora. If you are not satisfied with an eligible purchase, you may request a return or refund within the applicable return period stated on the product page or store policy.\n\nTo qualify for a return, the item must be in acceptable return condition, including being unused or only reasonably inspected, clean, and returned with original packaging, accessories, and included parts where applicable. Items showing misuse, heavy wear, missing components, or unsanitary condition may be refused.\n\nSome items may be non-returnable due to hygiene, safety, customization, final-sale status, or promotional terms. Where applicable, these conditions will be indicated in the product listing or during checkout.\n\nIf your item arrives damaged, defective, or incorrect, please contact us promptly with your order number and clear photos or videos. After review, we may offer a replacement, store credit, partial refund, or full refund depending on the situation.\n\nRefunds are issued after the returned product is received and inspected, or after we determine that returning the item is not necessary. Approved refunds are sent back to the original payment method, and processing time depends on your payment provider.\n\nOriginal shipping charges, return shipping costs, customs duties, taxes, and similar fees may be non-refundable unless the issue resulted from our error or a verified product defect."
      },
      shippingPolicy: {
        title: "Shipping Policy",
        body:
          "Sleepora ships to many destinations and works with fulfillment and carrier partners to deliver orders as efficiently as possible. Processing times and transit times may vary based on product availability, destination, season, and carrier conditions.\n\nOrders are generally processed after payment is confirmed. During promotional periods, holidays, stock updates, or unusually high order volume, processing times may be longer than expected. If a major delay occurs, we will try to contact you using the information provided with the order.\n\nShipping estimates shown on the website are general estimates only and are not guaranteed delivery dates. Delivery may be affected by customs clearance, local delivery delays, weather, remote destinations, incomplete addresses, or other circumstances beyond our control.\n\nCustomers are responsible for providing a complete and accurate shipping address. If an order is delayed, returned, or lost because of incorrect or incomplete address details provided by the customer, additional fees may apply.\n\nDepending on the destination country, customs duties, import taxes, brokerage charges, or other local fees may apply and remain the responsibility of the customer unless otherwise stated.\n\nTracking information may be provided when available after the order has shipped. If you need help locating a package, you may contact us and we will assist using the latest information available from the shipping carrier."
      }
    }
  },
  fr: {
    policy: {
      back: "Retour boutique",
      privacyPolicy: {
        title: "Politique de confidentialite",
        body:
          "Cette Politique de confidentialite explique comment Sleepora collecte, utilise et protege vos informations personnelles lorsque vous naviguez sur notre site, creez un compte, passez une commande, contactez le support ou utilisez nos services.\n\nNous pouvons collecter des informations telles que votre nom, votre adresse email, votre numero de telephone, votre adresse de livraison, certaines informations liees au paiement, les details de votre compte, votre historique de commande ainsi que tout contenu que vous nous envoyez via les formulaires ou le support client. Nous pouvons egalement collecter des donnees techniques comme le type de navigateur, l'appareil, l'adresse IP et l'activite generale sur le site afin d'ameliorer la securite et les performances.\n\nNous utilisons ces informations pour traiter et expedier les commandes, confirmer les paiements, communiquer au sujet de vos achats, fournir l'assistance client, gerer votre compte, prevenir la fraude, ameliorer nos produits et respecter nos obligations legales. Nous ne vendons pas vos donnees personnelles.\n\nVos informations peuvent etre partagees uniquement avec des prestataires de confiance necessaires au fonctionnement de la boutique, notamment les processeurs de paiement, transporteurs, services d'hebergement, outils d'analyse, systemes anti-fraude et fournisseurs d'email, et seulement dans la mesure requise pour leurs services.\n\nNous conservons les donnees personnelles aussi longtemps que raisonnablement necessaire pour executer les commandes, tenir nos registres, respecter la loi, resoudre les litiges et faire appliquer nos accords. Nous prenons des mesures raisonnables de protection, sans pouvoir garantir une securite absolue.\n\nVous pouvez demander l'acces, la correction ou la suppression de vos informations personnelles en nous contactant. Selon votre pays, vous pouvez disposer de droits supplementaires prevus par la loi applicable."
      },
      termsOfService: {
        title: "Conditions de service",
        body:
          "En visitant Sleepora ou en achetant sur notre site, vous acceptez les presentes Conditions de service. Si vous n'etes pas d'accord, vous ne devez pas utiliser le site.\n\nVous acceptez de fournir des informations actuelles, completes et exactes pour vos achats, votre inscription et vos echanges avec notre boutique. Vous etes responsable de la confidentialite de vos identifiants et de toute activite effectuee sous votre compte.\n\nTous les produits, descriptions, prix, promotions, disponibilites et contenus du site peuvent etre modifies, mis a jour ou retires a tout moment sans preavis. Nous nous reservons le droit de limiter, refuser ou annuler une commande en cas de suspicion de fraude, d'erreur de prix, de probleme de stock ou de mauvaise utilisation du site.\n\nVous ne pouvez pas utiliser le site a des fins illegales, perturber son fonctionnement ou sa securite, tenter un acces non autorise, ni reproduire ou exploiter son contenu sans autorisation ecrite prealable.\n\nLes commandes ne sont considerees comme acceptees qu'apres paiement reussi et validation interne. Les delais de livraison sont fournis a titre indicatif et peuvent varier selon la destination, la douane, les transporteurs ou d'autres facteurs externes.\n\nDans la mesure maximale autorisee par la loi, Sleepora ne pourra etre tenue responsable des pertes indirectes, accessoires ou consecutives liees a l'utilisation du site, aux retards de livraison, aux defaillances de services tiers ou a des circonstances hors de notre controle raisonnable."
      },
      refundPolicy: {
        title: "Politique de remboursement",
        body:
          "Nous voulons que vous achetiez en toute confiance chez Sleepora. Si vous n'etes pas satisfait d'un achat eligible, vous pouvez demander un retour ou un remboursement pendant la periode de retour applicable indiquee sur la fiche produit ou dans la politique de la boutique.\n\nPour etre accepte, l'article doit etre dans un etat de retour convenable, c'est-a-dire non utilise ou seulement raisonnablement inspecte, propre, et renvoye avec son emballage d'origine, ses accessoires et ses elements inclus lorsque cela s'applique. Les articles endommages, fortement utilises, incomplets ou dans un etat non hygienique peuvent etre refuses.\n\nCertains produits peuvent etre exclus du retour pour des raisons d'hygiene, de securite, de personnalisation, de vente finale ou de conditions promotionnelles. Ces restrictions peuvent etre indiquees sur la fiche produit ou lors du paiement.\n\nSi votre article arrive endommage, defectueux ou incorrect, veuillez nous contacter rapidement avec votre numero de commande ainsi que des photos ou videos claires. Selon le cas, nous pourrons proposer un remplacement, un avoir, un remboursement partiel ou complet.\n\nLes remboursements sont emis apres reception et verification du produit retourne, ou apres decision qu'un retour n'est pas necessaire. Les remboursements approuves sont renvoyes vers le moyen de paiement initial, avec un delai dependant du prestataire de paiement.\n\nLes frais de livraison initiaux, frais de retour, droits de douane, taxes et frais similaires peuvent ne pas etre remboursables sauf si le probleme resulte d'une erreur de notre part ou d'un defaut produit confirme."
      },
      shippingPolicy: {
        title: "Politique de livraison",
        body:
          "Sleepora expedie vers de nombreuses destinations et collabore avec des partenaires logistiques pour livrer les commandes aussi efficacement que possible. Les delais de traitement et d'acheminement peuvent varier selon la disponibilite produit, la destination, la saison et les conditions du transporteur.\n\nLes commandes sont generalement traitees apres confirmation du paiement. Pendant les promotions, les jours feries, les ajustements de stock ou les periodes de forte demande, le traitement peut prendre plus de temps que prevu. En cas de retard important, nous essayerons de vous contacter avec les informations fournies dans la commande.\n\nLes estimations affichees sur le site sont purement indicatives et ne constituent pas des dates de livraison garanties. La livraison peut etre affectee par le dedouanement, les retards locaux, la meteo, les destinations eloignees, les adresses incompletes ou d'autres circonstances independantes de notre volonte.\n\nLe client est responsable de fournir une adresse de livraison complete et exacte. Si une commande est retardee, retournee ou perdue en raison d'informations inexactes ou incompletes fournies par le client, des frais supplementaires peuvent s'appliquer.\n\nSelon le pays de destination, des droits de douane, taxes d'importation, frais de courtage ou autres frais locaux peuvent etre appliques et restent a la charge du client sauf mention contraire.\n\nUn numero de suivi peut etre fourni lorsqu'il est disponible apres l'expedition de la commande. Si vous avez besoin d'aide pour localiser un colis, vous pouvez nous contacter et nous vous assisterons selon les informations disponibles chez le transporteur."
      }
    }
  },
  ar: {
    policy: {
      back: "العودة للمتجر",
      privacyPolicy: {
        title: "سياسة الخصوصية",
        body:
          "توضح سياسة الخصوصية هذه كيف تقوم Sleepora بجمع معلوماتك الشخصية واستخدامها وحمايتها عندما تتصفح الموقع، تنشئ حسابا، تقدم طلبا، تتواصل مع الدعم، او تستخدم خدماتنا.\n\nقد نقوم بجمع معلومات مثل الاسم، البريد الالكتروني، رقم الهاتف، عنوان الشحن، بعض المعلومات المرتبطة بالدفع، تفاصيل الحساب، سجل الطلبات، واي محتوى ترسله لنا عبر النماذج او خدمة العملاء. كما قد نجمع بيانات تقنية مثل نوع المتصفح، نوع الجهاز، عنوان IP، والصفحات التي تزورها لتحسين الامان والاداء.\n\nنستخدم هذه المعلومات لمعالجة الطلبات وشحنها، تاكيد المدفوعات، التواصل بخصوص مشترياتك، تقديم الدعم، ادارة الحساب، منع الاحتيال، تحسين المنتجات والخدمات، والامتثال للالتزامات القانونية. نحن لا نبيع بياناتك الشخصية.\n\nقد نشارك البيانات فقط مع مزودي خدمات موثوقين يساعدوننا في تشغيل المتجر، مثل مزودي الدفع، شركات الشحن، خدمات الاستضافة، التحليلات، منع الاحتيال، وخدمات البريد الالكتروني، وذلك فقط بالقدر اللازم لتنفيذ الخدمة.\n\nنحتفظ بالمعلومات الشخصية طالما كان ذلك ضروريا بشكل معقول لتنفيذ الطلبات، حفظ السجلات، الامتثال للقانون، حل النزاعات، وتنفيذ الاتفاقيات. ونتخذ اجراءات حماية معقولة، لكن لا يمكن ضمان الامان الكامل لاي نقل او تخزين عبر الانترنت.\n\nيمكنك طلب الوصول الى بياناتك او تصحيحها او حذفها عبر التواصل معنا. وقد تكون لك حقوق خصوصية اضافية بحسب بلدك والقوانين المعمول بها."
      },
      termsOfService: {
        title: "شروط الخدمة",
        body:
          "عند زيارتك لموقع Sleepora او الشراء منه، فانك توافق على شروط الخدمة هذه. اذا لم توافق، فيجب عليك عدم استخدام الموقع.\n\nتوافق على تقديم معلومات حديثة وكاملة وصحيحة عند الشراء، التسجيل، او التواصل مع المتجر. كما تتحمل مسؤولية الحفاظ على سرية بيانات الدخول الخاصة بك وكل نشاط يتم عبر حسابك.\n\nيمكن تعديل المنتجات، الاسعار، العروض، الوصف، التوفر، ومحتوى الموقع او تحديثها او حذفها في اي وقت دون اشعار مسبق. ونحتفظ بحقنا في تقييد او رفض او الغاء اي طلب عند الاشتباه في احتيال، خطا سعري، مشكلة مخزون، او سوء استخدام للموقع.\n\nلا يجوز لك استخدام الموقع لاغراض غير قانونية، او تعطيل تشغيله او امنه، او محاولة الوصول غير المصرح به، او نسخ واستغلال محتواه دون موافقة كتابية مسبقة.\n\nلا يعتبر الطلب مقبولا نهائيا الا بعد نجاح الدفع واجتياز المراجعة الداخلية. ومواعيد الشحن المذكورة هي تقديرية فقط وقد تتغير بسبب الوجهة، الجمارك، شركات النقل، او ظروف خارجية اخرى.\n\nفي الحدود التي يسمح بها القانون، لا تتحمل Sleepora مسؤولية الخسائر غير المباشرة او العرضية او التبعية الناتجة عن استخدام الموقع، تاخر الشحن، فشل خدمات الجهات الخارجية، او الظروف الخارجة عن السيطرة المعقولة."
      },
      refundPolicy: {
        title: "سياسة الاسترجاع",
        body:
          "نريدك ان تتسوق بثقة من Sleepora. اذا لم تكن راضيا عن عملية شراء مؤهلة، يمكنك طلب ارجاع او استرداد خلال مدة الارجاع المطبقة والمذكورة في صفحة المنتج او سياسة المتجر.\n\nلكي يكون المنتج مقبولا للارجاع، يجب ان يكون في حالة مناسبة، اي غير مستعمل او تمت معاينته بشكل معقول فقط، ونظيفا، ومعه التغليف الاصلي والملحقات والاجزاء المرفقة حيثما ينطبق. وقد يتم رفض المنتجات المتضررة، او كثيرة الاستعمال، او الناقصة، او غير الصحية.\n\nقد تكون بعض المنتجات غير قابلة للارجاع بسبب النظافة، السلامة، التخصيص، البيع النهائي، او شروط العروض. وعند وجود هذا الشرط يتم توضيحه في صفحة المنتج او اثناء الدفع.\n\nاذا وصلك منتج تالف او معيب او غير صحيح، فيرجى التواصل معنا بسرعة مع رقم الطلب وصور او فيديوهات واضحة. وبعد المراجعة قد نقدم استبدالا، رصيدا، استردادا جزئيا، او استردادا كاملا بحسب الحالة.\n\nيتم رد المبالغ بعد استلام المنتج المرتجع وفحصه، او بعد تقرير ان الارجاع غير ضروري. وتتم اعادة المبلغ الى وسيلة الدفع الاصلية، وقد تختلف مدة المعالجة حسب مزود الدفع.\n\nقد لا تكون رسوم الشحن الاصلية، او رسوم الارجاع، او الرسوم الجمركية، او الضرائب، او الرسوم المشابهة قابلة للاسترداد الا اذا كان السبب خطا منا او عيبا مؤكدا في المنتج."
      },
      shippingPolicy: {
        title: "سياسة الشحن",
        body:
          "تقوم Sleepora بالشحن الى عدة وجهات وتعمل مع شركاء شحن وتنفيذ لتوصيل الطلبات باكبر قدر ممكن من الكفاءة. وقد تختلف مدة تجهيز الطلب ومدة النقل بحسب توفر المنتج والوجهة والموسم وظروف شركة الشحن.\n\nيتم عادة تجهيز الطلبات بعد تاكيد الدفع. وخلال فترات العروض، العطل، تحديثات المخزون، او الضغط المرتفع، قد يستغرق التجهيز وقتا اطول من المتوقع. وعند حدوث تاخير كبير سنحاول التواصل معك باستخدام معلومات الطلب.\n\nمواعيد الشحن المعروضة في الموقع هي تقديرات عامة فقط وليست مواعيد تسليم مضمونة. وقد يتاثر التسليم بسبب التخليص الجمركي، تاخر التوزيع المحلي، الاحوال الجوية، المناطق البعيدة، العناوين غير المكتملة، او اي ظروف خارجة عن ارادتنا.\n\nيتحمل العميل مسؤولية تقديم عنوان شحن كامل وصحيح. واذا تاخر الطلب او تمت اعادته او ضاع بسبب بيانات عنوان غير صحيحة او غير مكتملة قدمها العميل، فقد يتم تطبيق رسوم اضافية.\n\nقد تفرض بعض الدول رسوما جمركية او ضرائب استيراد او رسوم وساطة او رسوما محلية اخرى، وتكون مسؤولية العميل ما لم يذكر خلاف ذلك.\n\nقد يتم تزويدك برقم تتبع عند توفره بعد شحن الطلب. واذا احتجت الى مساعدة في تتبع شحنتك، يمكنك التواصل معنا وسنساعدك استنادا الى اخر المعلومات المتاحة من شركة الشحن."
      }
    }
  }
};

for (const [lang, sections] of Object.entries(policyEnhancements)) {
  const translation = resources[lang]?.translation;
  if (!translation) continue;
  for (const [section, value] of Object.entries(sections)) {
    translation[section] = {
      ...(translation[section] || {}),
      ...value
    };
  }
  resources[lang].translation = translation;
}

const uiEnhancements = {
  en: {
    meta: {
      profile: "My Account - Sleepora",
      settings: "Account Settings - Sleepora"
    },
    profile: {
      title: "My Account",
      subtitle: "Manage your profile, cart, and saved store preferences.",
      menuProfile: "My Account",
      menuSettings: "Settings",
      menuCart: "My Cart",
      logout: "Logout",
      updateAccount: "Update account"
    },
    settings: {
      title: "Account Settings",
      subtitle: "Keep your profile details and password up to date.",
      appearance: "Appearance",
      language: "Language",
      profileSection: "Profile details",
      passwordSection: "Security",
      currentPassword: "Current password",
      newPassword: "New password",
      saveProfile: "Save profile",
      savePassword: "Save password",
      profileSaved: "Profile updated successfully.",
      passwordSaved: "Password updated successfully."
    },
    checkout: {
      validationError: "Please complete all checkout fields before paying.",
      payWithPaypal: "Pay with PayPal or Card",
      chooseMethod: "Choose one payment method below:",
      loadingGateway: "Loading secure payment gateway...",
      paymentFailed: "Payment failed. Please try again.",
      paypalUnavailable: "PayPal is currently unavailable.",
      cardRedirectNote: "Card payments open on a dedicated page so customers can complete them more comfortably.",
      cardPageButton: "Pay by Card on Next Page",
      cardSupportNote: "You can pay with PayPal, Visa, or Mastercard.",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      backToCart: "Back to Cart",
      cardPageTitle: "Card Payment",
      cardPageSubtitle: "Complete your card details on a dedicated, cleaner payment page.",
      backToCheckout: "Back to Checkout",
      cardPageLead: "Use the secure PayPal card form below to pay with Visa or Mastercard.",
      cardUnavailable: "Card payments are unavailable for this PayPal account."
    },
    admin: {
      usersTitle: "Customer Accounts",
      refreshUsers: "Refresh Accounts",
      noUsers: "No customer accounts found.",
      userDeleted: "Customer account deleted.",
      usersLoadError: "Unable to load customer accounts.",
      accountBadge: "Account"
    }
  },
  fr: {
    meta: {
      profile: "Mon compte - Sleepora",
      settings: "Parametres du compte - Sleepora"
    },
    profile: {
      title: "Mon compte",
      subtitle: "Gerez votre profil, votre panier et vos preferences enregistrees.",
      menuProfile: "Mon compte",
      menuSettings: "Parametres",
      menuCart: "Mon panier",
      logout: "Deconnexion",
      updateAccount: "Mettre a jour le compte"
    },
    settings: {
      title: "Parametres du compte",
      subtitle: "Mettez a jour vos informations et votre mot de passe.",
      appearance: "Apparence",
      language: "Langue",
      profileSection: "Informations du profil",
      passwordSection: "Securite",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      saveProfile: "Enregistrer le profil",
      savePassword: "Enregistrer le mot de passe",
      profileSaved: "Profil mis a jour avec succes.",
      passwordSaved: "Mot de passe mis a jour avec succes."
    },
    checkout: {
      validationError: "Veuillez remplir tous les champs avant de payer.",
      payWithPaypal: "Payer avec PayPal ou carte",
      chooseMethod: "Choisissez une methode de paiement ci-dessous :",
      loadingGateway: "Chargement de la passerelle de paiement securisee...",
      paymentFailed: "Le paiement a echoue. Veuillez reessayer.",
      paypalUnavailable: "PayPal est actuellement indisponible.",
      cardRedirectNote: "Le paiement par carte s'ouvre sur une page dediee pour une experience plus claire, surtout sur mobile.",
      cardPageButton: "Payer par carte sur la page suivante",
      cardSupportNote: "Vous pouvez payer avec PayPal, Visa ou Mastercard.",
      orderSummary: "Resume de commande",
      subtotal: "Sous-total",
      backToCart: "Retour au panier",
      cardPageTitle: "Paiement par carte",
      cardPageSubtitle: "Finalisez les informations de votre carte sur une page dediee et plus propre.",
      backToCheckout: "Retour au checkout",
      cardPageLead: "Utilisez le formulaire PayPal securise ci-dessous pour payer par Visa ou Mastercard.",
      cardUnavailable: "Le paiement par carte n'est pas disponible pour ce compte PayPal."
    },
    admin: {
      usersTitle: "Comptes clients",
      refreshUsers: "Actualiser les comptes",
      noUsers: "Aucun compte client trouve.",
      userDeleted: "Compte client supprime.",
      usersLoadError: "Impossible de charger les comptes clients.",
      accountBadge: "Compte"
    }
  },
  ar: {
    meta: {
      profile: "حسابي - Sleepora",
      settings: "إعدادات الحساب - Sleepora"
    },
    profile: {
      title: "حسابي",
      subtitle: "قم بإدارة ملفك الشخصي وسلتك وتفضيلاتك المحفوظة.",
      menuProfile: "حسابي",
      menuSettings: "الإعدادات",
      menuCart: "سلتي",
      logout: "تسجيل الخروج",
      updateAccount: "تحديث الحساب"
    },
    settings: {
      title: "إعدادات الحساب",
      subtitle: "قم بتحديث بياناتك وكلمة المرور الخاصة بك.",
      appearance: "المظهر",
      language: "اللغة",
      profileSection: "بيانات الحساب",
      passwordSection: "الأمان",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      saveProfile: "حفظ البيانات",
      savePassword: "حفظ كلمة المرور",
      profileSaved: "تم تحديث الحساب بنجاح.",
      passwordSaved: "تم تحديث كلمة المرور بنجاح."
    },
    checkout: {
      validationError: "يرجى ملء جميع معلومات الدفع قبل المتابعة.",
      payWithPaypal: "الدفع عبر PayPal أو البطاقة",
      chooseMethod: "اختر طريقة الدفع المناسبة:",
      loadingGateway: "يتم تحميل بوابة الدفع الآمنة...",
      paymentFailed: "فشل الدفع. يرجى المحاولة مرة أخرى.",
      paypalUnavailable: "PayPal غير متاح حاليا.",
      cardRedirectNote: "سيتم فتح صفحة منفصلة لإدخال بيانات البطاقة بشكل أوضح ومريح خاصة على الهاتف.",
      cardPageButton: "الدفع بالبطاقة في الصفحة التالية",
      cardSupportNote: "يمكنك الدفع عبر PayPal أو Visa أو Mastercard.",
      orderSummary: "ملخص الطلب",
      subtotal: "المجموع الفرعي",
      backToCart: "العودة إلى السلة",
      cardPageTitle: "الدفع بالبطاقة",
      cardPageSubtitle: "أكمل معلومات بطاقتك في صفحة مستقلة ومنظمة أكثر.",
      backToCheckout: "العودة إلى صفحة الدفع",
      cardPageLead: "استخدم نموذج PayPal الآمن أدناه للدفع ببطاقة Visa أو Mastercard.",
      cardUnavailable: "الدفع بالبطاقة غير متاح لهذا الحساب على PayPal."
    },
    admin: {
      usersTitle: "حسابات العملاء",
      refreshUsers: "تحديث الحسابات",
      noUsers: "لا توجد حسابات عملاء حاليا.",
      userDeleted: "تم حذف حساب العميل.",
      usersLoadError: "تعذر تحميل حسابات العملاء.",
      accountBadge: "حساب"
    }
  }
};

for (const [lang, sections] of Object.entries(uiEnhancements)) {
  const translation = resources[lang]?.translation;
  if (!translation) continue;
  for (const [section, value] of Object.entries(sections)) {
    translation[section] = {
      ...(translation[section] || {}),
      ...value
    };
  }
  resources[lang].translation = translation;
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


