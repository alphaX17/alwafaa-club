// =========================================================================
// منظومة نادي الوفاء - فرع صور (Google Apps Script Backend الكامل والشامل)
// =========================================================================

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toLocaleString("ar-LB", { timeZone: "Asia/Beirut" });

    // =====================================================================
    // 0. حفظ وتحديث حالة استقبال المنح سحابياً
    // =====================================================================
    if (data.action === "save_scholarship_status") {
      var nextState = (data.status === "open" || data.status === "opened" || data.value === 1) ? "open" : "closed";
      PropertiesService.getScriptProperties().setProperty("SCHOLARSHIP_STATUS", nextState);
      return createJsonResponse({ status: "success", scholarshipStatus: nextState });
    }

    // =====================================================================
    // 1. التحقق الأمني السحابي من تسجيل دخول المشرفين
    // =====================================================================
    if (data.action === "admin_login") {
      var sheetAdmins = ss.getSheetByName("المشرفون");
      if (!sheetAdmins) {
        return createJsonResponse({ status: "error", message: "ورقة المشرفون غير موجودة في قاعدة البيانات" });
      }

      var sId = String(data.studentId || "").trim().toLowerCase();
      var pass = String(data.passcode || "").trim();
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
          return createJsonResponse({
            status: "success",
            adminName: rowName,
            studentId: rowId
          });
        }
      }
      return createJsonResponse({ status: "error", message: "رقم الملف الجامعي أو رمز الدخول غير صحيح" });
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
    // 4. استمارات الطلاب الواردة من المنصة
    // =====================================================================
    if (data.formType === "book_borrow" || data.formType === "book_donate") {
      var sheetRequests = ss.getSheetByName("الكتب");
      if (!sheetRequests) return createJsonResponse({ status: "error", message: "ورقة الكتب غير موجودة" });

      var typeLabel = (data.formType === "book_borrow") ? "طلب استعارة" : "تبرع بكتاب";
      sheetRequests.appendRow([
        timestamp,
        typeLabel,
        data.fullName || "",
        data.studentId || "",
        data.phone || "",
        data.bookTitle || ""
      ]);
      SpreadsheetApp.flush();
      return createJsonResponse({ status: "success", message: "تم تسجيل الطلب بنجاح" });
    }

    if (data.formType === "scholarship") {
      var sheetSch = ss.getSheetByName("المنح");
      if (sheetSch) {
        sheetSch.appendRow([
          timestamp, data.fullName || "", data.fatherName || "", data.lastName || "",
          data.motherName || "", data.originTown || "", data.currentAddress || "",
          data.gender || "", data.birthDate || "", data.phone || "", data.fatherJob || "",
          data.university || "", data.major || "", data.academicYear || "",
          data.studentId || "", data.bacGrade || "", data.hasScholarship || "", data.reason || ""
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
        s.appendRow([data.name || "", data.college || "", data.title || "", data.email || "", "كادر", "دكتور", "فعال", data.office || "", data.hours || ""]);
        SpreadsheetApp.flush();
      }
      return createJsonResponse({ status: "success" });
    }
    if (data.action === "delete_faculty") {
      deleteSimpleRow(ss.getSheetByName("الأساتذة"), 0, data.name);
      SpreadsheetApp.flush();
      return createJsonResponse({ status: "success" });
    }

    if (data.action === "add_resource") {
      var s = ss.getSheetByName("الموارد");
      if (s) {
        s.appendRow([data.name || data.title || "", data.code || "", data.college || "", data.type || "", data.link || "", data.term || ""]);
        SpreadsheetApp.flush();
      }
      return createJsonResponse({ status: "success" });
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
// تزويد الموقع بالبيانات الحية وحالة المنح
// =========================================================================
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // فحص طلب استعلام حالة المنح المنفصل (من زر الأدمن أو صفحة المنح)
    if (e && e.parameter && e.parameter.req === "scholarship_status") {
      // دعم إمكانية التحديث عبر GET في حال طُلب ذلك
      if (e.parameter.status) {
        var cleanStatus = (e.parameter.status === "open" || e.parameter.status === "opened") ? "open" : "closed";
        PropertiesService.getScriptProperties().setProperty("SCHOLARSHIP_STATUS", cleanStatus);
        return createJsonResponse({ status: "success", scholarshipStatus: cleanStatus });
      }

      var currentPropStatus = PropertiesService.getScriptProperties().getProperty("SCHOLARSHIP_STATUS") || "open";
      return createJsonResponse({ status: currentPropStatus, value: (currentPropStatus === "open" ? 1 : 0) });
    }

    // جلب كامل بيانات الموقع الاعتيادية مضافاً إليها حالة المنح
    var activeScholarshipStatus = PropertiesService.getScriptProperties().getProperty("SCHOLARSHIP_STATUS") || "open";

    return createJsonResponse({
      scholarshipStatus: activeScholarshipStatus,
      announcement: getAnnouncementData(ss),
      availableBooks: getSheetData(ss, "الكتب_المتوفرة"),
      loanedBooks: getSheetData(ss, "الكتب_المستعارة"),
      bookRequests: getSheetData(ss, "الكتب"),
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
