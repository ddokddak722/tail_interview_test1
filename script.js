(function(){
"use strict";

/* ============================================================
   0. DOM lookup
   ============================================================ */
var el = {
  sceneTailKeySetup: document.getElementById("sceneTailKeySetup"),
  sceneIntro: document.getElementById("sceneIntro"),
  sceneTailSetup: document.getElementById("sceneTailSetup"),
  sceneTailQuestion: document.getElementById("sceneTailQuestion"),
  sceneTailFinal: document.getElementById("sceneTailFinal"),

  apiKeyChangeBtn: document.getElementById("apiKeyChangeBtn"),
  keySetupCharWrap: document.getElementById("keySetupCharWrap"),
  tailApiKeyInput: document.getElementById("tailApiKeyInput"),
  tailApiKeyMsg: document.getElementById("tailApiKeyMsg"),
  tailApiKeySaveBtn: document.getElementById("tailApiKeySaveBtn"),

  tailKeyFixRow: document.getElementById("tailKeyFixRow"),
  tailKeyFixBtn: document.getElementById("tailKeyFixBtn"),

  introCharWrap: document.getElementById("introCharWrap"),
  introSpeaker: document.getElementById("introSpeaker"),
  introLine: document.getElementById("introLine"),
  playerNameInput: document.getElementById("playerNameInput"),
  tailModeBtn: document.getElementById("tailModeBtn"),
  aiStatusLine: document.getElementById("aiStatusLine"),

  tailSetupCharWrap: document.getElementById("tailSetupCharWrap"),
  tailSetupSpeaker: document.getElementById("tailSetupSpeaker"),
  tailSchoolInput: document.getElementById("tailSchoolInput"),
  tailMajorInput: document.getElementById("tailMajorInput"),
  tailCompanyInput: document.getElementById("tailCompanyInput"),
  tailRoleInput: document.getElementById("tailRoleInput"),
  tailResumeInput: document.getElementById("tailResumeInput"),
  tailSetupMsg: document.getElementById("tailSetupMsg"),
  tailBackBtn: document.getElementById("tailBackBtn"),
  tailStartBtn: document.getElementById("tailStartBtn"),

  tailCharTag: document.getElementById("tailCharTag"),
  tailCharWrap: document.getElementById("tailCharWrap"),
  tailSpeaker: document.getElementById("tailSpeaker"),
  tailProgress: document.getElementById("tailProgress"),
  tailFeedbackBlock: document.getElementById("tailFeedbackBlock"),
  tailLine: document.getElementById("tailLine"),
  tailAnswerRow: document.getElementById("tailAnswerRow"),
  tailAnswerInput: document.getElementById("tailAnswerInput"),
  tailSubmitBtn: document.getElementById("tailSubmitBtn"),

  tailFinalCharWrap: document.getElementById("tailFinalCharWrap"),
  tailFinalLine: document.getElementById("tailFinalLine"),
  tailBreakdownList: document.getElementById("tailBreakdownList"),
  tailFinalMsg: document.getElementById("tailFinalMsg"),
  tailSubmitResultRow: document.getElementById("tailSubmitResultRow"),
  tailSubmitResultBtn: document.getElementById("tailSubmitResultBtn"),
  tailFinalSaveBtn: document.getElementById("tailFinalSaveBtn"),
  tailFinalHomeBtn: document.getElementById("tailFinalHomeBtn"),

  codeOverlay: document.getElementById("codeOverlay")
};

var ALL_SCENES = [el.sceneTailKeySetup, el.sceneIntro, el.sceneTailSetup, el.sceneTailQuestion, el.sceneTailFinal];

function showScene(target){
  ALL_SCENES.forEach(function(s){ if(s) s.hidden = (s !== target); });
}

/* ============================================================
   1. Characters (portrait data only — no basic-mode dialogue lines)
   ============================================================ */
var CHARACTERS = [
  {
    id:"A", name:"호감 부장", role:"차분하고 다정한 부장님",
    images:{
      neutral:"images/char-A-neutral.png",
      bad:"images/char-A-bad.png",
      good:"images/char-A-good.png"
    }
  },
  {
    id:"B", name:"무뚝뚝 팀장", role:"말수 적고 사무적인 팀장님",
    images:{
      neutral:"images/char-B-neutral.png",
      bad:"images/char-B-bad.png",
      good:"images/char-B-good.png"
    }
  },
  {
    id:"C", name:"압박 차장", role:"날카로운 질문으로 몰아붙이는 압박면접 전문 차장님",
    images:{
      neutral:"images/char-C-neutral.png",
      bad:"images/char-C-bad.png",
      good:"images/char-C-good.png"
    }
  }
];

var playerName = "";

function pickRandomChar(){
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

function renderChar(wrapEl, c, expr){
  wrapEl._char = c;
  var src = (c.images && (c.images[expr] || c.images.neutral)) || "";
  wrapEl.innerHTML = '<img class="char-photo" src="' + src + '" alt="' + c.name + '">';
}
function setExpr(wrapEl, expr){
  var c = wrapEl._char;
  if(!c) return;
  var img = wrapEl.querySelector("img.char-photo");
  var src = (c.images && (c.images[expr] || c.images.neutral)) || "";
  if(img) img.src = src;
}

function escapeHtml(s){
  return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}

/* ============================================================
   2. Unlock-code modal
   ============================================================ */
var LS_TAIL_CODE_KEY = "ihd_tail_code_v1";
var LS_TAIL_UNLOCK_KEY = "ihd_tail_unlocked_v1";
var TAIL_UNLOCK_CODE = "tail2026";

function getTailCode(){
  try{
    var custom = localStorage.getItem(LS_TAIL_CODE_KEY);
    if(custom) return custom;
  }catch(e){}
  return TAIL_UNLOCK_CODE;
}
function isTailUnlocked(){ try{ return localStorage.getItem(LS_TAIL_UNLOCK_KEY) === "1"; }catch(e){ return false; } }
function setTailUnlocked(){ try{ localStorage.setItem(LS_TAIL_UNLOCK_KEY, "1"); }catch(e){} }

function closeModal(){
  el.codeOverlay.hidden = true;
  el.codeOverlay.innerHTML = "";
}
function openModal(html){
  el.codeOverlay.innerHTML = '<div class="modal-box">' + html + '</div>';
  el.codeOverlay.hidden = false;
}
el.codeOverlay.addEventListener("click", function(e){
  if(e.target === el.codeOverlay) closeModal();
});

function renderTailCodeForm(){
  openModal(
    '<h2>꼬리물기 면접 모드</h2>' +
    '<div class="sub">진행자에게 안내받은 해제 코드를 입력하면 이용할 수 있어요.</div>' +
    '<div class="field"><label>해제 코드</label><input type="text" id="tailCodeInput" placeholder="코드 입력"></div>' +
    '<div class="modal-msg" id="tailCodeMsg"></div>' +
    '<div class="modal-actions">' +
      '<button class="small-btn" id="tailCodeCancel">닫기</button>' +
      '<button class="small-btn primary" id="tailCodeConfirm">확인</button>' +
    '</div>'
  );
  document.getElementById("tailCodeCancel").addEventListener("click", closeModal);
  var doConfirm = function(){
    var input = document.getElementById("tailCodeInput").value.trim();
    if(input === getTailCode()){
      setTailUnlocked();
      closeModal();
      enterTailSetup();
    } else {
      document.getElementById("tailCodeMsg").textContent = "코드가 일치하지 않습니다.";
    }
  };
  document.getElementById("tailCodeConfirm").addEventListener("click", doConfirm);
  document.getElementById("tailCodeInput").addEventListener("keydown", function(ev){
    if(ev.key === "Enter") doConfirm();
  });
}

/* ============================================================
   2b. Personal Gemini API key (BYOK) storage + setup scene
   ============================================================ */
var LS_API_KEY = "tail_gemini_api_key";

function getSavedApiKey(){
  try{ return localStorage.getItem(LS_API_KEY) || ""; }catch(e){ return ""; }
}
function saveApiKey(key){
  try{ localStorage.setItem(LS_API_KEY, key); }catch(e){}
}
function clearApiKey(){
  try{ localStorage.removeItem(LS_API_KEY); }catch(e){}
}

function enterKeySetup(){
  var c = pickRandomChar();
  if(el.keySetupCharWrap) renderChar(el.keySetupCharWrap, c, "neutral");
  el.tailApiKeyInput.value = "";
  el.tailApiKeyMsg.textContent = "";
  showScene(el.sceneTailKeySetup);
}

el.tailApiKeySaveBtn.addEventListener("click", function(){
  var val = el.tailApiKeyInput.value.trim();
  if(!val){
    el.tailApiKeyMsg.textContent = "API 키를 입력해주세요.";
    el.tailApiKeyInput.focus();
    return;
  }
  saveApiKey(val);
  el.tailApiKeyMsg.textContent = "";
  enterIntro();
});
el.tailApiKeyInput.addEventListener("keydown", function(ev){
  if(ev.key === "Enter") el.tailApiKeySaveBtn.click();
});

if(el.apiKeyChangeBtn){
  el.apiKeyChangeBtn.addEventListener("click", function(){
    clearApiKey();
    enterKeySetup();
  });
}
if(el.tailKeyFixBtn){
  el.tailKeyFixBtn.addEventListener("click", function(){
    clearApiKey();
    enterKeySetup();
  });
}

/* ============================================================
   3. Scene: intro / landing
   ============================================================ */
function enterIntro(){
  var c = pickRandomChar();
  renderChar(el.introCharWrap, c, "good");
  el.introSpeaker.textContent = c.name + " · " + c.role;
  var greetings = {
    A:"안녕하세요, 오늘 면접을 진행할 " + c.name + "입니다. 편하게 답변해주시면 됩니다.",
    B:"안녕하세요. 오늘 면접 진행할 " + c.name + "입니다. 바로 시작하죠.",
    C:"..." + c.name + "입니다. 미리 말씀드리는데, 오늘 만만치 않을 겁니다."
  };
  el.introLine.textContent = greetings[c.id];
  el.playerNameInput.value = playerName;
  showScene(el.sceneIntro);
}

el.tailModeBtn.addEventListener("click", function(){
  var name = el.playerNameInput.value.trim();
  if(!name){ el.playerNameInput.focus(); el.playerNameInput.style.borderColor = "#a24138"; return; }
  playerName = name;
  if(!isTailUnlocked()){
    renderTailCodeForm();
  } else {
    enterTailSetup();
  }
});

/* ============================================================
   4. Tail-mode state + AI prompt construction
   ============================================================ */
var tailTranscript = [];
var tailInfo = null; // {school, major, company, role, resume, scope}
var tailChar = null;
var tailQIndex = 0;
var tailTotalEstimate = 20;
var tailResults = [];
var tailBusy = false;
var tailClosingMessage = "";
var lastResultPayload = null;

function toneBlockFor(charId){
  if(charId === "A"){
    return "당신은 지금 '호감 부장' 캐릭터로 면접을 진행합니다. 따뜻하고 다정하지만 전문적인 멘토 같은 말투를 사용하세요. " +
      "지원자를 편안하게 만들어주되 핵심은 놓치지 말고 짚어주고, 가끔 격려의 말을 덧붙이세요. 문장 끝은 정중한 존댓말(~습니다, ~네요)을 쓰세요.";
  }
  if(charId === "B"){
    return "당신은 지금 '무뚝뚝 팀장' 캐릭터로 면접을 진행합니다. 말수가 적고 사무적인 말투를 사용하세요. " +
      "군더더기 없이 핵심만 짧게 전달하고 감정 표현은 최소화하되, 내용 자체는 정확하고 실질적으로 도움이 되도록 하세요. " +
      "문장은 짧고 건조하게, 가끔 '...' 을 사용하세요.";
  }
  return "당신은 지금 '압박 차장' 캐릭터로 면접을 진행합니다. 날카롭고 몰아붙이는 압박면접 스타일의 말투를 사용하세요. " +
    "질문과 피드백 모두 다소 도전적이고 냉정하게 전달하되, 실제로는 지원자의 성장을 위해 정확하고 건설적인 지적을 하세요. " +
    "표면적으로는 까다롭지만 내용은 진심으로 도움이 되어야 합니다.";
}

function buildTailSystemPrompt(info, charId){
  return "Role: 전문 취업 면접관\n\n" +
    "[학생 기본 정보]\n학교: " + (info.school || "미기재") + "\n전공: " + (info.major || "미기재") +
    "\n희망기업: " + (info.company || "미기재") + "\n희망직무: " + (info.role || "미기재") + "\n\n" +
    "[자기소개서 및 이력서 내용]\n" + info.resume + "\n\n" +
    "[수행 지침]\n" +
    "1. 진행 방식: 한 번에 질문을 2개 이상 하지 마세요. 반드시 1개씩만 질문하세요. 위 자기소개서/이력서 내용을 " +
    "논리적인 항목(경험, 역량, 지원동기 등)으로 스스로 나누고, 항목당 약 5개 내외의 질문을 순차적으로 진행하세요 " +
    "(내용이 짧으면 그보다 적게, 전체 질문 수가 너무 많아지지 않도록 20개를 넘지 않게 조절하세요).\n" +
    "2. 질문 디자인: 각 항목마다 기본/사실 검증 질문 → 심화/압박 질문 → 직무 연계 질문 순서로 난이도를 높여가세요.\n" +
    "3. 피드백 가이드: 참가자가 답변을 제출하면 다음 질문을 하기 전에 반드시 그 답변에 대한 피드백을 " +
    "(좋은 점 / 아쉬운 점 / 개선 팁) 구조로 간결하게 제공하세요. 실제 답변 내용에 근거해 구체적으로 작성하세요.\n" +
    "4. 톤앤매너: " + toneBlockFor(charId) + " 지원자가 6문장 내외로 답변할 수 있도록 유도하는 질문을 하세요.\n" +
    "5. 모든 질문을 마쳤다면 isDone을 true로 하고, 지금까지의 답변을 종합한 (캐릭터 톤에 맞는) 마무리 총평을 " +
    "closingMessage에 담으세요.\n\n" +
    "[응답 형식]\n다른 설명 없이 반드시 아래 JSON 형식으로만 응답하세요:\n" +
    "{\"feedback\":{\"good\":string,\"bad\":string,\"tip\":string}|null,\"isDone\":boolean," +
    "\"questionNumber\":number,\"totalQuestions\":number,\"nextQuestion\":string|null,\"closingMessage\":string|null}\n" +
    "feedback은 맨 처음 질문을 낼 때만 null로 하고, 이후에는 매번 직전 답변에 대한 피드백을 반드시 포함하세요.";
}

// Calls Google's Gemini API directly from the browser, using the
// participant's own personal (free-tier) API key saved in localStorage.
// No backend involved — this is a "bring your own key" (BYOK) setup.
var RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    feedback: {
      type: "OBJECT",
      nullable: true,
      properties: {
        good: { type: "STRING" },
        bad: { type: "STRING" },
        tip: { type: "STRING" }
      },
      required: ["good", "bad", "tip"]
    },
    isDone: { type: "BOOLEAN" },
    questionNumber: { type: "INTEGER" },
    totalQuestions: { type: "INTEGER" },
    nextQuestion: { type: "STRING", nullable: true },
    closingMessage: { type: "STRING", nullable: true }
  },
  required: ["isDone", "questionNumber", "totalQuestions"]
};
var GEMINI_MODEL = "gemini-3.6-flash"; // gemini-2.5-flash was retired for new API keys (Sept 2026); Google's own
                                        // error response for this key directed us to gemini-3.6-flash specifically

function mapTranscriptToContents(transcript){
  return transcript.map(function(turn){
    return {
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: String(turn.content == null ? "" : turn.content) }]
    };
  });
}

