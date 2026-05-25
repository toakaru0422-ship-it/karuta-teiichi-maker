import { useMemo, useState } from "react";

const ROWS = ["upper", "middle", "lower"];
const ROW_LABELS = { upper: "上段", middle: "中段", lower: "下段" };
const FORBID_UPPER_INITIALS = new Set(["う", "つ", "し", "も", "ゆ"]);
const SLOT_CAPACITY = 22;
const ENCIRCLE_EDGE_BAND = 11;

const SITE_URL = "https://example.com";
const CONTACT_EMAIL = "xxxxx@example.com";
const ADSENSE_PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX";
const ADSENSE_SLOT_SIDEBAR = "0000000001";
const ADSENSE_SLOT_RESULT = "0000000002";

const ENCIRCLE_SET_IDS = new Set([
  "chi:chigiri",
  "ki:kimi",
  "yo:yononaka",
  "ko:kokoro",
  "wa:watako_wataya",
  "na:naniwa",
  "a:asaa_asau",
]);

const questions = [
  {
    id: "mu_me",
    title: "「む」「め」、どちらが右っぽい？",
    mode: "optionCount",
    min: 1,
    max: 1,
    fixedRow: "lower",
    options: [
      { id: "mu", label: "む", cards: ["む"] },
      { id: "me", label: "め", cards: ["め"] },
    ],
  },
  {
    id: "sa_su_se",
    title: "「さ」「す」「せ」の中で、右っぽい札を1〜2枚選んでください",
    mode: "optionCount",
    min: 1,
    max: 2,
    fixedRow: "lower",
    dynamicGroup: "selectedVsUnselected",
    options: [
      { id: "sa", label: "さ", cards: ["さ"] },
      { id: "su", label: "す", cards: ["す"] },
      { id: "se", label: "せ", cards: ["せ"] },
    ],
  },
  {
    id: "fu_ho",
    title: "「ふ」「ほ」、どちらが右っぽい？",
    mode: "optionCount",
    min: 1,
    max: 1,
    fixedRow: "lower",
    options: [
      { id: "fu", label: "ふ", cards: ["ふ"] },
      { id: "ho", label: "ほ", cards: ["ほ"] },
    ],
  },
  {
    id: "u_ts_sh_mo_yu",
    title: "右っぽいセットを2〜3個選んでください",
    mode: "optionCount",
    min: 2,
    max: 3,
    options: [
      { id: "uka_ura", label: "うか・うら", cards: ["うか", "うら"] },
      { id: "tsuki_tsuku", label: "つき・つく", cards: ["つき", "つく"] },
      { id: "shino_shira", label: "しの・しら", cards: ["しの", "しら"] },
      { id: "momo_moro", label: "もも・もろ", cards: ["もも", "もろ"] },
      { id: "yuu_yura", label: "ゆう・ゆら", cards: ["ゆう", "ゆら"] },
    ],
  },
  {
    id: "ini_ima",
    title: "「いに」と「いまは・いまこ」、どちらが右っぽい？",
    mode: "optionCount",
    min: 1,
    max: 1,
    options: [
      { id: "ini", label: "いに", cards: ["いに"] },
      { id: "imaha_imako", label: "いまは・いまこ", cards: ["いまは", "いまこ"] },
    ],
  },
  {
    id: "chi",
    title: "「ちは」と「ちぎりき・ちぎりお」、どちらが右っぽい？",
    mode: "optionCount",
    min: 1,
    max: 1,
    options: [
      { id: "chiha", label: "ちは", cards: ["ちは"] },
      { id: "chigiri", label: "ちぎりき・ちぎりお", cards: ["ちぎりき", "ちぎりお"] },
    ],
  },
  {
    id: "hi",
    title: "「ひさ」と「ひとは・ひとも」、どちらが右っぽい？",
    mode: "optionCount",
    min: 1,
    max: 1,
    options: [
      { id: "hisa", label: "ひさ", cards: ["ひさ"] },
      { id: "hito", label: "ひとは・ひとも", cards: ["ひとは", "ひとも"] },
    ],
  },
  {
    id: "ki",
    title: "「きり」と「きみは・きみお」、どちらが右っぽい？",
    mode: "optionCount",
    min: 1,
    max: 1,
    options: [
      { id: "kiri", label: "きり", cards: ["きり"] },
      { id: "kimi", label: "きみは・きみお", cards: ["きみは", "きみお"] },
    ],
  },
  {
    id: "haru_hana",
    title: "「はるす・はるの」と「はなさ・はなの」、どちらが右っぽい？",
    mode: "optionCount",
    min: 1,
    max: 1,
    options: [
      { id: "haru", label: "はるす・はるの", cards: ["はるす", "はるの"] },
      { id: "hana", label: "はなさ・はなの", cards: ["はなさ", "はなの"] },
    ],
  },
  {
    id: "ya",
    title: "「やえ」「やす」「やまが・やまざ」の中で、右っぽいものを1〜2個選んでください",
    mode: "optionCount",
    min: 1,
    max: 2,
    options: [
      { id: "yae", label: "やえ", cards: ["やえ"] },
      { id: "yasu", label: "やす", cards: ["やす"] },
      { id: "yama", label: "やまが・やまざ", cards: ["やまが", "やまざ"] },
    ],
  },
  {
    id: "yo",
    title: "「よも」「よを」「よのなかよ・よのなかは」の中で、右っぽいものを1〜2個選んでください",
    mode: "optionCount",
    min: 1,
    max: 2,
    options: [
      { id: "yomo", label: "よも", cards: ["よも"] },
      { id: "yowo", label: "よを", cards: ["よを"] },
      { id: "yononaka", label: "よのなかよ・よのなかは", cards: ["よのなかよ", "よのなかは"] },
    ],
  },
  {
    id: "ka",
    title: "「かく」「かさ」「かぜそ・かぜを」の中で、右っぽいものを1〜2個選んでください",
    mode: "optionCount",
    min: 1,
    max: 2,
    options: [
      { id: "kaku", label: "かく", cards: ["かく"] },
      { id: "kasa", label: "かさ", cards: ["かさ"] },
      { id: "kaze", label: "かぜそ・かぜを", cards: ["かぜそ", "かぜを"] },
    ],
  },
  {
    id: "mi",
    title: "「みち」「みせ」「みよ」「みかき・みかの」の中で、右っぽいものを2つ選んでください",
    mode: "optionCount",
    min: 2,
    max: 2,
    options: [
      { id: "michi", label: "みち", cards: ["みち"] },
      { id: "mise", label: "みせ", cards: ["みせ"] },
      { id: "miyo", label: "みよ", cards: ["みよ"] },
      { id: "mikaki_mikano", label: "みかき・みかの", cards: ["みかき", "みかの"] },
    ],
  },
  {
    id: "ta",
    title: "「たか」「たき」「たご」「たち」「たれ」「たま」の中で、右っぽい札を3枚選んでください",
    mode: "optionCount",
    min: 3,
    max: 3,
    options: ["たか", "たき", "たご", "たち", "たれ", "たま"].map((x) => ({
      id: x,
      label: x,
      cards: [x],
    })),
  },
  {
    id: "ko",
    title: "合計3枚になるように、右っぽいものを選んでください",
    mode: "cardCount",
    min: 3,
    max: 3,
    options: [
      { id: "kono", label: "この", cards: ["この"] },
      { id: "konu", label: "こぬ", cards: ["こぬ"] },
      { id: "koi", label: "こい", cards: ["こい"] },
      { id: "kore", label: "これ", cards: ["これ"] },
      { id: "kokoro", label: "こころあ・こころに", cards: ["こころあ", "こころに"] },
    ],
  },
  {
    id: "o",
    title: "「おく」「おぐ」「おと」「おも」「おおえ」「おおけ」「おおこ」の中で、右っぽい札を3〜4枚選んでください",
    mode: "optionCount",
    min: 3,
    max: 4,
    dynamicOGroup: true,
    options: ["おく", "おぐ", "おと", "おも", "おおえ", "おおけ", "おおこ"].map((x) => ({
      id: romanizeId(x),
      label: x,
      cards: [x],
    })),
  },
  {
    id: "wa",
    title: "「わび」「わがい・わがそ」「わすら・わすれ」「わたこ・わたや」の中で、右っぽいものを2つ選んでください",
    mode: "optionCount",
    min: 2,
    max: 2,
    options: [
      { id: "wabi", label: "わび", cards: ["わび"] },
      { id: "wagai_wagaso", label: "わがい・わがそ", cards: ["わがい", "わがそ"] },
      { id: "wasura_wasure", label: "わすら・わすれ", cards: ["わすら", "わすれ"] },
      { id: "watako_wataya", label: "わたこ・わたや", cards: ["わたこ", "わたや"] },
    ],
  },
  {
    id: "na",
    title: "合計3〜5枚になるように、右っぽいものを選んでください",
    mode: "cardCount",
    min: 3,
    max: 5,
    options: [
      { id: "natsu", label: "なつ", cards: ["なつ"] },
      { id: "naniwa", label: "なにわが・なにわえ", cards: ["なにわが", "なにわえ"] },
      { id: "nanishi", label: "なにし", cards: ["なにし"] },
      { id: "nagaka_nagara", label: "ながか・ながら", cards: ["ながか", "ながら"] },
      { id: "nageki_nageke", label: "なげき・なげけ", cards: ["なげき", "なげけ"] },
    ],
  },
  {
    id: "a",
    title: "合計8枚になるように、右っぽいものを選んでください",
    mode: "cardCount",
    min: 8,
    max: 8,
    options: [
      { id: "ai", label: "あい", cards: ["あい"] },
      { id: "ashi", label: "あし", cards: ["あし"] },
      { id: "ake", label: "あけ", cards: ["あけ"] },
      { id: "asaji", label: "あさじ", cards: ["あさじ"] },
      { id: "asaa_asau", label: "あさあ・あさう", cards: ["あさあ", "あさう"] },
      { id: "akino_akika", label: "あきの・あきか", cards: ["あきの", "あきか"] },
      { id: "aria_arima", label: "ありあ・ありま", cards: ["ありあ", "ありま"] },
      { id: "amano_amatsu", label: "あまの・あまつ", cards: ["あまの", "あまつ"] },
      { id: "arashi_araza", label: "あらし・あらざ", cards: ["あらし", "あらざ"] },
      { id: "awaji_aware", label: "あわじ・あわれ", cards: ["あわじ", "あわれ"] },
    ],
  },
];

