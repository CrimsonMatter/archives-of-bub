(() => {
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const REINDEX_DEBOUNCE_MS = 400;
  const PLAIN_ARCHIVAL_NOTE =
    "CERTAIN CLASSIFICATION ADJUSTMENTS RESOLVE ONLY UNDER PROPER ROTATION. THE READER IS ASSUMED COMPETENT.";

  let renderInProgress = false;
  let lastReindexAt = 0;

  function shuffledAlphabet() {
    const chars = ALPHABET.split("");

    for (let i = chars.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = chars[i];
      chars[i] = chars[j];
      chars[j] = temp;
    }

    return chars.join("");
  }

  function randomSubstitution() {
    let shuffled = shuffledAlphabet();
    while ([...ALPHABET].some((ch, idx) => shuffled[idx] === ch)) {
      shuffled = shuffledAlphabet();
    }

    const map = new Map();
    [...ALPHABET].forEach((ch, idx) => {
      map.set(ch, shuffled[idx]);
    });

    return map;
  }

  function encipher(text, substitutionMap) {
    const upper = text.toUpperCase();
    let output = "";

    for (const ch of upper) {
      output += substitutionMap.get(ch) ?? ch;
    }

    return output;
  }

  function isAlpha(ch) {
    return ch >= "A" && ch <= "Z";
  }

  function sanitizeGuess(value) {
    const upper = value.toUpperCase();
    const match = upper.match(/[A-Z]/);
    return match ? match[0] : "";
  }

  function renderCryptogramBoard(target, text) {
    target.replaceChildren();

    const words = text.split(" ");
    const guessInputs = [];

    function cssLengthToPx(value) {
      const v = (value || "").trim();
      if (!v) return 0;
      if (v.endsWith("px")) return parseFloat(v) || 0;
      if (v.endsWith("rem")) {
        const rootSize =
          parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        return (parseFloat(v) || 0) * rootSize;
      }
      return parseFloat(v) || 0;
    }

    const style = getComputedStyle(target);
    const cellPx = cssLengthToPx(style.getPropertyValue("--cell-width")) || 16;
    const gapPx = cssLengthToPx(style.getPropertyValue("--cell-gap")) || 0;
    const padLeft = cssLengthToPx(style.paddingLeft);
    const padRight = cssLengthToPx(style.paddingRight);
    const innerWidth = Math.max(220, target.clientWidth - padLeft - padRight);
    const maxColumns = Math.max(
      18,
      Math.floor((innerWidth + gapPx) / (cellPx + gapPx))
    );

    function buildLines(rawWords, maxCols) {
      const lines = [];
      let current = "";

      for (const word of rawWords) {
        if (!current) {
          if (word.length <= maxCols) {
            current = word;
          } else {
            let start = 0;
            while (start < word.length) {
              lines.push(word.slice(start, start + maxCols));
              start += maxCols;
            }
          }
          continue;
        }

        const candidate = `${current} ${word}`;
        if (candidate.length <= maxCols) {
          current = candidate;
        } else {
          lines.push(current);
          if (word.length <= maxCols) {
            current = word;
          } else {
            let start = 0;
            while (start < word.length) {
              const chunk = word.slice(start, start + maxCols);
              if (chunk.length === maxCols) {
                lines.push(chunk);
              } else {
                current = chunk;
              }
              start += maxCols;
            }
          }
        }
      }

      if (current) lines.push(current);
      return lines;
    }

    function focusByOffset(current, offset) {
      const index = guessInputs.indexOf(current);
      if (index < 0) return;
      const next = guessInputs[index + offset];
      if (next) next.focus();
    }

    function focusNextEmpty(current) {
      const index = guessInputs.indexOf(current);
      if (index < 0) return;
      for (let i = index + 1; i < guessInputs.length; i += 1) {
        if (!guessInputs[i].value) {
          guessInputs[i].focus();
          return;
        }
      }
    }

    function focusVertical(current, direction) {
      const currentRect = current.getBoundingClientRect();
      const currentX = currentRect.left + currentRect.width / 2;
      const currentY = currentRect.top + currentRect.height / 2;

      let best = null;
      let bestScore = Number.POSITIVE_INFINITY;

      for (const candidate of guessInputs) {
        if (candidate === current) continue;
        const rect = candidate.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        if (direction === "up" && y >= currentY - 1) continue;
        if (direction === "down" && y <= currentY + 1) continue;

        const verticalDistance = Math.abs(y - currentY);
        const horizontalDistance = Math.abs(x - currentX);
        const score = verticalDistance * 4 + horizontalDistance;

        if (score < bestScore) {
          bestScore = score;
          best = candidate;
        }
      }

      if (best) best.focus();
    }

    const lines = buildLines(words, maxColumns);

    for (const lineText of lines) {
      const lineNode = document.createElement("div");
      lineNode.className = "cryptogram__line";

      const cipherRow = document.createElement("div");
      cipherRow.className = "cryptogram__cipher-row";

      const answerRow = document.createElement("div");
      answerRow.className = "cryptogram__answer-row";

      for (const ch of lineText) {
        const cipherCell = document.createElement("span");
        cipherCell.className = "cryptogram__cell";

        const cipherChar = document.createElement("span");
        cipherChar.className = "cryptogram__cipher-char";
        cipherChar.textContent = ch === " " ? "\u00A0" : ch;
        cipherCell.append(cipherChar);
        cipherRow.append(cipherCell);

        const answerCell = document.createElement("span");
        answerCell.className = "cryptogram__cell";

        if (isAlpha(ch)) {
          const input = document.createElement("input");
          input.className = "cryptogram__guess";
          input.type = "text";
          input.maxLength = 1;
          input.autocomplete = "off";
          input.spellcheck = false;
          input.dataset.cipher = ch;
          input.setAttribute("aria-label", `Branch glyph ${ch}`);
          guessInputs.push(input);

          input.addEventListener("input", (event) => {
            const current = event.currentTarget;
            const guess = sanitizeGuess(current.value);
            current.value = guess;
            if (!current.dataset.cipher) return;

            const selector = `input[data-cipher="${current.dataset.cipher}"]`;
            target.querySelectorAll(selector).forEach((node) => {
              if (node !== current) node.value = guess;
            });

            if (guess) focusNextEmpty(current);
          });

          input.addEventListener("keydown", (event) => {
            const current = event.currentTarget;
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              focusByOffset(current, -1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              focusByOffset(current, 1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              focusVertical(current, "up");
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              focusVertical(current, "down");
            }
          });

          answerCell.append(input);
        } else {
          const fixed = document.createElement("span");
          fixed.className = "cryptogram__fixed";
          fixed.setAttribute("aria-hidden", "true");
          fixed.textContent = ch === " " ? "\u00A0" : ch;
          answerCell.append(fixed);
        }

        answerRow.append(answerCell);
      }

      lineNode.append(cipherRow);
      lineNode.append(answerRow);
      target.append(lineNode);
    }
  }

  const button = document.getElementById("reindex-trigger");
  const cryptogram = document.getElementById("cryptogram");

  function renderNewBranch() {
    if (!cryptogram || renderInProgress) return;
    renderInProgress = true;

    try {
      const substitutionMap = randomSubstitution();
      const cipherText = encipher(PLAIN_ARCHIVAL_NOTE, substitutionMap);
      renderCryptogramBoard(cryptogram, cipherText);
    } finally {
      renderInProgress = false;
    }
  }

  if (button && cryptogram) {
    button.addEventListener("click", () => {
      const now = Date.now();
      if (now - lastReindexAt < REINDEX_DEBOUNCE_MS || renderInProgress) return;
      lastReindexAt = now;
      renderNewBranch();
    });
  }
})();