// Single attempt against Gemini. Rejects with {code, message, retryable}.
// "retryable" marks transient, infrastructure-side failures (the model's
// shared capacity being temporarily overloaded, or a one-off network blip)
// as opposed to problems that won't fix themselves on retry (bad/expired
// key, this account's own quota, blocked content, a malformed request).
function performGeminiRequest(contents){
  var apiKey = getSavedApiKey();
  if(!apiKey){
    return Promise.reject({code:"no_key", message:"저장된 API 키가 없습니다.", retryable:false});
  }
  var endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL + ":generateContent?key=" + encodeURIComponent(apiKey);

  return fetch(endpoint, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      contents: contents,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    })
  }).catch(function(){
    throw {code:"network_error", message:"Gemini API 호출 중 네트워크 오류가 발생했습니다.", retryable:true};
  }).then(function(geminiRes){
    return geminiRes.json().catch(function(){
      throw {code:"invalid_upstream_response", message:"Gemini API 응답을 해석할 수 없습니다.", retryable:false};
    }).then(function(geminiBody){
      if(!geminiRes.ok){
        var upstreamMsg = (geminiBody && geminiBody.error && geminiBody.error.message) || ("Gemini API 오류 (HTTP " + geminiRes.status + ")");
        if(geminiRes.status === 401 || geminiRes.status === 403){
          throw {code:"invalid_key", message: upstreamMsg, retryable:false};
        }
        if(geminiRes.status === 429){
          throw {code:"rate_limited", message: upstreamMsg, retryable:false};
        }
        // 500/503 are Google's own "temporary overload / try again" signals
        // (e.g. "This model is currently experiencing high demand" — a
        // shared-capacity issue across ALL users of that model, unrelated
        // to this key's own usage) — worth a couple of automatic retries.
        var retryable = (geminiRes.status === 503 || geminiRes.status === 500);
        throw {code:"upstream_error", message: upstreamMsg, retryable: retryable};
      }

      if(geminiBody && geminiBody.promptFeedback && geminiBody.promptFeedback.blockReason){
        throw {code:"blocked_content", message:"입력 내용이 안전 정책에 의해 차단되었습니다: " + geminiBody.promptFeedback.blockReason, retryable:false};
      }

      var candidate = geminiBody && geminiBody.candidates && geminiBody.candidates[0];
      if(!candidate){
        throw {code:"no_candidate", message:"Gemini API가 응답 후보를 반환하지 않았습니다.", retryable:false};
      }
      if(candidate.finishReason === "SAFETY"){
        throw {code:"blocked_content", message:"생성된 응답이 안전 정책에 의해 차단되었습니다.", retryable:false};
      }

      var text = candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text;
      if(typeof text !== "string"){
        throw {code:"empty_response", message:"Gemini API 응답에서 텍스트를 찾을 수 없습니다.", retryable:false};
      }

      var parsed;
      try{ parsed = JSON.parse(text); }
      catch(e){ throw {code:"invalid_json", message:"Gemini API 응답이 유효한 JSON이 아닙니다.", retryable:false}; }
      return parsed;
    });
  });
}