const encircleLeftQuestion = {
  id: "encircleLeft",
  title: "左で囲いたい場所はどっち？",
  mode: "optionCount",
  min: 1,
  max: 1,
  options: [
    { id: "左外", label: "左外", cards: [] },
    { id: "左内", label: "左内", cards: [] },
  ],
};

const encircleRightQuestion = {
  id: "encircleRight",
  title: "右で囲いたい場所はどっち？",
  mode: "optionCount",
  min: 1,
  max: 1,
  options: [
    { id: "右内", label: "右内", cards: [] },
    { id: "右外", label: "右外", cards: [] },
  ],
};

function romanizeId(text) {
  const map = {
    おく: "oku",
    おぐ: "ogu",
    おと: "oto",
    おも: "omo",
    おおえ: "ooe",
    おおけ: "ooke",
    おおこ: "ooko",
  };
  return map[text] || text;
}

function initialOf(card) {
  return card[0];
}

function selectedMetric(question, selectedIds) {
  const selected = question.options.filter((option) => selectedIds.includes(option.id));
  if (question.mode === "cardCount") {
    return selected.reduce((sum, option) => sum + option.cards.length, 0);
  }
  return selected.length;
}

function isValid(question, selectedIds) {
  const value = selectedMetric(question, selectedIds);
  return value >= question.min && value <= question.max;
}

