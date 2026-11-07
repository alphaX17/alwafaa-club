/**
 * =========================================================================
 * منصة نادي الوفاء - المساعد الأكاديمي والطلابي الذكي (AI Assistant Module)
 * الجامعة اللبنانية الدولية (LIU) - فرع صور
 * =========================================================================
 * هذا الملف مستقل بالكامل، يدير:
 * 1. واجهة المحادثة والتفاعل (فتح/إغلاق، النافذة المنبثقة، تأثيرات السكرول).
 * 2. نظام الحصص وإدارة الاستهلاك العادل (Rate Limiter: 12 استفساراً / 60 دقيقة).
 * 3. الاتصال الآمن بسيرفر الموقع السحابي (Google Apps Script Backend Proxy).
 * 4. التعرف الصوتي المباشر باللغة العربية (Speech Recognition).
 * 5. تنسيق الردود الذكية وعرض الروابط التفاعلية المباشرة.
 * =========================================================================
 */

(function () {
  'use strict';

  // الرابط السحابي المعتمد لـ Backend نادي الوفاء
  const BACKEND_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby2S217Wuobe1xxvIzMFJM9tgxbIqh6gPbMA7b7V-fZGMr0S-3x3vfGpp6ZqE7I77kWqA/exec";

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

  function closeChat() {
    if (chatWindow) chatWindow.classList.add('hidden');
    if (chatBackdrop) chatBackdrop.classList.add('hidden');
    stopVoiceRecognition();
  }

  function formatBotReply(rawText) {
    const escapeDiv = document.createElement('div');
    escapeDiv.textContent = rawText;
    let text = escapeDiv.innerHTML;

    // تحويل الروابط الكاملة
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

    // إضافة استفسار المستخدم لسياق الجلسة
    chatHistory.push({
      role: "user",
      parts: [{ text: userPrompt }]
    });

    if (chatHistory.length > 10) {
      chatHistory = chatHistory.slice(-10);
    }

    try {
      // إرسال الطلب بشكل آمن ومباشر إلى Google Apps Script Backend Proxy
      const response = await fetch(BACKEND_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          action: "ask_ai",
          prompt: userPrompt,
          history: chatHistory
        })
      });

      const loading = document.getElementById('aiLoading');
      if (loading) loading.remove();

      const data = await response.json();

      if (data && data.status === "success" && data.reply) {
        addMessage(data.reply, false);
        chatHistory.push({
          role: "model",
          parts: [{ text: data.reply }]
        });
      } else {
        chatHistory.pop();
        const errMessage = (data && data.message) 
          ? data.message 
          : "تعذر الاتصال بالمساعد الذكي في الوقت الحالي. يرجى تكرار المحاولة بعد لحظات.";
        addMessage(errMessage, false);
      }
    } catch (networkError) {
      console.error("AI Backend Network Error:", networkError);
      const loading = document.getElementById('aiLoading');
      if (loading) loading.remove();
      chatHistory.pop();
      addMessage("تعذر الاتصال بخادم النادي السحابي. يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة.", false);
    } finally {
      isAIBusy = false;
      if (chatInput) {
        chatInput.disabled = false;
        if (window.innerWidth >= 640) chatInput.focus();
      }
      if (sendBtn) sendBtn.disabled = false;
    }
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

  // تشغيل عند جاهزية مستند الـ DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