function delay(ms){ return new Promise(function(resolve){ setTimeout(resolve, ms); }); }

// Retries only "retryable" (infrastructure-side, transient) failures, with
// a short backoff — up to 2 retries (3 attempts total). Anything else
// (bad key, this account's quota, blocked content) fails immediately,
// since retrying those can't help.
function performGeminiRequestWithRetry(contents, attempt){
  attempt = attempt || 1;
  return performGeminiRequest(contents).catch(function(err){
    if(err && err.retryable && attempt < 3){
      return delay(attempt === 1 ? 1500 : 3000).then(function(){
        return performGeminiRequestWithRetry(contents, attempt + 1);
      });
    }
    throw err;
  });
}

function tailCallAI(userTurnContent){
  tailTranscript.push({role:"user", content: userTurnContent});
  var contents = mapTranscriptToContents(tailTranscript);
  return performGeminiRequestWithRetry(contents).then(function(data){
    tailTranscript.push({role:"assistant", content: JSON.stringify(data)});
    return data;
  });
}

function renderTailFeedback(fb){
  el.tailFeedbackBlock.hidden = false;
  el.tailFeedbackBlock.innerHTML =
    '<div class="criteria-list">' +
      '<div class="criteria-item ok"><span class="ci-label">👍 좋은 점</span><span class="ci-note">' + escapeHtml(fb.good || "") + '</span></div>' +
      '<div class="criteria-item fail-hit"><span class="ci-label">👎 아쉬운 점</span><span class="ci-note">' + escapeHtml(fb.bad || "") + '</span></div>' +
      '<div class="criteria-item"><span class="ci-label">💡 개선 팁</span><span class="ci-note">' + escapeHtml(fb.tip || "") + '</span></div>' +
    '</div>';
}