function makeGroup({ question, optionId, label, cards, side, fixedRow, encircleTarget = false }) {
  return {
    id: `${question.id}:${optionId}`,
    questionId: question.id,
    label,
    cards,
    side,
    fixedRow: fixedRow || null,
    noUpper: cards.some((card) => FORBID_UPPER_INITIALS.has(initialOf(card))),
    encircleTarget,
  };
}

function makeGroups(answers) {
  const groups = [];

  questions.forEach((question) => {
    const selectedIds = answers[question.id] || [];

    if (question.dynamicGroup === "selectedVsUnselected") {
      const selectedOptions = question.options.filter((option) => selectedIds.includes(option.id));
      const unselectedOptions = question.options.filter((option) => !selectedIds.includes(option.id));

      if (selectedOptions.length) {
        const cards = selectedOptions.flatMap((option) => option.cards);
        groups.push(makeGroup({
          question,
          optionId: "selected_set",
          label: cards.join("・"),
          cards,
          side: "right",
          fixedRow: question.fixedRow,
        }));
      }

      if (unselectedOptions.length) {
        const cards = unselectedOptions.flatMap((option) => option.cards);
        groups.push(makeGroup({
          question,
          optionId: "unselected_set",
          label: cards.join("・"),
          cards,
          side: "left",
          fixedRow: question.fixedRow,
        }));
      }

      return;
    }

    if (question.dynamicOGroup) {
      const dynamicIds = new Set(["ooe", "ooke", "ooko"]);

      question.options.forEach((option) => {
        if (dynamicIds.has(option.id)) return;
        groups.push(makeGroup({
          question,
          optionId: option.id,
          label: option.label,
          cards: option.cards,
          side: selectedIds.includes(option.id) ? "right" : "left",
          fixedRow: question.fixedRow,
        }));
      });

      const selectedOO = question.options.filter((option) => dynamicIds.has(option.id) && selectedIds.includes(option.id));
      const unselectedOO = question.options.filter((option) => dynamicIds.has(option.id) && !selectedIds.includes(option.id));

      if (selectedOO.length) {
        const cards = selectedOO.flatMap((option) => option.cards);
        groups.push(makeGroup({
          question,
          optionId: "oo_selected_set",
          label: cards.join("・"),
          cards,
          side: "right",
          fixedRow: question.fixedRow,
        }));
      }

      if (unselectedOO.length) {
        const cards = unselectedOO.flatMap((option) => option.cards);
        groups.push(makeGroup({
          question,
          optionId: "oo_unselected_set",
          label: cards.join("・"),
          cards,
          side: "left",
          fixedRow: question.fixedRow,
        }));
      }

      return;
    }

    question.options.forEach((option) => {
      const id = `${question.id}:${option.id}`;
      groups.push(makeGroup({
        question,
        optionId: option.id,
        label: option.label,
        cards: option.cards,
        side: selectedIds.includes(option.id) ? "right" : "left",
        fixedRow: question.fixedRow,
        encircleTarget: ENCIRCLE_SET_IDS.has(id),
      }));
    });
  });

  return groups;
}

