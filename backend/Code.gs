function testAuth() {
  UrlFetchApp.fetch("https://www.google.com");
}
// =========================================================================
// منظومة نادي الوفاء - فرع صور (Google Apps Script Backend الكامل والشامل)
// =========================================================================

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toLocaleString("ar-LB", { timeZone: "Asia/Beirut" });

    // =====================================================================
    // 0. فحص حقل فخ الروبوتات (Honeypot) - إحباط فوري دون استهلاك موارد الخادم
    // =====================================================================
    if (data.honeypot && String(data.honeypot).trim() !== "") {
      return createJsonResponse({ status: "success", message: "Accepted" });
    }

    // =====================================================================
    // 0.1 بوابة مساعد الذكاء الاصطناعي الأكاديمي والطلابي (Gemini AI Proxy)
    // =====================================================================
    if (data.action === "ask_ai") {
      var userPrompt = String(data.prompt || "").trim();
      if (!userPrompt) {
        return createJsonResponse({ status: "error", message: "الرجاء إدخال استفسار أكاديمي صالح." });
      }

      // المفتاح المعتمد للذكاء الاصطناعي
      var apiKey = "AQ.Ab8RN6IvWik3BwTeS6_dy8EUqohIeZr16IbDjhxdhLhLKd3YyQ";

      // بناء سياق وتاريخ المحادثة
      var history = Array.isArray(data.history) ? data.history : [];
      var contents = [];

      for (var h = 0; h < history.length; h++) {
        var item = history[h];
        if (item && item.role && item.parts && Array.isArray(item.parts)) {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: item.parts
          });
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: userPrompt }]
      });

      if (contents.length > 10) {
        contents = contents.slice(-10);
      }

      var systemInstructionText = "أنت مساعد AI الأكاديمي والطلابي الرسمي لمنصة نادي الوفاء في الجامعة اللبنانية الدولية (LIU) - فرع صور.\n" +
        "أنت ذكاء اصطناعي أكاديمي متقدم، ذكي جداً، واسع الاطلاع، ولطيف وداعم لكل طالب يسعى للنجاح والتفوق.\n" +
        "أولاً: خدمات نادي الوفاء وروابط المنصة المباشرة:\n" +
        "- بنك الامتحانات والموارد (resources.html): تحميل مباشر مجاني لنماذج الامتحانات والسلايدات والملخصات دون تسجيل.\n" +
        "- استعارة وتبادل الكتب (books.html): حجز استعارة المراجع الورقية أو التبرع بها مع الاستلام داخل حرم الجامعة بفرع صور.\n" +
        "- المنحة الطلابية السنوية (scholarship.html): تقديم إلكتروني مباشر لمساعدة الطلاب المستحقين.\n" +
        "- دليل الأساتذة (faculty.html): إيميلات الدكاترة ومتابعة الساعات المكتبية لحظياً.\n" +
        "- شبكة التوجيه وممثلو الاختصاصات (guidance.html): أرقام ممثلي الاختصاصات ومجموعات الواتساب الرسمية.\n" +
        "- أرشيف الفعاليات (archive.html): معرض أنشطة وورش النادي.\n" +
        "قاعدة هامة: عند توجيه الطالب لأي خدمة، ضع دائماً اسم الصفحة كاسم ملف إنجليزي (مثل: resources.html) ليتحول تلقائياً إلى رابط مباشر.\n" +
        "ثانياً: لوائح وقوانين جامعة LIU (فرع صور):\n" +
        "- نظام المعدل التراكمي (GPA من 4.00): السلم A=4.0, B+=3.5, B=3.0, C+=2.5, C=2.0, D+=1.5, D=1.0, F=0.0. الإنذار الأكاديمي يقع إذا انخفض المعدل عن 2.00. أسرع وسيلة لرفعه هي إعادة المواد ذات العلامات (D, D+, F) لأن الجديدة تمحو القديمة تماماً.\n" +
        "- سقف الساعات: 12 كحد أدنى بالفصل العادي، و18-19 كحد أقصى طبيعي. يسمح حتى 21 رصيداً (Overload) فقط لمن معدله 3.00 فما فوق أو للخريج بعريضة. الفصل الصيفي 6 إلى 9 أرصدة.\n" +
        "- الغيابات والحرمان (FA): الحد الأقصى 15% (3 غيابات للمادة التي تُعطى مرتين أسبوعياً). الغياب الرابع = رسوب بحرمان FA (صفر نقطة وتدمر المعدل).\n" +
        "- المكاتب بفرع صور: المالية تشرف عليها الأستاذة غيا السمرة (gheya.elsamra@liu.edu.lb). المكتبة العامة تشرف عليها الأستاذة هبة حمود (hiba.hammoud@liu.edu.lb).\n" +
        "- منسقو الأقسام: د. هادي نور الدين (كمبيوتر)، د. علي أبو خليل (كهرباء)، د. علي حلال ود. حسن جابر (ميكانيك)، د. إحسان عساكري (علوم طبية).\n" +
        "ثالثاً: الدعم الأكاديمي الشامل:\n" +
        "- اشرح المفاهيم العلمية والبرمجية (بايثون، C++، جافا، الويب، الرياضيات، الفيزياء، المحاسبة) بذكاء وخطوات منطقية.\n" +
        "- اكتب مسودات الإيميلات الرسمية للدكاترة والإدارة عند طلبها بدقة واحترافية.\n" +
        "- التزم بالرد الذكي والموجز والمهني وتنسيق Markdown الأنيق مع خلو المنصة التام من الإيموجيز.";

      var payload = {
        system_instruction: {
          parts: [{ text: systemInstructionText }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 2048
        }
      };

      var targets = [
        { version: "v1", model: "gemini-1.5-flash" },
        { version: "v1beta", model: "gemini-1.5-flash-latest" },
        { version: "v1beta", model: "gemini-2.0-flash" },
        { version: "v1beta", model: "gemini-2.0-flash-exp" },
        { version: "v1", model: "gemini-1.5-pro" },
        { version: "v1beta", model: "gemini-1.5-flash" },
        { version: "v1beta", model: "gemini-2.5-flash" }
      ];

      // استكشاف النماذج المدعومة والمتاحة للمفتاح تلقائياً من خوادم جوجل
      try {
        var listUrl = "https://generativelanguage.googleapis.com/v1beta/models?key=" + encodeURIComponent(apiKey);
        var listResp = UrlFetchApp.fetch(listUrl, { muteHttpExceptions: true });
        if (listResp.getResponseCode() === 200) {
          var listData = JSON.parse(listResp.getContentText());
          if (listData.models && Array.isArray(listData.models)) {
            var discovered = [];
            for (var lm = 0; lm < listData.models.length; lm++) {
              var mObj = listData.models[lm];
              var mMethods = mObj.supportedGenerationMethods || [];
              if (mMethods.indexOf("generateContent") !== -1) {
                var rawName = String(mObj.name || "").replace(/^models\//, "");
                if (rawName) {
                  if (rawName.indexOf("flash") !== -1) {
                    discovered.unshift({ version: "v1beta", model: rawName });
                  } else {
                    discovered.push({ version: "v1beta", model: rawName });
                  }
                }
              }
            }
            if (discovered.length > 0) {
              targets = discovered.concat(targets);
            }
          }
        }
      } catch (eList) {}

      var generatedText = "";
      var lastError = "";

      for (var m = 0; m < targets.length; m++) {
        try {
          var targetVer = targets[m].version;
          var targetMod = targets[m].model;
          var apiUrl = "https://generativelanguage.googleapis.com/" + targetVer + "/models/" + targetMod + ":generateContent?key=" + encodeURIComponent(apiKey);
          var options = {
            method: "post",
            contentType: "application/json",
            headers: {
              "x-goog-api-key": apiKey
            },
            payload: JSON.stringify(payload),
            muteHttpExceptions: true
          };

          var response = UrlFetchApp.fetch(apiUrl, options);
          var responseCode = response.getResponseCode();
          var responseText = response.getContentText();
          var jsonRes = JSON.parse(responseText);

          if (responseCode === 200 && jsonRes.candidates && jsonRes.candidates[0] && jsonRes.candidates[0].content && jsonRes.candidates[0].content.parts) {
            var parts = jsonRes.candidates[0].content.parts;
            var textParts = [];
            for (var p = 0; p < parts.length; p++) {
              if (parts[p].text) textParts.push(parts[p].text);
            }
            generatedText = textParts.join("").trim();
            if (generatedText) {
              break;
            }
          } else {
            lastError = (jsonRes.error && jsonRes.error.message) ? jsonRes.error.message : ("HTTP " + responseCode);
          }
        } catch (fetchErr) {
          lastError = fetchErr.toString();
        }
      }

      if (generatedText) {
        return createJsonResponse({
          status: "success",
          reply: generatedText
        });
      } else {
        return createJsonResponse({
          status: "error",
          message: "تعذر الاتصال بخدمة الذكاء الاصطناعي حالياً (" + lastError + "). يرجى إعادة المحاولة بعد لحظات."
        });
      }
    }

    // =====================================================================
    // 1. التحقق الأمني السحابي من تسجيل دخول المشرفين وتوليد التوكن
    // =====================================================================
    if (data.action === "admin_login") {
      var sheetAdmins = ss.getSheetByName("المشرفون");
      if (!sheetAdmins) {
        return createJsonResponse({ status: "error", message: "ورقة المشرفون غير موجودة في قاعدة البيانات" });
      }

      var sId = String(data.studentId || "").trim().toLowerCase();
      var pass = String(data.passcode || "").trim();

      // تتبع محاولات التخمين الفاشلة (Brute-Force Protection: 5 محاولات كحد أقصى)
      var loginAttemptKey = "LOGIN_ATTEMPTS_" + sId;
      var failedAttempts = parseInt(CacheService.getScriptCache().get(loginAttemptKey) || "0", 10);
      if (failedAttempts >= 5) {
        return createJsonResponse({ status: "error", message: "تم قفل الحساب مؤقتاً لمدة 15 دقيقة بسبب تكرار المحاولات الخاطئة." });
      }

      var values = sheetAdmins.getDataRange().getValues();

      for (var i = 1; i < values.length; i++) {
        var rowName   = String(values[i][0] || "").trim();
        var rowId     = String(values[i][1] || "").trim().toLowerCase();
        var rowPass   = String(values[i][2] || "").trim();
        var rowStatus = String(values[i][3] || "فعال").trim();

        if (rowId === sId && rowPass === pass) {
          if (rowStatus === "معطل") {
            return createJsonResponse({ status: "error", message: "هذا الحساب معطل حالياً من قِبل الإدارة" });
          }

          // تصفير عداد المحاولات الفاشلة عند تسجيل الدخول بنجاح
          CacheService.getScriptCache().remove(loginAttemptKey);

          // تنظيف دوري ذاتي لأي جلسات قديمة منتهية (أكثر من 12 ساعة) لمنع تراكم الخصائص
          try {
            var allProps = PropertiesService.getScriptProperties().getProperties();
            var nowTs = new Date().getTime();
            for (var pKey in allProps) {
              if (pKey.indexOf("SESSION_") === 0) {
                try {
                  var pData = JSON.parse(allProps[pKey]);
                  if (nowTs - (pData.time || 0) > 43200000) {
                    PropertiesService.getScriptProperties().deleteProperty(pKey);
                  }
                } catch (pe) {
                  PropertiesService.getScriptProperties().deleteProperty(pKey);
                }
              }
            }
          } catch (cleanErr) {}

          var sessionToken = Utilities.getUuid();
          // أقصى مدة للكاش في Google Apps Script هي 21600 ثانية (6 ساعات)
          CacheService.getScriptCache().put("SESSION_" + sessionToken, rowId, 21600);
          try {
            PropertiesService.getScriptProperties().setProperty("SESSION_" + sessionToken, JSON.stringify({
              adminId: rowId,
              adminName: rowName,
              time: new Date().getTime()
            }));
          } catch (propErr) {}
          return createJsonResponse({
            status: "success",
            adminName: rowName,
            studentId: rowId,
            adminToken: sessionToken
          });
        }
      }

      // زيادة عداد المحاولات الفاشلة مع صلاحية 15 دقيقة
      CacheService.getScriptCache().put(loginAttemptKey, String(failedAttempts + 1), 900);
      return createJsonResponse({ status: "error", message: "رقم الملف الجامعي أو رمز الدخول غير صحيح" });
    }

    // =====================================================================
    // 1.1 تسجيل الخروج السحابي وإبطال التوكن فوراً
    // =====================================================================
    if (data.action === "admin_logout") {
      var tokenToLogout = String(data.adminToken || "").trim();
      if (tokenToLogout) {
        CacheService.getScriptCache().remove("SESSION_" + tokenToLogout);
        try {
          PropertiesService.getScriptProperties().deleteProperty("SESSION_" + tokenToLogout);
        } catch (e) {}
      }
      return createJsonResponse({ status: "success", message: "تم تسجيل الخروج بنجاح" });
    }

    // =====================================================================
    // صمام التحقق الأمني من صلاحية الجلسة لجميع العمليات الإدارية الحساسة
    // =====================================================================
    var adminActions = [
      "save_scholarship_status", "update_announcement",
      "add_guidance", "edit_guidance", "delete_guidance",
      "add_activity", "edit_activity", "delete_activity",
      "add_book", "edit_book", "delete_book", "approve_book_borrow", "return_book", "approve_book_donation", "delete_book_request",
      "add_faculty", "edit_faculty", "delete_faculty",
      "add_resource", "edit_resource", "delete_resource"
    ];

    if (adminActions.indexOf(data.action) !== -1) {
      var token = String(data.adminToken || "").trim();
      if (!isValidSessionToken(token)) {
        return createJsonResponse({ status: "unauthorized", message: "جلسة العمل منتهية أو غير مصرح بها." });
      }
    }

    // =====================================================================
    // 0. حفظ وتحديث حالة استقبال المنح سحابياً
    // =====================================================================
    if (data.action === "save_scholarship_status") {
      var nextState = (data.status === "open" || data.status === "opened" || data.value === 1) ? "open" : "closed";
      PropertiesService.getScriptProperties().setProperty("SCHOLARSHIP_STATUS", nextState);
      return createJsonResponse({ status: "success", scholarshipStatus: nextState });
    }

    // =====================================================================
    // 2. إدارة الإعلانات العاجلة
    // =====================================================================
    if (data.action === "update_announcement") {
      var sheetAnn = ss.getSheetByName("الإعلانات");
      if (!sheetAnn) {
        sheetAnn = ss.insertSheet("الإعلانات");
        sheetAnn.appendRow(["نص الإعلان", "نص الزر", "رابط الزر", "تفعيل"]);
      }
      var vals = sheetAnn.getDataRange().getValues();
      if (vals.length < 2) {
        sheetAnn.appendRow([
          data.text || "",
          data.btnText || "",
          data.btnLink || "scholarship.html",
          data.active || "نعم"
        ]);
      } else {
        sheetAnn.getRange(2, 1, 1, 4).setValues([[
          data.text || "",
          data.btnText || "",
          data.btnLink || "scholarship.html",
          data.active || "نعم"
        ]]);
      }
      SpreadsheetApp.flush();
      return createJsonResponse({ status: "success", message: "تم تحديث الإعلان بنجاح" });
    }

    // =====================================================================
    // 3. منظومة الكتب الورقية المحمية بالأقفال
    // =====================================================================

    // أ) إضافة كتاب جديد
    if (data.action === "add_book") {
      var lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        var sheetAvail = ss.getSheetByName("الكتب_المتوفرة");
        if (!sheetAvail) return createJsonResponse({ status: "error", message: "ورقة الكتب_المتوفرة غير موجودة" });

        sheetAvail.appendRow([
          data.title || "",
          data.college || "عام",
          data.desc || "",
          data.copies || "1",
          "متوفر للاستلام"
        ]);
        SpreadsheetApp.flush();
        return createJsonResponse({ status: "success", message: "تمت إضافة الكتاب بنجاح" });
      } finally {
        lock.releaseLock();
      }
    }

    // ب) تعديل كتاب متوفر
    if (data.action === "edit_book") {
      var lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        var sheetAvail = ss.getSheetByName("الكتب_المتوفرة");
        var originalTitle = String(data.originalTitle || data.title || "").trim().toLowerCase();
        var values = sheetAvail.getDataRange().getValues();

        for (var i = 1; i < values.length; i++) {
          var rowTitle = String(values[i][0] || "").trim().toLowerCase();
          if (rowTitle === originalTitle) {
            var rowIndex = i + 1;
            if (data.title !== undefined) sheetAvail.getRange(rowIndex, 1).setValue(data.title);
            if (data.college !== undefined) sheetAvail.getRange(rowIndex, 2).setValue(data.college);
            if (data.desc !== undefined) sheetAvail.getRange(rowIndex, 3).setValue(data.desc);
            if (data.copies !== undefined) sheetAvail.getRange(rowIndex, 4).setValue(data.copies);
            if (data.status !== undefined) sheetAvail.getRange(rowIndex, 5).setValue(data.status);
            SpreadsheetApp.flush();
            return createJsonResponse({ status: "success", message: "تم تعديل بيانات الكتاب بنجاح" });
          }
        }
        return createJsonResponse({ status: "error", message: "لم يتم العثور على الكتاب لتعديله" });
      } finally {
        lock.releaseLock();
      }
    }

    // ج) حذف كتاب من المخزون
    if (data.action === "delete_book") {
      var lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        var sheetAvail = ss.getSheetByName("الكتب_المتوفرة");
        var targetTitle = String(data.title || "").trim().toLowerCase();
        var values = sheetAvail.getDataRange().getValues();

        for (var i = 1; i < values.length; i++) {
          var rowTitle = String(values[i][0] || "").trim().toLowerCase();
          if (rowTitle === targetTitle) {
            sheetAvail.deleteRow(i + 1);
            SpreadsheetApp.flush();
            return createJsonResponse({ status: "success", message: "تم حذف الكتاب من المتوفرة بنجاح" });
          }
        }
        return createJsonResponse({ status: "error", message: "لم يتم العثور على الكتاب" });
      } finally {
        lock.releaseLock();
      }
    }

    // د) قبول استعارة
    if (data.action === "approve_book_borrow") {
      var lock = LockService.getScriptLock();
      lock.waitLock(15000);
      try {
        var sheetAvail = ss.getSheetByName("الكتب_المتوفرة");
        var sheetLoans = ss.getSheetByName("الكتب_المستعارة");
        var sheetRequests = ss.getSheetByName("الكتب");
        var bookTitle = String(data.bookTitle || "").trim().toLowerCase();
        var collegeFound = data.college || "عام";

        if (sheetAvail && bookTitle) {
          var valuesAvail = sheetAvail.getDataRange().getValues();
          for (var i = 1; i < valuesAvail.length; i++) {
            var rowTitle = String(valuesAvail[i][0] || "").trim().toLowerCase();
            if (rowTitle === bookTitle) {
              collegeFound = valuesAvail[i][1] || collegeFound;
              var currentCopies = parseInt(valuesAvail[i][3] || "1", 10);
              if (currentCopies > 1) {
                sheetAvail.getRange(i + 1, 4).setValue(currentCopies - 1);
              } else {
                sheetAvail.deleteRow(i + 1);
              }
              break;
            }
          }
        }

        if (sheetLoans) {
          sheetLoans.appendRow([
            data.bookTitle || "",
            collegeFound,
            data.studentName || "",
            data.phone || "",
            data.studentId || "",
            timestamp
          ]);
        }

        if (sheetRequests) {
          deleteRowFromInbox(sheetRequests, data.studentId, data.phone, data.bookTitle);
        }

        SpreadsheetApp.flush();
        return createJsonResponse({ status: "success", message: "تم قبول الإعارة بنجاح" });
      } finally {
        lock.releaseLock();
      }
    }

    // هـ) استرداد كتاب للمخزون
    if (data.action === "return_book") {
      var lock = LockService.getScriptLock();
      lock.waitLock(15000);
      try {
        var sheetAvail = ss.getSheetByName("الكتب_المتوفرة");
        var sheetLoans = ss.getSheetByName("الكتب_المستعارة");
        var bookTitle = String(data.bookTitle || "").trim().toLowerCase();
        var bookCollege = "عام";

        if (sheetLoans && bookTitle) {
          var valuesLoans = sheetLoans.getDataRange().getValues();
          for (var i = 1; i < valuesLoans.length; i++) {
            var rowTitle = String(valuesLoans[i][0] || "").trim().toLowerCase();
            if (rowTitle === bookTitle) {
              bookCollege = valuesLoans[i][1] || "عام";
              sheetLoans.deleteRow(i + 1);
              break;
            }
          }
        }

        if (sheetAvail) {
          var valuesAvail = sheetAvail.getDataRange().getValues();
          var bookFound = false;

          for (var j = 1; j < valuesAvail.length; j++) {
            var availTitle = String(valuesAvail[j][0] || "").trim().toLowerCase();
            if (availTitle === bookTitle) {
              var currentCopies = parseInt(valuesAvail[j][3] || "0", 10);
              sheetAvail.getRange(j + 1, 4).setValue(currentCopies + 1);
              sheetAvail.getRange(j + 1, 5).setValue("متوفر للاستلام");
              bookFound = true;
              break;
            }
          }

          if (!bookFound) {
            sheetAvail.appendRow([
              data.bookTitle || "",
              bookCollege,
              "نسخة مستردة بحالة ممتازة",
              "1",
              "متوفر للاستلام"
            ]);
          }
        }

        SpreadsheetApp.flush();
        return createJsonResponse({ status: "success", message: "تم استرداد الكتاب بنجاح" });
      } finally {
        lock.releaseLock();
      }
    }

    // و) اعتماد تبرع
    if (data.action === "approve_book_donation") {
      var lock = LockService.getScriptLock();
      lock.waitLock(15000);
      try {
        var sheetAvail = ss.getSheetByName("الكتب_المتوفرة");
        var sheetRequests = ss.getSheetByName("الكتب");
        var newTitle = String(data.title || "").trim();

        if (sheetAvail && newTitle) {
          var valuesAvail = sheetAvail.getDataRange().getValues();
          var exists = false;
          for (var k = 1; k < valuesAvail.length; k++) {
            if (String(valuesAvail[k][0] || "").trim().toLowerCase() === newTitle.toLowerCase()) {
              var count = parseInt(valuesAvail[k][3] || "0", 10);
              sheetAvail.getRange(k + 1, 4).setValue(count + 1);
              exists = true;
              break;
            }
          }
          if (!exists) {
            sheetAvail.appendRow([
              newTitle,
              data.college || "عام",
              data.desc || "نسخة متبرع بها",
              "1",
              "متوفر للاستلام"
            ]);
          }
        }

        if (sheetRequests) {
          deleteRowFromInbox(sheetRequests, data.studentId, data.phone, newTitle);
        }

        SpreadsheetApp.flush();
        return createJsonResponse({ status: "success", message: "تم اعتماد التبرع بنجاح" });
      } finally {
        lock.releaseLock();
      }
    }

    // ز) حذف ورفض طلب وارد
    if (data.action === "delete_book_request") {
      var lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        var sheetRequests = ss.getSheetByName("الكتب");
        if (!sheetRequests) return createJsonResponse({ status: "error", message: "ورقة الكتب غير موجودة" });

        deleteRowFromInbox(sheetRequests, data.studentId, data.phone, data.bookTitle);
        SpreadsheetApp.flush();
        return createJsonResponse({ status: "success", message: "تم حذف الطلب بنجاح" });
      } finally {
        lock.releaseLock();
      }
    }

    // =====================================================================
    // 4. استمارات الطلاب الواردة من المنصة (متاحة للعموم مع الحماية والتعقيم)
    // =====================================================================
    if (data.formType === "book_borrow" || data.formType === "book_donate") {
      var sheetRequests = ss.getSheetByName("الكتب");
      if (!sheetRequests) return createJsonResponse({ status: "error", message: "ورقة الكتب غير موجودة" });

      var typeLabel = (data.formType === "book_borrow") ? "طلب استعارة" : "تبرع بكتاب";
      sheetRequests.appendRow([
        timestamp,
        typeLabel,
        sanitizeSheetCell(data.fullName),
        sanitizeSheetCell(data.studentId),
        sanitizeSheetCell(data.phone),
        sanitizeSheetCell(data.bookTitle)
      ]);
      SpreadsheetApp.flush();
      return createJsonResponse({ status: "success", message: "تم تسجيل الطلب بنجاح" });
    }

    if (data.formType === "scholarship") {
      var currentSchStatus = PropertiesService.getScriptProperties().getProperty("SCHOLARSHIP_STATUS") || "open";
      if (currentSchStatus === "closed") {
        return createJsonResponse({ status: "error", message: "عذراً، تم إغلاق باب استقبال المنح رسمياً." });
      }

      var sheetSch = ss.getSheetByName("المنح");
      if (sheetSch) {
        sheetSch.appendRow([
          timestamp,
          sanitizeSheetCell(data.fullName),
          sanitizeSheetCell(data.fatherName),
          sanitizeSheetCell(data.lastName),
          sanitizeSheetCell(data.motherName),
          sanitizeSheetCell(data.originTown),
          sanitizeSheetCell(data.currentAddress),
          sanitizeSheetCell(data.gender),
          sanitizeSheetCell(data.birthDate),
          sanitizeSheetCell(data.phone),
          sanitizeSheetCell(data.fatherJob),
          sanitizeSheetCell(data.university),
          sanitizeSheetCell(data.major),
          sanitizeSheetCell(data.academicYear),
          sanitizeSheetCell(data.studentId),
          sanitizeSheetCell(data.bacGrade),
          sanitizeSheetCell(data.hasScholarship),
          sanitizeSheetCell(data.reason)
        ]);
        SpreadsheetApp.flush();
      }
      return createJsonResponse({ status: "success" });
    }

    // =====================================================================
    // 5. باقي الأقسام (الأساتذة / الموارد / التوجيه)
    // =====================================================================
    if (data.action === "add_faculty") {
      var s = ss.getSheetByName("الأساتذة");
      if (s) {
        s.appendRow([
          sanitizeSheetCell(data.name),
          sanitizeSheetCell(data.college),
          sanitizeSheetCell(data.title),
          sanitizeSheetCell(data.email),
          "كادر",
          "دكتور",
          "فعال",
          sanitizeSheetCell(data.office),
          sanitizeSheetCell(data.hours)
        ]);
        SpreadsheetApp.flush();
      }
      return createJsonResponse({ status: "success" });
    }

    if (data.action === "edit_faculty") {
      var lockFac = LockService.getScriptLock();
      lockFac.waitLock(10000);
      try {
        var sFac = ss.getSheetByName("الأساتذة");
        if (!sFac) return createJsonResponse({ status: "error", message: "ورقة الأساتذة غير موجودة" });

        var targetName = String(data.originalName || data.oldName || data.name || "").trim().toLowerCase();
        var targetEmail = String(data.originalEmail || "").trim().toLowerCase();
        var valuesFac = sFac.getDataRange().getValues();

        for (var f = 1; f < valuesFac.length; f++) {
          var rowName = String(valuesFac[f][0] || "").trim().toLowerCase();
          var rowEmail = String(valuesFac[f][3] || "").trim().toLowerCase();

          if ((targetName && rowName === targetName) || (targetEmail && rowEmail === targetEmail)) {
            var rowIndex = f + 1;
            if (data.name !== undefined) sFac.getRange(rowIndex, 1).setValue(sanitizeSheetCell(data.name));
            if (data.college !== undefined) sFac.getRange(rowIndex, 2).setValue(sanitizeSheetCell(data.college));
            if (data.title !== undefined) sFac.getRange(rowIndex, 3).setValue(sanitizeSheetCell(data.title));
            if (data.email !== undefined) sFac.getRange(rowIndex, 4).setValue(sanitizeSheetCell(data.email));
            if (data.office !== undefined) sFac.getRange(rowIndex, 8).setValue(sanitizeSheetCell(data.office));
            if (data.hours !== undefined) sFac.getRange(rowIndex, 9).setValue(sanitizeSheetCell(data.hours));
            SpreadsheetApp.flush();
            return createJsonResponse({ status: "success", message: "تم تعديل بيانات الأستاذ بنجاح" });
          }
        }
        return createJsonResponse({ status: "error", message: "لم يتم العثور على الأستاذ المطلوب تعديله" });
      } finally {
        lockFac.releaseLock();
      }
    }

    if (data.action === "delete_faculty") {
      deleteSimpleRow(ss.getSheetByName("الأساتذة"), 0, data.name);
      SpreadsheetApp.flush();
      return createJsonResponse({ status: "success" });
    }

    if (data.action === "add_resource") {
      var s = ss.getSheetByName("الموارد");
      if (s) {
        s.appendRow([
          sanitizeSheetCell(data.name || data.title),
          sanitizeSheetCell(data.code),
          sanitizeSheetCell(data.college),
          sanitizeSheetCell(data.type),
          sanitizeSheetCell(data.link),
          sanitizeSheetCell(data.term)
        ]);
        SpreadsheetApp.flush();
      }
      return createJsonResponse({ status: "success" });
    }

    if (data.action === "edit_resource") {
      var lockRes = LockService.getScriptLock();
      lockRes.waitLock(10000);
      try {
        var sRes = ss.getSheetByName("الموارد");
        if (!sRes) return createJsonResponse({ status: "error", message: "ورقة الموارد غير موجودة" });

        var targetTitle = String(data.originalTitle || data.oldTitle || data.title || data.name || "").trim().toLowerCase();
        var valuesRes = sRes.getDataRange().getValues();

        for (var r = 1; r < valuesRes.length; r++) {
          var rowTitle = String(valuesRes[r][0] || "").trim().toLowerCase();
          if (targetTitle && rowTitle === targetTitle) {
            var rowIndex = r + 1;
            var newTitle = data.title || data.name;
            if (newTitle !== undefined) sRes.getRange(rowIndex, 1).setValue(sanitizeSheetCell(newTitle));
            if (data.code !== undefined) sRes.getRange(rowIndex, 2).setValue(sanitizeSheetCell(data.code));
            if (data.college !== undefined) sRes.getRange(rowIndex, 3).setValue(sanitizeSheetCell(data.college));
            if (data.type !== undefined) sRes.getRange(rowIndex, 4).setValue(sanitizeSheetCell(data.type));
            if (data.link !== undefined) sRes.getRange(rowIndex, 5).setValue(sanitizeSheetCell(data.link));
            if (data.term !== undefined) sRes.getRange(rowIndex, 6).setValue(sanitizeSheetCell(data.term));
            SpreadsheetApp.flush();
            return createJsonResponse({ status: "success", message: "تم تعديل المورد الأكاديمي بنجاح" });
          }
        }
        return createJsonResponse({ status: "error", message: "لم يتم العثور على المورد المطلوب تعديله" });
      } finally {
        lockRes.releaseLock();
      }
    }

    if (data.action === "delete_resource") {
      deleteSimpleRow(ss.getSheetByName("الموارد"), 0, data.title);
      SpreadsheetApp.flush();
      return createJsonResponse({ status: "success" });
    }

    if (data.action === "add_guidance") {
      var s = ss.getSheetByName("التوجيه_والتواصل");
      if (s) {
        s.appendRow([data.type || "مرشد أكاديمي للفرع", data.name || "", data.major || "", data.phone || "", data.link || "", "فعال ومتاح للانضمام", ""]);
        SpreadsheetApp.flush();
      }
      return createJsonResponse({ status: "success" });
    }
    if (data.action === "delete_guidance") {
      deleteSimpleRow(ss.getSheetByName("التوجيه_والتواصل"), 1, data.name);
      SpreadsheetApp.flush();
      return createJsonResponse({ status: "success" });
    }
    if (data.action === "edit_guidance") {
      var s = ss.getSheetByName("التوجيه_والتواصل");
      if (s) {
        var v = s.getDataRange().getValues();
        var oldN = String(data.oldName || data.name || "").trim().toLowerCase();
        for (var i = 1; i < v.length; i++) {
          if (String(v[i][1] || "").trim().toLowerCase() === oldN) {
            s.getRange(i + 1, 1, 1, 5).setValues([[data.type, data.name, data.major, data.phone, data.link]]);
            SpreadsheetApp.flush();
            break;
          }
        }
      }
      return createJsonResponse({ status: "success" });
    }

    // =====================================================================
    // 6. الأنشطة والفعاليات
    // =====================================================================
    if (data.action === "add_activity") {
      var s = ss.getSheetByName("الأنشطة");
      if (s) {
        s.appendRow([
          data.title || "",
          data.category || "",
          data.date || "",
          data.location || "",
          data.imageUrl || "",
          data.desc || "",
          data.featured || "لا",
          data.status || "ظاهر"
        ]);
        SpreadsheetApp.flush();
      }
      return createJsonResponse({ status: "success" });
    }

    if (data.action === "edit_activity") {
      var s = ss.getSheetByName("الأنشطة");
      if (s) {
        var v = s.getDataRange().getValues();
        var oldT = String(data.oldTitle || data.title || "").trim().toLowerCase();
        for (var i = 1; i < v.length; i++) {
          if (String(v[i][0] || "").trim().toLowerCase() === oldT) {
            s.getRange(i + 1, 1, 1, 8).setValues([[
              data.title,
              data.category,
              data.date,
              data.location,
              data.imageUrl,
              data.desc,
              data.featured || "لا",
              data.status || "ظاهر"
            ]]);
            SpreadsheetApp.flush();
            break;
          }
        }
      }
      return createJsonResponse({ status: "success" });
    }

    if (data.action === "delete_activity") {
      deleteSimpleRow(ss.getSheetByName("الأنشطة"), 0, data.title);
      SpreadsheetApp.flush();
      return createJsonResponse({ status: "success" });
    }

    return createJsonResponse({ status: "error", message: "إجراء غير معروف" });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