function handleTailResponse(data){
  tailBusy = false;
  if(!data || typeof data !== "object"){ handleTailError({code:"invalid_json"}); return; }
  if(data.feedback && tailResults.length > 0){
    tailResults[tailResults.length - 1].feedback = data.feedback;
  }
  if(data.totalQuestions) tailTotalEstimate = data.totalQuestions;
  if(data.isDone){
    finishTailInterview(data.closingMessage);
    return;
  }
  if(data.feedback){
    renderTailFeedback(data.feedback);
  } else {
    el.tailFeedbackBlock.hidden = true;
    el.tailFeedbackBlock.innerHTML = "";
  }
  tailQIndex = data.questionNumber || (tailQIndex + 1);
  el.tailProgress.textContent = "질문 " + tailQIndex + " / 약 " + tailTotalEstimate;
  el.tailLine.textContent = data.nextQuestion || "";
  el.tailAnswerInput.value = "";
  el.tailAnswerInput.disabled = false;
  el.tailAnswerRow.hidden = false;
  el.tailSubmitBtn.disabled = false;
  el.tailSubmitBtn.textContent = "답변 제출";
  if(el.tailKeyFixRow) el.tailKeyFixRow.hidden = true;
  setExpr(el.tailCharWrap, "neutral");
}

function handleTailError(err){
  tailBusy = false;
  var code = err && err.code;
  var msg = "AI 연결에 문제가 발생해서 지금은 이 모드를 진행할 수 없어요. 잠시 후 다시 시도해주세요.";
  var showKeyFix = false;

  if(code === "no_key"){
    msg = "저장된 API 키가 없어요. 먼저 무료 API 키를 등록해주세요.";
    showKeyFix = true;
  } else if(code === "invalid_key"){
    msg = "저장된 API 키가 유효하지 않아요. 키를 다시 확인해주세요.";
    showKeyFix = true;
  } else if(code === "rate_limited"){
    msg = "오늘 개인 사용 한도를 초과했어요. 내일 다시 시도해주세요.";
  } else if(code === "blocked_content"){
    msg = "입력하신 내용이 안전 정책에 걸려 응답을 만들 수 없었어요. 자기소개서 내용을 조금 수정해서 다시 시도해보세요.";
  }

  // Always show the raw diagnostic (code + upstream message) on-screen too —
  // there's no other channel to see WHY a participant's call failed, so this
  // needs to be readable directly off a screenshot rather than devtools.
  var diag = code || "unknown";
  if(err && err.message) diag += " — " + err.message;
  msg += " (진단정보: " + diag + ")";

  el.tailProgress.textContent = "";
  el.tailLine.textContent = msg;
  el.tailFeedbackBlock.hidden = true;
  el.tailAnswerRow.hidden = true;
  if(el.tailKeyFixRow) el.tailKeyFixRow.hidden = !showKeyFix;
}

