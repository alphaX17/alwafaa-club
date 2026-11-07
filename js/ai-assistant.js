/**
 * =========================================================================
 * منصة نادي الوفاء - المساعد الأكاديمي والطلابي الذكي (AI Assistant Module)
 * الجامعة اللبنانية الدولية (LIU) - فرع صور
 * =========================================================================
 * هذا الملف مستقل بالكامل، يدير:
 * 1. واجهة المحادثة والتفاعل (فتح/إغلاق، النافذة المنبثقة، تأثيرات السكرول).
 * 2. نظام الحصص وإدارة الاستهلاك العادل (Rate Limiter: 12 استفساراً / 60 دقيقة).
 * 3. الاتصال الذكي بنموذج Google Gemini وتقديم الدعم الأكاديمي الشامل.
 * 4. التعرف الصوتي المباشر باللغة العربية (Speech Recognition).
 * 5. موسوعة التوجيه الأكاديمي وأنظمة الجامعة ولوائح الـ GPA.
 * =========================================================================
 */

(function () {
  'use strict';

  // الرابط السحابي المعتمد لـ Backend نادي الوفاء
  const BACKEND_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby2S217Wuobe1xxvIzMFJM9tgxbIqh6gPbMA7b7V-fZGMr0S-3x3vfGpp6ZqE7I77kWqA/exec";

  // مفتاح Gemini الاحتياطي للاتصال المباشر
  const DIRECT_GEMINI_KEY = "AQ.Ab8RN6IVXwgyoQifvEBwkTH8FvkPW0u0TPes4vwJ41XtNSrY6A";

  // ==================== نظام الحصة وإدارة استهلاك الجلسة ====================
  const MAX_SESSION_QUESTIONS = 12;
  const QUOTA_WINDOW_MS = 60 * 60 * 1000; // 60 دقيقة
  const QUOTA_STORAGE_KEY = 'nadi_ai_session_quota';

  let chatHistory = [];
  let isAIBusy = false;
  let recognition = null;
  let isRecording = false;

  // عناصر واجهة المستخدم
  let toggleChatBtn = null;
  let closeChatBtn = null;
  let chatWindow = null;
  let chatBackdrop = null;
  let chatForm = null;
  let chatInput = null;
  let chatMessages = null;
  let voiceBtn = null;
  let sendBtn = null;
  let aiQuotaBadge = null;

  function getQuotaState() {
    try {
      const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.count === 'number' && parsed.resetAt) {
          if (Date.now() < parsed.resetAt) {
            return parsed;
          }
        }
      }
    } catch (e) {}

    const newState = {
      count: MAX_SESSION_QUESTIONS,
      resetAt: Date.now() + QUOTA_WINDOW_MS
    };
    saveQuotaState(newState);
    return newState;
  }

  function saveQuotaState(state) {
    try {
      localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function updateQuotaUI() {
    const state = getQuotaState();
    if (!aiQuotaBadge) {
      aiQuotaBadge = document.getElementById('aiQuotaBadge');
    }

    if (aiQuotaBadge) {
      if (state.count <= 0) {
        const remainingMins = Math.max(1, Math.ceil((state.resetAt - Date.now()) / 60000));
        aiQuotaBadge.textContent = `يتجدد بعد ${remainingMins} د`;
        aiQuotaBadge.className = 'text-rose-500 font-bold font-mono';
      } else {
        aiQuotaBadge.textContent = `${state.count} أسئلة متبقية`;
        aiQuotaBadge.className = state.count <= 3
          ? 'text-amber-500 font-bold font-mono'
          : 'text-gold-600 dark:text-gold-400 font-bold font-mono';
      }
    }

    if (chatInput && !isAIBusy) {
      if (state.count <= 0) {
        const remainingMins = Math.max(1, Math.ceil((state.resetAt - Date.now()) / 60000));
        chatInput.placeholder = `انتهى رصيد الجلسة (يتجدد بعد ${remainingMins} دقيقة)`;
      } else {
        chatInput.placeholder = 'اسألني عن المواد، الدكاترة، الـ GPA، أو الاستعارة...';
      }
    }
  }

  function consumeQuota() {
    const state = getQuotaState();
    if (state.count > 0) {
      state.count -= 1;
      saveQuotaState(state);
      updateQuotaUI();
      return true;
    }
    return false;
  }

  // ==================== موسوعة التوجيه الأكاديمي والجامعي الفائقة ====================
  const SYSTEM_INSTRUCTION = `
أنت "مساعد AI الأكاديمي والطلابي الرسمي" لمنصة "نادي الوفاء" في الجامعة اللبنانية الدولية (LIU) - فرع صور.
أنت ذكاء اصطناعي أكاديمي متقدم، ذكي جداً، واسع الاطلاع، ولطيف وداعم لكل طالب يسعى للنجاح والتفوق.

دورك ورسالتك الأساسية:
1. إرشاد الطلاب في كل ما يخص موقع ومنصة نادي الوفاء وخدماته المباشرة وتوفير روابط سريعة للصفحات.
2. الإجابة بدقة واحترافية عن جميع لوائح وقوانين الجامعة اللبنانية الدولية (فرع صور)، ونظام المعدل التراكمي (GPA)، والتسجيل، والامتحانات، والمشاكل الطلابية.
3. تقديم الدعم الأكاديمي والدراسي العام: شرح المفاهيم العلمية والبرمجية، كتابة مسودات الإيميلات الرسمية للأساتذة والإدارة، نصائح المذاكرة والاستعداد للفحوصات، وحل المعضلات الدراسية بروح إيجابية مشجعة وعالية الذكاء.

أولاً: خدمات نادي الوفاء وروابط المنصة المباشرة:
- بنك الامتحانات والموارد (resources.html): تحميل مباشر مجاني لنماذج الامتحانات النصفية (Midterms) والنهائية (Finals) والسلايدات والملخصات لجميع المقررات دون تسجيل دخول.
- استعارة وتبادل الكتب (books.html): حجز استعارة المراجع الورقية المتاحة بالمكتبة أو التبرع بالكتب القديمة مع الاستلام داخل حرم الجامعة بفرع صور.
- المنحة الطلابية السنوية (scholarship.html): تقديم إلكتروني مباشر لمبادرة تخفيف الأعباء الجامعية ومساعدة الطلاب المستحقين.
- دليل الأساتذة (faculty.html): إيميلات الدكاترة، أرقام المكاتب، ومتابعة الساعات المكتبية لحظياً مع إمكانية المراسلة أو نسخ الإيميل بضغطة زر.
- شبكة التوجيه وممثلو الاختصاصات (guidance.html): ممثلو الاختصاصات ومجموعات الواتساب الرسمية للتوجيه الأكاديمي المباشر.
- أرشيف الفعاليات (archive.html): معرض الصور والأنشطة والورش التدريبية التي ينظمها النادي.
* قاعدة هامة: عند توجيه الطالب لأي خدمة، ضع دائماً اسم الصفحة كاسم ملف إنجليزي (مثل: resources.html أو books.html) ليتحول تلقائياً إلى رابط مباشر يضغط عليه الطالب.

ثانياً: لوائح وقوانين جامعة LIU الأكاديمية الرسمية:
1. نظام المعدل التراكمي (GPA من 4.00):
   - السلم: A=4.0, B+=3.5, B=3.0, C+=2.5, C=2.0, D+=1.5, D=1.0, F=0.0.
   - الإنذار الأكاديمي (Academic Probation): يقع الطالب تحته إذا انخفض الـ CGPA عن 2.00/4.00.
   - طريقة رفع المعدل الأسرع: إعادة المواد ذات العلامات (D أو D+ أو F) لأن العلامة الجديدة تمحو وتستبدل القديمة تماماً من حساب المعدل التراكمي.
   - لائحة الشرف (Dean's Honor List): تتطلب فصلاً دراسياً لا يقل عن 15 رصيداً بمعدل فصلي 3.50 فما فوق دون أي رسوب.
2. سقف الساعات (Credit Limits):
   - الفصل العادي (خريف / ربيع): الأدنى 12 رصيداً، الأقصى الطبيعي 18-19 رصيداً. يُسمح حتى 21 رصيداً (Overload) فقط لمن معدله 3.00 فما فوق أو للخريج في فصل تخرجه الفعلي عبر عريضة رسمية (Petition).
   - الفصل الصيفي (Summer): الحد الأقصى 6 إلى 9 أرصدة فقط.
3. الغيابات والحرمان (FA):
   - الحد الأقصى المسموح للغياب هو 15% من ساعات المقرر (3 غيابات فقط للمادة التي تُعطى مرتين أسبوعياً). الغياب الرابع = صدور حرمان برسوب بعلامة FA (تُحسب كصفر نقطة وتدمر الـ GPA).
4. السحب والإضافة (Drop & Add) والانسحاب (W):
   - السحب والإضافة: خلال الأسبوع الأول من الفصل فقط؛ تُعدل أو تُسقط المواد دون غرامة ودون أثر أكاديمي.
   - الانسحاب المتأخر (W): متاح حتى منتصف الفصل تقريباً، لا يؤثر على المعدل نهائياً لكن رسومها المالية لا تُسترد.
5. العرائض والالتماسات (Petitions):
   - تُقدم إلكترونياً عبر بوابة UMS أو عمادة الكلية بفرع صور للحالات التالية: فتح مقعد في شعبة مغلقة، تسجيل مادة متزامنة مع متطلبها السابق في فصل التخرج، طلب إعادة امتحان تغيب عنه الطالب بعذر طبي رسمي، أو طلب سقف ساعات إضافي (Overload).
6. المكاتب والتواصل بفرع صور:
   - الدائرة المالية: مكتب الأستاذة غيا السمرة (gheya.elsamra@liu.edu.lb) للأقساط وبراءات الذمة.
   - المكتبة الجامعية: تشرف عليها الأستاذة هبة حمود (hiba.hammoud@liu.edu.lb) للمطالعة والمراجع.
   - منسقو الأقسام: د. هادي نور الدين (كمبيوتر)، د. علي أبو خليل (كهرباء)، د. علي حلال ود. حسن جابر (ميكانيك)، د. إحسان عساكري (علوم طبية).
   - مجموعة الإعلانات المركزية: https://chat.whatsapp.com/H5Gvs4LV3OaH7NQsuJpYFx
   - مجموعة التوجيه الطلابي: https://chat.whatsapp.com/Kdt9QVnMsmW2GguggFDuvs

ثالثاً: الدعم الأكاديمي والشرح العلمي الشامل:
- إذا سألك الطالب عن مفهوم دراسي أو علمي (مثل: البرمجة بلغات Python أو C++ أو Java أو تقنيات الويب وقواعد البيانات، أو الرياضيات والتفاضل والتكامل، أو الفيزياء، أو المحاسبة وإدارة الأعمال):
  * اشرح له المفاهيم بذكاء ووضوح عالٍ، مع تقديم أمثلة سهلة وتوضيح الخطوات المنطقية.
- إذا طلب نصائح لتنظيم الوقت أو الاستعداد للامتحانات أو التعامل مع الضغط الدراسي:
  * قدّم له نصائح عملية، منهجية، ومثبتة علمياً بأسلوب تحفيزي راقٍ.
- إذا طلب صياغة إيميل رسمي لدكتور أو للإدارة:
  * اكتب له الإيميل جاهزاً بصيغة أكاديمية محترمة ومهنية (بالعربية أو الإنجليزية حسب طلبه).

رابعاً: أسلوب الرد والضوابط (Tone & Guardrails):
- الالتزام التام بسياسة خلو المنصة من الإيموجيز المشوهة (Zero Emojis Policy) - استخدم التنسيق النصي الراقي.
- نسّق إجاباتك بتنسيق Markdown أنيق ومريح للقراءة (استخدم العناوين، النقاط المرقمة، والخط العريض للمصطلحات).
- كن مرناً وذكياً، ولا ترفض أي استفسار دراسي أو جامعي أو علمي مفيد. الرفض اللطيف يكون حصراً في حال طُرحت مواضيع مسيئة تماماً أو سياسية أو خارجة عن إطار الأخلاقيات والآداب العامة.
`;

  function closeChat() {
    if (chatWindow) chatWindow.classList.add('hidden');
    if (chatBackdrop) chatBackdrop.classList.add('hidden');
    stopVoiceRecognition();
  }

  function formatBotReply(rawText) {
    const escapeDiv = document.createElement('div');
    escapeDiv.textContent = rawText;
    let text = escapeDiv.innerHTML;

    // تحويل الروابط
    text = text.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-gold-500 hover:underline font-bold break-all">$1</a>');
    // تحويل الإيميلات
    text = text.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g, '<a href="mailto:$1" class="text-gold-500 hover:underline font-bold">$1</a>');
    // تحويل أسماء صفحات الموقع إلى روابط داخلية مباشرة
    text = text.replace(/\b(resources\.html|books\.html|scholarship\.html|faculty\.html|guidance\.html|archive\.html)\b/g, '<a href="$1" class="text-gold-500 underline font-bold hover:opacity-80">$1</a>');
    // تنسيق العناوين العريضة
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // الأسطر الجديدة
    text = text.replace(/\n/g, '<br>');

    return text;
  }

  function addMessage(text, isUser = false) {
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = isUser ? 'flex justify-end' : 'flex items-start gap-2 max-w-[90%]';

    const content = document.createElement('div');
    content.className = isUser
      ? 'p-3 rounded-2xl rounded-tl-none bg-clubNavy-light dark:bg-gold-500 text-white dark:text-slate-950 font-medium text-xs leading-relaxed'
      : 'p-3 rounded-2xl rounded-tr-none bg-slate-100 dark:bg-[#131e3a] text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800 text-xs leading-relaxed';

    if (isUser) {
      content.textContent = text;
    } else {
      content.innerHTML = formatBotReply(text);
    }

    msgDiv.appendChild(content);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
  }

  function getFriendlyFallbackResponse(text) {
    const q = text.toLowerCase().trim();

    if (q.includes('غيا') || q.includes('سمرة') || q.includes('مالية') || q.includes('قسط')) {
      return 'الدائرة المالية في فرع صور تشرف عليها الأستاذة غيا السمرة: gheya.elsamra@liu.edu.lb لمتابعة الأقساط وبراءات الذمة المالية.';
    }
    if (q.includes('هبة') || q.includes('حمود') || q.includes('مكتبة')) {
      return 'المكتبة العامة في حرم فرع صور تشرف عليها الأستاذة هبة حمود: hiba.hammoud@liu.edu.lb وتوفر قاعات المطالعة والمراجع الأكاديمية.';
    }
    if (q.includes('منحة') || q.includes('حسم')) {
      return 'للتقديم على المنحة الطلابية السنوية: تفضل بزيارة صفحة scholarship.html واملأ الاستمارة الإلكترونية مباشرة.';
    }
    if (q.includes('كتاب') || q.includes('استعارة') || q.includes('تبرع')) {
      return 'لحجز استعارة كتاب ورقي أو التبرع به لمكتبة النادي: تفضل بزيارة صفحة books.html وسيتواصل معك فريق النادي للتسليم داخل الحرم الجامعي.';
    }
    if (q.includes('امتحان') || q.includes('دورات') || q.includes('سلايد') || q.includes('ملخص')) {
      return 'نماذج الامتحانات السابقة والسلايدات متوفرة للتحميل المباشر والمجاني في صفحة بنك الموارد: resources.html.';
    }
    if (q.includes('أستاذ') || q.includes('دكتور') || q.includes('مكتب') || q.includes('ساعات مكتبية')) {
      return 'عناوين التواصل والساعات المكتبية لجميع دكاترة الكليات متوفرة في دليل الأساتذة: faculty.html.';
    }
    if (q.includes('توجيه') || q.includes('ممثل') || q.includes('واتساب') || q.includes('جروب')) {
      return 'روابط مجموعات الواتساب الرسمية وأرقام مسؤولي الاختصاصات للتواصل المباشر تجدها في صفحة: guidance.html.';
    }
    if (q.includes('معدل') || q.includes('gpa') || q.includes('إنذار')) {
      return 'المعدل التراكمي في جامعة LIU يُحسب من 4.00. يقع الطالب تحت الإنذار الأكاديمي إذا انخفض المعدل عن 2.00، وأسرع وسيلة لرفعه هي إعادة المواد التي نال فيها علامة D أو F لأن درجتها الجديدة تستبدل السابقة كلياً.';
    }

    return 'عذراً زميلي الطالب، يبدو أن هناك ضغطاً مؤقتاً على خوادم الذكاء الاصطناعي المجانية. تفضل بتكرار سؤالك بعد ثوانٍ قليلة، أو استعرض خدمات الموقع المباشرة (resources.html، books.html، faculty.html).';
  }

  async function queryAI(userPrompt) {
    if (isAIBusy) return;

    // 1. فحص الحصة المتبقية للجلسة
    const quotaState = getQuotaState();
    if (quotaState.count <= 0) {
      const remainingMins = Math.max(1, Math.ceil((quotaState.resetAt - Date.now()) / 60000));
      addMessage(`وصلت إلى الحد الأقصى للاستفسارات في هذه الجلسة (${MAX_SESSION_QUESTIONS} استفساراً).\n\nسيتجدد رصيدك تلقائياً خلال **${remainingMins} دقيقة** حرصاً على إتاحة خدمة الذكاء الاصطناعي لجميع الطلاب بالتساوي.\n\nيمكنك في هذه الأثناء مراجعة صفحات الموقع أو التواصل المباشر مع ممثلي الاختصاصات في صفحة guidance.html.`, false);
      return;
    }

    // 2. استهلاك سؤال من الحصة وتحديث الواجهة
    consumeQuota();
    isAIBusy = true;
    if (chatInput) chatInput.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'aiLoading';
    loadingDiv.className = 'flex items-center gap-2 max-w-[90%] text-slate-400 text-[11px] p-2';
    loadingDiv.innerHTML = `
      <span class="inline-block w-2 h-2 rounded-full bg-gold-500 animate-ping"></span>
      <span>مساعد AI يحلل الاستفسار الأكاديمي...</span>
    `;
    if (chatMessages) {
      chatMessages.appendChild(loadingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatHistory.push({
      role: "user",
      parts: [{ text: userPrompt }]
    });

    if (chatHistory.length > 10) {
      chatHistory = chatHistory.slice(-10);
    }

    let botReply = '';

    // محاولة الاتصال بالذكاء الاصطناعي
    try {
      // الاستراتيجية: اتصال مباشر بنموذج Gemini
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${encodeURIComponent(DIRECT_GEMINI_KEY)}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents: chatHistory,
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 2048
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.candidates && data.candidates[0]?.content?.parts) {
        botReply = data.candidates[0].content.parts.map(p => p.text || '').join('').trim();
      } else {
        console.warn("Direct Gemini unavailable, attempting fallback. Error:", data);
      }
    } catch (netErr) {
      console.warn("Direct fetch error:", netErr);
    }

    const loading = document.getElementById('aiLoading');
    if (loading) loading.remove();

    if (botReply) {
      addMessage(botReply, false);
      chatHistory.push({
        role: "model",
        parts: [{ text: botReply }]
      });
    } else {
      chatHistory.pop();
      const fallback = getFriendlyFallbackResponse(userPrompt);
      addMessage(fallback, false);
    }

    isAIBusy = false;
    if (chatInput) {
      chatInput.disabled = false;
      if (window.innerWidth >= 640) chatInput.focus();
    }
    if (sendBtn) sendBtn.disabled = false;
  }

  // ==================== ميزة التحدث الصوتي ====================
  function initVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'ar-LB';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        isRecording = true;
        if (voiceBtn) {
          voiceBtn.classList.add('bg-rose-500', 'text-white', 'animate-pulse');
          voiceBtn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        }
        if (chatInput) chatInput.placeholder = 'جارٍ الاستماع إليك... تحدث الآن';
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (chatInput) {
          chatInput.value = transcript;
          if (transcript.trim() && chatForm) {
            setTimeout(() => {
              chatForm.dispatchEvent(new Event('submit'));
            }, 400);
          }
        }
      };

      recognition.onerror = () => {
        stopVoiceRecognition();
      };

      recognition.onend = () => {
        stopVoiceRecognition();
      };
    } else {
      if (voiceBtn) voiceBtn.style.display = 'none';
    }
  }

  function stopVoiceRecognition() {
    if (recognition && isRecording) {
      try { recognition.stop(); } catch (e) {}
    }
    isRecording = false;
    if (voiceBtn) {
      voiceBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
      voiceBtn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
    }
    if (chatInput) {
      chatInput.placeholder = 'اسألني عن المواد، الدكاترة، الـ GPA، أو الاستعارة...';
    }
  }

  // ==================== التهيئة وتعيين المستمعات ====================
  function init() {
    toggleChatBtn = document.getElementById('toggleChatBtn');
    closeChatBtn = document.getElementById('closeChatBtn');
    chatWindow = document.getElementById('chatWindow');
    chatBackdrop = document.getElementById('chatBackdrop');
    chatForm = document.getElementById('chatForm');
    chatInput = document.getElementById('chatInput');
    chatMessages = document.getElementById('chatMessages');
    voiceBtn = document.getElementById('voiceBtn');
    sendBtn = document.getElementById('sendBtn');
    aiQuotaBadge = document.getElementById('aiQuotaBadge');

    updateQuotaUI();
    initVoiceRecognition();

    if (toggleChatBtn && chatWindow) {
      toggleChatBtn.addEventListener('click', () => {
        const isOpening = chatWindow.classList.contains('hidden');
        chatWindow.classList.toggle('hidden');
        if (chatBackdrop) chatBackdrop.classList.toggle('hidden', !isOpening);

        if (isOpening) {
          updateQuotaUI();
          if (window.innerWidth >= 640 && chatInput) {
            chatInput.focus();
          }
          if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }
        } else {
          stopVoiceRecognition();
        }
      });
    }

    if (closeChatBtn) closeChatBtn.addEventListener('click', closeChat);
    if (chatBackdrop) chatBackdrop.addEventListener('click', closeChat);

    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userText = chatInput.value.trim();
        if (!userText || isAIBusy) return;

        addMessage(userText, true);
        chatInput.value = '';
        stopVoiceRecognition();
        queryAI(userText);
      });
    }

    if (voiceBtn && recognition) {
      voiceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isRecording) {
          try {
            if (chatInput) chatInput.value = '';
            recognition.start();
          } catch (err) {
            stopVoiceRecognition();
          }
        } else {
          stopVoiceRecognition();
        }
      });
    }
  }

  // تشغيل عند تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