function encircleZoneBySide(answers) {
  return {
    left: answers.encircleLeft?.[0] || "左内",
    right: answers.encircleRight?.[0] || "右内",
  };
}

function slotMeta(side, row, index) {
  const sign = side === "right" ? 1 : -1;
  const x = sign * (index + 1);
  const y = row === "lower" ? 0 : row === "middle" ? 2.35 : 4.7;
  const zone = side === "left"
    ? index < SLOT_CAPACITY / 2 ? "左内" : "左外"
    : index < SLOT_CAPACITY / 2 ? "右内" : "右外";

  return { side, row, index, x, y, zone };
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function emptyBoard() {
  return {
    left: {
      upper: Array(SLOT_CAPACITY).fill(null),
      middle: Array(SLOT_CAPACITY).fill(null),
      lower: Array(SLOT_CAPACITY).fill(null),
    },
    right: {
      upper: Array(SLOT_CAPACITY).fill(null),
      middle: Array(SLOT_CAPACITY).fill(null),
      lower: Array(SLOT_CAPACITY).fill(null),
    },
  };
}

function groupZoneMatches(group, row, start, zoneBySide) {
  if (!group.encircleTarget) return true;

  const requiredZone = zoneBySide[group.side];

  for (let i = 0; i < group.cards.length; i += 1) {
    if (slotMeta(group.side, row, start + i).zone !== requiredZone) return false;
  }

  return true;
}

function canPlace(board, group, row, start, zoneBySide) {
  if (group.fixedRow && group.fixedRow !== row) return false;
  if (group.noUpper && row === "upper") return false;
  if (start + group.cards.length > SLOT_CAPACITY) return false;
  if (!groupZoneMatches(group, row, start, zoneBySide)) return false;

  const line = board[group.side][row];

  for (let i = 0; i < group.cards.length; i += 1) {
    if (line[start + i]) return false;
  }

  return true;
}


function edgeStartsForGroup(group, requiredZone) {
  const starts = [];
  const len = group.cards.length;

  if (requiredZone.endsWith("内")) {
    for (let start = 0; start <= SLOT_CAPACITY - len; start += len) {
      starts.push(start);
    }
  } else {
    for (let end = SLOT_CAPACITY; end - len >= 0; end -= len) {
      starts.push(end - len);
    }
  }

  return starts;
}

function edgePriority(group, row, start, zoneBySide) {
  const requiredZone = zoneBySide[group.side];
  const len = group.cards.length;
  const edgeOffset = requiredZone.endsWith("内")
    ? start
    : SLOT_CAPACITY - (start + len);

  const rowBonus = row === "lower" ? 0.3 : row === "middle" ? 0.2 : 0.1;
  return -edgeOffset * 100 + rowBonus + Math.random() * 0.001;
}

function placeEncircleGroup(board, group, placements, zoneBySide) {
  const requiredZone = zoneBySide[group.side];

  const candidateRows = ROWS.filter((row) => {
    if (group.fixedRow && group.fixedRow !== row) return false;
    if (group.noUpper && row === "upper") return false;
    return true;
  });

  const candidates = [];

  candidateRows.forEach((row) => {
    edgeStartsForGroup(group, requiredZone).forEach((start) => {
      if (canPlace(board, group, row, start, zoneBySide)) {
        candidates.push({
          row,
          start,
          score: edgePriority(group, row, start, zoneBySide) + localPlacementScore(group, row, start, placements, zoneBySide) * 0.02,
        });
      }
    });
  });

  if (!candidates.length) return false;

  candidates.sort((a, b) => b.score - a.score);
  const chosen = candidates[0];
  const cardSlots = makeCandidateCardSlots(group, chosen.row, chosen.start);

  cardSlots.forEach((slot) => {
    board[group.side][chosen.row][slot.index] = {
      card: slot.card,
      groupId: group.id,
      groupLabel: group.label,
      fixedSet: group.cards.length >= 2,
      encircleTarget: group.encircleTarget,
    };
  });

  placements[group.id] = { group, cardSlots };
  return true;
}

function makeCandidateCardSlots(group, row, start) {
  return group.cards.map((card, i) => ({
    card,
    groupId: group.id,
    groupLabel: group.label,
    ...slotMeta(group.side, row, start + i),
  }));
}

function sameInitialPairScore(candidateSlots, placedCardSlots) {
  let score = 0;

  candidateSlots.forEach((a) => {
    placedCardSlots.forEach((b) => {
      if (a.groupId === b.groupId) return;
      if (initialOf(a.card) !== initialOf(b.card)) return;

      const d = distance(a, b);
      score += d * 3.5;
      if (a.side !== b.side) score += 4.8;
      if (a.row !== b.row) score += 2.6;
      if (a.side === b.side && a.row === b.row) score -= 8.5;
    });
  });

  return score;
}

function localPlacementScore(group, row, start, placements, zoneBySide) {
  const candidateSlots = makeCandidateCardSlots(group, row, start);
  let score = 0;

  Object.values(placements).forEach((placed) => {
    score += sameInitialPairScore(candidateSlots, placed.cardSlots);
  });

  score += row === "lower" ? 0.7 : row === "middle" ? 0.35 : -0.1;

  if (group.encircleTarget) {
    const requiredZone = zoneBySide[group.side];
    const edgeOffset = requiredZone.endsWith("内")
      ? start
      : SLOT_CAPACITY - (start + group.cards.length);

    score += 80;
    score -= edgeOffset * 45;
  }

  return score + Math.random() * 1.5;
}

function placeGroup(board, group, placements, zoneBySide) {
  const candidateRows = ROWS.filter((row) => {
    if (group.fixedRow && group.fixedRow !== row) return false;
    if (group.noUpper && row === "upper") return false;
    return true;
  });

  const candidates = [];

  candidateRows.forEach((row) => {
    for (let start = 0; start <= SLOT_CAPACITY - group.cards.length; start += 1) {
      if (canPlace(board, group, row, start, zoneBySide)) {
        candidates.push({
          row,
          start,
          score: localPlacementScore(group, row, start, placements, zoneBySide),
        });
      }
    }
  });

  if (!candidates.length) return false;

  candidates.sort((a, b) => b.score - a.score);
  const top = candidates.slice(0, Math.min(6, candidates.length));
  const chosen = top[Math.floor(Math.random() * top.length)];

  const cardSlots = makeCandidateCardSlots(group, chosen.row, chosen.start);

  cardSlots.forEach((slot) => {
    board[group.side][chosen.row][slot.index] = {
      card: slot.card,
      groupId: group.id,
      groupLabel: group.label,
      fixedSet: group.cards.length >= 2,
      encircleTarget: group.encircleTarget,
    };
  });

  placements[group.id] = { group, cardSlots };
  return true;
}

function scoreLayout(placements, zoneBySide) {
  const values = Object.values(placements);
  let score = 0;

  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      score += sameInitialPairScore(values[i].cardSlots, values[j].cardSlots);
    }
  }

  const rowCounts = {
    left: { upper: 0, middle: 0, lower: 0 },
    right: { upper: 0, middle: 0, lower: 0 },
  };

  values.forEach((placed) => {
    placed.cardSlots.forEach((slot) => {
      rowCounts[slot.side][slot.row] += 1;
      if (placed.group.encircleTarget && slot.zone === zoneBySide[slot.side]) score += 30;
    });
  });

  ["left", "right"].forEach((side) => {
    const total = ROWS.reduce((sum, row) => sum + rowCounts[side][row], 0);
    const desired = { upper: total * 0.22, middle: total * 0.36, lower: total * 0.42 };

    ROWS.forEach((row) => {
      score -= Math.abs(rowCounts[side][row] - desired[row]) * 0.5;
    });
  });

  return score;
}