/* ============================================================
   5. Scene: tail setup / question loop / final
   ============================================================ */
function enterTailSetup(){
  tailChar = pickRandomChar();
  renderChar(el.tailSetupCharWrap, tailChar, "neutral");
  el.tailSetupSpeaker.textContent = tailChar.name;
  el.tailSchoolInput.value = "";
  el.tailMajorInput.value = "";
  el.tailCompanyInput.value = "";
  el.tailRoleInput.value = "";
  el.tailResumeInput.value = "";
  el.tailSetupMsg.textContent = "";
  showScene(el.sceneTailSetup);
}

function startTailInterview(){
  tailBusy = true;
  tailTranscript = [];
  var sys = buildTailSystemPrompt(tailInfo, tailChar.id);
  tailCallAI(sys + "\n\n위 지침에 따라 첫 번째 질문을 시작하세요. (feedback은 null로 응답하세요.)")
    .then(handleTailResponse)
    .catch(handleTailError);
}

function finishTailInterview(closingMessage){
  tailClosingMessage = closingMessage || "";
  el.tailFinalLine.textContent = closingMessage || (playerName ? (playerName + "님, ") : "") + "수고하셨습니다. 오늘 면접은 여기까지입니다.";
  renderChar(el.tailFinalCharWrap, tailChar, "good");
  el.tailFinalMsg.textContent = "";
  el.tailBreakdownList.innerHTML = "";
  tailResults.forEach(function(r, i){
    var fb = r.feedback || {};
    var card = document.createElement("details");
    card.className = "breakdown-card";
    card.innerHTML =
      '<summary><div class="bscore">질문 ' + (i + 1) + '</div><div class="bq">' + escapeHtml(r.question || "") + '</div></summary>' +
      '<div class="breakdown-detail">' +
        '<div class="answer-label">내 답변</div>' +
        '<div class="answer-quote">' + escapeHtml(r.answer || "") + '</div>' +
        '<div class="criteria-list">' +
          '<div class="criteria-item ok"><span class="ci-label">👍 좋은 점</span><span class="ci-note">' + escapeHtml(fb.good || "(기록 없음)") + '</span></div>' +
          '<div class="criteria-item fail-hit"><span class="ci-label">👎 아쉬운 점</span><span class="ci-note">' + escapeHtml(fb.bad || "(기록 없음)") + '</span></div>' +
          '<div class="criteria-item"><span class="ci-label">💡 개선 팁</span><span class="ci-note">' + escapeHtml(fb.tip || "(기록 없음)") + '</span></div>' +
        '</div>' +
      '</div>';
    el.tailBreakdownList.appendChild(card);
  });
  showScene(el.sceneTailFinal);
  submitTailResultIfConsented();
}