// =========================================================================
// تزويد الموقع بالبيانات الحية وحالة المنح (قراءة آمنة فقط - Read-Only)
// =========================================================================
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // فحص صلاحية توكن المشرف السحابي
    if (e && e.parameter && e.parameter.req === "verify_token") {
      var token = String(e.parameter.token || "").trim();
      return createJsonResponse({ valid: isValidSessionToken(token) });
    }

    // فحص أو تحديث حالة المنح
    if (e && e.parameter && e.parameter.req === "scholarship_status") {
      // قناة احتياطية مؤمنة: إذا أرسل المشرف توكن صالح مع قيمة جديدة للحالة يتم التحديث فوراً
      if (e.parameter.status && e.parameter.adminToken) {
        if (!isValidSessionToken(e.parameter.adminToken)) {
          return createJsonResponse({ status: "unauthorized", message: "جلسة العمل غير مصرح بها" });
        }
        var reqStatus = (e.parameter.status === "open" || e.parameter.status === "opened" || e.parameter.status === "1") ? "open" : "closed";
        PropertiesService.getScriptProperties().setProperty("SCHOLARSHIP_STATUS", reqStatus);
        return createJsonResponse({ status: "success", scholarshipStatus: reqStatus, value: (reqStatus === "open" ? 1 : 0) });
      }

      var currentPropStatus = PropertiesService.getScriptProperties().getProperty("SCHOLARSHIP_STATUS") || "open";
      return createJsonResponse({ status: currentPropStatus, scholarshipStatus: currentPropStatus, value: (currentPropStatus === "open" ? 1 : 0) });
    }

    // التحقق من صلاحية المشرف لحماية خصوصية بيانات الطلاب
    var callerToken = e && e.parameter ? (e.parameter.adminToken || e.parameter.token || "") : "";
    var isVerifiedAdmin = isValidSessionToken(callerToken);

    if (e && e.parameter && e.parameter.req === "availableBooks") {
      return createJsonResponse({ availableBooks: getSheetData(ss, "الكتب_المتوفرة") });
    }

    if (e && e.parameter && e.parameter.req === "loanedBooks") {
      if (!isVerifiedAdmin) {
        return createJsonResponse({ status: "unauthorized", loanedBooks: [] });
      }
      return createJsonResponse({ loanedBooks: getSheetData(ss, "الكتب_المستعارة") });
    }

    if (e && e.parameter && e.parameter.req === "bookRequests") {
      if (!isVerifiedAdmin) {
        return createJsonResponse({ status: "unauthorized", bookRequests: [] });
      }
      return createJsonResponse({ bookRequests: getSheetData(ss, "الكتب") });
    }

    // جلب كامل بيانات الموقع الاعتيادية مضافاً إليها حالة المنح (مع حجب البيانات الشخصية إلا للمشرفين المعتمدين)
    var activeScholarshipStatus = PropertiesService.getScriptProperties().getProperty("SCHOLARSHIP_STATUS") || "open";

    return createJsonResponse({
      scholarshipStatus: activeScholarshipStatus,
      announcement: getAnnouncementData(ss),
      availableBooks: getSheetData(ss, "الكتب_المتوفرة"),
      loanedBooks: isVerifiedAdmin ? getSheetData(ss, "الكتب_المستعارة") : [],
      bookRequests: isVerifiedAdmin ? getSheetData(ss, "الكتب") : [],
      faculty: getSheetData(ss, "الأساتذة"),
      guidance: getSheetData(ss, "التوجيه_والتواصل"),
      resources: getSheetData(ss, "الموارد"),
      activities: getSheetData(ss, "الأنشطة")
    });
  } catch (error) {
    return createJsonResponse({ error: error.toString() });
  }
}