function optimizeLayout(groups, zoneBySide, attempts = 1000) {
  let best = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const board = emptyBoard();
    const placements = {};

    const encircleGroups = groups
      .filter((group) => group.encircleTarget)
      .sort((a, b) => b.cards.length - a.cards.length || Math.random() - 0.5);

    const normalGroups = groups
      .filter((group) => !group.encircleTarget)
      .sort((a, b) => {
        if (a.fixedRow && !b.fixedRow) return -1;
        if (!a.fixedRow && b.fixedRow) return 1;
        if (a.cards.length !== b.cards.length) return b.cards.length - a.cards.length;
        return Math.random() - 0.5;
      });

    let ok = true;

    for (const group of encircleGroups) {
      if (!placeEncircleGroup(board, group, placements, zoneBySide)) {
        ok = false;
        break;
      }
    }

    if (!ok) continue;

    for (const group of normalGroups) {
      if (!placeGroup(board, group, placements, zoneBySide)) {
        ok = false;
        break;
      }
    }

    if (!ok) continue;

    const score = scoreLayout(placements, zoneBySide);
    if (!best || score > best.score) best = { board, placements, score };
  }

  return best;
}

function displayItems(board, side, row) {
  const line = board?.[side]?.[row] || [];
  const items = line.filter(Boolean);
  return side === "left" ? items.reverse() : items;
}