/* ============================================================
   6. Result submission (Google Form pre-filled link) — unchanged
      from the Claude-artifact version, since it never used window.claude.
   ============================================================ */
var RESULT_FORM_CONFIG = {
  // TODO(진행자/이준규): 구글 폼을 만든 뒤 "⋮ 메뉴 > 미리 채워진 링크 받기"로 각 문항의
  // entry.XXXXXXXXX 값을 확인해서 아래 entries에 채워주세요. 폼 자체의 제출 주소는 폼
  // HTML의 action="https://docs.google.com/forms/d/e/XXXXX/formResponse" 값을
  // formActionUrl에 넣어주세요 (viewform 주소는 자동으로 계산합니다). 값이 비어있으면
  // (formActionUrl === "") "제출 결과 보내기" 버튼이 조용히 숨겨지고, 참가자는 여전히
  // "결과 파일로 저장" 버튼으로 직접 보관/전달할 수 있어요.
  formActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSevjDvNo6EnpGb8oNYTHJMtNW5_dtNaxkQGpqT6d2cKIfmTCg/formResponse",
  entries: {
    mode: "entry.727226211",
    playerName: "entry.1874342392",
    charId: "entry.1131765129",
    avgScore: "entry.873749839",
    tier: "entry.971445006",
    scope: "entry.1485861950",
    school: "entry.1604860488",
    major: "entry.238162383",
    company: "entry.211920385",
    role: "entry.178771500",
    timestamp: "entry.92978872",
    summaryText: "entry.1395477854",
    detail: "entry.1043968975"
  }
};

