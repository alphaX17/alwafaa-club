/**
 * =========================================================================
 * منصة نادي الوفاء - محرك اللغات والترجمة الشامل (i18n Engine)
 * الجامعة اللبنانية الدولية (LIU) - فرع صور
 * =========================================================================
 * يدير هذا الملف الترجمة الثلاثية المعتمدة:
 * - العربية (AR - Arabic - Default RTL)
 * - الإنجليزية (EN - English - LTR)
 * - الفرنسية (FR - Français - LTR)
 *
 * يشمل: ضبط الاتجاه (dir="rtl"/"ltr")، تبديل الخطوط، وتحديث جميع النصوص الحية.
 * =========================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'clubLang';
  const DEFAULT_LANG = 'ar';

  // ==================== قاموس الترجمة الأكاديمي المعتمد ====================
  const translations = {
    ar: {
      // شريط التنقل والقائمة
      "nav.clubName": "نادي الوفاء",
      "nav.campusSubtitle": "الجامعة اللبنانية الدولية — صور",
      "nav.examBank": "بنك الامتحانات",
      "nav.books": "الكتب",
      "nav.scholarship": "المنحة",
      "nav.faculty": "الأساتذة",
      "nav.guidance": "التوجيه",
      "nav.archive": "الأرشيف",
      "nav.themeLight": "النهاري",
      "nav.themeDark": "الليلي",
      "nav.selectLang": "اللغة",
      "nav.openMenu": "فتح القائمة",
      "nav.closeMenu": "إغلاق القائمة",
      "nav.sidebarTitle": "أقسام المنصة",
      "nav.sidebarSubtitle": "الوصول السريع لكافة الخدمات",
      "nav.homeLink": "الرئيسية (الأنشطة والخدمات)",
      "nav.resourcesLink": "بنك الامتحانات والموارد",
      "nav.booksLink": "إعارة واستعارة الكتب الورقية",
      "nav.scholarshipLink": "المنحة الطلابية السنوية",
      "nav.facultyLink": "دليل الأساتذة والساعات المكتبية",
      "nav.guidanceLink": "شبكة التوجيه الأكاديمي",
      "nav.archiveLink": "أرشيف الفعاليات والأنشطة",

      // قسم الإعلانات والـ Hero
      "announcement.badge": "إعلان",
      "announcement.defaultText": "تم فتح باب التقديم للمنحة الطلابية السنوية التابعة لنادي الوفاء.",
      "announcement.btn": "قدّم الآن",
      "hero.tagline": "— من الطلاب، للطلاب • فرع صور",
      "hero.titleLine1": "كل ما تحتاجه لفصلك",
      "hero.titleLine2": "القادم",
      "hero.titleHighlight": "في مكان واحد.",
      "hero.description": "مرجع شامل لطلاب الجامعة اللبنانية الدولية في صور: بنك الموارد الأكاديمية ونماذج الامتحانات، استعارة وتبادل المراجع الدراسية، وشبكة التوجيه الأكاديمي المباشر.",
      "hero.activitiesBtn": "الأنشطة والفعاليات الجامعية",

      // قسم ماذا يقدم النادي
      "services.subtitle": "الخدمات الطلابية",
      "services.title": "ماذا يقدّم النادي",
      "services.books.title": "استعارة الكتب الورقية",
      "services.books.desc": "استعارة نسخ ورقية مطبوعة من مراجع ومقررات الجامعة بفرع صور أو تقديم كتبك ليستفيد منها زملاؤك.",
      "services.books.link": "طلب واستعارة كتاب",
      "services.resources.title": "بنك الامتحانات والموارد",
      "services.resources.desc": "نماذج امتحانات سابقة نصفية ونهائية، ملخصات دراسية معتمدة، وسلايدات المقررات لكافة الكليات.",
      "services.resources.link": "تصفح الملفات",
      "services.scholarship.title": "المنحة الطلابية",
      "services.scholarship.desc": "مبادرة نادي الوفاء السنوية لتخفيف الأعباء الجامعية ومساعدة الطلاب المستحقين في مسيرتهم.",
      "services.scholarship.link": "تفاصيل وتقديم المنحة",
      "services.faculty.title": "دليل الأساتذة",
      "services.faculty.desc": "وسائل التواصل والبريد الجامعي لأساتذة الكليات، أماكن المكاتب، ومتابعة الساعات المكتبية لحظياً.",
      "services.faculty.link": "دليل الأساتذة",
      "services.guidance.title": "شبكة التوجيه وممثلو الاختصاصات",
      "services.guidance.desc": "ممثلو الاختصاصات ومجموعات الواتساب الرسمية للإرشاد الأكاديمي والإجابة عن استفسارات المواد.",
      "services.guidance.link": "التواصل مع الممثلين",
      "services.archive.title": "أرشيف الفعاليات والأنشطة",
      "services.archive.desc": "سجل الأنشطة والورش التخصصية، الدورات التدريبية، والمبادرات الطلابية التي ينظمها النادي.",
      "services.archive.link": "سجل الفعاليات",

      // مقولة وفلسفة النادي
      "quote.text": "\"نادي الوفاء جمعية طلابية يديرها طلاب فرع صور، تجمع ما تعلّمناه في فصولنا ليجده من يأتي بعدنا جاهزاً: الامتحانات، الكتب، والأشخاص الذين يعرفون الطريق.\"",
      "quote.author": "— الهيئة الإدارية، نادي الوفاء صور",

      // قسم الأنشطة
      "activities.subtitle": "الميدان الجامعي",
      "activities.title": "الأنشطة والفعاليات الجامعية",
      "activities.archiveBtn": "أرشيف الفعاليات",
      "activities.empty": "لا توجد فعاليات معروضة حالياً في الصفحة الرئيسية.",
      "activities.details": "التفاصيل",
      "activities.recent": "فعالية حديثة",
      "activities.photos": "صور",

      // المساعد الذكي AI
      "ai.floatingBtn": "مساعد AI",
      "ai.windowTitle": "مساعد AI الذكي",
      "ai.badgeModel": "Gemini Flash",
      "ai.statusConnected": "متصل",
      "ai.quotaRemaining": "{count} استفسارات متبقية",
      "ai.greeting": "مرحباً بك زميلي الطالب! أنا مساعد AI الأكاديمي لنادي الوفاء في فرع صور. يمكنك سؤالي عن كل ما يخص الجامعة: اللوائح الأكاديمية ونظام الـ GPA، خدمات الموقع (الامتحانات، الكتب، المنح، والأساتذة)، أو حتى الاستفسار والشرح في مقرراتك الدراسية ونصائح التفوق.",
      "ai.inputPlaceholder": "اسأل مساعد AI عن المواد، الأساتذة، أو اللوائح...",
      "ai.listening": "جارٍ الاستماع إليك... تحدث براحتك دون استعجال",
      "ai.voiceTooltip": "تحدث صوتياً",
      "ai.sendTooltip": "إرسال",
      "ai.loading": "مساعد AI يحلل الاستفسار الأكاديمي...",

      // الفوتر
      "footer.tagline": "نادي الوفاء — الجامعة اللبنانية الدولية في صور • المنصة الطلابية الرسمية",
      "footer.quickLinks": "روابط سريعة",
      "footer.about": "عن النادي والجامعة",
      "footer.campus": "الجامعة اللبنانية الدولية — فرع صور",
      "footer.portal": "بوابة UMS الطلابية",
      "footer.rights": "جميع الحقوق محفوظة © {year} نادي الوفاء — فرع صور."
    },

    en: {
      // Navigation & Menu
      "nav.clubName": "Al-Wafaa Club",
      "nav.campusSubtitle": "Lebanese International University — Tyre",
      "nav.examBank": "Exams Bank",
      "nav.books": "Books",
      "nav.scholarship": "Scholarship",
      "nav.faculty": "Faculty",
      "nav.guidance": "Guidance",
      "nav.archive": "Archive",
      "nav.themeLight": "Light",
      "nav.themeDark": "Dark",
      "nav.selectLang": "Language",
      "nav.openMenu": "Open Menu",
      "nav.closeMenu": "Close Menu",
      "nav.sidebarTitle": "Platform Sections",
      "nav.sidebarSubtitle": "Quick access to all campus services",
      "nav.homeLink": "Home (Activities & Services)",
      "nav.resourcesLink": "Exam Bank & Study Resources",
      "nav.booksLink": "Peer Book Lending & Exchange",
      "nav.scholarshipLink": "Annual Student Scholarship",
      "nav.facultyLink": "Faculty Directory & Office Hours",
      "nav.guidanceLink": "Academic Guidance Network",
      "nav.archiveLink": "Campus Events & Activities Archive",

      // Announcement & Hero
      "announcement.badge": "Announcement",
      "announcement.defaultText": "Applications are now open for the Al-Wafaa Club Annual Student Scholarship.",
      "announcement.btn": "Apply Now",
      "hero.tagline": "— By Students, For Students • Tyre Campus",
      "hero.titleLine1": "Everything You Need for Your Next",
      "hero.titleLine2": "Semester",
      "hero.titleHighlight": "in One Place.",
      "hero.description": "A comprehensive reference for LIU Tyre students: academic exam banks, peer book exchange, official faculty contacts, and direct academic mentoring.",
      "hero.activitiesBtn": "Campus Events & Activities",

      // Services Section
      "services.subtitle": "Student Services",
      "services.title": "What the Club Offers",
      "services.books.title": "Peer Book Lending",
      "services.books.desc": "A free exchange library for university textbooks and syllabi, with options to borrow or donate past semester materials on campus.",
      "services.books.link": "Request or Donate Books",
      "services.resources.title": "Exam Bank & Resources",
      "services.resources.desc": "A comprehensive and up-to-date repository of midterm and final exams, lecture slides, and course study summaries.",
      "services.resources.link": "Browse Academic Resources",
      "services.scholarship.title": "Student Scholarship",
      "services.scholarship.desc": "Al-Wafaa Club's annual initiative designed to ease university financial burdens and support deserving students.",
      "services.scholarship.link": "Scholarship Details & Form",
      "services.faculty.title": "Faculty Directory",
      "services.faculty.desc": "University emails, office locations, and real-time office hours tracker for all campus faculty members.",
      "services.faculty.link": "Explore Faculty Directory",
      "services.guidance.title": "Academic Mentors & Reps",
      "services.guidance.desc": "Major representatives and official WhatsApp academic groups offering course guidance and student advising.",
      "services.guidance.link": "Connect with Representatives",
      "services.archive.title": "Events & Activities Archive",
      "services.archive.desc": "Chronicles of professional workshops, specialized seminars, competitions, and student initiatives.",
      "services.archive.link": "View Events Log",

      // Philosophy & Quote
      "quote.text": "\"Al-Wafaa Club is a student-led organization at the Tyre Campus, bringing together our collective academic experience for future students: exams, books, and mentors who know the way.\"",
      "quote.author": "— Administrative Board, Al-Wafaa Club Tyre",

      // Activities Section
      "activities.subtitle": "Campus Life",
      "activities.title": "Campus Events & Activities",
      "activities.archiveBtn": "Full Activities Archive",
      "activities.empty": "No activities currently featured on the homepage.",
      "activities.details": "Details",
      "activities.recent": "Recent Event",
      "activities.photos": "Photos",

      // AI Assistant
      "ai.floatingBtn": "AI Assistant",
      "ai.windowTitle": "AI Academic Advisor",
      "ai.badgeModel": "Gemini Flash",
      "ai.statusConnected": "Online",
      "ai.quotaRemaining": "{count} queries remaining",
      "ai.greeting": "Welcome, fellow student! I am the official Al-Wafaa AI Academic Advisor for LIU Tyre Campus. Feel free to ask me anything about university regulations, GPA rules, campus services (exams, books, scholarships, professors), course explanations, or academic success tips.",
      "ai.inputPlaceholder": "Ask about courses, professors, GPA, or book loans...",
      "ai.listening": "Listening... Speak at your own pace without rushing",
      "ai.voiceTooltip": "Voice Input",
      "ai.sendTooltip": "Send Query",
      "ai.loading": "AI Assistant is analyzing your academic query...",

      // Footer
      "footer.tagline": "The official student and academic platform for LIU Tyre Campus. A hub for activities, resources, advising, and book exchange.",
      "footer.quickLinks": "Quick Links",
      "footer.about": "About Club & Campus",
      "footer.campus": "Lebanese International University — Tyre Campus",
      "footer.portal": "UMS Student Portal",
      "footer.rights": "All rights reserved © {year} Al-Wafaa Club — Tyre Campus."
    },

    fr: {
      // Navigation et Menu
      "nav.clubName": "Club Al-Wafaa",
      "nav.campusSubtitle": "Université Internationale Libanaise — Tyr",
      "nav.examBank": "Examens",
      "nav.books": "Livres",
      "nav.scholarship": "Bourse",
      "nav.faculty": "Professeurs",
      "nav.guidance": "Orientation",
      "nav.archive": "Archives",
      "nav.themeLight": "Clair",
      "nav.themeDark": "Sombre",
      "nav.selectLang": "Langue",
      "nav.openMenu": "Ouvrir le menu",
      "nav.closeMenu": "Fermer le menu",
      "nav.sidebarTitle": "Sections de la plateforme",
      "nav.sidebarSubtitle": "Accès rapide à tous les services du campus",
      "nav.homeLink": "Accueil (Activités & Services)",
      "nav.resourcesLink": "Banque d'Examens & Ressources",
      "nav.booksLink": "Prêt & Échange de Livres Étudiants",
      "nav.scholarshipLink": "Bourse Étudiante Annuelle",
      "nav.facultyLink": "Répertoire des Professeurs & Permanences",
      "nav.guidanceLink": "Réseau d'Orientation Académique",
      "nav.archiveLink": "Archives des Activités du Campus",

      // Annonce & Hero
      "announcement.badge": "Annonce",
      "announcement.defaultText": "Les candidatures sont ouvertes pour la bourse annuelle du Club Al-Wafaa.",
      "announcement.btn": "Postuler",
      "hero.tagline": "— Par les étudiants, pour les étudiants • Campus de Tyr",
      "hero.titleLine1": "Tout ce dont vous avez besoin pour",
      "hero.titleLine2": "votre prochain semestre",
      "hero.titleHighlight": "en un seul endroit.",
      "hero.description": "Une référence complète pour les étudiants de l'LIU Tyr : banque d'examens, échange de manuels scolaires, contacts des professeurs et mentorat académique direct.",
      "hero.activitiesBtn": "Événements & Activités du Campus",

      // Services du Club
      "services.subtitle": "Services aux Étudiants",
      "services.title": "Ce que le Club Propose",
      "services.books.title": "Prêt de Livres Papier",
      "services.books.desc": "Une bibliothèque d'échange gratuite de manuels scolaires et de références universitaires, avec possibilité d'emprunter ou de faire un don sur le campus.",
      "services.books.link": "Demander ou Donner un Livre",
      "services.resources.title": "Banque d'Examens & Ressources",
      "services.resources.desc": "Un recueil complet et actualisé des examens partiels et finaux, des diapositives de cours et des résumés académiques.",
      "services.resources.link": "Explorer les Ressources",
      "services.scholarship.title": "Bourse Étudiante",
      "services.scholarship.desc": "Initiative annuelle du Club Al-Wafaa pour alléger les charges universitaires et soutenir les étudiants méritants.",
      "services.scholarship.link": "Détails & Candidature",
      "services.faculty.title": "Répertoire des Professeurs",
      "services.faculty.desc": "Courriels universitaires, bureaux et suivi en direct des heures de permanence pour l'ensemble du corps professoral.",
      "services.faculty.link": "Consulter le Répertoire",
      "services.guidance.title": "Délégués & Orientation",
      "services.guidance.desc": "Délégués de spécialités et groupes WhatsApp officiels pour l'orientation académique et l'entraide pour les cours.",
      "services.guidance.link": "Contacter les Délégués",
      "services.archive.title": "Archives des Activités",
      "services.archive.desc": "Historique des ateliers spécialisés, séminaires de formation, concours et initiatives étudiantes organisés par le club.",
      "services.archive.link": "Consulter les Archives",

      // Philosophie & Citation
      "quote.text": "\"Le Club Al-Wafaa est une organisation étudiante dirigée par les étudiants du campus de Tyr, rassemblant nos acquis académiques pour les générations futures : examens, livres et mentors qui connaissent la voie.\"",
      "quote.author": "— Bureau Administratif, Club Al-Wafaa Tyr",

      // Activités
      "activities.subtitle": "Vie Universitaire",
      "activities.title": "Événements & Activités du Campus",
      "activities.archiveBtn": "Toutes les Activités",
      "activities.empty": "Aucune activité n'est affichée sur la page d'accueil pour le moment.",
      "activities.details": "Détails",
      "activities.recent": "Événement Récent",
      "activities.photos": "Photos",

      // Assistant IA
      "ai.floatingBtn": "Assistant IA",
      "ai.windowTitle": "Conseiller IA Académique",
      "ai.badgeModel": "Gemini Flash",
      "ai.statusConnected": "En ligne",
      "ai.quotaRemaining": "{count} requêtes restantes",
      "ai.greeting": "Bienvenue cher étudiant ! Je suis le conseiller académique IA officiel du Club Al-Wafaa à Tyr. Posez-moi vos questions sur les règlements universitaires, le calcul du GPA, les services de la plateforme (examens, livres, bourses, professeurs) ou des explications académiques.",
      "ai.inputPlaceholder": "Posez une question sur les cours, le GPA, les professeurs...",
      "ai.listening": "Écoute en cours... Parlez à votre rythme sans vous presser",
      "ai.voiceTooltip": "Parler au micro",
      "ai.sendTooltip": "Envoyer la question",
      "ai.loading": "L'assistant IA analyse votre demande académique...",

      // Pied de page
      "footer.tagline": "La plateforme étudiante et académique officielle du campus de Tyr. Carrefour d'activités, de ressources, d'orientation et d'échange de livres.",
      "footer.quickLinks": "Liens Rapides",
      "footer.about": "À Propos du Club",
      "footer.campus": "Université Internationale Libanaise — Campus de Tyr",
      "footer.portal": "Portail Étudiant UMS",
      "footer.rights": "Tous droits réservés © {year} Club Al-Wafaa — Campus de Tyr."
    }
  };

  // ==================== وظائف المحرك الأساسية ====================

  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function t(key, lang = null, params = {}) {
    const activeLang = lang || getCurrentLang();
    const dict = translations[activeLang] || translations[DEFAULT_LANG];
    let val = dict[key] || translations[DEFAULT_LANG][key] || key;

    for (const p in params) {
      val = val.replace(new RegExp(`{${p}}`, 'g'), params[p]);
    }
    return val;
  }

  function setLanguage(lang) {
    if (!translations[lang]) lang = DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, lang);

    const isRTL = (lang === 'ar');
    const html = document.documentElement;

    html.setAttribute('lang', lang);
    html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

    // تعديل الخط المعتمد
    if (isRTL) {
      document.body.style.fontFamily = "'Tajawal', sans-serif";
    } else {
      document.body.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    }

    // ترجمة جميع العناصر الحاملة لسمة data-i18n
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const translated = t(key, lang);
      if (translated) {
        el.innerHTML = translated;
      }
    });

    // ترجمة سمات الـ placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translated = t(key, lang);
      if (translated) {
        el.setAttribute('placeholder', translated);
      }
    });

    // ترجمة سمات الـ title
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      const translated = t(key, lang);
      if (translated) {
        el.setAttribute('title', translated);
      }
    });

    // تحديث أزرار عرض اللغة في الواجهة
    updateLanguageUI(lang);

    // تحديث الأيقونات
    if (window.lucide) {
      lucide.createIcons();
    }

    // إرسال حدث عام لتحديث أي مكونات ديناميكية أخرى
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  function updateLanguageUI(lang) {
    const currentLangLabel = document.getElementById('currentLangLabel');
    if (currentLangLabel) {
      currentLangLabel.textContent = lang === 'ar' ? 'العربية' : lang === 'en' ? 'English' : 'Français';
    }

    const currentLangCode = document.getElementById('currentLangCode');
    if (currentLangCode) {
      currentLangCode.textContent = lang.toUpperCase();
    }

    // تمييز اللغة المحددة في القوائم المنسدلة
    document.querySelectorAll('[data-set-lang]').forEach((btn) => {
      const targetLang = btn.getAttribute('data-set-lang');
      if (targetLang === lang) {
        btn.classList.add('bg-gold-500/15', 'text-gold-500', 'font-extrabold');
      } else {
        btn.classList.remove('bg-gold-500/15', 'text-gold-500', 'font-extrabold');
      }
    });
  }

  // الاستماع التلقائي للنقر على أي زر لاختيار اللغة
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-set-lang]');
    if (btn) {
      const targetLang = btn.getAttribute('data-set-lang');
      if (targetLang) {
        setLanguage(targetLang);
      }
    }
  });

  // ==================== إتاحة الدوال للبيئة العامة ====================
  window.i18n = {
    t: t,
    setLanguage: setLanguage,
    getCurrentLang: getCurrentLang,
    translations: translations
  };

  window.t = t;

  // تهيئة اللغة مباشرة عند بدء تحميل الـ DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setLanguage(getCurrentLang()));
  } else {
    setLanguage(getCurrentLang());
  }

})();
