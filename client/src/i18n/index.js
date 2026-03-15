import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LANGUAGE_STORAGE_KEY } from "../lib/storage";

const resources = {
  en: {
    translation: {
      brand: {
        name: "Ba2i3",
        tagline: "Ba2i3 Marketplace"
      },
      meta: {
        home: "Ba2i3 Marketplace",
        products: "Products - Ba2i3",
        product: "Product - Ba2i3",
        cart: "Cart - Ba2i3",
        checkout: "Checkout - Ba2i3",
        login: "Login - Ba2i3",
        register: "Register - Ba2i3",
        policy: "Policy - Ba2i3",
        admin: "Admin - Ba2i3"
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
        heroTitle: "Welcome to Ba2i3 Marketplace",
        heroSubtitle: "Premium products for everyday needs.",
        shopNow: "Shop Now",
        featuredLabel: "FEATURED PRODUCT",
        featuredTitle: "Ergonomic Memory Foam Neck Pillow",
        featuredDescription:
          "Built for long nights and calm mornings, this premium contour pillow supports your neck naturally while reducing pressure.",
        buyNow: "Buy Now",
        collectionTitle: "Product Collection",
        trustTitle: "Why Ba2i3",
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
          "Every Ba2i3 product is designed with premium materials to create a calmer sleep environment and better overnight recovery.",
        notFound: "Product not found"
      },
      products: {
        title: "Ba2i3 Collection",
        subtitle: "Discover curated picks for everyday shopping in one clean collection.",
        price: "Price",
        sortFeatured: "Newest"
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
        title: "Contact Ba2i3",
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
        rights: "(c) 2026 Ba2i3. All rights reserved."
      },
      policy: {
        back: "Back to store",
        privacyPolicy: {
          title: "Privacy Policy",
          body: "We collect only the information needed to process orders and support customer service."
        },
        termsOfService: {
          title: "Terms of Service",
          body: "By using Ba2i3, you agree to our terms for orders, payments, and product use."
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
        dashboardTitle: "Ba2i3 Admin",
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
        name: "Ba2i3",
        tagline: "Ba2i3 Marketplace"
      },
      meta: {
        home: "Ba2i3 Marketplace",
        products: "Produits - Ba2i3",
        product: "Produit - Ba2i3",
        cart: "Panier - Ba2i3",
        checkout: "Paiement - Ba2i3",
        login: "Connexion - Ba2i3",
        register: "Inscription - Ba2i3",
        policy: "Politique - Ba2i3",
        admin: "Admin - Ba2i3"
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
        heroTitle: "Bienvenue sur Ba2i3 Marketplace",
        heroSubtitle: "Des produits de sommeil premium pour un repos plus profond et confortable.",
        shopNow: "Acheter",
        featuredLabel: "PRODUIT VEDETTE",
        featuredTitle: "Oreiller cervical ergonomique a memoire de forme",
        featuredDescription:
          "Concu pour les longues nuits, cet oreiller premium soutient naturellement la nuque et reduit la pression.",
        buyNow: "Acheter",
        collectionTitle: "Collection Produits",
        trustTitle: "Pourquoi Ba2i3",
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
          "Chaque produit Ba2i3 est concu avec des materiaux premium pour un sommeil plus calme et une meilleure recuperation.",
        notFound: "Produit introuvable"
      },
      products: {
        title: "Collection Ba2i3",
        subtitle: "Decouvrez une selection claire et pratique pour vos besoins quotidiens.",
        price: "Prix",
        sortFeatured: "Nouveautes"
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
        title: "Contacter Ba2i3",
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
        rights: "(c) 2026 Ba2i3. Tous droits reserves."
      },
      policy: {
        back: "Retour boutique",
        privacyPolicy: {
          title: "Politique de confidentialite",
          body: "Nous collectons uniquement les donnees necessaires pour traiter les commandes."
        },
        termsOfService: {
          title: "Conditions de service",
          body: "En utilisant Ba2i3, vous acceptez les conditions de commande et de paiement."
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
        dashboardTitle: "Admin Ba2i3",
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
        name: "Ba2i3",
        tagline: "Ba2i3 Marketplace"
      },
      meta: {
        home: "Ba2i3 Marketplace",
        products: "???????? - Ba2i3",
        product: "?????? - Ba2i3",
        cart: "????? - Ba2i3",
        checkout: "????? - Ba2i3",
        login: "????? ?????? - Ba2i3",
        register: "????? ???? - Ba2i3",
        policy: "???????? - Ba2i3",
        admin: "??????? - Ba2i3"
      },
      language: {
        en: "EN",
        fr: "FR",
        ar: "AR"
      },
      theme: {
        light: "????",
        dark: "????"
      },
      nav: {
        products: "????????",
        cart: "?????",
        login: "????",
        register: "?????",
        contact: "?????"
      },
      home: {
        heroTitle: "مرحبا بكم في متجر",
        heroSubtitle: "?????? ??? ????? ????? ???? ???? ????? ???? ?????.",
        shopNow: "???? ????",
        featuredLabel: "?????? ??????",
        featuredTitle: "????? ???? ?????? ??? ?????",
        featuredDescription: "????? ???? ?????? ???? ????? ?????? ????? ?? ??? ??? ???? ????.",
        buyNow: "???? ????",
        collectionTitle: "?????? ????????",
        trustTitle: "????? Ba2i3",
        trust1: "???? 30 ????",
        trust2: "???? ????? ??????",
        trust3: "??? ????? ????"
      },
      product: {
        benefits: "???????",
        addToCart: "??? ??? ?????",
        buyNow: "???? ????",
        detailsTitle: "?????",
        detailsBody: "?? ???? ?? Ba2i3 ???? ????? ????? ????? ???? ?????? ???? ????? ?????.",
        notFound: "?????? ??? ?????"
      },
      products: {
        title: "مجموعة Ba2i3",
        subtitle: "اكتشف تشكيلة مرتبة ومناسبة للتسوق اليومي.",
        price: "السعر",
        sortFeatured: "الأحدث"
      },
      cart: {
        title: "????",
        empty: "????? ?????.",
        continue: "?????? ??????",
        quantity: "??????",
        total: "????????",
        checkout: "?????",
        remove: "???"
      },
      checkout: {
        title: "?????",
        subtitle: "???? ???? ?????.",
        fullName: "????? ??????",
        email: "?????? ??????????",
        phone: "??????",
        address: "???????",
        paySecurely: "???? ?????",
        secureSoon: "????? ????? ????? ???? ?????",
        success: "?? ?????? ???? ???????? ??? ?????."
      },
      auth: {
        loginTitle: "????? ??????",
        registerTitle: "????? ????",
        firstName: "????? ?????",
        lastName: "??? ???????",
        email: "?????? ??????????",
        password: "???? ??????",
        signIn: "????",
        create: "?????",
        createAccount: "????? ????",
        already: "???? ???? ???????",
        noAccount: "??? ???? ?????"
      },
      contact: {
        title: "????? ?? Ba2i3",
        subtitle: "???? ?????? ????? ???? ?????.",
        email: "?????? ??????????",
        message: "???????",
        send: "?????",
        success: "?? ????? ??????? ?????."
      },
      footer: {
        privacyPolicy: "????? ????????",
        termsOfService: "???? ??????",
        refundPolicy: "????? ?????????",
        shippingPolicy: "????? ?????",
        rights: "(c) 2026 Ba2i3. ???? ?????? ??????."
      },
      policy: {
        back: "?????? ??????",
        privacyPolicy: {
          title: "????? ????????",
          body: "???? ??? ???????? ??????? ??????? ??????? ????? ???????."
        },
        termsOfService: {
          title: "???? ??????",
          body: "???????? Ba2i3 ???? ????? ??? ???? ??????? ?????? ??????????."
        },
        refundPolicy: {
          title: "????? ?????????",
          body: "???? ??????? ???????? ??????? ???? ????? ??????? ????? ??????."
        },
        shippingPolicy: {
          title: "????? ?????",
          body: "???? ?????? ????? ??? ????? ????? ?? ??? ???? ??? ?????."
        }
      },
      admin: {
        setupTitle: "????? ???????",
        setupSubtitle: "???? ?????? ???? ?????? ????? ??? /admin",
        username: "??? ????????",
        password: "???? ??????",
        confirmPassword: "????? ???? ??????",
        saveSetup: "??? ????????",
        loginTitle: "???? ???????",
        loginSubtitle: "???? ??? ??????? ???",
        loginButton: "???? ???????",
        logout: "????? ??????",
        dashboardTitle: "???? ????? Ba2i3",
        dashboardSubtitle: "????? ???????? ???????? ?? ?? ????",
        addProduct: "????? ????",
        editProduct: "????? ??????",
        name: "?????",
        price: "?????",
        description: "?????",
        featured: "????",
        image: "???? ??????",
        imagePath: "???? ??????",
        imageHelp: "????? ????????: jpg, jpeg, png, webp. ???? ?????? 5MB.",
        chooseFile: "???? ????",
        saveProduct: "??? ??????",
        updateProduct: "????? ??????",
        cancelEdit: "????? ???????",
        deleteProduct: "???",
        products: "????????",
        noProducts: "?? ???? ??????.",
        preview: "??????",
        setupSaved: "?? ??? ?????? ???????.",
        passwordsMismatch: "????? ?????? ??? ?????????.",
        invalidLogin: "?????? ?????? ??? ?????.",
        saved: "?? ??? ?????????.",
        deleted: "?? ??? ??????.",
        uploadError: "??? ??? ??????.",
        validationError: "???? ????? ?????? ????????.",
        localApiError: "????? ????? ???????? ??? ?????. ???? ?? ????? ???????? ??????."
      },
      common: {
        loading: "??? ???????...",
        unavailable: "??? ????",
        missingImage: "?????? ??? ?????"
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
  ar: { products: "????????", machines: "???????", accessories: "???????????", pillows: "???????", cart: "?????" },
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
    zip: translation.checkout?.zip || "ZIP Code",
    country: translation.checkout?.country || "Country",
    payWithPaypal: translation.checkout?.payWithPaypal || "Cash on Delivery",
    checkoutWithPaypal: translation.checkout?.checkoutWithPaypal || "Checkout",
    chooseMethod: translation.checkout?.chooseMethod || "Choose one payment method below:",
    redirectHint:
      translation.checkout?.redirectHint || "Confirm your order and pay in cash when it arrives.",
    retryPaypal: translation.checkout?.retryPaypal || "Try again",
    loadingGateway: translation.checkout?.loadingGateway || "Loading secure payment gateway...",
    paypalUnavailable: translation.checkout?.paypalUnavailable || "Cash on delivery is currently the only available payment method.",
    paymentFailed: translation.checkout?.paymentFailed || "Payment failed. Please try again.",
    validationError: translation.checkout?.validationError || "Please complete all checkout fields.",
    orderSummary: translation.checkout?.orderSummary || "Order Summary",
    subtotal: translation.checkout?.subtotal || "Subtotal",
    backToCart: translation.checkout?.backToCart || "Back to Cart",
    successTitle: translation.checkout?.successTitle || "Payment completed",
    cancelTitle: translation.checkout?.cancelTitle || "Payment cancelled",
    cancelled: translation.checkout?.cancelled || "Payment was cancelled. You can try again.",
    orderRef: translation.checkout?.orderRef || "Order reference",
    cardSupportNote: translation.checkout?.cardSupportNote || "Cash on delivery is available for every order.",
    secureTitle: translation.checkout?.secureTitle || "Secure payment",
    sleeporaCheckoutTitle: translation.checkout?.sleeporaCheckoutTitle || "Ba2i3 Checkout",
    paypalMethod: translation.checkout?.paypalMethod || "PayPal",
    cardMethod: translation.checkout?.cardMethod || "Card",
    paypalMethodHint: translation.checkout?.paypalMethodHint || "Pay in cash when your order is delivered.",
    cardMethodHint: translation.checkout?.cardMethodHint || "Pay in cash when your order is delivered.",
    securityMessage:
      translation.checkout?.securityMessage || "Your order details are submitted securely and paid in cash on delivery.",
    consentPrefix: translation.checkout?.consentPrefix || "I agree to the",
    and: translation.checkout?.and || "and",
    acceptPoliciesError: translation.checkout?.acceptPoliciesError || "Please accept the Terms and Refund Policy.",
    processing: translation.checkout?.processing || "Processing...",
    connectionIssue: translation.checkout?.connectionIssue || "Connection issue, please retry.",
    completeFormFirst: translation.checkout?.completeFormFirst || "Complete the form and accept the policies to continue.",
    successThankYou:
      translation.checkout?.successThankYou || "Thank you. Your payment was successful and your order is now confirmed.",
    continueShopping: translation.checkout?.continueShopping || "Continue Shopping",
    backHome: translation.checkout?.backHome || "Back to Home",
    errors: {
      firstName: translation.checkout?.errors?.firstName || "First name is required.",
      lastName: translation.checkout?.errors?.lastName || "Last name is required.",
      email: translation.checkout?.errors?.email || "Please enter a valid email.",
      phone: translation.checkout?.errors?.phone || "Phone number is required.",
      address: translation.checkout?.errors?.address || "Address is required.",
      city: translation.checkout?.errors?.city || "City is required.",
      zip: translation.checkout?.errors?.zip || "Postal code is required.",
      country: translation.checkout?.errors?.country || "Country is required."
    }
  };
  translation.trust = {
    ...(translation.trust || {}),
    securePaypal: translation.trust?.securePaypal || "Cash on delivery available",
    sslEncrypted: translation.trust?.sslEncrypted || "SSL Secure & Encrypted",
    freeShipping: translation.trust?.freeShipping || "Free worldwide shipping",
    deliveryEstimate: translation.trust?.deliveryEstimate || "Delivery: 12 to 48 hours",
    moneyBack: translation.trust?.moneyBack || "30-Day Money-Back Guarantee",
    acceptedPayments: translation.trust?.acceptedPayments || "Accepted payments"
  };
  translation.product = {
    ...(translation.product || {}),
    reviewsTitle: translation.product?.reviewsTitle || "Customer Reviews",
    reviewsCount: translation.product?.reviewsCount || "reviews",
    ratingLabel: translation.product?.ratingLabel || "Product rating",
    verifiedBuyer: translation.product?.verifiedBuyer || "Verified buyer",
    reviewOne: translation.product?.reviewOne || "Excellent quality and really comfortable from the first night.",
    reviewTwo: translation.product?.reviewTwo || "Fast delivery, secure checkout, and the product feels premium.",
    reviewThree: translation.product?.reviewThree || "Exactly like the photos and much better than expected.",
    faqTitle: translation.product?.faqTitle || "FAQ",
    shippingTrustTitle: translation.product?.shippingTrustTitle || "Shipping, returns & secure payment",
    enlarge: translation.product?.enlarge || "Click to enlarge",
    highDemand: translation.product?.highDemand || "Limited stock - high demand today",
    faq: {
      shipping: {
        q: translation.product?.faq?.shipping?.q || "How long does shipping take?",
        a: translation.product?.faq?.shipping?.a || "Most orders arrive within 12 to 48 hours depending on destination."
      },
      returns: {
        q: translation.product?.faq?.returns?.q || "Can I return my order?",
        a: translation.product?.faq?.returns?.a || "Yes. You have 30 days to request a return on eligible items."
      },
      security: {
        q: translation.product?.faq?.security?.q || "Is payment secure?",
        a: translation.product?.faq?.security?.a || "Yes. Your order is confirmed securely and paid in cash on delivery."
      },
      tracking: {
        q: translation.product?.faq?.tracking?.q || "Will I receive tracking?",
        a: translation.product?.faq?.tracking?.a || "Tracking details are shared as soon as your order is dispatched."
      },
      support: {
        q: translation.product?.faq?.support?.q || "How fast does support reply?",
        a: translation.product?.faq?.support?.a || "We usually reply to support requests within 24 hours."
      }
    }
  };
  translation.cart = {
    ...(translation.cart || {}),
    shipping: translation.cart?.shipping || "Shipping",
    freeShipping: translation.cart?.freeShipping || "Free",
    proceedSecure: translation.cart?.proceedSecure || "Proceed to Secure Checkout",
    checkoutMicrocopy: translation.cart?.checkoutMicrocopy || "Cash on delivery. Free shipping and 30-day guarantee."
  };
  translation.footer = {
    ...(translation.footer || {}),
    contact: translation.footer?.contact || "Contact",
    paypalPowered: translation.footer?.paypalPowered || "Cash on delivery available"
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
    ordersLoadError: translation.admin?.ordersLoadError || "Unable to load orders.",
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
    noOrders: translation.admin?.noOrders || "No orders yet.",
    deleteUser: translation.admin?.deleteUser || "Delete user",
    confirmDeleteProduct: translation.admin?.confirmDeleteProduct || "Delete this product?",
    confirmDeleteUser: translation.admin?.confirmDeleteUser || "Delete this customer account?"
  };
  resources[key].translation = translation;
}

const localizedEnhancements = {
  en: {
    home: {
      collectionSubtitle: "Sleep tools selected for calm nights and deep recovery."
    },
    admin: {
      catalogSection: "Catalog",
      customersSection: "Customers",
      workspaceSection: "Workspace",
      settingsSection: "Settings",
      productsSubtitle: "View, edit, and remove existing products only.",
      addProductSubtitle: "Create a new product or update an existing product record.",
      ordersSubtitle: "Review incoming COD orders.",
      usersSubtitle: "Open an account to view its details.",
      refreshProducts: "Refresh Products",
      benefits: "Benefits",
      benefitsHelp: "One benefit per line. These lines appear on the product page.",
      quickActions: "Quick actions",
      storeSummary: "Store summary",
      totalProducts: "Products",
      featuredProducts: "Featured",
      totalCustomers: "Customers",
      totalOrders: "Paid orders",
      createdAt: "Created"
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
      payWithPaypal: "Paiement a la livraison",
      chooseMethod: "Choisissez un moyen de paiement ci-dessous :",
      redirectHint: "Confirmez votre commande et payez en especes a la livraison.",
      cardSupportNote: "Le paiement a la livraison est disponible pour chaque commande."
    },
    admin: {
      selectColor: "Choisir une couleur",
      catalogSection: "Catalogue",
      customersSection: "Clients",
      workspaceSection: "Espace admin",
      settingsSection: "Parametres",
      productsSubtitle: "Afficher, modifier et supprimer uniquement les produits existants.",
      addProductSubtitle: "Creez un produit ou mettez a jour une fiche produit existante.",
      ordersSubtitle: "Consultez les commandes en paiement a la livraison.",
      usersSubtitle: "Ouvrez un compte pour voir ses details.",
      refreshProducts: "Actualiser les produits",
      benefits: "Benefices",
      benefitsHelp: "Une ligne par benefice. Ces lignes apparaissent sur la page produit.",
      quickActions: "Actions rapides",
      storeSummary: "Resume de la boutique",
      totalProducts: "Produits",
      featuredProducts: "Vedettes",
      totalCustomers: "Clients",
      totalOrders: "Commandes payees",
      createdAt: "Cree le"
    }
  },
  ar: {
    nav: {
      products: "????????",
      machines: "???????",
      accessories: "???????????",
      pillows: "???????",
      cart: "?????"
    },
    home: {
      trustTitle: "????? Ba2i3",
      collectionSubtitle: "?????? ??? ?????? ????? ????? ???????? ????."
    },
    product: {
      colorsTitle: "??????? ????????",
      selectedColor: "????? ??????",
      reelsTitle: "????",
      defaultBenefit1: "???? ??? ??????",
      defaultBenefit2: "???? ????? ?????",
      defaultBenefit3: "???? ?????",
      defaultBenefit4: "???? ???? ????"
    },
    auth: {
      loginTitle: "????? ??????",
      registerTitle: "????? ????",
      firstName: "????? ?????",
      lastName: "??? ???????",
      email: "?????? ??????????",
      password: "???? ??????",
      signIn: "????",
      create: "?????",
      createAccount: "????? ????",
      already: "???? ???? ???????",
      noAccount: "??? ???? ?????",
      forgotPassword: "???? ???? ?????",
      gender: "?????",
      selectGender: "???? ?????",
      male: "???",
      female: "????",
      age: "?????",
      phone: "??? ??????",
      countryPhone: "?????? / ??? ???????",
      confirmPassword: "????? ???? ??????",
      missingFields: "???? ??? ???? ?????? ????????.",
      requestFailed: "??? ?????. ???? ??? ????.",
      registerSuccess: "?? ????? ?????? ?????. ?? ?????? ??????.",
      loginSuccess: "?? ????? ?????? ?????.",
      passwordsMismatch: "????? ?????? ??? ?????????.",
      passwordPolicy: "??? ?? ????? ???? ?????? ??? ???? ????? ?????? ???? ????.",
      otpMethod: "????? ????? OTP",
      otpByEmail: "?????? ??????????",
      otpByPhone: "?????? (SMS)",
      sendOtp: "????? OTP",
      otpSent: "?? ????? OTP ?????.",
      otpCode: "??? OTP",
      newPassword: "???? ?????? ???????",
      resetPassword: "????? ????? ???? ??????",
      passwordResetSuccess: "?? ????? ???? ?????? ?????."
    },
    checkout: {
      title: "?????",
      subtitle: "???? ???? ?????.",
      fullName: "????? ??????",
      email: "?????? ??????????",
      phone: "??????",
      address: "???????",
      city: "???????",
      state: "???????",
      zip: "????? ???????",
      country: "??????",
      payWithPaypal: "????? ??? ????????",
      chooseMethod: "???? ????? ??? ?? ??????:",
      redirectHint: "??? ????? ??? ?????? ????? ?????? ?????? ??????/??????? ???? ???.",
      retryPaypal: "????? ?????? ??????",
      loadingGateway: "???? ????? ????? ????? ??????...",
      paypalUnavailable: "?????? ??? ???? ?????.",
      paymentFailed: "???? ????? ?????. ???? ??? ????.",
      validationError: "???? ????? ???? ???? ?????.",
      orderSummary: "???? ?????",
      subtotal: "??????? ??????",
      backToCart: "?????? ?????",
      cardSupportNote: "????? ????? ??? ?????? ?? ???? ?? ?????????."
    },
    admin: {
      selectColor: "???? ?????",
      catalogSection: "\u0627\u0644\u0645\u062a\u062c\u0631",
      customersSection: "\u0627\u0644\u0639\u0645\u0644\u0627\u0621",
      workspaceSection: "\u0627\u0644\u0625\u062f\u0627\u0631\u0629",
      settingsSection: "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a",
      productsSubtitle: "\u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u062d\u0627\u0644\u064a\u0629 \u0648\u062a\u0639\u062f\u064a\u0644\u0647\u0627 \u0623\u0648 \u062d\u0630\u0641\u0647\u0627 \u0641\u0642\u0637.",
      addProductSubtitle: "\u0623\u0636\u0641 \u0645\u0646\u062a\u062c\u0627 \u062c\u062f\u064a\u062f\u0627 \u0623\u0648 \u062d\u062f\u0651\u062b \u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0646\u062a\u062c \u0645\u0648\u062c\u0648\u062f.",
      ordersSubtitle: "\u0627\u0639\u0631\u0636 \u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0629 \u0641\u0642\u0637.",
      usersSubtitle: "\u0627\u0641\u062a\u062d \u0627\u0644\u062d\u0633\u0627\u0628 \u0644\u0639\u0631\u0636 \u062a\u0641\u0627\u0635\u064a\u0644\u0647.",
      refreshProducts: "\u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a",
      benefits: "\u0627\u0644\u0641\u0648\u0627\u0626\u062f",
      benefitsHelp: "\u0633\u0637\u0631 \u0648\u0627\u062d\u062f \u0644\u0643\u0644 \u0641\u0627\u0626\u062f\u0629. \u062a\u0638\u0647\u0631 \u0647\u0630\u0647 \u0627\u0644\u0633\u0637\u0648\u0631 \u0641\u064a \u0635\u0641\u062d\u0629 \u0627\u0644\u0645\u0646\u062a\u062c.",
      quickActions: "\u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0633\u0631\u064a\u0639\u0629",
      storeSummary: "\u0645\u0644\u062e\u0635 \u0627\u0644\u0645\u062a\u062c\u0631",
      totalProducts: "\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a",
      featuredProducts: "\u0627\u0644\u0645\u0645\u064a\u0632\u0629",
      totalCustomers: "\u0627\u0644\u0639\u0645\u0644\u0627\u0621",
      totalOrders: "\u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0629",
      createdAt: "\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0625\u0646\u0634\u0627\u0621"
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
          "This Privacy Policy explains how Ba2i3 collects, uses, and protects your personal information when you browse our website, create an account, place an order, contact support, or otherwise interact with our services.\n\nWe may collect information such as your name, email address, phone number, shipping address, billing-related information, account details, order history, and any information you submit through forms or customer support messages. We may also collect technical data such as browser type, device information, IP address, pages visited, and general website activity to improve store performance and security.\n\nWe use your information to process and deliver orders, confirm payments, communicate about your purchase, provide support, manage your account, prevent fraud, improve our products and services, and comply with legal obligations. We do not sell your personal information.\n\nYour information may be shared only with trusted third-party providers that help us operate the store, such as payment processors, shipping carriers, hosting services, analytics providers, fraud prevention tools, and email service providers, and only to the extent necessary for them to perform their services.\n\nWe retain personal information for as long as reasonably necessary to fulfill orders, maintain business records, comply with legal requirements, resolve disputes, and enforce our agreements. We use reasonable safeguards to protect your information, but no method of transmission or storage online is completely secure.\n\nIf you would like to access, correct, or request deletion of your personal information, you may contact us through the contact details shown on the website. Depending on your country, you may have additional privacy rights under applicable law."
      },
      termsOfService: {
        title: "Terms of Service",
        body:
          "By visiting Ba2i3 or purchasing from our website, you agree to these Terms of Service. If you do not agree, you should not access or use the website.\n\nYou agree to provide current, complete, and accurate information for purchases, account registration, and customer communication. You are responsible for keeping your login credentials secure and for all activity that occurs under your account.\n\nAll product listings, descriptions, prices, promotions, availability, and website content may be changed, updated, or removed at any time without prior notice. We reserve the right to limit, refuse, or cancel any order in cases including suspected fraud, pricing errors, stock issues, or misuse of the website.\n\nYou may not use the website for any unlawful purpose, interfere with the operation or security of the site, attempt unauthorized access, or reproduce and exploit site content without our prior written permission.\n\nOrders are not considered accepted until payment has been successfully completed and the order has passed our internal review. Delivery estimates are provided for convenience only and may be affected by destination, customs, carriers, local conditions, or other external factors.\n\nTo the maximum extent permitted by law, Ba2i3 shall not be liable for indirect, incidental, or consequential losses arising from use of the website, delayed shipments, third-party service failures, or circumstances outside our reasonable control."
      },
      refundPolicy: {
        title: "Refund Policy",
        body:
          "We want you to shop with confidence at Ba2i3. If you are not satisfied with an eligible purchase, you may request a return or refund within the applicable return period stated on the product page or store policy.\n\nTo qualify for a return, the item must be in acceptable return condition, including being unused or only reasonably inspected, clean, and returned with original packaging, accessories, and included parts where applicable. Items showing misuse, heavy wear, missing components, or unsanitary condition may be refused.\n\nSome items may be non-returnable due to hygiene, safety, customization, final-sale status, or promotional terms. Where applicable, these conditions will be indicated in the product listing or during checkout.\n\nIf your item arrives damaged, defective, or incorrect, please contact us promptly with your order number and clear photos or videos. After review, we may offer a replacement, store credit, partial refund, or full refund depending on the situation.\n\nRefunds are issued after the returned product is received and inspected, or after we determine that returning the item is not necessary. Approved refunds are sent back to the original payment method, and processing time depends on your payment provider.\n\nOriginal shipping charges, return shipping costs, customs duties, taxes, and similar fees may be non-refundable unless the issue resulted from our error or a verified product defect."
      },
      shippingPolicy: {
        title: "Shipping Policy",
        body:
          "Ba2i3 ships to many destinations and works with fulfillment and carrier partners to deliver orders as efficiently as possible. Processing times and transit times may vary based on product availability, destination, season, and carrier conditions.\n\nOrders are generally processed after payment is confirmed. During promotional periods, holidays, stock updates, or unusually high order volume, processing times may be longer than expected. If a major delay occurs, we will try to contact you using the information provided with the order.\n\nShipping estimates shown on the website are general estimates only and are not guaranteed delivery dates. Delivery may be affected by customs clearance, local delivery delays, weather, remote destinations, incomplete addresses, or other circumstances beyond our control.\n\nCustomers are responsible for providing a complete and accurate shipping address. If an order is delayed, returned, or lost because of incorrect or incomplete address details provided by the customer, additional fees may apply.\n\nDepending on the destination country, customs duties, import taxes, brokerage charges, or other local fees may apply and remain the responsibility of the customer unless otherwise stated.\n\nTracking information may be provided when available after the order has shipped. If you need help locating a package, you may contact us and we will assist using the latest information available from the shipping carrier."
      }
    }
  },
  fr: {
    policy: {
      back: "Retour boutique",
      privacyPolicy: {
        title: "Politique de confidentialite",
        body:
          "Cette Politique de confidentialite explique comment Ba2i3 collecte, utilise et protege vos informations personnelles lorsque vous naviguez sur notre site, creez un compte, passez une commande, contactez le support ou utilisez nos services.\n\nNous pouvons collecter des informations telles que votre nom, votre adresse email, votre numero de telephone, votre adresse de livraison, certaines informations liees au paiement, les details de votre compte, votre historique de commande ainsi que tout contenu que vous nous envoyez via les formulaires ou le support client. Nous pouvons egalement collecter des donnees techniques comme le type de navigateur, l'appareil, l'adresse IP et l'activite generale sur le site afin d'ameliorer la securite et les performances.\n\nNous utilisons ces informations pour traiter et expedier les commandes, confirmer les paiements, communiquer au sujet de vos achats, fournir l'assistance client, gerer votre compte, prevenir la fraude, ameliorer nos produits et respecter nos obligations legales. Nous ne vendons pas vos donnees personnelles.\n\nVos informations peuvent etre partagees uniquement avec des prestataires de confiance necessaires au fonctionnement de la boutique, notamment les processeurs de paiement, transporteurs, services d'hebergement, outils d'analyse, systemes anti-fraude et fournisseurs d'email, et seulement dans la mesure requise pour leurs services.\n\nNous conservons les donnees personnelles aussi longtemps que raisonnablement necessaire pour executer les commandes, tenir nos registres, respecter la loi, resoudre les litiges et faire appliquer nos accords. Nous prenons des mesures raisonnables de protection, sans pouvoir garantir une securite absolue.\n\nVous pouvez demander l'acces, la correction ou la suppression de vos informations personnelles en nous contactant. Selon votre pays, vous pouvez disposer de droits supplementaires prevus par la loi applicable."
      },
      termsOfService: {
        title: "Conditions de service",
        body:
          "En visitant Ba2i3 ou en achetant sur notre site, vous acceptez les presentes Conditions de service. Si vous n'etes pas d'accord, vous ne devez pas utiliser le site.\n\nVous acceptez de fournir des informations actuelles, completes et exactes pour vos achats, votre inscription et vos echanges avec notre boutique. Vous etes responsable de la confidentialite de vos identifiants et de toute activite effectuee sous votre compte.\n\nTous les produits, descriptions, prix, promotions, disponibilites et contenus du site peuvent etre modifies, mis a jour ou retires a tout moment sans preavis. Nous nous reservons le droit de limiter, refuser ou annuler une commande en cas de suspicion de fraude, d'erreur de prix, de probleme de stock ou de mauvaise utilisation du site.\n\nVous ne pouvez pas utiliser le site a des fins illegales, perturber son fonctionnement ou sa securite, tenter un acces non autorise, ni reproduire ou exploiter son contenu sans autorisation ecrite prealable.\n\nLes commandes ne sont considerees comme acceptees qu'apres paiement reussi et validation interne. Les delais de livraison sont fournis a titre indicatif et peuvent varier selon la destination, la douane, les transporteurs ou d'autres facteurs externes.\n\nDans la mesure maximale autorisee par la loi, Ba2i3 ne pourra etre tenue responsable des pertes indirectes, accessoires ou consecutives liees a l'utilisation du site, aux retards de livraison, aux defaillances de services tiers ou a des circonstances hors de notre controle raisonnable."
      },
      refundPolicy: {
        title: "Politique de remboursement",
        body:
          "Nous voulons que vous achetiez en toute confiance chez Ba2i3. Si vous n'etes pas satisfait d'un achat eligible, vous pouvez demander un retour ou un remboursement pendant la periode de retour applicable indiquee sur la fiche produit ou dans la politique de la boutique.\n\nPour etre accepte, l'article doit etre dans un etat de retour convenable, c'est-a-dire non utilise ou seulement raisonnablement inspecte, propre, et renvoye avec son emballage d'origine, ses accessoires et ses elements inclus lorsque cela s'applique. Les articles endommages, fortement utilises, incomplets ou dans un etat non hygienique peuvent etre refuses.\n\nCertains produits peuvent etre exclus du retour pour des raisons d'hygiene, de securite, de personnalisation, de vente finale ou de conditions promotionnelles. Ces restrictions peuvent etre indiquees sur la fiche produit ou lors du paiement.\n\nSi votre article arrive endommage, defectueux ou incorrect, veuillez nous contacter rapidement avec votre numero de commande ainsi que des photos ou videos claires. Selon le cas, nous pourrons proposer un remplacement, un avoir, un remboursement partiel ou complet.\n\nLes remboursements sont emis apres reception et verification du produit retourne, ou apres decision qu'un retour n'est pas necessaire. Les remboursements approuves sont renvoyes vers le moyen de paiement initial, avec un delai dependant du prestataire de paiement.\n\nLes frais de livraison initiaux, frais de retour, droits de douane, taxes et frais similaires peuvent ne pas etre remboursables sauf si le probleme resulte d'une erreur de notre part ou d'un defaut produit confirme."
      },
      shippingPolicy: {
        title: "Politique de livraison",
        body:
          "Ba2i3 expedie vers de nombreuses destinations et collabore avec des partenaires logistiques pour livrer les commandes aussi efficacement que possible. Les delais de traitement et d'acheminement peuvent varier selon la disponibilite produit, la destination, la saison et les conditions du transporteur.\n\nLes commandes sont generalement traitees apres confirmation du paiement. Pendant les promotions, les jours feries, les ajustements de stock ou les periodes de forte demande, le traitement peut prendre plus de temps que prevu. En cas de retard important, nous essayerons de vous contacter avec les informations fournies dans la commande.\n\nLes estimations affichees sur le site sont purement indicatives et ne constituent pas des dates de livraison garanties. La livraison peut etre affectee par le dedouanement, les retards locaux, la meteo, les destinations eloignees, les adresses incompletes ou d'autres circonstances independantes de notre volonte.\n\nLe client est responsable de fournir une adresse de livraison complete et exacte. Si une commande est retardee, retournee ou perdue en raison d'informations inexactes ou incompletes fournies par le client, des frais supplementaires peuvent s'appliquer.\n\nSelon le pays de destination, des droits de douane, taxes d'importation, frais de courtage ou autres frais locaux peuvent etre appliques et restent a la charge du client sauf mention contraire.\n\nUn numero de suivi peut etre fourni lorsqu'il est disponible apres l'expedition de la commande. Si vous avez besoin d'aide pour localiser un colis, vous pouvez nous contacter et nous vous assisterons selon les informations disponibles chez le transporteur."
      }
    }
  },
  ar: {
    policy: {
      back: "?????? ??????",
      privacyPolicy: {
        title: "????? ????????",
        body:
          "???? ????? ???????? ??? ??? ???? Ba2i3 ???? ???????? ??????? ?????????? ???????? ????? ????? ??????? ???? ?????? ???? ????? ?????? ?? ?????? ?? ?????? ???????.\n\n?? ???? ???? ??????? ??? ?????? ?????? ??????????? ??? ??????? ????? ?????? ??? ????????? ???????? ??????? ?????? ??????? ??? ???????? ??? ????? ????? ??? ??? ??????? ?? ???? ???????. ??? ?? ???? ?????? ????? ??? ??? ???????? ??? ??????? ????? IP? ???????? ???? ?????? ?????? ?????? ???????.\n\n?????? ??? ????????? ??????? ??????? ??????? ????? ?????????? ??????? ????? ????????? ????? ?????? ????? ??????? ??? ????????? ????? ???????? ????????? ????????? ?????????? ?????????. ??? ?? ???? ??????? ???????.\n\n?? ????? ???????? ??? ?? ????? ????? ??????? ????????? ?? ????? ??????? ??? ????? ?????? ????? ?????? ????? ?????????? ?????????? ??? ????????? ?????? ?????? ??????????? ???? ??? ?????? ?????? ?????? ??????.\n\n????? ?????????? ??????? ????? ??? ??? ?????? ???? ????? ?????? ???????? ??? ???????? ???????? ???????? ?? ????????? ?????? ??????????. ????? ??????? ????? ??????? ??? ?? ???? ???? ?????? ?????? ??? ??? ?? ????? ??? ????????.\n\n????? ??? ?????? ??? ??????? ?? ??????? ?? ????? ??? ??????? ????. ??? ???? ?? ???? ?????? ?????? ???? ???? ????????? ??????? ???."
      },
      termsOfService: {
        title: "???? ??????",
        body:
          "??? ?????? ????? Ba2i3 ?? ?????? ???? ???? ????? ??? ???? ?????? ???. ??? ?? ?????? ???? ???? ??? ??????? ??????.\n\n????? ??? ????? ??????? ????? ?????? ?????? ??? ??????? ???????? ?? ??????? ?? ??????. ??? ????? ??????? ?????? ??? ???? ?????? ?????? ?????? ?? ??? ???? ??? ??? ?????.\n\n???? ????? ????????? ???????? ??????? ?????? ??????? ?????? ?????? ?? ??????? ?? ????? ?? ?? ??? ??? ????? ????. ?????? ????? ?? ????? ?? ??? ?? ????? ?? ??? ??? ???????? ?? ??????? ??? ????? ????? ?????? ?? ??? ??????? ??????.\n\n?? ???? ?? ??????? ?????? ?????? ??? ???????? ?? ????? ?????? ?? ????? ?? ?????? ?????? ??? ?????? ??? ?? ??? ???????? ?????? ??? ?????? ?????? ?????.\n\n?? ????? ????? ?????? ?????? ??? ??? ???? ????? ??????? ???????? ????????. ??????? ????? ???????? ?? ??????? ??? ??? ????? ???? ??????? ???????? ????? ?????? ?? ???? ?????? ????.\n\n?? ?????? ???? ???? ??? ???????? ?? ????? Ba2i3 ??????? ??????? ??? ???????? ?? ??????? ?? ??????? ??????? ?? ??????? ??????? ???? ?????? ??? ????? ?????? ????????? ?? ?????? ??????? ?? ??????? ????????."
      },
      refundPolicy: {
        title: "????? ?????????",
        body:
          "????? ?? ????? ???? ?? Ba2i3. ??? ?? ??? ????? ?? ????? ???? ?????? ????? ??? ????? ?? ??????? ???? ??? ??????? ??????? ????????? ?? ???? ?????? ?? ????? ??????.\n\n??? ???? ?????? ?????? ???????? ??? ?? ???? ?? ???? ??????? ?? ??? ?????? ?? ??? ??????? ???? ????? ???? ??????? ???? ??????? ?????? ????????? ???????? ??????? ????? ?????. ??? ??? ??? ???????? ????????? ?? ????? ?????????? ?? ???????? ?? ??? ??????.\n\n?? ???? ??? ???????? ??? ????? ??????? ???? ???????? ???????? ???????? ????? ???????? ?? ???? ??????. ???? ???? ??? ????? ??? ?????? ?? ???? ?????? ?? ????? ?????.\n\n??? ???? ???? ???? ?? ???? ?? ??? ????? ????? ??????? ???? ????? ?? ??? ????? ???? ?? ???????? ?????. ???? ???????? ?? ???? ????????? ?????? ???????? ?????? ?? ???????? ????? ???? ??????.\n\n??? ?? ??????? ??? ?????? ?????? ??????? ?????? ?? ??? ????? ?? ??????? ??? ?????. ???? ????? ?????? ??? ????? ????? ???????? ??? ????? ??? ???????? ??? ???? ?????.\n\n?? ?? ???? ???? ????? ???????? ?? ???? ???????? ?? ?????? ????????? ?? ???????? ?? ?????? ???????? ????? ????????? ??? ??? ??? ????? ??? ??? ?? ???? ????? ?? ??????."
      },
      shippingPolicy: {
        title: "????? ?????",
        body:
          "???? Ba2i3 ?????? ??? ??? ????? ????? ?? ????? ??? ?????? ?????? ??????? ????? ??? ???? ?? ???????. ??? ????? ??? ????? ????? ???? ????? ???? ???? ?????? ??????? ??????? ????? ???? ?????.\n\n??? ???? ????? ??????? ??? ????? ?????. ????? ????? ??????? ?????? ??????? ???????? ?? ????? ???????? ?? ?????? ??????? ???? ???? ?? ???????. ???? ???? ????? ???? ?????? ??????? ??? ???????? ??????? ?????.\n\n?????? ????? ???????? ?? ?????? ?? ??????? ???? ??? ????? ?????? ????? ??????. ??? ????? ??????? ???? ??????? ???????? ???? ??????? ??????? ??????? ??????? ??????? ???????? ???????? ??? ????????? ?? ?? ???? ????? ?? ???????.\n\n????? ?????? ??????? ????? ????? ??? ???? ?????. ???? ???? ????? ?? ??? ?????? ?? ??? ???? ?????? ????? ??? ????? ?? ??? ?????? ????? ??????? ??? ??? ????? ???? ??????.\n\n?? ???? ??? ????? ????? ?????? ?? ????? ??????? ?? ???? ????? ?? ????? ????? ????? ????? ??????? ?????? ?? ?? ???? ???? ???.\n\n?? ??? ?????? ???? ???? ??? ????? ??? ??? ?????. ???? ????? ??? ?????? ?? ???? ?????? ????? ??????? ???? ???????? ??????? ??? ??? ????????? ??????? ?? ???? ?????."
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
      profile: "My Account - Ba2i3",
      settings: "Account Settings - Ba2i3"
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
      payWithPaypal: "Cash on Delivery",
      chooseMethod: "Choose one payment method below:",
      loadingGateway: "Loading secure payment gateway...",
      paymentFailed: "Payment failed. Please try again.",
      paypalUnavailable: "Cash on delivery is currently the only available payment method.",
      secureTitle: "Secure payment",
      sleeporaCheckoutTitle: "Ba2i3 Checkout",
      paypalMethod: "PayPal",
      cardMethod: "Card",
      paypalMethodHint: "Pay in cash when your order is delivered.",
      cardMethodHint: "Pay in cash when your order is delivered.",
      cardSupportNote: "Cash on delivery is available for every order.",
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
      profile: "Mon compte - Ba2i3",
      settings: "Parametres du compte - Ba2i3"
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
      payWithPaypal: "Paiement a la livraison",
      chooseMethod: "Choisissez une methode de paiement ci-dessous :",
      loadingGateway: "Chargement de la passerelle de paiement securisee...",
      paymentFailed: "Le paiement a echoue. Veuillez reessayer.",
      paypalUnavailable: "Le paiement a la livraison est actuellement le seul mode disponible.",
      secureTitle: "Paiement securise",
      sleeporaCheckoutTitle: "Checkout Ba2i3",
      paypalMethod: "PayPal",
      cardMethod: "Carte",
      paypalMethodHint: "Payez en especes a la livraison de votre commande.",
      cardMethodHint: "Payez en especes a la livraison de votre commande.",
      cardSupportNote: "Le paiement a la livraison est disponible pour chaque commande.",
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
      profile: "????? - Ba2i3",
      settings: "??????? ?????? - Ba2i3"
    },
    profile: {
      title: "?????",
      subtitle: "?? ?????? ???? ?????? ????? ????????? ????????.",
      menuProfile: "?????",
      menuSettings: "?????????",
      menuCart: "????",
      logout: "????? ??????",
      updateAccount: "????? ??????"
    },
    settings: {
      title: "??????? ??????",
      subtitle: "?? ?????? ??????? ????? ?????? ?????? ??.",
      appearance: "??????",
      language: "?????",
      profileSection: "?????? ??????",
      passwordSection: "??????",
      currentPassword: "???? ?????? ???????",
      newPassword: "???? ?????? ???????",
      saveProfile: "??? ????????",
      savePassword: "??? ???? ??????",
      profileSaved: "?? ????? ?????? ?????.",
      passwordSaved: "?? ????? ???? ?????? ?????."
    },
    checkout: {
      validationError: "???? ??? ???? ??????? ????? ??? ????????.",
      payWithPaypal: "????? ??? ????????",
      chooseMethod: "???? ????? ????? ????????:",
      loadingGateway: "??? ????? ????? ????? ??????...",
      paymentFailed: "??? ?????. ???? ???????? ??? ????.",
      paypalUnavailable: "????? ??? ???????? ?? ????? ????? ??????? ?????.",
      secureTitle: "??? ???",
      sleeporaCheckoutTitle: "إتمام الطلب - Ba2i3",
      paypalMethod: "PayPal",
      cardMethod: "???????",
      paypalMethodHint: "???? ???? ??? ?????? ????.",
      cardMethodHint: "???? ???? ??? ?????? ????.",
      cardSupportNote: "????? ??? ???????? ???? ??? ???????.",
      orderSummary: "???? ?????",
      subtotal: "??????? ??????",
      backToCart: "?????? ??? ?????",
      cardPageTitle: "????? ????????",
      cardPageSubtitle: "???? ??????? ?????? ?? ???? ?????? ?????? ????.",
      backToCheckout: "?????? ??? ???? ?????",
      cardPageLead: "?????? ????? PayPal ????? ????? ????? ?????? Visa ?? Mastercard.",
      cardUnavailable: "????? ???????? ??? ???? ???? ?????? ??? PayPal."
    },
    admin: {
      usersTitle: "?????? ???????",
      refreshUsers: "????? ????????",
      noUsers: "?? ???? ?????? ????? ?????.",
      userDeleted: "?? ??? ???? ??????.",
      usersLoadError: "???? ????? ?????? ???????.",
      accountBadge: "????"
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

const mobileUiFixes = {
  en: {
    drawer: {
      language: "Language",
      currency: "Currency",
      categories: "Categories",
      account: "Account",
      myAccount: "My Account",
      settings: "Settings"
    },
    theme: {
      modeLabel: "Mode"
    },
    common: {
      back: "Back",
      free: "FREE",
      off: "off",
      continueToPayment: "Continue to payment",
      reviewOrder: "Review your order",
      paySecurely: "Pay securely",
      processingPayment: "Processing payment...",
      cancel: "Cancel"
    },
    actions: {
      view: "View"
    },
    trust: {
      purchaseProtection: "Purchase protection",
      secureOptions: "Secure payment options",
      verifiedReviews: "Verified reviews"
    },
    cart: {
      itemLabel: "item",
      itemsLabel: "items",
      itemsInCartTitle: "{{count}} {{countLabel}} in your cart",
      secureCheckout: "Proceed to secure checkout",
      moreOptions: "Or continue for more options",
      recommendationsTitle: "Add affordable items with free shipping",
      howPay: "How you'll pay",
      itemTotal: "Item(s) total",
      shopDiscount: "Shop discount",
      shipping: "Shipping",
      totalWithCount: "Total ({{count}} {{countLabel}})",
      markGift: "Mark order as a gift",
      applyCoupon: "Apply coupon code"
    },
    checkout: {
      stepShipping: "Shipping",
      stepPayment: "Payment",
      stepReview: "Review",
      addressTitle: "Enter an address",
      confirmEmail: "Confirm Email",
      country: "Country",
      fullName: "Full name",
      streetAddress: "Street address",
      address2: "Apt / Suite / Other (optional)",
      postalCode: "Postal code (optional)",
      city: "City",
      phoneOptional: "Phone number (optional)",
      choosePaymentMethod: "Choose a payment method",
      cardOption: "Pay with a card",
      paypalRedirect: "Cash on delivery only",
      cardNumber: "Card number",
      expiry: "Expiration date (MM/YY)",
      securityCode: "Security code",
      nameOnCard: "Name on card",
      billingSame: "My billing address is the same as my shipping address.",
      reviewTitle: "Review your order",
      reviewName: "Name",
      reviewAddress: "Address",
      reviewEmail: "Email",
      reviewMethod: "Method",
      reviewCard: "Card",
      backToCart: "Back to cart",
      cardBrands: "Cash on Delivery",
      completeAddress: "Please complete your address.",
      completeCardDetails: "Please complete card details.",
      chooseCardFirst: "Please choose card payment to continue from review.",
      completeBeforePay: "Please complete card details before paying.",
      paymentStartError: "Unable to start secure payment.",
      cardFieldsUnavailable: "Cash on delivery is the available payment method for this store.",
      loadingCardFields: "Loading secure card fields...",
      captureFailed: "Card payment capture failed.",
      cardSubmitFailed: "Card payment failed.",
      reviewCardSecure: "{{brand}} details entered securely",
      validation: {
        emailRequired: "Email is required.",
        confirmEmail: "Confirm email must match.",
        countryRequired: "Country is required.",
        fullNameRequired: "Full name is required.",
        addressRequired: "Street address is required.",
        cityRequired: "City is required.",
        cardFields: "Card details are incomplete.",
        cardNumber: "Card number is incomplete.",
        expiry: "Expiry must be MM/YY.",
        cvv: "Security code is required.",
        nameOnCard: "Name on card is required."
      }
    },
    product: {
      nowLabel: "Now",
      reviewSummary: "{{average}}/5 from {{count}} reviews",
      addReview: "Add Review",
      reviewRating: "Rating",
      ratingExcellent: "5 - Excellent",
      ratingGood: "4 - Good",
      ratingAverage: "3 - Average",
      ratingPoor: "2 - Poor",
      ratingBad: "1 - Bad",
      yourReview: "Your review",
      reviewPlaceholder: "Share your experience with this product.",
      submitReview: "Submit review",
      reviewAuthGate: "Sign in first to post a review from your account.",
      unverified: "Unverified"
    }
  },
  fr: {
    drawer: {
      language: "Langue",
      currency: "Devise",
      categories: "Categories",
      account: "Compte",
      myAccount: "Mon compte",
      settings: "Parametres"
    },
    theme: {
      modeLabel: "Mode"
    },
    common: {
      back: "Retour",
      free: "GRATUIT",
      off: "de remise",
      continueToPayment: "Continuer vers le paiement",
      reviewOrder: "Verifier votre commande",
      paySecurely: "Payer en toute securite",
      processingPayment: "Traitement du paiement...",
      cancel: "Annuler"
    },
    actions: {
      view: "Voir"
    },
    trust: {
      purchaseProtection: "Protection d'achat",
      secureOptions: "Paiement securise",
      verifiedReviews: "Avis verifies"
    },
    cart: {
      itemLabel: "article",
      itemsLabel: "articles",
      itemsInCartTitle: "{{count}} {{countLabel}} dans votre panier",
      secureCheckout: "Passer au paiement securise",
      moreOptions: "Ou continuer pour plus d'options",
      recommendationsTitle: "Ajoutez des articles abordables avec livraison gratuite",
      howPay: "Mode de paiement",
      itemTotal: "Total des articles",
      shopDiscount: "Remise boutique",
      shipping: "Livraison",
      totalWithCount: "Total ({{count}} {{countLabel}})",
      markGift: "Marquer la commande comme cadeau",
      applyCoupon: "Appliquer un code promo"
    },
    checkout: {
      stepShipping: "Livraison",
      stepPayment: "Paiement",
      stepReview: "Verification",
      addressTitle: "Saisir une adresse",
      confirmEmail: "Confirmer l'email",
      country: "Pays",
      fullName: "Nom complet",
      streetAddress: "Adresse",
      address2: "Appartement / Suite / Autre (optionnel)",
      postalCode: "Code postal (optionnel)",
      city: "Ville",
      phoneOptional: "Telephone (optionnel)",
      choosePaymentMethod: "Choisissez un mode de paiement",
      cardOption: "Payer par carte",
      paypalRedirect: "Paiement a la livraison uniquement",
      cardNumber: "Numero de carte",
      expiry: "Date d'expiration (MM/AA)",
      securityCode: "Code de securite",
      nameOnCard: "Nom sur la carte",
      billingSame: "Mon adresse de facturation est la meme que mon adresse de livraison.",
      reviewTitle: "Verifier votre commande",
      reviewName: "Nom",
      reviewAddress: "Adresse",
      reviewEmail: "Email",
      reviewMethod: "Methode",
      reviewCard: "Carte",
      backToCart: "Retour au panier",
      cardBrands: "Cash on Delivery",
      completeAddress: "Veuillez completer votre adresse.",
      completeCardDetails: "Veuillez completer les details de la carte.",
      chooseCardFirst: "Choisissez le paiement par carte pour continuer.",
      completeBeforePay: "Veuillez completer la carte avant de payer.",
      paymentStartError: "Impossible de lancer le paiement securise.",
      cardFieldsUnavailable: "Le paiement a la livraison est le mode disponible pour cette boutique.",
      loadingCardFields: "Chargement des champs carte securises...",
      captureFailed: "La capture du paiement par carte a echoue.",
      cardSubmitFailed: "Le paiement par carte a echoue.",
      reviewCardSecure: "Informations {{brand}} saisies en toute securite",
      validation: {
        emailRequired: "L'email est obligatoire.",
        confirmEmail: "La confirmation de l'email doit correspondre.",
        countryRequired: "Le pays est obligatoire.",
        fullNameRequired: "Le nom complet est obligatoire.",
        addressRequired: "L'adresse est obligatoire.",
        cityRequired: "La ville est obligatoire.",
        cardFields: "Les details de la carte sont incomplets.",
        cardNumber: "Le numero de carte est incomplet.",
        expiry: "La date doit etre au format MM/AA.",
        cvv: "Le code de securite est obligatoire.",
        nameOnCard: "Le nom sur la carte est obligatoire."
      }
    },
    product: {
      nowLabel: "Maintenant",
      reviewSummary: "{{average}}/5 sur {{count}} avis",
      addReview: "Ajouter un avis",
      reviewRating: "Note",
      ratingExcellent: "5 - Excellent",
      ratingGood: "4 - Bien",
      ratingAverage: "3 - Moyen",
      ratingPoor: "2 - Faible",
      ratingBad: "1 - Mauvais",
      yourReview: "Votre avis",
      reviewPlaceholder: "Partagez votre experience avec ce produit.",
      submitReview: "Publier l'avis",
      reviewAuthGate: "Connectez-vous d'abord pour publier un avis depuis votre compte.",
      unverified: "Non verifie"
    }
  },
  ar: {
    drawer: {
      language: "\u0627\u0644\u0644\u063a\u0629",
      currency: "\u0627\u0644\u0639\u0645\u0644\u0629",
      categories: "\u0627\u0644\u0641\u0626\u0627\u062a",
      account: "\u0627\u0644\u062d\u0633\u0627\u0628",
      myAccount: "\u062d\u0633\u0627\u0628\u064a",
      settings: "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a"
    },
    theme: {
      modeLabel: "\u0627\u0644\u0648\u0636\u0639"
    },
    common: {
      back: "\u0631\u062c\u0648\u0639",
      free: "\u0645\u062c\u0627\u0646\u0627",
      off: "\u062e\u0635\u0645",
      continueToPayment: "\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0625\u0644\u0649 \u0627\u0644\u062f\u0641\u0639",
      reviewOrder: "\u0645\u0631\u0627\u062c\u0639\u0629 \u0637\u0644\u0628\u0643",
      paySecurely: "\u0627\u062f\u0641\u0639 \u0628\u0623\u0645\u0627\u0646",
      processingPayment: "\u062c\u0627\u0631\u064a \u0645\u0639\u0627\u0644\u062c\u0629 \u0627\u0644\u062f\u0641\u0639...",
      cancel: "\u0625\u0644\u063a\u0627\u0621"
    },
    actions: {
      view: "\u0639\u0631\u0636"
    },
    trust: {
      purchaseProtection: "\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0634\u0631\u0627\u0621",
      secureOptions: "\u062e\u064a\u0627\u0631\u0627\u062a \u062f\u0641\u0639 \u0622\u0645\u0646\u0629",
      verifiedReviews: "\u0645\u0631\u0627\u062c\u0639\u0627\u062a \u0645\u0648\u062b\u0642\u0629"
    },
    cart: {
      itemLabel: "\u0639\u0646\u0635\u0631",
      itemsLabel: "\u0639\u0646\u0627\u0635\u0631",
      itemsInCartTitle: "\u0644\u062f\u064a\u0643 {{count}} {{countLabel}} \u0641\u064a \u0633\u0644\u062a\u0643",
      secureCheckout: "\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0625\u0644\u0649 \u062f\u0641\u0639 \u0622\u0645\u0646",
      moreOptions: "\u0623\u0648 \u062a\u0627\u0628\u0639 \u0644\u0645\u0632\u064a\u062f \u0645\u0646 \u0627\u0644\u062e\u064a\u0627\u0631\u0627\u062a",
      recommendationsTitle: "\u0623\u0636\u0641 \u0645\u0646\u062a\u062c\u0627\u062a \u0628\u0633\u0639\u0631 \u0645\u0646\u0627\u0633\u0628 \u0645\u0639 \u0634\u062d\u0646 \u0645\u062c\u0627\u0646\u064a",
      howPay: "\u0643\u064a\u0641 \u0633\u062a\u062f\u0641\u0639",
      itemTotal: "\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0639\u0646\u0627\u0635\u0631",
      shopDiscount: "\u062e\u0635\u0645 \u0627\u0644\u0645\u062a\u062c\u0631",
      shipping: "\u0627\u0644\u0634\u062d\u0646",
      totalWithCount: "\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a ({{count}} {{countLabel}})",
      markGift: "\u062a\u0639\u064a\u064a\u0646 \u0627\u0644\u0637\u0644\u0628 \u0643\u0647\u062f\u064a\u0629",
      applyCoupon: "\u062a\u0637\u0628\u064a\u0642 \u0643\u0648\u062f \u062e\u0635\u0645"
    },
    checkout: {
      stepShipping: "\u0627\u0644\u0634\u062d\u0646",
      stepPayment: "\u0627\u0644\u062f\u0641\u0639",
      stepReview: "\u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629",
      addressTitle: "\u0623\u062f\u062e\u0644 \u0627\u0644\u0639\u0646\u0648\u0627\u0646",
      confirmEmail: "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
      country: "\u0627\u0644\u0628\u0644\u062f",
      fullName: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
      streetAddress: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0634\u0627\u0631\u0639",
      address2: "\u0634\u0642\u0629 / \u062c\u0646\u0627\u062d / \u0623\u062e\u0631\u0649 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
      postalCode: "\u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0628\u0631\u064a\u062f\u064a (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
      city: "\u0627\u0644\u0645\u062f\u064a\u0646\u0629",
      phoneOptional: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
      choosePaymentMethod: "\u0627\u062e\u062a\u0631 \u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u062f\u0641\u0639",
      cardOption: "\u0627\u062f\u0641\u0639 \u0628\u0627\u0644\u0628\u0637\u0627\u0642\u0629",
      paypalRedirect: "\u0633\u064a\u062a\u0645 \u062a\u062d\u0648\u064a\u0644\u0643 \u0625\u0644\u0649 \u0635\u0641\u062d\u0629 PayPal \u0627\u0644\u0622\u0645\u0646\u0629",
      cardNumber: "\u0631\u0642\u0645 \u0627\u0644\u0628\u0637\u0627\u0642\u0629",
      expiry: "\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0627\u0646\u062a\u0647\u0627\u0621 (MM/YY)",
      securityCode: "\u0631\u0645\u0632 \u0627\u0644\u0623\u0645\u0627\u0646",
      nameOnCard: "\u0627\u0644\u0627\u0633\u0645 \u0639\u0644\u0649 \u0627\u0644\u0628\u0637\u0627\u0642\u0629",
      billingSame: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0641\u0648\u062a\u0631\u0629 \u0647\u0648 \u0646\u0641\u0633 \u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0634\u062d\u0646.",
      reviewTitle: "\u0645\u0631\u0627\u062c\u0639\u0629 \u0637\u0644\u0628\u0643",
      reviewName: "\u0627\u0644\u0627\u0633\u0645",
      reviewAddress: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
      reviewEmail: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
      reviewMethod: "\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u062f\u0641\u0639",
      reviewCard: "\u0627\u0644\u0628\u0637\u0627\u0642\u0629",
      backToCart: "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629",
      cardBrands: "Cash on Delivery",
      completeAddress: "\u064a\u0631\u062c\u0649 \u0625\u0643\u0645\u0627\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0639\u0646\u0648\u0627\u0646.",
      completeCardDetails: "\u064a\u0631\u062c\u0649 \u0625\u0643\u0645\u0627\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0628\u0637\u0627\u0642\u0629.",
      chooseCardFirst: "\u064a\u0631\u062c\u0649 \u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u062f\u0641\u0639 \u0628\u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0623\u0648\u0644\u0627.",
      completeBeforePay: "\u064a\u0631\u062c\u0649 \u0625\u0643\u0645\u0627\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0642\u0628\u0644 \u0627\u0644\u062f\u0641\u0639.",
      paymentStartError: "\u062a\u0639\u0630\u0631 \u0628\u062f\u0621 \u0627\u0644\u062f\u0641\u0639 \u0627\u0644\u0622\u0645\u0646.",
      cardFieldsUnavailable: "\u0627\u0644\u062f\u0641\u0639 \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u0628\u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u063a\u064a\u0631 \u0645\u0641\u0639\u0644 \u0644\u0647\u0630\u0627 \u062d\u0633\u0627\u0628 PayPal.",
      loadingCardFields: "\u062c\u0627\u0631\u064a \u062a\u062d\u0645\u064a\u0644 \u062d\u0642\u0648\u0644 \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0622\u0645\u0646\u0629...",
      captureFailed: "\u0641\u0634\u0644 \u062a\u062b\u0628\u064a\u062a \u062f\u0641\u0639 \u0627\u0644\u0628\u0637\u0627\u0642\u0629.",
      cardSubmitFailed: "\u0641\u0634\u0644 \u062f\u0641\u0639 \u0627\u0644\u0628\u0637\u0627\u0642\u0629.",
      reviewCardSecure: "\u062a\u0645 \u0625\u062f\u062e\u0627\u0644 \u0628\u064a\u0627\u0646\u0627\u062a {{brand}} \u0628\u0634\u0643\u0644 \u0622\u0645\u0646",
      validation: {
        emailRequired: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0645\u0637\u0644\u0648\u0628.",
        confirmEmail: "\u064a\u062c\u0628 \u0623\u0646 \u064a\u0637\u0627\u0628\u0642 \u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a.",
        countryRequired: "\u0627\u0644\u0628\u0644\u062f \u0645\u0637\u0644\u0648\u0628.",
        fullNameRequired: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 \u0645\u0637\u0644\u0648\u0628.",
        addressRequired: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0634\u0627\u0631\u0639 \u0645\u0637\u0644\u0648\u0628.",
        cityRequired: "\u0627\u0644\u0645\u062f\u064a\u0646\u0629 \u0645\u0637\u0644\u0648\u0628\u0629.",
        cardFields: "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u063a\u064a\u0631 \u0645\u0643\u062a\u0645\u0644\u0629.",
        cardNumber: "\u0631\u0642\u0645 \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u063a\u064a\u0631 \u0645\u0643\u062a\u0645\u0644.",
        expiry: "\u064a\u062c\u0628 \u0625\u062f\u062e\u0627\u0644 \u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0628\u0635\u064a\u063a\u0629 MM/YY.",
        cvv: "\u0631\u0645\u0632 \u0627\u0644\u0623\u0645\u0627\u0646 \u0645\u0637\u0644\u0648\u0628.",
        nameOnCard: "\u0627\u0644\u0627\u0633\u0645 \u0639\u0644\u0649 \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u0645\u0637\u0644\u0648\u0628."
      }
    },
    product: {
      nowLabel: "\u0627\u0644\u0622\u0646",
      reviewSummary: "{{average}}/5 \u0645\u0646 {{count}} \u0645\u0631\u0627\u062c\u0639\u0629",
      addReview: "\u0623\u0636\u0641 \u0645\u0631\u0627\u062c\u0639\u0629",
      reviewRating: "\u0627\u0644\u062a\u0642\u064a\u064a\u0645",
      ratingExcellent: "5 - \u0645\u0645\u062a\u0627\u0632",
      ratingGood: "4 - \u062c\u064a\u062f",
      ratingAverage: "3 - \u0645\u062a\u0648\u0633\u0637",
      ratingPoor: "2 - \u0636\u0639\u064a\u0641",
      ratingBad: "1 - \u0633\u064a\u0626",
      yourReview: "\u0631\u0623\u064a\u0643",
      reviewPlaceholder: "\u0634\u0627\u0631\u0643 \u062a\u062c\u0631\u0628\u062a\u0643 \u0645\u0639 \u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062a\u062c.",
      submitReview: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629",
      reviewAuthGate: "\u0633\u062c\u0644 \u062f\u062e\u0648\u0644\u0643 \u0623\u0648\u0644\u0627 \u0644\u0643\u062a\u0627\u0628\u0629 \u0645\u0631\u0627\u062c\u0639\u0629 \u0628\u0627\u0633\u0645 \u062d\u0633\u0627\u0628\u0643.",
      unverified: "\u063a\u064a\u0631 \u0645\u0648\u062b\u0642"
    }
  }
};

for (const [lang, sections] of Object.entries(mobileUiFixes)) {
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

const brandCodOverrides = {
  en: {
    brand: {
      name: "Ba2i3"
    },
    footer: {
      rights: "(c) 2026 Ba2i3. All rights reserved.",
      codNotice: "Cash on delivery available across the store"
    },
    trust: {
      securePaypal: "Cash on delivery available for every order.",
      codOnly: "Cash on delivery available for every order."
    },
    cart: {
      secureCheckout: "Proceed to checkout",
      codOnlyNote: "Cash on delivery only. No online payment required."
    },
    checkout: {
      subtitle: "Complete your cash on delivery order.",
      choosePaymentMethod: "Choose a payment method",
      codLabel: "Cash on Delivery",
      codDescription: "Pay in cash when your order is delivered.",
      reviewMethod: "Payment method",
      successTitle: "Order confirmed",
      successThankYou: "Your order has been placed successfully. You will pay in cash when it is delivered.",
      placeOrder: "Place order",
      placingOrder: "Placing your order...",
      continueShopping: "Continue shopping",
      backHome: "Back home",
      orderRef: "Order reference",
      cancelTitle: "Checkout paused",
      cancelled: "Your order was not placed yet. You can return to your cart or continue checkout anytime.",
      orderCreateError: "Unable to place your order right now."
    },
    admin: {
      ordersTitle: "Orders",
      ordersSubtitle: "Review incoming COD orders.",
      paidBadge: "COD",
      codBadge: "COD",
      noOrders: "No orders yet.",
      ordersLoadError: "Unable to load orders."
    }
  },
  fr: {
    brand: {
      name: "Ba2i3"
    },
    footer: {
      rights: "(c) 2026 Ba2i3. Tous droits reserves.",
      codNotice: "Paiement a la livraison disponible sur toute la boutique"
    },
    trust: {
      securePaypal: "Paiement a la livraison disponible pour chaque commande.",
      codOnly: "Paiement a la livraison disponible pour chaque commande."
    },
    cart: {
      secureCheckout: "Passer a la commande",
      codOnlyNote: "Paiement a la livraison uniquement. Aucun paiement en ligne requis."
    },
    checkout: {
      subtitle: "Finalisez votre commande en paiement a la livraison.",
      choosePaymentMethod: "Choisissez un mode de paiement",
      codLabel: "Paiement a la livraison",
      codDescription: "Payez en especes a la livraison de votre commande.",
      reviewMethod: "Mode de paiement",
      successTitle: "Commande confirmee",
      successThankYou: "Votre commande a bien ete enregistree. Le paiement se fera a la livraison.",
      placeOrder: "Confirmer la commande",
      placingOrder: "Validation de votre commande...",
      continueShopping: "Continuer vos achats",
      backHome: "Retour a l'accueil",
      orderRef: "Reference de commande",
      cancelTitle: "Commande en pause",
      cancelled: "Votre commande n'a pas encore ete validee. Vous pouvez revenir au panier ou reprendre le checkout a tout moment.",
      orderCreateError: "Impossible de valider votre commande pour le moment."
    },
    admin: {
      ordersTitle: "Commandes",
      ordersSubtitle: "Consultez les commandes en paiement a la livraison.",
      paidBadge: "COD",
      codBadge: "COD",
      noOrders: "Aucune commande pour le moment.",
      ordersLoadError: "Impossible de charger les commandes."
    }
  },
  ar: {
    brand: {
      name: "\u0628\u0627\u064a\u0639"
    },
    footer: {
      rights: "(c) 2026 \u0628\u0627\u064a\u0639. \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629.",
      codNotice: "\u0627\u0644\u062f\u0641\u0639 \u0639\u0646\u062f \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645 \u0645\u062a\u0627\u062d \u0641\u064a \u062c\u0645\u064a\u0639 \u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0645\u062a\u062c\u0631"
    },
    trust: {
      securePaypal: "\u0627\u0644\u062f\u0641\u0639 \u0639\u0646\u062f \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645 \u0645\u062a\u0627\u062d \u0644\u0643\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062a.",
      codOnly: "\u0627\u0644\u062f\u0641\u0639 \u0639\u0646\u062f \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645 \u0645\u062a\u0627\u062d \u0644\u0643\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062a."
    },
    cart: {
      secureCheckout: "\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0625\u0644\u0649 \u0625\u062a\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628",
      codOnlyNote: "\u0627\u0644\u062f\u0641\u0639 \u0639\u0646\u062f \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645 \u0641\u0642\u0637. \u0644\u0627 \u064a\u0648\u062c\u062f \u062f\u0641\u0639 \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a."
    },
    checkout: {
      subtitle: "\u0623\u0643\u0645\u0644 \u0637\u0644\u0628\u0643 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u062f\u0641\u0639 \u0639\u0646\u062f \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645.",
      choosePaymentMethod: "\u0627\u062e\u062a\u0631 \u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u062f\u0641\u0639",
      codLabel: "\u0627\u0644\u062f\u0641\u0639 \u0639\u0646\u062f \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645",
      codDescription: "\u0627\u062f\u0641\u0639 \u0646\u0642\u062f\u0627 \u0639\u0646\u062f \u0627\u0633\u062a\u0644\u0627\u0645 \u0637\u0644\u0628\u0643.",
      reviewMethod: "\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u062f\u0641\u0639",
      successTitle: "\u062a\u0645 \u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0637\u0644\u0628",
      successThankYou: "\u062a\u0645 \u062a\u0633\u062c\u064a\u0644 \u0637\u0644\u0628\u0643 \u0628\u0646\u062c\u0627\u062d. \u0633\u062a\u062f\u0641\u0639 \u0639\u0646\u062f \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645.",
      placeOrder: "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0637\u0644\u0628",
      placingOrder: "\u062c\u0627\u0631 \u062a\u0623\u0643\u064a\u062f \u0637\u0644\u0628\u0643...",
      continueShopping: "\u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u062a\u0633\u0648\u0642",
      backHome: "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
      orderRef: "\u0645\u0631\u062c\u0639 \u0627\u0644\u0637\u0644\u0628",
      cancelTitle: "\u062a\u0645 \u0625\u064a\u0642\u0627\u0641 \u0625\u062a\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628",
      cancelled: "\u0644\u0645 \u064a\u062a\u0645 \u062a\u0623\u0643\u064a\u062f \u0637\u0644\u0628\u0643 \u0628\u0639\u062f. \u064a\u0645\u0643\u0646\u0643 \u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629 \u0623\u0648 \u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u0625\u062a\u0645\u0627\u0645 \u0641\u064a \u0623\u064a \u0648\u0642\u062a.",
      orderCreateError: "\u062a\u0639\u0630\u0631 \u062a\u0623\u0643\u064a\u062f \u0637\u0644\u0628\u0643 \u062d\u0627\u0644\u064a\u0627."
    },
    admin: {
      ordersTitle: "\u0627\u0644\u0637\u0644\u0628\u0627\u062a",
      ordersSubtitle: "\u0631\u0627\u062c\u0639 \u0637\u0644\u0628\u0627\u062a \u0627\u0644\u062f\u0641\u0639 \u0639\u0646\u062f \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645 \u0627\u0644\u0648\u0627\u0631\u062f\u0629.",
      paidBadge: "COD",
      codBadge: "COD",
      noOrders: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0637\u0644\u0628\u0627\u062a \u062d\u0627\u0644\u064a\u0627.",
      ordersLoadError: "\u062a\u0639\u0630\u0631 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062a."
    }
  }
};

for (const [lang, sections] of Object.entries(brandCodOverrides)) {
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

function replaceStringDeep(value, search, replacement) {
  if (typeof value === "string") {
    return value.replaceAll(search, replacement);
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceStringDeep(item, search, replacement));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceStringDeep(item, search, replacement)]));
  }

  return value;
}

if (resources.ar?.translation) {
  resources.ar.translation = replaceStringDeep(resources.ar.translation, "Ba2i3", "\u0628\u0627\u064a\u0639");
}

const storefrontFixOverrides = {
  en: {
    brand: {
      tagline: "Welcome to Ba2i3 Store"
    },
    meta: {
      home: "Ba2i3 - Welcome to Ba2i3 Store"
    },
    home: {
      heroTitle: "Welcome to Ba2i3 Store",
      heroSubtitle: "Premium products at the best prices in Morocco.",
      shopNow: "Discover Now",
      buyNow: "Shop Now",
      collectionTitle: "Product Collection",
      viewAll: "See more",
      searchCta: "Search"
    }
  },
  fr: {
    brand: {
      tagline: "Bienvenue dans la boutique Ba2i3"
    },
    meta: {
      home: "Ba2i3 - Bienvenue dans la boutique Ba2i3"
    },
    home: {
      heroTitle: "Bienvenue dans la boutique Ba2i3",
      heroSubtitle: "Des produits premium aux meilleurs prix au Maroc.",
      shopNow: "Decouvrir",
      buyNow: "Acheter",
      collectionTitle: "Collection Produits",
      viewAll: "Voir plus",
      searchCta: "Rechercher"
    }
  },
  ar: {
    brand: {
      name: "Ba2i3",
      tagline: "مرحبا بكم في متجر Ba2i3"
    },
    meta: {
      home: "Ba2i3 - مرحبا بكم في متجر Ba2i3",
      products: "المنتجات - Ba2i3",
      product: "المنتج - Ba2i3",
      cart: "السلة - Ba2i3",
      checkout: "إتمام الطلب - Ba2i3",
      login: "تسجيل الدخول - Ba2i3",
      register: "إنشاء حساب - Ba2i3",
      policy: "السياسات - Ba2i3",
      profile: "حسابي - Ba2i3",
      settings: "إعدادات الحساب - Ba2i3"
    },
    nav: {
      products: "المنتجات",
      machines: "الأجهزة",
      accessories: "الإكسسوارات",
      pillows: "الوسائد",
      cart: "السلة",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      contact: "تواصل معنا"
    },
    drawer: {
      openMenu: "فتح القائمة",
      language: "اللغة",
      currency: "العملة",
      categories: "الفئات",
      account: "الحساب",
      favorites: "المفضلة",
      myAccount: "حسابي",
      settings: "الإعدادات"
    },
    common: {
      loading: "جارٍ التحميل...",
      unavailable: "غير متاح",
      missingImage: "الصورة غير متاحة",
      close: "إغلاق",
      back: "رجوع",
      free: "مجانا",
      off: "خصم",
      continueToPayment: "المتابعة",
      reviewOrder: "مراجعة الطلب",
      cancel: "إلغاء",
      or: "أو"
    },
    actions: {
      view: "عرض"
    },
    home: {
      heroTitle: "مرحبا بكم في متجر Ba2i3",
      heroTitlePrefix: "مرحبا بكم في متجر",
      heroSubtitle: "",
      shopNow: "اكتشف الآن",
      buyNow: "اكتشف الآن",
      collectionTitle: "مجموعة المنتجات",
      collectionSubtitle: "منتجات مختارة بعناية لاحتياجاتك اليومية.",
      viewAll: "عرض المزيد",
      searchCta: "بحث",
      searchPlaceholder: "ابحث عن أي شيء"
    },
    product: {
      sellerName: "من متجر Ba2i3",
      benefits: "المميزات",
      addToCart: "أضف إلى السلة",
      buyNow: "اطلب الآن",
      detailsTitle: "تفاصيل المنتج",
      detailsBody: "منتجات Ba2i3 مختارة بعناية لتجمع بين الجودة والسعر المناسب.",
      notFound: "المنتج غير موجود",
      colorsTitle: "اللون",
      selectColor: "اختر اللون",
      size: "المقاس",
      shippingTrustTitle: "الشحن والإرجاع والدفع عند الاستلام",
      highDemand: "كمية محدودة - طلب مرتفع اليوم",
      similarItems: "منتجات مشابهة",
      defaultOption: "افتراضي",
      nowLabel: "الآن",
      reviewsTitle: "آراء العملاء",
      reviewSummary: "{{average}}/5 من {{count}} مراجعة",
      addReview: "أضف مراجعة",
      reviewRating: "التقييم",
      ratingExcellent: "5 - ممتاز",
      ratingGood: "4 - جيد",
      ratingAverage: "3 - متوسط",
      ratingPoor: "2 - ضعيف",
      ratingBad: "1 - سيئ",
      yourReview: "رأيك",
      reviewPlaceholder: "شارك تجربتك مع هذا المنتج.",
      submitReview: "إرسال المراجعة",
      reviewAuthGate: "سجل دخولك أولا لكتابة مراجعة باسم حسابك.",
      reviewMinLength: "يجب أن تحتوي المراجعة على 12 حرفا على الأقل.",
      reviewAdded: "تمت إضافة المراجعة بنجاح.",
      verifiedBuyer: "عميل موثق",
      unverified: "غير موثق",
      reviewOne: "الجودة ممتازة والمنتج مطابق تماما للصور.",
      reviewTwo: "وصل الطلب بسرعة والمنتج عملي جدا في الاستخدام اليومي.",
      reviewThree: "المنتج جيد، لكن التوصيل تأخر قليلا."
    },
    products: {
      title: "منتجات مختارة",
      subtitle: "تصفح أفضل المنتجات المتوفرة في متجر Ba2i3.",
      price: "السعر",
      favoritesTitle: "المفضلة",
      favoritesSubtitle: "المنتجات التي حفظتها في متجر Ba2i3.",
      filters: "الفلاتر",
      category: "الفئة",
      maxPrice: "أقصى سعر",
      clearFilters: "مسح الفلاتر",
      applyFilters: "تطبيق الفلاتر",
      sortBy: "الترتيب حسب",
      sortFeatured: "الأبرز",
      sortTopRated: "الأعلى تقييما",
      sortPriceLow: "السعر: من الأقل إلى الأعلى",
      sortPriceHigh: "السعر: من الأعلى إلى الأقل",
      sortName: "الاسم: أ إلى ي",
      resultsCount: "{{count}} منتج",
      noResults: "لا توجد منتجات مطابقة حاليا.",
      tryAdjusting: "جرّب تغيير الفئة أو البحث أو السعر.",
      noFavorites: "لا توجد منتجات في المفضلة بعد.",
      noFavoritesHelp: "اضغط على القلب في أي بطاقة منتج ليظهر هنا."
    },
    trust: {
      purchaseProtection: "حماية الشراء",
      secureOptions: "خيارات موثوقة",
      verifiedReviews: "مراجعات موثوقة",
      deliveryEstimate: "مدة التوصيل: من 12 إلى 48 ساعة",
      moneyBack: "ضمان استرجاع خلال 30 يوما",
      securePaypal: "الدفع عند الاستلام متاح لكل الطلبات",
      codOnly: "الدفع عند الاستلام متاح لكل الطلبات",
      acceptedPayments: "طريقة الدفع"
    },
    cart: {
      title: "سلتك",
      empty: "السلة فارغة حاليا.",
      continue: "متابعة التسوق",
      quantity: "الكمية",
      total: "الإجمالي",
      checkout: "إتمام الطلب",
      remove: "حذف",
      shipping: "الشحن",
      recommendationsTitle: "أضف منتجات مناسبة مع شحن مجاني",
      howPay: "طريقة الدفع",
      itemTotal: "إجمالي المنتجات",
      shopDiscount: "خصم المتجر",
      totalWithCount: "الإجمالي ({{count}} {{countLabel}})",
      secureCheckout: "إتمام الطلب",
      codOnlyNote: "الدفع عند الاستلام فقط. لا يوجد دفع إلكتروني.",
      itemLabel: "منتج",
      itemsLabel: "منتجات",
      itemsInCartTitle: "لديك {{count}} {{countLabel}} في السلة"
    },
    checkout: {
      title: "إتمام الطلب",
      subtitle: "أكمل طلبك بالدفع عند الاستلام.",
      addressTitle: "أدخل عنوانك",
      confirmEmail: "تأكيد البريد الإلكتروني",
      country: "البلد",
      fullName: "الاسم الكامل",
      streetAddress: "العنوان",
      address2: "شقة / جناح / معلومات إضافية (اختياري)",
      postalCode: "الرمز البريدي (اختياري)",
      city: "المدينة",
      phoneOptional: "رقم الهاتف (اختياري)",
      choosePaymentMethod: "اختر طريقة الدفع",
      codLabel: "الدفع عند الاستلام",
      codDescription: "ادفع نقدا عند استلام طلبك.",
      reviewTitle: "راجع طلبك",
      reviewName: "الاسم",
      reviewAddress: "العنوان",
      reviewEmail: "البريد الإلكتروني",
      reviewMethod: "طريقة الدفع",
      backToCart: "العودة إلى السلة",
      placeOrder: "تأكيد الطلب",
      placingOrder: "جار تأكيد طلبك...",
      successTitle: "تم تأكيد الطلب",
      successThankYou: "تم تسجيل طلبك بنجاح. سيتم الدفع عند الاستلام.",
      continueShopping: "متابعة التسوق",
      backHome: "العودة إلى الرئيسية",
      orderRef: "مرجع الطلب",
      orderCreateError: "تعذر تأكيد طلبك حاليا.",
      completeAddress: "يرجى إكمال بيانات العنوان.",
      validation: {
        emailRequired: "البريد الإلكتروني مطلوب.",
        confirmEmail: "يجب أن يتطابق تأكيد البريد الإلكتروني.",
        countryRequired: "البلد مطلوب.",
        fullNameRequired: "الاسم الكامل مطلوب.",
        addressRequired: "العنوان مطلوب.",
        cityRequired: "المدينة مطلوبة."
      }
    },
    auth: {
      loginTitle: "تسجيل الدخول",
      registerTitle: "إنشاء حساب",
      firstName: "الاسم الشخصي",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      signIn: "دخول",
      create: "إنشاء",
      createAccount: "إنشاء حساب",
      already: "لديك حساب بالفعل؟",
      noAccount: "ليس لديك حساب؟",
      forgotPassword: "نسيت كلمة المرور؟",
      staySignedIn: "البقاء مسجلا",
      troubleSigningIn: "هل تواجه مشكلة في تسجيل الدخول؟",
      socialGoogle: "المتابعة باستخدام Google",
      socialFacebook: "المتابعة باستخدام Facebook",
      socialApple: "المتابعة باستخدام Apple",
      socialSetupRequired: "يلزم الإعداد",
      socialConfigNeeded: "تسجيل الدخول الاجتماعي يحتاج إلى إعداد المزوّد.",
      socialLegal: "بالضغط على تسجيل الدخول أو المتابعة عبر Google أو Facebook أو Apple فإنك توافق على شروط {{brand}} وسياسة الخصوصية.",
      gender: "الجنس",
      selectGender: "اختر الجنس",
      male: "ذكر",
      female: "أنثى",
      age: "العمر",
      phone: "رقم الهاتف",
      countryPhone: "البلد / مفتاح الاتصال",
      confirmPassword: "تأكيد كلمة المرور",
      missingFields: "يرجى ملء جميع الحقول المطلوبة.",
      requestFailed: "تعذر إتمام الطلب. حاول مرة أخرى.",
      registerSuccess: "تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول الآن.",
      loginSuccess: "تم تسجيل الدخول بنجاح.",
      passwordsMismatch: "كلمتا المرور غير متطابقتين.",
      passwordPolicy: "يجب أن تحتوي كلمة المرور على حروف كبيرة وصغيرة ورقم ورمز.",
      otpMethod: "طريقة إرسال رمز التحقق",
      otpByEmail: "البريد الإلكتروني",
      otpByPhone: "الهاتف (SMS)",
      sendOtp: "إرسال الرمز",
      otpSent: "تم إرسال الرمز بنجاح.",
      otpCode: "رمز التحقق",
      newPassword: "كلمة المرور الجديدة",
      resetPassword: "إعادة تعيين كلمة المرور",
      passwordResetSuccess: "تم تحديث كلمة المرور بنجاح."
    },
    footer: {
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة",
      refundPolicy: "سياسة الاسترجاع",
      shippingPolicy: "سياسة الشحن",
      contact: "تواصل معنا",
      rights: "(c) 2026 Ba2i3. جميع الحقوق محفوظة.",
      codNotice: "الدفع عند الاستلام متاح في جميع طلبات المتجر"
    },
    policy: {
      back: "العودة إلى المتجر",
      privacyPolicy: {
        title: "سياسة الخصوصية",
        body: "نجمع فقط المعلومات الضرورية لمعالجة الطلبات وخدمة العملاء."
      },
      termsOfService: {
        title: "شروط الخدمة",
        body: "باستخدام متجر Ba2i3 فإنك توافق على شروط الطلبات والاستخدام."
      },
      refundPolicy: {
        title: "سياسة الاسترجاع",
        body: "يمكن استرجاع المنتجات المؤهلة ضمن فترة الإرجاع ووفق حالة المنتج."
      },
      shippingPolicy: {
        title: "سياسة الشحن",
        body: "نعالج الطلبات بسرعة ونوفر الشحن حسب الوجهة المتاحة."
      }
    },
    profile: {
      title: "حسابي",
      subtitle: "أدر بيانات حسابك وتفضيلاتك المحفوظة.",
      menuProfile: "حسابي",
      menuSettings: "الإعدادات",
      menuCart: "سلتك",
      logout: "تسجيل الخروج",
      updateAccount: "تحديث الحساب"
    },
    settings: {
      title: "إعدادات الحساب",
      subtitle: "حدّث معلوماتك الشخصية وكلمة المرور.",
      language: "اللغة",
      profileSection: "بيانات الحساب",
      passwordSection: "الأمان",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      saveProfile: "حفظ البيانات",
      savePassword: "حفظ كلمة المرور",
      profileSaved: "تم تحديث بيانات الحساب بنجاح.",
      passwordSaved: "تم تحديث كلمة المرور بنجاح."
    }
  }
};

for (const [lang, sections] of Object.entries(storefrontFixOverrides)) {
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

const adminArabicPanelOverrides = {
  brand: {
    name: "Ba2i3"
  },
  meta: {
    admin: "\u0625\u062f\u0627\u0631\u0629 Ba2i3"
  },
  common: {
    loading: "\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0645\u064a\u0644...",
    unavailable: "\u063a\u064a\u0631 \u0645\u062a\u0627\u062d"
  },
  theme: {
    light: "\u0641\u0627\u062a\u062d",
    dark: "\u062f\u0627\u0643\u0646",
    modeLabel: "\u0627\u0644\u0648\u0636\u0639"
  },
  nav: {
    machines: "\u0627\u0644\u0623\u062c\u0647\u0632\u0629",
    accessories: "\u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062a",
    pillows: "\u0627\u0644\u0648\u0633\u0627\u0626\u062f"
  },
  auth: {
    email: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    gender: "\u0627\u0644\u062c\u0646\u0633",
    age: "\u0627\u0644\u0639\u0645\u0631"
  },
  cart: {
    itemTotal: "\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a",
    shopDiscount: "\u062e\u0635\u0645 \u0627\u0644\u0645\u062a\u062c\u0631",
    shipping: "\u0627\u0644\u0634\u062d\u0646",
    totalWithCount: "\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a ({{count}} {{countLabel}})",
    itemLabel: "\u0645\u0646\u062a\u062c",
    itemsLabel: "\u0645\u0646\u062a\u062c\u0627\u062a"
  },
  trust: {
    deliveryEstimate: "\u0645\u062f\u0629 \u0627\u0644\u062a\u0648\u0635\u064a\u0644: \u0645\u0646 12 \u0625\u0644\u0649 48 \u0633\u0627\u0639\u0629"
  },
  checkout: {
    title: "\u0625\u062a\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628",
    addressTitle: "\u0623\u062f\u062e\u0644 \u0639\u0646\u0648\u0627\u0646\u0643",
    email: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    confirmEmail: "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    country: "\u0627\u0644\u0628\u0644\u062f",
    fullName: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
    streetAddress: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
    address2: "\u0634\u0642\u0629 / \u062c\u0646\u0627\u062d / \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0625\u0636\u0627\u0641\u064a\u0629 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
    postalCode: "\u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0628\u0631\u064a\u062f\u064a (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
    city: "\u0627\u0644\u0645\u062f\u064a\u0646\u0629",
    phoneOptional: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
    stepShipping: "\u0627\u0644\u0634\u062d\u0646",
    stepPayment: "\u0627\u0644\u062f\u0641\u0639",
    stepReview: "\u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629",
    choosePaymentMethod: "\u0627\u062e\u062a\u0631 \u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u062f\u0641\u0639",
    reviewMethod: "\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u062f\u0641\u0639",
    codLabel: "\u0627\u0644\u062f\u0641\u0639 \u0639\u0646\u062f \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645",
    codDescription: "\u0627\u062f\u0641\u0639 \u0646\u0642\u062f\u0627 \u0639\u0646\u062f \u0627\u0633\u062a\u0644\u0627\u0645 \u0637\u0644\u0628\u0643.",
    reviewTitle: "\u0631\u0627\u062c\u0639 \u0637\u0644\u0628\u0643",
    reviewName: "\u0627\u0644\u0627\u0633\u0645",
    reviewAddress: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
    reviewEmail: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    backToCart: "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629",
    placeOrder: "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0637\u0644\u0628",
    placingOrder: "\u062c\u0627\u0631 \u062a\u0623\u0643\u064a\u062f \u0637\u0644\u0628\u0643...",
    continueShopping: "\u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u062a\u0633\u0648\u0642",
    backHome: "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
    successTitle: "\u062a\u0645 \u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0637\u0644\u0628",
    successThankYou: "\u062a\u0645 \u062a\u0633\u062c\u064a\u0644 \u0637\u0644\u0628\u0643 \u0628\u0646\u062c\u0627\u062d. \u0633\u064a\u062a\u0645 \u0627\u0644\u062f\u0641\u0639 \u0639\u0646\u062f \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645.",
    orderRef: "\u0645\u0631\u062c\u0639 \u0627\u0644\u0637\u0644\u0628",
    completeAddress: "\u064a\u0631\u062c\u0649 \u0625\u0643\u0645\u0627\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0639\u0646\u0648\u0627\u0646.",
    deliveryEstimateLabel: "\u0645\u062f\u0629 \u0627\u0644\u062a\u0648\u0635\u064a\u0644",
    deliveryEstimateValue: "\u0645\u0646 12 \u0625\u0644\u0649 48 \u0633\u0627\u0639\u0629",
    validation: {
      emailRequired: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0645\u0637\u0644\u0648\u0628.",
      confirmEmail: "\u064a\u062c\u0628 \u0623\u0646 \u064a\u062a\u0637\u0627\u0628\u0642 \u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a.",
      countryRequired: "\u0627\u0644\u0628\u0644\u062f \u0645\u0637\u0644\u0648\u0628.",
      fullNameRequired: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 \u0645\u0637\u0644\u0648\u0628.",
      addressRequired: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0645\u0637\u0644\u0648\u0628.",
      cityRequired: "\u0627\u0644\u0645\u062f\u064a\u0646\u0629 \u0645\u0637\u0644\u0648\u0628\u0629."
    }
  },
  admin: {
    setupTitle: "\u0625\u0639\u062f\u0627\u062f \u0627\u0644\u0625\u062f\u0627\u0631\u0629",
    setupSubtitle: "\u0623\u0646\u0634\u0626 \u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0645\u062a\u062c\u0631 \u0644\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u0622\u0645\u0646 \u0625\u0644\u0649 /admin.",
    username: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645",
    password: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
    confirmPassword: "\u062a\u0623\u0643\u064a\u062f \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
    saveSetup: "\u062d\u0641\u0638 \u0627\u0644\u0625\u0639\u062f\u0627\u062f",
    setupSaved: "\u062a\u0645 \u062d\u0641\u0638 \u0625\u0639\u062f\u0627\u062f \u0627\u0644\u0625\u062f\u0627\u0631\u0629 \u0628\u0646\u062c\u0627\u062d.",
    passwordsMismatch: "\u0643\u0644\u0645\u062a\u0627 \u0627\u0644\u0645\u0631\u0648\u0631 \u063a\u064a\u0631 \u0645\u062a\u0637\u0627\u0628\u0642\u062a\u064a\u0646.",
    loginTitle: "\u062a\u0633\u062c\u064a\u0644 \u062f\u062e\u0648\u0644 \u0627\u0644\u0625\u062f\u0627\u0631\u0629",
    loginSubtitle: "\u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0644\u0625\u062f\u0627\u0631\u0629 \u0645\u062a\u062c\u0631 Ba2i3.",
    loginButton: "\u062f\u062e\u0648\u0644",
    invalidLogin: "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062f\u062e\u0648\u0644 \u063a\u064a\u0631 \u0635\u062d\u064a\u062d\u0629.",
    logout: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c",
    logoutSuccess: "\u062a\u0645 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c.",
    dashboardTitle: "\u0644\u0648\u062d\u0629 \u062a\u062d\u0643\u0645 Ba2i3",
    dashboardSubtitle: "\u0623\u062f\u0631 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0648\u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0648\u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0645\u0646 \u0645\u0643\u0627\u0646 \u0648\u0627\u062d\u062f.",
    catalogSection: "\u0627\u0644\u0645\u062a\u062c\u0631",
    customersSection: "\u0627\u0644\u0639\u0645\u0644\u0627\u0621",
    workspaceSection: "\u0627\u0644\u0625\u062f\u0627\u0631\u0629",
    settingsSection: "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a",
    settingsSubtitle: "\u0645\u0638\u0647\u0631 \u0644\u0648\u062d\u0629 \u0627\u0644\u0625\u062f\u0627\u0631\u0629 \u0648\u0623\u062f\u0648\u0627\u062a\u0647\u0627 \u0627\u0644\u0633\u0631\u064a\u0639\u0629.",
    interfaceSection: "\u0627\u0644\u0648\u0627\u062c\u0647\u0629",
    quickActions: "\u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0633\u0631\u064a\u0639\u0629",
    storeSummary: "\u0645\u0644\u062e\u0635 \u0627\u0644\u0645\u062a\u062c\u0631",
    totalProducts: "\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a",
    featuredProducts: "\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0645\u0645\u064a\u0632\u0629",
    totalCustomers: "\u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0639\u0645\u0644\u0627\u0621",
    totalOrders: "\u0627\u0644\u0637\u0644\u0628\u0627\u062a",
    products: "\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a",
    productsSubtitle: "\u0627\u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u062d\u0627\u0644\u064a\u0629 \u0648\u0639\u062f\u0651\u0644\u0647\u0627 \u0623\u0648 \u0627\u062d\u0630\u0641\u0647\u0627 \u0641\u0642\u0637.",
    addProduct: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062a\u062c",
    addProductSubtitle: "\u0623\u0636\u0641 \u0645\u0646\u062a\u062c\u064b\u0627 \u062c\u062f\u064a\u062f\u064b\u0627 \u0623\u0648 \u062d\u062f\u0651\u062b \u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0646\u062a\u062c \u0645\u0648\u062c\u0648\u062f.",
    editProduct: "\u062a\u0639\u062f\u064a\u0644 \u0627\u0644\u0645\u0646\u062a\u062c",
    cancelEdit: "\u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u062a\u0639\u062f\u064a\u0644",
    saveProduct: "\u062d\u0641\u0638 \u0627\u0644\u0645\u0646\u062a\u062c",
    updateProduct: "\u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0645\u0646\u062a\u062c",
    deleteProduct: "\u062d\u0630\u0641 \u0627\u0644\u0645\u0646\u062a\u062c",
    noProducts: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0646\u062a\u062c\u0627\u062a \u062d\u0627\u0644\u064a\u064b\u0627.",
    name: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062a\u062c",
    price: "\u0627\u0644\u0633\u0639\u0631",
    description: "\u0627\u0644\u0648\u0635\u0641",
    category: "\u0627\u0644\u0641\u0626\u0629",
    featured: "\u0645\u0645\u064a\u0632",
    image: "\u0627\u0644\u0635\u0648\u0631\u0629",
    imagePath: "\u0645\u0633\u0627\u0631 \u0627\u0644\u0635\u0648\u0631\u0629",
    imageHelp: "\u0627\u0644\u0627\u0645\u062a\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u0645\u062f\u0639\u0648\u0645\u0629: jpg\u060c jpeg\u060c png\u060c webp. \u0627\u0644\u062d\u062f \u0627\u0644\u0623\u0642\u0635\u0649 5 \u0645\u064a\u063a\u0627\u0628\u0627\u064a\u062a.",
    chooseFile: "\u0627\u062e\u062a\u0631 \u0645\u0644\u0641\u064b\u0627",
    preview: "\u0645\u0639\u0627\u064a\u0646\u0629",
    refreshProducts: "\u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a",
    colors: "\u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0645\u062a\u0627\u062d\u0629",
    colorsHelp: "\u0627\u0643\u062a\u0628 \u0627\u0644\u0623\u0644\u0648\u0627\u0646 \u0645\u0641\u0635\u0648\u0644\u0629 \u0628\u0641\u0648\u0627\u0635\u0644\u060c \u0645\u062b\u0644 White\u060c Black\u060c #d9c7a8.",
    sizes: "\u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062a",
    size: "\u0627\u0644\u0645\u0642\u0627\u0633",
    addSize: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0642\u0627\u0633",
    removeSize: "\u062d\u0630\u0641 \u0627\u0644\u0645\u0642\u0627\u0633",
    sizeHelp: "\u0627\u062e\u062a\u064a\u0627\u0631\u064a. \u0623\u0636\u0641 \u0627\u0644\u0645\u0642\u0627\u0633\u0627\u062a \u0627\u0644\u062a\u064a \u064a\u062c\u0628 \u0623\u0646 \u062a\u0638\u0647\u0631 \u0641\u064a \u0635\u0641\u062d\u0629 \u0627\u0644\u0645\u0646\u062a\u062c.",
    sizePlaceholder: "S / M / L / XL \u0623\u0648 \u0645\u0642\u0627\u0633 \u0645\u062e\u0635\u0635",
    benefits: "\u0627\u0644\u0641\u0648\u0627\u0626\u062f",
    benefitsHelp: "\u0627\u0643\u062a\u0628 \u0641\u0627\u0626\u062f\u0629 \u0641\u064a \u0643\u0644 \u0633\u0637\u0631. \u062a\u0638\u0647\u0631 \u0647\u0630\u0647 \u0627\u0644\u0623\u0633\u0637\u0631 \u0641\u064a \u0635\u0641\u062d\u0629 \u0627\u0644\u0645\u0646\u062a\u062c.",
    variants: "\u0627\u0644\u0646\u0633\u062e \u0648\u0627\u0644\u0635\u0648\u0631",
    variant: "\u0646\u0633\u062e\u0629",
    addVariant: "\u0625\u0636\u0627\u0641\u0629 \u0646\u0633\u062e\u0629",
    removeVariant: "\u062d\u0630\u0641",
    variantColor: "\u0627\u0644\u0644\u0648\u0646",
    selectColor: "\u0627\u062e\u062a\u0631 \u0644\u0648\u0646\u064b\u0627",
    variantImage: "\u0645\u0633\u0627\u0631 \u0635\u0648\u0631\u0629 \u0627\u0644\u0646\u0633\u062e\u0629",
    variantHelp: "\u064a\u062c\u0628 \u0623\u0646 \u062a\u062d\u062a\u0648\u064a \u0643\u0644 \u0646\u0633\u062e\u0629 \u0639\u0644\u0649 \u0644\u0648\u0646 \u0648\u0635\u0648\u0631\u0629. \u064a\u0645\u0643\u0646\u0643 \u0631\u0641\u0639 \u0639\u062f\u0629 \u0635\u0648\u0631 \u0644\u0644\u0645\u0646\u062a\u062c.",
    imageUploaded: "\u062a\u0645 \u0631\u0641\u0639 \u0627\u0644\u0635\u0648\u0631\u0629 \u0628\u0646\u062c\u0627\u062d.",
    reels: "\u0645\u0642\u0627\u0637\u0639 \u0627\u0644\u0645\u0646\u062a\u062c",
    reel: "\u0645\u0642\u0637\u0639",
    addReel: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0642\u0637\u0639",
    removeReel: "\u062d\u0630\u0641 \u0627\u0644\u0645\u0642\u0637\u0639",
    reelUrl: "\u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0642\u0637\u0639",
    reelPoster: "\u0635\u0648\u0631\u0629 \u0627\u0644\u063a\u0644\u0627\u0641",
    reelHelp: "\u0623\u0636\u0641 \u0631\u0648\u0627\u0628\u0637 \u0641\u064a\u062f\u064a\u0648 \u0645\u0628\u0627\u0634\u0631\u0629 \u0623\u0648 \u0627\u0631\u0641\u0639 \u0645\u0642\u0627\u0637\u0639 \u0644\u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062a\u062c.",
    videoUpload: "\u0631\u0641\u0639 \u0641\u064a\u062f\u064a\u0648",
    videoHelp: "\u0627\u0644\u0625\u0645\u062a\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u0645\u0642\u0628\u0648\u0644\u0629: mp4\u060c webm\u060c mov\u060c m4v. \u0627\u0644\u062d\u062f \u0627\u0644\u0623\u0642\u0635\u0649 30 \u0645\u064a\u063a\u0627\u0628\u0627\u064a\u062a.",
    mediaUploaded: "\u062a\u0645 \u0631\u0641\u0639 \u0627\u0644\u0645\u0644\u0641 \u0628\u0646\u062c\u0627\u062d.",
    imageTypeError: "\u0627\u062e\u062a\u0631 \u0635\u0648\u0631\u0629 \u0635\u062d\u064a\u062d\u0629 \u0628\u0627\u0644\u0635\u064a\u063a jpg \u0623\u0648 jpeg \u0623\u0648 png \u0623\u0648 webp.",
    videoTypeError: "\u0627\u062e\u062a\u0631 \u0641\u064a\u062f\u064a\u0648 \u0635\u062d\u064a\u062d\u064b\u0627 \u0628\u0627\u0644\u0635\u064a\u063a mp4 \u0623\u0648 webm \u0623\u0648 mov \u0623\u0648 m4v.",
    imageTooLarge: "\u062d\u062c\u0645 \u0627\u0644\u0635\u0648\u0631\u0629 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0645\u0633\u0645\u0648\u062d.",
    videoTooLarge: "\u062d\u062c\u0645 \u0627\u0644\u0641\u064a\u062f\u064a\u0648 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0645\u0633\u0645\u0648\u062d.",
    saved: "\u062a\u0645 \u062d\u0641\u0638 \u0627\u0644\u062a\u0639\u062f\u064a\u0644\u0627\u062a.",
    deleted: "\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u0645\u0646\u062a\u062c.",
    uploadError: "\u062a\u0639\u0630\u0631 \u0631\u0641\u0639 \u0627\u0644\u0645\u0644\u0641.",
    validationError: "\u064a\u0631\u062c\u0649 \u0625\u0643\u0645\u0627\u0644 \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629.",
    localApiError: "\u0648\u0627\u062c\u0647\u0629 \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u063a\u064a\u0631 \u0645\u062a\u0627\u062d\u0629. \u062a\u062d\u0642\u0642 \u0645\u0646 \u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u0646\u0634\u0631.",
    apiUnavailable: "\u0648\u0627\u062c\u0647\u0629 \u0627\u0644\u0625\u062f\u0627\u0631\u0629 \u063a\u064a\u0631 \u0645\u062a\u0627\u062d\u0629. \u062a\u062d\u0642\u0642 \u0645\u0646 \u062c\u0630\u0631 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0641\u064a Vercel.",
    usersTitle: "\u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0639\u0645\u0644\u0627\u0621",
    usersSubtitle: "\u0627\u0641\u062a\u062d \u0627\u0644\u062d\u0633\u0627\u0628 \u0644\u0639\u0631\u0636 \u062a\u0641\u0627\u0635\u064a\u0644\u0647.",
    refreshUsers: "\u062a\u062d\u062f\u064a\u062b \u0627\u0644\u062d\u0633\u0627\u0628\u0627\u062a",
    noUsers: "\u0644\u0627 \u062a\u0648\u062c\u062f \u062d\u0633\u0627\u0628\u0627\u062a \u0639\u0645\u0644\u0627\u0621 \u062d\u0627\u0644\u064a\u064b\u0627.",
    userDeleted: "\u062a\u0645 \u062d\u0630\u0641 \u062d\u0633\u0627\u0628 \u0627\u0644\u0639\u0645\u064a\u0644.",
    usersLoadError: "\u062a\u0639\u0630\u0631 \u062a\u062d\u0645\u064a\u0644 \u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0639\u0645\u0644\u0627\u0621.",
    accountBadge: "\u062d\u0633\u0627\u0628",
    createdAt: "\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0625\u0646\u0634\u0627\u0621",
    deleteUser: "\u062d\u0630\u0641 \u0627\u0644\u062d\u0633\u0627\u0628",
    confirmDeleteUser: "\u0647\u0644 \u062a\u0631\u064a\u062f \u062d\u0630\u0641 \u062d\u0633\u0627\u0628 \u0647\u0630\u0627 \u0627\u0644\u0639\u0645\u064a\u0644\u061f",
    customerName: "\u0627\u0644\u0627\u0633\u0645",
    customerEmail: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    customerPhone: "\u0627\u0644\u0647\u0627\u062a\u0641",
    customerAddress: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
    copyEmail: "\u0646\u0633\u062e \u0627\u0644\u0628\u0631\u064a\u062f",
    copyPhone: "\u0646\u0633\u062e \u0627\u0644\u0647\u0627\u062a\u0641",
    copyAddress: "\u0646\u0633\u062e \u0627\u0644\u0639\u0646\u0648\u0627\u0646",
    copyEmailSuccess: "\u062a\u0645 \u0646\u0633\u062e \u0627\u0644\u0628\u0631\u064a\u062f.",
    copyPhoneSuccess: "\u062a\u0645 \u0646\u0633\u062e \u0627\u0644\u0647\u0627\u062a\u0641.",
    copyAddressSuccess: "\u062a\u0645 \u0646\u0633\u062e \u0627\u0644\u0639\u0646\u0648\u0627\u0646.",
    copied: "\u062a\u0645 \u0627\u0644\u0646\u0633\u062e.",
    copyFailed: "\u062a\u0639\u0630\u0631 \u0627\u0644\u0646\u0633\u062e.",
    ordersTitle: "\u0627\u0644\u0637\u0644\u0628\u0627\u062a",
    ordersSubtitle: "\u0631\u0627\u062c\u0639 \u0637\u0644\u0628\u0627\u062a \u0627\u0644\u062f\u0641\u0639 \u0639\u0646\u062f \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645 \u0627\u0644\u0648\u0627\u0631\u062f\u0629.",
    refreshOrders: "\u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0637\u0644\u0628\u0627\u062a",
    paidBadge: "COD",
    codBadge: "COD",
    noOrders: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0637\u0644\u0628\u0627\u062a \u062d\u0627\u0644\u064a\u064b\u0627.",
    ordersLoadError: "\u062a\u0639\u0630\u0631 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062a.",
    orderItems: "\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a",
    noOrderItems: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0646\u062a\u062c\u0627\u062a.",
    orderTotal: "\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a",
    confirmDeleteProduct: "\u0647\u0644 \u062a\u0631\u064a\u062f \u062d\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062a\u062c\u061f",
    categories: {
      accessories: "\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062a",
      clothing: "\u0645\u0644\u0627\u0628\u0633",
      shoes: "\u0623\u062d\u0630\u064a\u0629",
      "traditional-wear": "\u0644\u0628\u0627\u0633 \u062a\u0642\u0644\u064a\u062f\u064a",
      bags: "\u062d\u0642\u0627\u0626\u0628",
      beauty: "\u0627\u0644\u062c\u0645\u0627\u0644",
      home: "\u0627\u0644\u0645\u0646\u0632\u0644",
      kitchen: "\u0627\u0644\u0645\u0637\u0628\u062e",
      electronics: "\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0627\u062a",
      "phones-accessories": "\u0627\u0644\u0647\u0648\u0627\u062a\u0641 \u0648\u0627\u0644\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062a",
      watches: "\u0633\u0627\u0639\u0627\u062a",
      jewelry: "\u0645\u062c\u0648\u0647\u0631\u0627\u062a",
      sports: "\u0631\u064a\u0627\u0636\u0629",
      kids: "\u0623\u0637\u0641\u0627\u0644",
      men: "\u0631\u062c\u0627\u0644",
      women: "\u0646\u0633\u0627\u0621",
      machines: "\u0623\u062c\u0647\u0632\u0629",
      pillows: "\u0648\u0633\u0627\u0626\u062f"
    },
    colorNames: {
      white: "\u0623\u0628\u064a\u0636",
      black: "\u0623\u0633\u0648\u062f",
      gray: "\u0631\u0645\u0627\u062f\u064a",
      beige: "\u0628\u064a\u062c",
      cream: "\u0643\u0631\u064a\u0645\u064a",
      ivory: "\u0639\u0627\u062c\u064a",
      pearl: "\u0644\u0624\u0644\u0624\u064a",
      silver: "\u0641\u0636\u064a",
      warmWhite: "\u0623\u0628\u064a\u0636 \u062f\u0627\u0641\u0626",
      charcoal: "\u0641\u062d\u0645\u064a",
      red: "\u0623\u062d\u0645\u0631",
      blue: "\u0623\u0632\u0631\u0642",
      green: "\u0623\u062e\u0636\u0631",
      brown: "\u0628\u0646\u064a",
      pink: "\u0648\u0631\u062f\u064a",
      navy: "\u0643\u062d\u0644\u064a"
    }
  }
};

if (resources.ar?.translation) {
  for (const [section, value] of Object.entries(adminArabicPanelOverrides)) {
    resources.ar.translation[section] = {
      ...(resources.ar.translation[section] || {}),
      ...value
    };
  }
}

const finalStorefrontLanguageOverrides = {
  en: {
    product: {
      selectOptions: "Select options"
    },
    products: {
      title: "Ba2i3 Collection",
      subtitle: "Discover curated picks for everyday shopping in one clean collection.",
      sortFeatured: "Newest"
    },
    trust: {
      deliveryEstimate: "Delivery within 12 to 48 hours"
    },
    checkout: {
      deliveryEstimateValue: "12 to 48 hours",
      orderItems: "Order items"
    }
  },
  fr: {
    product: {
      selectOptions: "Choisir les options"
    },
    products: {
      title: "Collection Ba2i3",
      subtitle: "Decouvrez une selection claire et pratique pour vos besoins quotidiens.",
      sortFeatured: "Nouveautes"
    },
    trust: {
      deliveryEstimate: "Livraison sous 12 a 48 heures"
    },
    checkout: {
      deliveryEstimateValue: "12 a 48 heures",
      orderItems: "Articles de la commande"
    }
  },
  ar: {
    product: {
      selectOptions: "اختر الخيارات"
    },
    products: {
      title: "مجموعة Ba2i3",
      subtitle: "اكتشف تشكيلة مرتبة ومناسبة للتسوق اليومي.",
      sortFeatured: "الأحدث"
    },
    trust: {
      deliveryEstimate: "\u0645\u062f\u0629 \u0627\u0644\u062a\u0648\u0635\u064a\u0644: \u0645\u0646 12 \u0625\u0644\u0649 48 \u0633\u0627\u0639\u0629"
    },
    checkout: {
      deliveryEstimateValue: "\u0645\u0646 12 \u0625\u0644\u0649 48 \u0633\u0627\u0639\u0629",
      orderItems: "\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0637\u0644\u0628"
    }
  }
};

for (const [lang, sections] of Object.entries(finalStorefrontLanguageOverrides)) {
  const translation = resources[lang]?.translation;
  if (!translation) continue;
  for (const [section, value] of Object.entries(sections)) {
    translation[section] = {
      ...(translation[section] || {}),
      ...value
    };
  }
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