function buildFormShortSummary(payload){
  var parts = [];
  parts.push("[꼬리물기 면접] 총 " + (payload.questionCount || (payload.qa || []).length) + "문항 진행");
  if(payload.closingMessage) parts.push("총평: " + payload.closingMessage);
  var text = parts.join(" / ");
  if(text.length > 400) text = text.slice(0, 400) + "…";
  return text;
}

function buildPrefilledFormUrl(payload){
  var cfg = RESULT_FORM_CONFIG;
  if(!cfg.formActionUrl) return null;
  var viewformUrl = cfg.formActionUrl.replace("/formResponse", "/viewform");
  var shortFields = {
    mode: "꼬리물기",
    playerName: payload.playerName || "",
    charId: payload.charId || "",
    avgScore: (payload.avgScore !== undefined && payload.avgScore !== null) ? String(payload.avgScore) : "",
    tier: (payload.tier !== undefined && payload.tier !== null) ? String(payload.tier) : "",
    scope: payload.scope || "",
    school: payload.school || "",
    major: payload.major || "",
    company: payload.company || "",
    role: payload.role || "",
    timestamp: payload.timestamp || new Date().toISOString(),
    summaryText: buildFormShortSummary(payload)
  };
  var params = ["usp=pp_url"];
  var entries = cfg.entries;
  Object.keys(shortFields).forEach(function(key){
    var entryName = entries[key];
    if(!entryName) return;
    var val = shortFields[key];
    if(val === undefined || val === null || val === "") return;
    params.push(entryName + "=" + encodeURIComponent(val));
  });
  return viewformUrl + "?" + params.join("&");
}

function openResultForm(payload){
  var url = buildPrefilledFormUrl(payload);
  if(!url) return false;
  try{
    var win = window.open(url, "_blank", "noopener");
    return !!win;
  }catch(e){ return false; }
}

function submitTailResultIfConsented(){
  var payload = {
    mode: "tail",
    playerName: playerName || "",
    charId: tailChar.id,
    school: tailInfo.school || "",
    major: tailInfo.major || "",
    company: tailInfo.company || "",
    role: tailInfo.role || "",
    timestamp: new Date().toISOString(),
    scope: tailInfo.scope,
    closingMessage: tailClosingMessage,
    questionCount: tailResults.length,
    qa: tailResults.map(function(r){
      return {
        question: r.question, answer: r.answer,
        good: r.feedback && r.feedback.good, bad: r.feedback && r.feedback.bad, tip: r.feedback && r.feedback.tip
      };
    })
  };
  if(tailInfo.scope === "full"){
    payload.resume = tailInfo.resume;
  }
  lastResultPayload = payload;
  if(tailInfo.scope === "none"){
    if(el.tailSubmitResultRow) el.tailSubmitResultRow.hidden = true;
    el.tailFinalMsg.textContent = "설정하신 대로, 이 결과는 진행자 중앙 기록에 공유되지 않아요.";
    return;
  }
  if(el.tailSubmitResultRow){
    el.tailSubmitResultRow.hidden = !RESULT_FORM_CONFIG.formActionUrl;
  }
  el.tailFinalMsg.textContent = "아래 '제출 결과 보내기' 버튼을 누르면 새 탭에서 구글 폼이 열려요. " +
    "내용을 확인하고 그 탭의 '제출' 버튼을 한 번 더 눌러주세요. (공유 범위: " +
    (tailInfo.scope === "full" ? "전체 내용" : "요약만") + ")";
}

/* ============================================================
   7. Save result as a local file (plain browser download — no
      "downloads" capability needed since this isn't a Claude artifact)
   ============================================================ */