function VerticalCard({ item }) {
  return (
    <div
      title={item.groupLabel}
      className={[
        "vertical-card",
        item.encircleTarget ? "encircle-card" : "",
        item.fixedSet ? "set-card" : "",
      ].join(" ")}
    >
      {item.card}
    </div>
  );
}

function Board({ result }) {
  if (!result) return null;

  return (
    <div className="board-wrap">
      <div className="board-title">自陣定位置</div>
      <div className="board-table">
        {ROWS.map((row) => (
          <div key={row} className="board-row">
            <div className="row-side row-side-left-edge">
              {displayItems(result.board, "left", row).map((item, index) => (
                <VerticalCard key={`${row}-left-${index}-${item.card}`} item={item} />
              ))}
            </div>
            <div className="row-label">{ROW_LABELS[row]}</div>
            <div className="row-side row-side-right-edge">
              {displayItems(result.board, "right", row).map((item, index) => (
                <VerticalCard key={`${row}-right-${index}-${item.card}`} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="zone-labels">
        <div><span>左外</span><span>左内</span></div>
        <div></div>
        <div><span>右内</span><span>右外</span></div>
      </div>
    </div>
  );
}

function AdSlot({ compact = false, slot = ADSENSE_SLOT_SIDEBAR }) {
  const canShowRealAd = ADSENSE_PUBLISHER_ID !== "ca-pub-XXXXXXXXXXXXXXXX";

  return (
    <div className={compact ? "ad compact" : "ad"} aria-label="広告">
      <span className="ad-label">広告</span>
      {canShowRealAd ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_PUBLISHER_ID}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <span className="ad-placeholder">AdSense枠</span>
      )}
    </div>
  );
}

function QuestionCard({ question, selectedIds, onToggle }) {
  const value = selectedMetric(question, selectedIds);
  const valid = isValid(question, selectedIds);
  const unit = question.mode === "cardCount" ? "枚" : "個";

  return (
    <div className="question-card">
      <h2>{question.title}</h2>
      <div className="count">
        {value}{unit} / {question.min === question.max ? `${question.min}${unit}` : `${question.min}〜${question.max}${unit}`}
      </div>

      <div className="options">
        {question.options.map((option) => {
          const checked = selectedIds.includes(option.id);
          const disabled = !checked && wouldExceed(question, selectedIds, option);

          return (
            <button
              key={option.id}
              onClick={() => onToggle(option.id)}
              disabled={disabled}
              className={checked ? "option selected" : "option"}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {!valid && <div className="warning">指定された数になるように選んでください。</div>}
    </div>
  );
}

function wouldExceed(question, selectedIds, option) {
  const next = [...selectedIds, option.id];
  return selectedMetric(question, next) > question.max;
}


function ExternalPolicyLink() {
  return (
    <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">
      Googleによる広告でのデータ利用について
    </a>
  );
}

function PolicyPage({ page, setPage }) {
  const pages = {
    about: {
      title: "このサイトについて",
      body: (
        <>
          <p>定位置メーカーは、競技かるたの自陣定位置の初期案を作成するためのツールです。</p>
          <p>質問への回答をもとに定位置案を自動生成しますが、特定の配置が勝率向上や競技成績を保証するものではありません。</p>
          <p>実際の定位置は、取り方、暗記のしやすさ、身体感覚、所属会や指導者の方針などに応じて調整してください。</p>
        </>
      ),
    },
    privacy: {
      title: "プライバシーポリシー",
      body: (
        <>
          <p>当サイトでは、サイトの改善、利用状況の把握、広告配信のために、Cookieなどの技術を使用する場合があります。</p>
          <p>当サイトでは、第三者配信の広告サービス「Google AdSense」を利用する場合があります。</p>
          <p>Googleなどの第三者広告配信事業者は、ユーザーの興味に応じた広告を表示するため、Cookieなどの識別子を使用することがあります。</p>
          <p>Cookieを使用することで、当サイトや他サイトへのアクセス情報に基づいて広告が配信される場合があります。ただし、氏名、住所、メールアドレス、電話番号など、個人を直接特定する情報は含まれません。</p>
          <p><ExternalPolicyLink /></p>
          <p>アクセス解析を導入する場合、取得される情報はサイト改善の目的で利用します。</p>
        </>
      ),
    },
    cookie: {
      title: "Cookieについて",
      body: (
        <>
          <p>当サイトでは、利便性の向上、アクセス解析、広告配信のためにCookieを使用する場合があります。</p>
          <p>Cookieとは、ユーザーのブラウザに保存される情報で、サイトの利用状況の把握や広告配信などに利用されます。</p>
          <p>ユーザーはブラウザの設定によりCookieを無効にできます。ただし、一部の機能が正しく動作しない場合があります。</p>
          <p>EEA、英国、スイス等からのアクセスに対しては、Google AdSenseの「Privacy & messaging」またはGoogle認定CMPによる同意メッセージを利用する想定です。</p>
        </>
      ),
    },
    terms: {
      title: "利用規約",
      body: (
        <>
          <p>当サイトは、競技かるたを楽しむための参考ツールとして提供されています。</p>
          <p>ユーザーは、自己の責任において当サイトを利用するものとします。</p>
          <p>当サイトの機能、表示内容、広告表示、掲載情報は、予告なく変更または停止する場合があります。</p>
          <p>当サイトの表示や機能を妨害する行為、不正アクセス、過度な負荷をかける行為を禁止します。</p>
        </>
      ),
    },
    disclaimer: {
      title: "免責事項",
      body: (
        <>
          <p>当サイトの情報および生成される定位置案は、競技かるたを楽しむための参考情報です。</p>
          <p>生成される配置は、競技結果、勝率向上、上達、特定の効果を保証するものではありません。</p>
          <p>当サイトの利用により生じたトラブル、競技結果、練習上の不都合等について、運営者は責任を負いかねます。</p>
          <p>掲載内容や機能は、予告なく変更・停止する場合があります。</p>
        </>
      ),
    },
    contact: {
      title: "お問い合わせ",
      body: (
        <>
          <p>サイトに関するお問い合わせ、不具合報告、削除依頼等は、以下の連絡先までお願いいたします。</p>
          <p>メール：{CONTACT_EMAIL}</p>
          <p>本番公開時は、専用の連絡先メールアドレスに差し替えてください。</p>
        </>
      ),
    },
  };

  const current = pages[page] || pages.about;

  return (
    <section className="policy-page">
      <button className="secondary back-button" onClick={() => setPage("app")}>定位置メーカーに戻る</button>
      <h2>{current.title}</h2>
      <div className="policy-body">{current.body}</div>
    </section>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="footer">
      <button onClick={() => setPage("about")}>このサイトについて</button>
      <button onClick={() => setPage("privacy")}>プライバシーポリシー</button>
      <button onClick={() => setPage("cookie")}>Cookieについて</button>
      <button onClick={() => setPage("terms")}>利用規約</button>
      <button onClick={() => setPage("disclaimer")}>免責事項</button>
      <button onClick={() => setPage("contact")}>お問い合わせ</button>
    </footer>
  );
}

function CookieBanner() {
  const [choice, setChoice] = useState(() => localStorage.getItem("cookieConsent") || "");

  function save(nextChoice) {
    localStorage.setItem("cookieConsent", nextChoice);
    setChoice(nextChoice);
  }

  if (choice) return null;

  return (
    <div className="cookie-banner">
      <div>
        <strong>Cookieの使用について</strong>
        <p>当サイトでは、利便性向上、アクセス解析、広告配信のためCookieを使用する場合があります。</p>
      </div>
      <div className="cookie-actions">
        <button className="secondary" onClick={() => save("declined")}>拒否</button>
        <button className="primary" onClick={() => save("accepted")}>同意する</button>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [page, setPage] = useState("app");
  const allSteps = [...questions, encircleLeftQuestion, encircleRightQuestion];
  const current = allSteps[step];
  const selectedIds = answers[current.id] || [];
  const currentValid = isValid(current, selectedIds);

  const groups = useMemo(() => makeGroups(answers), [answers]);

  const counts = useMemo(() => {
    const right = groups.reduce((sum, group) => sum + (group.side === "right" ? group.cards.length : 0), 0);
    return { right, left: 100 - right };
  }, [groups]);

  function toggle(optionId) {
    setAnswers((prev) => {
      const old = prev[current.id] || [];
      const exists = old.includes(optionId);
      const next = exists ? old.filter((id) => id !== optionId) : [...old, optionId];

      if (!exists && selectedMetric(current, next) > current.max) return prev;
      return { ...prev, [current.id]: next };
    });
  }

  function nextStep() {
    if (!currentValid || isGenerating) return;

    if (step < allSteps.length - 1) {
      setStep(step + 1);
      return;
    }

    generate();
  }

  async function generate() {
    if (isGenerating) return;

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 40));

    try {
      const zoneBySide = encircleZoneBySide(answers);
      const layout = optimizeLayout(makeGroups(answers), zoneBySide, 1000);

      if (!layout) {
        alert("配置に失敗しました。もう一度試してください。");
        return;
      }

      setResult(layout);
    } finally {
      setIsGenerating(false);
    }
  }

  function reset() {
    if (isGenerating) return;
    setStep(0);
    setAnswers({});
    setResult(null);
  }

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <div className="eyebrow">競技かるた</div>
          <h1>定位置メーカー</h1>
        </header>

        {page !== "app" ? (
          <>
            <PolicyPage page={page} setPage={setPage} />
            <Footer setPage={setPage} />
            <CookieBanner />
          </>
        ) : !result ? (
          <div className="layout">
            <section>
              <div className="progress-info">
                <span>{step + 1} / {allSteps.length}</span>
                <span>{Math.round(((step + 1) / allSteps.length) * 100)}%</span>
              </div>

              <div className="progress">
                <div style={{ width: `${((step + 1) / allSteps.length) * 100}%` }} />
              </div>

              <QuestionCard question={current} selectedIds={selectedIds} onToggle={toggle} />

              <div className="nav-buttons">
                <button className="secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                  戻る
                </button>
                <button className="primary" onClick={nextStep} disabled={!currentValid || isGenerating}>
                  {isGenerating ? "作成中..." : step === allSteps.length - 1 ? "完成" : "次へ"}
                </button>
              </div>
            </section>

            <aside className="side">
              <AdSlot />
              <div className="mini-counts">
                <div>
                  <span>左</span>
                  <strong>{counts.left}</strong>
                </div>
                <div>
                  <span>右</span>
                  <strong>{counts.right}</strong>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <section className="result">
            <div className="result-header">
              <h2>完成</h2>
              <div className="result-buttons">
                <button className="secondary" onClick={generate} disabled={isGenerating}>{isGenerating ? "作成中..." : "作り直す"}</button>
                <button className="primary" onClick={reset} disabled={isGenerating}>最初から</button>
              </div>
            </div>

            <Board result={result} />
            <AdSlot compact slot={ADSENSE_SLOT_RESULT} />
          </section>
        )}

        {page === "app" && <Footer setPage={setPage} />}
        <CookieBanner />
      </div>
    </main>
  );
}