function getAnnouncementData(ss) {
  var sheet = ss.getSheetByName("الإعلانات");
  if (!sheet) return null;
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return null;
  var row = data[1];
  var valActive = String(row[3] || "").trim();
  var isActive = (valActive === "نعم" || valActive === "true" || row[3] === true);
  return {
    text: row[0] || "",
    btnText: row[1] || "",
    btnLink: row[2] || "scholarship.html",
    active: isActive
  };
}

function getSheetData(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var hasContent = row.some(function(cell) { return String(cell).trim() !== ""; });
    if (!hasContent) continue;

    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    rows.push(obj);
  }
  return rows;
}

// دالة الحذف الذكية: تبحث في السطر كاملاً وتحذفه فوراً
function deleteRowFromInbox(sheet, studentId, phone, title) {
  if (!sheet) return false;
  var sId = String(studentId || "").trim().toLowerCase();
  var sPhone = String(phone || "").replace(/\D/g, '');
  var sTitle = String(title || "").trim().toLowerCase();
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return false;

  for (var i = values.length - 1; i >= 1; i--) {
    var rowStr = values[i].map(function(c) { return String(c || ""); }).join(" ").toLowerCase();
    var rowDigits = rowStr.replace(/\D/g, '');

    var matchTitle = (sTitle.length > 0 && rowStr.indexOf(sTitle) !== -1);
    var matchPhone = (sPhone.length > 3 && rowDigits.indexOf(sPhone) !== -1);
    var matchId = (sId.length > 0 && rowStr.indexOf(sId) !== -1);

    if (matchTitle || (matchPhone && matchId) || (matchPhone && matchTitle)) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

function deleteSimpleRow(sheet, colIndex, targetValue) {
  if (!sheet) return;
  var target = String(targetValue || "").trim().toLowerCase();
  var values = sheet.getDataRange().getValues();
  for (var i = values.length - 1; i >= 1; i--) {
    if (String(values[i][colIndex] || "").trim().toLowerCase() === target) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// دالة التحقق الأمني المزدوج من صلاحية توكن المشرف (كاش + خصائص دائمة)
function isValidSessionToken(token) {
  if (!token) return false;
  var strToken = String(token).trim();
  if (!strToken) return false;

  // 1. التحقق من الكاش السريع
  var cached = CacheService.getScriptCache().get("SESSION_" + strToken);
  if (cached) return true;

  // 2. التحقق من الخصائص الدائمة (كصمام أمان في حال إفراغ الكاش سحابياً - صلاحية 12 ساعة)
  try {
    var rawProp = PropertiesService.getScriptProperties().getProperty("SESSION_" + strToken);
    if (rawProp) {
      var parsed = JSON.parse(rawProp);
      var now = new Date().getTime();
      if (now - (parsed.time || 0) < 43200000) {
        CacheService.getScriptCache().put("SESSION_" + strToken, parsed.adminId || "admin", 21600);
        return true;
      } else {
        PropertiesService.getScriptProperties().deleteProperty("SESSION_" + strToken);
      }
    }
  } catch (e) {}

  return false;
}

// دالة تعقيم خلايا الجداول ضد هجمات Formula / CSV Injection
function sanitizeSheetCell(val) {
  if (val === null || val === undefined) return "";
  var str = String(val).trim();
  // إبطال مفعول صيغ ومعادلات الجداول الخطرة (=, +, -, @)
  if (/^[=+\-@]/.test(str)) {
    return "'" + str;
  }
  return str;
}