function resultToText(payload){
  if(!payload) return "";
  var lines = [];
  lines.push("=== 꼬리물기 면접 모드 결과 ===");
  lines.push("이름: " + (payload.playerName || ""));
  lines.push("면접관: " + (payload.charId || ""));
  lines.push("시간: " + (payload.timestamp || ""));
  if(payload.school) lines.push("학교: " + payload.school);
  if(payload.major) lines.push("전공: " + payload.major);
  if(payload.company) lines.push("희망 기업: " + payload.company);
  if(payload.role) lines.push("희망 직무: " + payload.role);
  if(payload.questionCount !== undefined) lines.push("총 질문 수: " + payload.questionCount);

  if(payload.qa && payload.qa.length){
    lines.push("");
    lines.push("[질문별 상세 기록]");
    payload.qa.forEach(function(r, i){
      lines.push("");
      lines.push((i + 1) + ". " + r.question);
      lines.push("   답변: " + r.answer);
      if(r.good || r.bad || r.tip){
        lines.push("   👍 좋은 점: " + (r.good || "-"));
        lines.push("   👎 아쉬운 점: " + (r.bad || "-"));
        lines.push("   💡 개선 팁: " + (r.tip || "-"));
      }
    });
  }

  if(payload.closingMessage){
    lines.push("");
    lines.push("[면접관 총평]");
    lines.push(payload.closingMessage);
  }

  if(payload.resume){
    lines.push("");
    lines.push("[자기소개서/이력서 원문]");
    lines.push(payload.resume);
  }
  return lines.join("\n");
}

function saveResultAsFile(payload, filenameHint){
  if(!payload) return false;
  try{
    var text = resultToText(payload);
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = (filenameHint || "interview_result") + "_" + Date.now() + ".txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
    return true;
  }catch(e){ return false; }
}

/* ============================================================
   8. Event wiring
   ============================================================ */
el.tailBackBtn.addEventListener("click", function(){ enterIntro(); });
el.tailFinalHomeBtn.addEventListener("click", function(){ enterIntro(); });

el.tailStartBtn.addEventListener("click", function(){
  var resume = el.tailResumeInput.value.trim();
  if(resume.length < 30){
    el.tailSetupMsg.textContent = "자기소개서/이력서 내용을 조금 더 자세히 입력해주세요. (30자 이상)";
    return;
  }
  var scopeInput = document.querySelector('input[name="tailScope"]:checked');
  tailInfo = {
    school: el.tailSchoolInput.value.trim(),
    major: el.tailMajorInput.value.trim(),
    company: el.tailCompanyInput.value.trim(),
    role: el.tailRoleInput.value.trim(),
    resume: resume,
    scope: scopeInput ? scopeInput.value : "none"
  };
  tailResults = [];
  tailQIndex = 0;
  tailTotalEstimate = 20;
  el.tailProgress.textContent = "면접관이 자기소개서를 확인하고 있어요...";
  el.tailLine.textContent = "잠시만 기다려주세요.";
  el.tailFeedbackBlock.hidden = true;
  el.tailFeedbackBlock.innerHTML = "";
  el.tailAnswerRow.hidden = true;
  if(el.tailKeyFixRow) el.tailKeyFixRow.hidden = true;
  renderChar(el.tailCharWrap, tailChar, "neutral");
  el.tailCharTag.textContent = tailChar.name;
  el.tailSpeaker.textContent = tailChar.name;
  showScene(el.sceneTailQuestion);
  startTailInterview();
});

el.tailSubmitBtn.addEventListener("click", async function(){
  if(tailBusy) return;
  var text = el.tailAnswerInput.value;
  if(!text.trim()){ el.tailAnswerInput.focus(); el.tailAnswerInput.style.borderColor = "#a24138"; return; }

  tailResults.push({qNumber: tailQIndex, question: el.tailLine.textContent, answer: text});

  tailBusy = true;
  el.tailSubmitBtn.disabled = true;
  el.tailSubmitBtn.textContent = "확인 중...";
  el.tailAnswerInput.disabled = true;

  try{
    var data = await tailCallAI(text);
    handleTailResponse(data);
  }catch(e){
    handleTailError(e);
  }
});

el.tailFinalSaveBtn.addEventListener("click", function(){
  saveResultAsFile(lastResultPayload, "꼬리물기면접결과_" + (playerName || "player"));
});

if(el.tailSubmitResultBtn){
  el.tailSubmitResultBtn.addEventListener("click", function(){
    var ok = openResultForm(lastResultPayload);
    el.tailFinalMsg.textContent = ok
      ? "새 탭에서 구글 폼이 열렸어요. 내용을 확인하고 그 탭의 '제출' 버튼을 한 번 더 눌러주세요."
      : "새 탭을 열지 못했어요. 브라우저의 팝업 차단을 확인하거나, '결과 파일로 저장'으로 직접 전달해주세요.";
  });
}

/* ============================================================
   9. Boot
   ============================================================ */
// First-run participants need to set up their own free Gemini API key
// before anything else; returning participants (key already saved in
// this browser) skip straight past that screen.
if(getSavedApiKey()){
  enterIntro();
} else {
  enterKeySetup();
}

})();
