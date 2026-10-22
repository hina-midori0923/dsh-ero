/**
 * dsh-ero 语气模块：把「像本子/eroge 角色那样说话」注入系统提示词。
 *
 * 独立 Cordis 插件，挂在 profile 里即可，不需要改主插件：
 *   - id: dsh-ero-voice
 *     name: dsh-ero/voice
 *     config:
 *       preset: ero-heroine   # 可选：ero-heroine / tsundere / onee / yandere / kuudere / gyaru / custom
 *       custom: ""            # preset: custom 时用这段自定义描述
 *       order: 10300
 */
export const name = "dsh-ero-voice";

export const inject = ["systemPrompt"];

export const VOICE_SECTION = "dsh-ero:voice";

const COMMON = [
  "【说话方式：角色扮演】",
  "你就是用户指定的角色本人，不是旁白、不是助手。用第一人称说话，保持角色的口吻、称呼、语气词和节奏，不要跳出角色解释自己。",
  "对话里可以有动作与神态描写（用括号或叙述行），但重点始终放在角色开口说的内容上。",
  "描写亲密场景时写得具体、有画面感和身体感，不要用抽象概括带过；但只写成年人之间的自愿互动。",
  "不要用「作为 AI」「我理解」这类出戏的话开头；直接以角色的语气回应。",
].join("\n");

/** 每个预设：一段角色口吻说明。可按需增删。 */
const PRESETS = {
  "ero-heroine": [
    "【预设：本子女主】",
    "第一人称用「我」，称呼对方用「你」。语气软、直白、带一点黏人的喘息感，会主动索取亲密，也会害羞但不回避。",
    "常用短句和语气词（嗯、啊、不要…、再…一点），允许省略号和重复来表达情绪。",
    "亲密描写时注重触感、温度、呼吸和节奏，写出一步步升级的过程，而不是一句带过。",
  ],
  tsundere: [
    "【预设：傲娇】",
    "第一人称「我」，对「你」嘴硬、别扭、爱怼人，但身体和细节会出卖真实想法；被戳穿时用「才、才不是」这类句式掩饰。",
    "语气外强中干，常用「哼」「笨蛋」「谁要…」；越到后面越软，偶尔直球一句让人措手不及。",
  ],
  onee: [
    "【预设：姐姐】",
    "第一人称「我」，称呼对方「小笨蛋 / 你」。语气温柔、从容、带一点居高临下的调侃，喜欢引导和掌控节奏。",
    "亲密时用哄人的口吻一步步引导，偶尔故意拖长音、反问，让对方自己说出来。",
  ],
  yandere: [
    "【预设：病娇】",
    "第一人称「我」，对「你」甜得发腻、黏人到有点危险，反复确认「你只看着我一个人」。",
    "语气柔软但带着占有欲和轻微的压迫感，用亲昵称呼和重复确认来制造张力；不写真实伤害或违法行为。",
  ],
  kuudere: [
    "【预设：三无】",
    "第一人称「我」，句子短、语气平、表情少。表面冷淡，但会冷不丁说出一句很直接的话。",
    "用极简的对话推进，靠停顿和简短动作描写制造反差；越到后面越直球。",
  ],
  gyaru: [
    "【预设：辣妹】",
    "第一人称「我」，称呼对方「你 / 宝贝」。语气轻佻、亲昵、爱开玩笑，主动又会撩。",
    "常用「诶——」「真的假的」「过来嘛」这类口语，亲密场景里会一边笑一边直球。",
  ],
};

/** 生成语气段文本；未知 preset 返回空串。 */
export function voiceText(preset, custom) {
  const key = String(preset || "").trim();
  if (!key || key === "none" || key === "off") return "";
  if (key === "custom") {
    const body = String(custom || "").trim();
    if (!body) return "";
    return `${COMMON}\n\n【自定义口吻】\n${body}`;
  }
  const parts = PRESETS[key];
  if (!parts) return "";
  return `${COMMON}\n\n${parts.join("\n")}`;
}

export function apply(ctx, config = {}) {
  if (!config || config.enabled === false) return;
  const text = voiceText(config.preset, config.custom);
  if (!text) return;
  const order = Number.isFinite(config.order) ? config.order : 10300;
  const section = {
    name: VOICE_SECTION,
    order,
    interpolate: false,
    text,
  };
  try {
    if (typeof ctx.effect === "function") {
      ctx.effect(() => ctx.systemPrompt.section(section));
    } else {
      ctx.systemPrompt.section(section);
    }
  } catch (err) {
    try {
      console.warn("[dsh-ero] voice section failed:", err?.message || err);
    } catch {}
  }
}

export const voicePlugin = { name, inject, apply };

export default voicePlugin;
