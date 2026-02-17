(() => {
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const REINDEX_DEBOUNCE_MS = 400;
  const QUOTES = [
    "Of course science is complicated; That wont stop me from explaining it.",
    "Of COURSE the Earth is round; otherwise all the felines would have knocked us all off the edge.",
    "Of course Schrödinger's Cat is dead! It was put in the box 91 years ago!",
    "Of course particles behave differently when observed — they don’t like being watched.",
    "Of COURSE Pavlov proved learning is associative; but the DOG proved humans are easy to program!",
    "Of COURSE water takes the shape of it's container; You want a CUBE of water to fit in a round glass?!",
    "Of COURSE the universe is teeming with life; I suspect they're planning a third-planet intervention!",
    "Of COURSE we’re in a simulation; the laws of physics read like terms and conditions.",
    "Of COURSE light speed is the limit; you think HEAVY speed's gonna move much faster!?",
    "Of COURSE we can’t visit other branches of the Multiverse; we can barely make it to the moon!",
    "Of course we’re in a simulation; The news is our patch notes, and they’ve been massively under-budgeted lately.",
    "Of COURSE we haven’t heard from aliens; they haven't bothered to contact us yet!",
    "Of COURSE quantum entanglement is real. Some particles just CAN'T move on!",
    "Of COURSE Pavlov's bell worked every time; it's just a clapper and a sound bow!",
    "Of COURSE clocks run slower in gravity; the hour hands are LIGHTER when they're out of it!",
    "Of COURSE the Earth is round; why ELSE would they call it a globe?",
    "Of COURSE Schrödinger’s cat is both alive AND dead; we're still waiting to prove that it's NEITHER.",
    "Of COURSE the photon behaves like a particle when it's being observed: We ALL behave when we know we're being watched!",
    "No! Quantum entanglement is not spooky at all: What could go wrong with a long distance relationship?",
    "Of COURSE it’s still the ship of Theseus; You can't get out of insurance premiums THAT easily.",
    "Of COURSE the Earth's not flat: YOU ever see anyone cleaning the nicotine stains off the \"dome\".",
    "There are more hydrogen atoms in a SINGLE water molecule than stars in our ENTIRE solar system.",
    "Of COURSE the dog didn’t need to be hungry; what dog needs MOTIVATION to eat?!",
    "Of COURSE you can’t know the cat’s state until you open the box; we’re physicists, not psychics!",
    "Of COURSE your watch disagrees with mine; mine’s a sundial!",
    "Of COURSE the original is still the Ship of Theseus; the nameplate stayed the same.",
    "Of COURSE the Earth's not flat; otherwise admission to the edge would’ve been monetized… and have merch!",
    "Of COURSE the galaxy looks empty; I’d hide too if humans were searching for me.",
    "Of COURSE the bell became the stimulus; that’s what Ivan Pavlov used!",
    "Of COURSE there’s a universe where the experiment worked; that timeline simply had funding!",
    "If reality IS a simulation, it’s poorly optimized. Seven billion NPCs and no tutorial.",
    "Of COURSE the electron goes through both slits at the same time; that’s what makes the outcome so baffling!",
    "Of COURSE both ships are Theseus’s; imagine the mess of paperwork if they weren’t!",
    "Of COURSE the wave function collapses when you look; who HASN’T experienced loss of flow state?!",
    "Of COURSE you have free will; you freely chose everything you were conditioned to prefer.",
    "Of COURSE Pavlov’s dog started drooling at the bell; Pavlov conditioned it to!",
    "Of COURSE observation collapses the wave function. Being noticed is stressful!",
    "Of COURSE we haven’t heard from intelligent life yet; they communicate logically!",
    "Of COURSE every quantum event splits reality; how ELSE could the Multiverse exist?!",
    "Of COURSE déjà vu is real; your instance just reloaded from a checkpoint.",
    "Of COURSE the particle takes every available path; we ALL optimize for plausible deniability.",
    "Of COURSE parallel worlds don’t collide; NOBODY wants merge conflicts with a reality such as ours!",
    "Of COURSE Free will survives Physics; it just operates under Supervision.",
    "Of COURSE the ship of Theseus is a simple question; Replace ANYTHING long enough, and it becomes MANAGEMENT.",
    "Yes, the Multiverse likely exists; It’s the only explanation for this… one.",
    "Of COURSE nothing observed is unaffected by the observer; that’s why no one can agree on anything.",
    "Of COURSE time slows at high speeds; the universe charges EXTRA for expedited shipping.",
    "Of COURSE Bell’s inequality gets violated; why ELSE would Einstein have called it spooky?!",
    "Of COURSE entangled particles stay correlated across galaxies; separation is MUCH too difficult!",
    "Of COURSE the cat is in a superposition; it’s simultaneously Loves AND loathes you!",
    "Of COURSE ‘now’ depends on your frame of reference; how else could now be now for you now….instead of later?",
    "Of COURSE the moon isn't local; otherwise birds would hit it constantly!",
    "Of COURSE the Multiverse exists; How ELSE could there be a younger version of me.",
    "Of COURSE the world is round; if it had corners, cat hair would have clumped up in them by now!",
    "Of COURSE the dog salivates before the food arrives; it salivates after it’s gone too! It’s ALWAYS salivating!",
    "Meteors would flip it like a pancake.; Of COURSE the world isn’t flat.",
    "You call it free will. Physics calls it supervised autonomy.",
    "Clocks do not disagree, they simply obey gravity; Of COURSE time respects authority.",
    "The cat doesn’t collapse; YOU do. Of COURSE observation changes outcomes.",
    "If Earth were flat, gravity would need instructions: Of COURSE humans would’ve lost them.",
    "Distance means nothing to particles. It's not romantic. That’s entanglement.",
    "You are late, the universe disagrees; Of COURSE relativity complicates punctuality.",
    "You arrived exactly where prior conditions predicted; That felt like freedom.",
    "Authenticity is just agreement; Of COURSE Theseus' rebuilt ship qualifies.",
    "You replaced your cells and no one held a ceremony; Of COURSE it’s still the Ship of Theseus."
  ];

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

  function randomQuote() {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }

  function normalizeQuote(text) {
    return text
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[—–]/g, "-")
      .replace(/…/g, "...")
      .replace(/\u00A0/g, " ");
  }

  function isAlpha(ch) {
    return ch >= "A" && ch <= "Z";
  }

  function sanitizeGuess(value) {
    const upper = value.toUpperCase();
    const match = upper.match(/[A-Z]/);
    return match ? match[0] : "";
  }

  function renderCryptogramBoard(target, text, plainText, onSolvedChange) {
    target.replaceChildren();

    const words = text.split(" ");
    const guessInputs = [];
    const plainUpper = plainText.toUpperCase();
    const solutionByCipher = new Map();
    let solved = false;

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

    for (let i = 0; i < text.length; i += 1) {
      const cipherCh = text[i];
      const plainCh = plainUpper[i];
      if (isAlpha(cipherCh) && isAlpha(plainCh) && !solutionByCipher.has(cipherCh)) {
        solutionByCipher.set(cipherCh, plainCh);
      }
    }

    function checkSolved() {
      for (const [cipherChar, plainChar] of solutionByCipher.entries()) {
        const selector = `input[data-cipher="${cipherChar}"]`;
        const nodes = target.querySelectorAll(selector);
        if (!nodes.length) return false;
        for (const node of nodes) {
          if (node.value !== plainChar) return false;
        }
      }
      return true;
    }

    function updateSolvedState() {
      const nextSolved = checkSolved();
      if (nextSolved !== solved) {
        solved = nextSolved;
        onSolvedChange(nextSolved);
      }
    }

    onSolvedChange(false);

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
            updateSolvedState();
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
  const alignmentConfirmation = document.getElementById("alignment-confirmation");

  function setAlignmentAcknowledgment(isConfirmed) {
    if (!alignmentConfirmation) return;
    alignmentConfirmation.textContent = isConfirmed ? "Branch alignment confirmed." : "";
    alignmentConfirmation.classList.toggle("is-visible", isConfirmed);
  }

  function renderNewBranch() {
    if (!cryptogram || renderInProgress) return;
    renderInProgress = true;

    try {
      const plainText = normalizeQuote(randomQuote());
      const substitutionMap = randomSubstitution();
      const cipherText = encipher(plainText, substitutionMap);
      renderCryptogramBoard(cryptogram, cipherText, plainText, setAlignmentAcknowledgment);
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
