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
      "ai.quotaRemaining": "{count} أسئلة متبقية",
      "ai.quotaReset": "يتجدد بعد {mins} د",
      "ai.quotaExhausted": "انتهى رصيد الجلسة (يتجدد بعد {mins} دقيقة)",
      "ai.greeting": "مرحباً بك زميلي الطالب! أنا مساعد AI الأكاديمي لنادي الوفاء في فرع صور. يمكنك سؤالي عن كل ما يخص الجامعة: اللوائح الأكاديمية ونظام الـ GPA، خدمات الموقع (الامتحانات، الكتب، المنح، والأساتذة)، أو حتى الاستفسار والشرح في مقرراتك الدراسية ونصائح التفوق.",
      "ai.inputPlaceholder": "اسأل الـ AI عن أي شيء تحتاجه...",
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
      "footer.rights": "جميع الحقوق محفوظة © {year} نادي الوفاء — فرع صور.",

      // مفاتيح الصفحات الفرعية
      "nav.theme": "المظهر",
      "resources.badge": "تحميل مجاني مباشر دون تسجيل",
      "resources.title": "امتحانات سابقة، ملخصات، وكتب. مجاناً.",
      "resources.desc": "ابحث باسم المادة، الرمز (Course Code)، أو الكلية للوصول المباشر إلى النماذج النصفية والنهائية السابقة، الكتب الرقمية، والملخصات المعتمدة.",
      "resources.searchPlaceholder": "ابحث باسم المادة أو الرمز (مثال: MATH 200, MECH, CSC, BIO, FIN)...",
      "resources.filterCategory": "التصنيف:",
      "resources.filterAll": "الكل",
      "resources.filterExam": "امتحانات سابقة",
      "resources.filterSummary": "ملخصات وسلايدات",
      "resources.filterBook": "كتب ومراجع",
      "resources.filterAssignment": "واجبات واختبارات",
      "resources.facultyEngineering": "الهندسة",
      "resources.facultyScience": "العلوم والحاسوب",
      "resources.facultyBusiness": "إدارة الأعمال",
      "resources.facultyPharmacy": "الصيدلة والطب",
      "resources.facultyEducation": "التربية واللغات",
      "resources.filterTerm": "الفصل:",
      "resources.termAll": "جميع الفصول",
      "resources.termFall": "خريف Fall",
      "resources.termSpring": "ربيع Spring",
      "resources.termSummer": "صيف Summer",
      "resources.fileBook": "كتاب / مرجع",
      "resources.filePdf": "PDF مستند",
      "resources.btnDownload": "تحميل",
      "resources.tooltipCopy": "نسخ رابط التحميل",
      "resources.noResultsTitle": "لم يتم العثور على أي ملفات مطابقة",
      "resources.noResultsDesc": "تأكد من كتابة اسم المادة أو رمزها بشكل صحيح، أو تواصل مع شبكة التوجيه لتوفيرها.",
      "resources.footer": "نادي الوفاء — الجامعة اللبنانية الدولية في صور • بنك الموارد الرقمية والامتحانات",

      "books.tabBorrow": "استعارة الكتب",
      "books.tabDonate": "التبرع بالكتب",
      "books.borrowTitle": "كتاب واحد، يمرّ على طلاب كثيرين.",
      "books.borrowDesc": "اختر الكتاب الذي تحتاجه واضغط على طلب استعارة، ثم أدخل بياناتك لتأكيد الحجز والاستلام داخل حرم الجامعة بفرع صور.",
      "books.searchPlaceholder": "ابحث بعنوان الكتاب، اسم المقرر، أو الكلية...",
      "books.availableBadge": "متوفر للاستعارة",
      "books.borrowedBadge": "تمت استعارته حالياً",
      "books.unavailableBtn": "غير متاح",
      "books.copiesAvailable": "النسخ المتاحة: {copies}",
      "books.returnsSoon": "يعود قريباً",
      "books.btnRequest": "طلب استعارة",
      "books.donateTitle": "تبرع بكتبك ودع زملاءك يستفيدون.",
      "books.donateDesc": "يمكنك التبرع بأي مراجع أو كتب مقررات انتهيت من دراستها ليقوم النادي بفهرستها وإعارتها للطلاب المحتاجين.",
      "books.footer": "نادي الوفاء — الجامعة اللبنانية الدولية في صور • منصة استعارة وتبادل الكتب",

      "scholarship.badge": "المنحة الطلابية السنوية",
      "scholarship.title": "نموذج التقديم الإلكتروني المباشر.",
      "scholarship.desc": "مبادرة سنوية يطلقها نادي الوفاء لدعم ومساعدة الطلاب المستحقين في الجامعة اللبنانية الدولية بفرع صور.",
      "scholarship.footer": "نادي الوفاء — الجامعة اللبنانية الدولية في صور • المنحة الطلابية السنوية",

      "faculty.badge": "الهيئة التعليمية والأكاديمية",
      "faculty.title": "دليل الأساتذة والساعات المكتبية.",
      "faculty.desc": "بيانات التواصل، البريد الإلكتروني الجامعي، أماكن المكاتب، ومتابعة فورية للساعات المكتبية لأساتذة الكليات بفرع صور.",
      "faculty.searchPlaceholder": "ابحث باسم الدكتور، الكلية، أو التخصص...",
      "faculty.filterAdmin": "الجهاز الإداري",
      "faculty.noResults": "لم يتم العثور على أي نتيجة مطابقة",
      "faculty.noResultsDesc": "تأكد من كتابة الاسم بدقة أو اختر كلية أخرى من الأعلى.",
      "faculty.footer": "نادي الوفاء — الجامعة اللبنانية الدولية في صور • دليل الأساتذة والساعات المكتبية",

      "guidance.badge": "الإرشاد والتوجيه الطلابي",
      "guidance.title": "شبكة التوجيه وممثلو الاختصاصات.",
      "guidance.desc": "تواصل مباشر مع ممثلي الكليات والاختصاصات ومجموعات الواتساب الرسمية للإرشاد وحل الاستفسارات الدراسية.",
      "guidance.groupsTitle": "مجموعات الدعم والإعلانات المركزية",
      "guidance.officialWhatsapp": "واتساب الرسمي",
      "guidance.loadingGroups": "جاري تحميل المجموعات...",
      "guidance.repsTitle": "ممثلو الاختصاصات للتواصل المباشر (واتساب)",
      "guidance.tyreCampus": "فرع صور",
      "guidance.loadingReps": "جاري تحميل شبكة التوجيه...",
      "guidance.footer": "نادي الوفاء — الجامعة اللبنانية الدولية في صور • شبكة التوجيه الأكاديمي",

      "archive.badge": "الميدان الجامعي والأنشطة",
      "archive.badgePhoto": "معرض الصور والتوثيق الميداني",
      "archive.title": "سجل المحطات الطلابية والأكاديمية.",
      "archive.desc": "هنا نخلد ذكريات وإنجازات نادي الوفاء في الجامعة اللبنانية الدولية - فرع صور.",
      "archive.searchPlaceholder": "ابحث باسم الفعالية، المكان أو الموضوع...",
      "archive.filterWorkshop": "ورش وتدريب",
      "archive.filterScientific": "معارض وندوات",
      "archive.filterService": "مبادرات وتطوع",
      "archive.filterHonoring": "ثقافي وتكريم",
      "archive.noResults": "لم يتم العثور على أي نشاط مطابق",
      "archive.noResultsDesc": "جرب البحث بكلمة أخرى أو اختر تصنيفاً مختلفاً من الأعلى.",
      "archive.footer": "نادي الوفاء — الجامعة اللبنانية الدولية في صور • أرشيف الفعاليات والأنشطة"
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
      "ai.quotaRemaining": "{count} questions remaining",
      "ai.quotaReset": "Renews in {mins}m",
      "ai.quotaExhausted": "Session quota exhausted (renews in {mins}m)",
      "ai.greeting": "Welcome, fellow student! I am the official Al-Wafaa AI Academic Advisor for LIU Tyre Campus. Feel free to ask me anything about university regulations, GPA rules, campus services (exams, books, scholarships, professors), course explanations, or academic success tips.",
      "ai.inputPlaceholder": "Ask AI anything you need...",
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
      "footer.rights": "All rights reserved © {year} Al-Wafaa Club — Tyre Campus.",

      // Secondary Pages Keys
      "nav.theme": "Theme",
      "resources.badge": "Direct Free Download • No Login Required",
      "resources.title": "Past Exams, Summaries & Books. Free.",
      "resources.desc": "Search by course title, code (e.g. MATH 200, MECH, CSC), or faculty for instant access to past exams, textbooks, and verified notes.",
      "resources.searchPlaceholder": "Search by course name or code (e.g., MATH 200, MECH, CSC, BIO, FIN)...",
      "resources.filterCategory": "Category:",
      "resources.filterAll": "All",
      "resources.filterExam": "Past Exams",
      "resources.filterSummary": "Summaries & Slides",
      "resources.filterBook": "Books & References",
      "resources.filterAssignment": "Assignments & Quizzes",
      "resources.facultyEngineering": "Engineering",
      "resources.facultyScience": "Arts & Sciences",
      "resources.facultyBusiness": "Business",
      "resources.facultyPharmacy": "Pharmacy & Medicine",
      "resources.facultyEducation": "Education & Languages",
      "resources.filterTerm": "Semester:",
      "resources.termAll": "All Semesters",
      "resources.termFall": "Fall Semester",
      "resources.termSpring": "Spring Semester",
      "resources.termSummer": "Summer Semester",
      "resources.fileBook": "Book / Reference",
      "resources.filePdf": "PDF Document",
      "resources.btnDownload": "Download",
      "resources.tooltipCopy": "Copy download link",
      "resources.noResultsTitle": "No Matching Files Found",
      "resources.noResultsDesc": "Make sure course title or code is typed correctly, or contact our student mentors to request the file.",
      "resources.footer": "Al-Wafaa Club — LIU Tyre Campus • Digital Resources & Exams Bank",

      "books.tabBorrow": "Borrow Books",
      "books.tabDonate": "Donate Books",
      "books.borrowTitle": "One Book, Passed Through Many Hands.",
      "books.borrowDesc": "Choose the textbook you need and click Request Book, then fill in your details to confirm pickup inside LIU Tyre campus.",
      "books.searchPlaceholder": "Search by book title, course, or faculty...",
      "books.availableBadge": "Available to Borrow",
      "books.borrowedBadge": "Currently Borrowed",
      "books.unavailableBtn": "Unavailable",
      "books.copiesAvailable": "Available copies: {copies}",
      "books.returnsSoon": "Returning soon",
      "books.btnRequest": "Request Book",
      "books.donateTitle": "Donate Your Books and Support Your Peers.",
      "books.donateDesc": "Donate any textbooks or course materials you completed so the club can catalog and lend them to fellow students in need.",
      "books.footer": "Al-Wafaa Club — LIU Tyre Campus • Peer Book Lending & Exchange",

      "scholarship.badge": "Annual Student Scholarship",
      "scholarship.title": "Direct Online Application Form.",
      "scholarship.desc": "An annual initiative launched by Al-Wafaa Club to ease university financial burdens and support deserving students at LIU Tyre.",
      "scholarship.footer": "Al-Wafaa Club — LIU Tyre Campus • Annual Student Scholarship",

      "faculty.badge": "Faculty & Academic Staff",
      "faculty.title": "Faculty Directory & Office Hours.",
      "faculty.desc": "Contact info, official university emails, office locations, and real-time office hours tracking for LIU Tyre professors.",
      "faculty.searchPlaceholder": "Search by professor name, faculty, or major...",
      "faculty.filterAdmin": "Administration",
      "faculty.noResults": "No matching faculty found",
      "faculty.noResultsDesc": "Please check the spelling or select another faculty above.",
      "faculty.footer": "Al-Wafaa Club — LIU Tyre Campus • Faculty Directory & Office Hours",

      "guidance.badge": "Student Academic Advising",
      "guidance.title": "Academic Mentors & Major Representatives.",
      "guidance.desc": "Direct connection with student major representatives and official WhatsApp academic mentoring groups.",
      "guidance.groupsTitle": "Central Announcements & Support Groups",
      "guidance.officialWhatsapp": "Official WhatsApp",
      "guidance.loadingGroups": "Loading support groups...",
      "guidance.repsTitle": "Major Representatives for Direct Contact",
      "guidance.tyreCampus": "Tyre Campus",
      "guidance.loadingReps": "Loading guidance network...",
      "guidance.footer": "Al-Wafaa Club — LIU Tyre Campus • Academic Guidance Network",

      "archive.badge": "Campus Life & Activities",
      "archive.badgePhoto": "Photo Gallery & Field Documentation",
      "archive.title": "Campus Events & Student Activities Archive.",
      "archive.desc": "Documenting student memories and achievements of Al-Wafaa Club at LIU Tyre.",
      "archive.searchPlaceholder": "Search by event title, venue, or topic...",
      "archive.filterWorkshop": "Workshops & Training",
      "archive.filterScientific": "Exhibitions & Seminars",
      "archive.filterService": "Volunteer & Initiatives",
      "archive.filterHonoring": "Cultural & Honors",
      "archive.noResults": "No matching events found",
      "archive.noResultsDesc": "Try another search term or choose a different category above.",
      "archive.footer": "Al-Wafaa Club — LIU Tyre Campus • Events & Activities Archive"
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
      "ai.quotaReset": "Renouvellement dans {mins}m",
      "ai.quotaExhausted": "Quota épuisé (renouvellement dans {mins}m)",
      "ai.greeting": "Bienvenue cher étudiant ! Je suis le conseiller académique IA officiel du Club Al-Wafaa à Tyr. Posez-moi vos questions sur les règlements universitaires, le calcul du GPA, les services de la plateforme (examens, livres, bourses, professeurs) ou des explications académiques.",
      "ai.inputPlaceholder": "Demandez à l'IA tout ce dont vous avez besoin...",
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
      "footer.rights": "Tous droits réservés © {year} Club Al-Wafaa — Campus de Tyr.",

      // Clés des Pages Secondaires
      "nav.theme": "Thème",
      "resources.badge": "Téléchargement Direct Gratuit • Sans Inscription",
      "resources.title": "Anciens Examens, Résumés & Livres. Gratuit.",
      "resources.desc": "Recherchez par nom de cours, code (ex: MATH 200, MECH, CSC) ou faculté pour un accès direct aux examens, manuels et résumés vérifiés.",
      "resources.searchPlaceholder": "Rechercher par cours ou code (ex: MATH 200, MECH, CSC, BIO, FIN)...",
      "resources.filterCategory": "Catégorie :",
      "resources.filterAll": "Tous",
      "resources.filterExam": "Anciens Examens",
      "resources.filterSummary": "Résumés & Diapositives",
      "resources.filterBook": "Livres & Références",
      "resources.filterAssignment": "Devoirs & Quiz",
      "resources.facultyEngineering": "Ingénierie",
      "resources.facultyScience": "Arts & Sciences",
      "resources.facultyBusiness": "Gestion & Affaires",
      "resources.facultyPharmacy": "Pharmacie & Santé",
      "resources.facultyEducation": "Éducation & Langues",
      "resources.filterTerm": "Semestre :",
      "resources.termAll": "Tous les Semestres",
      "resources.termFall": "Semestre d'Automne",
      "resources.termSpring": "Semestre de Printemps",
      "resources.termSummer": "Semestre d'Été",
      "resources.fileBook": "Livre / Référence",
      "resources.filePdf": "Document PDF",
      "resources.btnDownload": "Télécharger",
      "resources.tooltipCopy": "Copier le lien de téléchargement",
      "resources.noResultsTitle": "Aucun Fichier Correspondant",
      "resources.noResultsDesc": "Vérifiez l'orthographe du titre ou du code, ou contactez notre réseau d'orientation étudiante.",
      "resources.footer": "Club Al-Wafaa — LIU Tyr • Banque de Ressources Numériques & Examens",

      "books.tabBorrow": "Emprunter des livres",
      "books.tabDonate": "Donner des livres",
      "books.borrowTitle": "Un Livre, Partagé Entre de Nombreux Étudiants.",
      "books.borrowDesc": "Choisissez le manuel scolaire nécessaire et cliquez sur Demander le Livre pour confirmer le retrait au campus de Tyr.",
      "books.searchPlaceholder": "Rechercher par titre de livre, cours ou faculté...",
      "books.availableBadge": "Disponible à l'Emprunt",
      "books.borrowedBadge": "Actuellement Emprunté",
      "books.unavailableBtn": "Indisponible",
      "books.copiesAvailable": "Exemplaires dispo: {copies}",
      "books.returnsSoon": "Bientôt disponible",
      "books.btnRequest": "Demander l'Emprunt",
      "books.donateTitle": "Donnez Vos Livres et Soutenez Vos Camarades.",
      "books.donateDesc": "Faites don des manuels scolaires que vous avez terminés afin que le club puisse les répertorier et les prêter aux étudiants.",
      "books.footer": "Club Al-Wafaa — LIU Tyr • Prêt & Échange de Livres Étudiants",

      "scholarship.badge": "Bourse Étudiante Annuelle",
      "scholarship.title": "Formulaire de Candidature en Ligne Direct.",
      "scholarship.desc": "Une initiative annuelle lancée par le Club Al-Wafaa pour alléger les frais universitaires et soutenir les étudiants méritants de l'LIU Tyr.",
      "scholarship.footer": "Club Al-Wafaa — LIU Tyr • Bourse Étudiante Annuelle",

      "faculty.badge": "Corps Professoral & Académique",
      "faculty.title": "Annuaire des Professeurs & Permanences.",
      "faculty.desc": "Coordonnées, courriels universitaires, bureaux et suivi en direct des heures de permanence des professeurs de Tyr.",
      "faculty.searchPlaceholder": "Rechercher par nom de professeur, faculté ou filière...",
      "faculty.filterAdmin": "Administration",
      "faculty.noResults": "Aucun résultat correspondant trouvé",
      "faculty.noResultsDesc": "Veuillez vérifier l'orthographe ou sélectionner une autre faculté ci-dessus.",
      "faculty.footer": "Club Al-Wafaa — LIU Tyr • Annuaire des Professeurs & Permanences",

      "guidance.badge": "Orientation & Conseil Étudiant",
      "guidance.title": "Réseau d'Orientation & Délégués de Filières.",
      "guidance.desc": "Contact direct avec les délégués étudiants de filières et groupes WhatsApp officiels d'orientation académique.",
      "guidance.groupsTitle": "Groupes de Soutien & Annonces Centrales",
      "guidance.officialWhatsapp": "WhatsApp Officiel",
      "guidance.loadingGroups": "Chargement des groupes...",
      "guidance.repsTitle": "Délégués de Filières pour Contact Direct",
      "guidance.tyreCampus": "Campus de Tyr",
      "guidance.loadingReps": "Chargement du réseau d'orientation...",
      "guidance.footer": "Club Al-Wafaa — LIU Tyr • Réseau d'Orientation Académique",

      "archive.badge": "Vie Étudiante & Événements",
      "archive.badgePhoto": "Galerie Photos & Documentation de Terrain",
      "archive.title": "Archives des Événements & Activités Étudiantes.",
      "archive.desc": "Préservation des souvenirs et réalisations du Club Al-Wafaa à l'LIU Tyr.",
      "archive.searchPlaceholder": "Rechercher par titre, lieu ou sujet...",
      "archive.filterWorkshop": "Ateliers & Formations",
      "archive.filterScientific": "Expositions & Séminaires",
      "archive.filterService": "Initiatives & Bénévolat",
      "archive.filterHonoring": "Culture & Hommages",
      "archive.noResults": "Aucun événement correspondant trouvé",
      "archive.noResultsDesc": "Essayez un autre mot-clé ou sélectionnez une catégorie différente ci-dessus.",
      "archive.footer": "Club Al-Wafaa — LIU Tyr • Archives des Événements & Activités"
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

    const langMenu = document.getElementById('langDropdownMenu');
    if (langMenu) langMenu.classList.add('hidden');

    // إزالة فئة الحماية من الوميض لإظهار المحتوى المترجم فوراً
    document.documentElement.classList.remove('i18n-loading');

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

    // تمييز اللغة المحددة في القوائم المنسدلة والقوائم الجانبية
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

  // إدارة فتح وإغلاق القائمة المنسدلة لاختيار اللغة بشكل موحد وموثوق
  function setupLangDropdown() {
    const btn = document.getElementById('langDropdownBtn');
    const menu = document.getElementById('langDropdownMenu');
    if (!btn || !menu) return;

    btn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.toggle('hidden');
    };
  }

  // إغلاق قائمة اللغات المنسدلة تلقائياً عند النقر في أي مكان خارجها
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('langDropdownMenu');
    const btn = document.getElementById('langDropdownBtn');
    if (!menu || menu.classList.contains('hidden')) return;

    if (btn && btn.contains(e.target)) return;
    if (menu.contains(e.target)) return;

    menu.classList.add('hidden');
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
    document.addEventListener('DOMContentLoaded', () => {
      setLanguage(getCurrentLang());
      setupLangDropdown();
    });
  } else {
    setLanguage(getCurrentLang());
    setupLangDropdown();
  }

})();
