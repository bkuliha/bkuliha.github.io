(function () {
  const CODE_SLOTS = [
    { slot: 1, label: "1. cislica", source: "Prva stopa" },
    { slot: 2, label: "2. cislica", source: "Druha stopa" },
    { slot: 3, label: "3. cislica", source: "Tretia stopa" },
    { slot: 4, label: "4. cislica", source: "Posledna stopa" }
  ];

  const sceneBadge = document.getElementById("sceneBadge");
  const sceneStep = document.getElementById("sceneStep");
  const sceneTitle = document.getElementById("sceneTitle");
  const sceneLead = document.getElementById("sceneLead");
  const sceneTags = document.getElementById("sceneTags");
  const sceneArt = document.getElementById("sceneArt");
  const storyPanel = document.getElementById("storyPanel");
  const storyContent = document.getElementById("storyContent");
  const choices = document.getElementById("choices");
  const challengePanel = document.getElementById("challengePanel");
  const challengeTitle = document.getElementById("challengeTitle");
  const challengePrompt = document.getElementById("challengePrompt");
  const challengeVisual = document.getElementById("challengeVisual");
  const challengeOptions = document.getElementById("challengeOptions");
  const inputWrap = document.getElementById("inputWrap");
  const answerInput = document.getElementById("answerInput");
  const submitAnswerButton = document.getElementById("submitAnswerButton");
  const feedbackText = document.getElementById("feedbackText");
  const hintText = document.getElementById("hintText");
  const hintButton = document.getElementById("hintButton");
  const companionName = document.getElementById("companionName");
  const companionText = document.getElementById("companionText");
  const progressBadge = document.getElementById("progressBadge");
  const codeBoard = document.getElementById("codeBoard");
  const routeLog = document.getElementById("routeLog");
  const goalText = document.getElementById("goalText");
  const restartButton = document.getElementById("restartButton");

  const SCENES = {
    P1: {
      kind: "story",
      badge: "P1",
      step: "Titulka",
      title: "KNIHA O ZAHADNYCH CISLACH",
      lead: "Vetvena matematicka escape room z kniznice.",
      art: "art-title",
      tags: ["kniha", "kniznica", "4 cislice"],
      sidebarTitle: "Zaciatok pribehu",
      sidebarText: "Pred tebou je titulna strana a vstup do kniznice plnej stop.",
      goal: "Stlac Zacat a otvor staru knihu.",
      bodyHtml: `
        <p>Stara kniha caká na otvorenie. Niekde medzi policami sa skrýva kod, ktory odhali tajomstvo kniznice.</p>
        <blockquote>V kniznici nestaci len citat. Treba aj porovnavat, pocitat a vybrat spravnu cestu.</blockquote>
      `,
      choices: [
        {
          label: "Zacat",
          description: "Vstup do kniznice a otvor knihu so zazracnym listkom.",
          action: { type: "goto", target: "P2" }
        }
      ]
    },
    P2: {
      kind: "story",
      badge: "P2",
      step: "Uvod v kniznici",
      title: "Kniha sa otvorila",
      lead: "Timea nasla staru knihu a z nej vypadol zazltnuty listok.",
      art: "art-intro",
      tags: ["listok", "tajomstvo", "prva stopa"],
      sidebarTitle: "Stara kniha",
      sidebarText: "Prva cislica sa ukryva tam, kde su cisla zoradene.",
      goal: "Pokračuj k prvym stopam v kniznici.",
      bodyHtml: `
        <p>Timea prisla do kniznice hladat knihu na skolsky projekt. Na spodnej polici nasla staru, tazku knihu. Na obale bolo napisane <strong>Kniha o zahadnych cislach</strong>.</p>
        <p>Keď ju otvorila, vypadol z nej zazltnuty listok.</p>
        <blockquote>"Kto chce odhalit tajomstvo kniznice, musi najst 4 cislice. Pozor! Nie vsetky cesty vedu spravne. Prva cislica sa ukryva tam, kde su cisla zoradene."</blockquote>
        <p>Timea sa obzrela po kniznici. Kam pojde najskor?</p>
      `,
      choices: [
        {
          label: "Prezriet si stopy v kniznici",
          description: "Rozhliadni sa po kniznici a vyber prvu cestu.",
          action: { type: "goto", target: "P3" }
        }
      ]
    },
    P3: {
      kind: "story",
      badge: "P3",
      step: "Prva volba",
      title: "Kam sa vybrat najskor?",
      lead: "Prva cislica sa skryva tam, kde su cisla zoradene.",
      art: "art-choice",
      tags: ["katalog", "regal", "prva volba"],
      sidebarTitle: "Prva krizovatka",
      sidebarText: "Vyber spravny zaciatok. Niektore cesty ta len zdrzia.",
      goal: "Rozhodni, kam Timea zamieri ako prve.",
      bodyHtml: `
        <p>Kam sa Timea vyberie ako prve?</p>
      `,
      choices: [
        {
          label: "Pozriet katalog",
          description: "Miesto, kde su knihy a cisla zoradene presne podla systemu.",
          action: { type: "goto", target: "P4" }
        },
        {
          label: "Preskumat naucny regal",
          description: "Polica s knihami, na ktorych chrbtoch svietia velke cisla.",
          action: { type: "goto", target: "P5" }
        },
        {
          label: "Spytat sa hned knihovnicky",
          description: "Mozno poradi, ale mozno len vrati Timeu spat k listku.",
          action: { type: "goto", target: "D1" }
        }
      ]
    },
    D1: {
      kind: "story",
      badge: "D1",
      step: "Slepa ulicka",
      title: "Pult vypoziciek",
      lead: "Knihovnicka usmerni Timeu spat k cislom.",
      art: "art-deadend",
      tags: ["slepa ulicka", "spat", "hint"],
      sidebarTitle: "Slepa ulicka",
      sidebarText: "Najprv treba pozerat na cisla, nie na ludi.",
      goal: "Vrat sa a hladaj miesto, kde su cisla zoradene.",
      bodyHtml: `
        <p>Timea prisla ku knihovnicke, ale ta len potichu ukazala na listok.</p>
        <blockquote>"Prva stopa hovori: tam, kde su cisla zoradene. Zatial sa nepozeraj na ludi. Pozeraj na cisla."</blockquote>
      `,
      choices: [
        {
          label: "Spat do kniznice",
          description: "Vrat sa k prvej volbe a skus inu cestu.",
          action: { type: "goto", target: "P3" }
        }
      ]
    },
    P4: {
      kind: "quiz",
      badge: "P4",
      step: "Katalog",
      title: "KATALOG",
      lead: "Prva matematicka stopa je ukryta medzi usporiadanymi cislami.",
      art: "art-catalog",
      tags: ["porovnavanie", "1. cislica", "katalog"],
      sidebarTitle: "Katalog",
      sidebarText: "Spocitaj len cisla vacsie ako 4 000 a mensie ako 8 000.",
      goal: "Najdi spravny pocet a otvor cestu k 1. cislici.",
      hint: "Pozri len tie cisla, ktore splnaju obe podmienky naraz: su vacsie ako 4 000 a mensie ako 8 000.",
      challengeTitle: "Prva uloha",
      promptHtml: `
        <p>V katalogu Timea nasla listok s cislami:</p>
        <div class="scene-note">4205, 3998, 6781, 8001, 7102, 2988</div>
        <p><strong>Uloha:</strong> Kolko z tychto cisel je vacsich ako 4 000 a zaroven mensich ako 8 000?</p>
        <p class="scene-note">Ak odpovies spravne, ziskas 1. cislicu kodu.</p>
      `,
      visualHtml: `
        <div class="visual-list">
          <div class="visual-pill">4205</div>
          <div class="visual-pill">3998</div>
          <div class="visual-pill">6781</div>
          <div class="visual-pill">8001</div>
          <div class="visual-pill">7102</div>
          <div class="visual-pill">2988</div>
        </div>
      `,
      choices: [
        {
          label: "2",
          description: "Vyber tuto moznost, ak si nasla len dve vhodne cisla.",
          action: { type: "feedback", message: "Este raz. Skontroluj 4205, 6781 a 7102." }
        },
        {
          label: "3",
          description: "Spravna odpoved otvori chodbu s prvou cislicou.",
          action: { type: "goto", target: "P6" }
        },
        {
          label: "4",
          description: "Skus este raz prepocitat iba cisla v spravnom intervale.",
          action: { type: "feedback", message: "Nie, 8001 je uz viac ako 8 000 a 3998 je menej ako 4 000." }
        }
      ]
    },
    P5: {
      kind: "quiz",
      badge: "P5",
      step: "Naucny regal",
      title: "NAUCNY REGAL",
      lead: "Aj tato cesta vie priniest prvu cislicu, ak Timea spravne zaokruhli.",
      art: "art-shelf",
      tags: ["zaokruhlovanie", "1. cislica", "regal"],
      sidebarTitle: "Naucny regal",
      sidebarText: "Zaokruhluj na tisice. Nepostaci, ze cislo zacina stvorkou.",
      goal: "Zisti, kolko cisel sa po zaokruhleni zmeni na 4 000.",
      hint: "Pozeraj na stovky. Ak je v stovkach 5 alebo viac, cislo ide hore na dalsiu tisicku.",
      challengeTitle: "Prva uloha",
      promptHtml: `
        <p>Na chrbtoch knih boli cisla:</p>
        <div class="scene-note">3511, 3622, 4477, 4510, 5488</div>
        <p><strong>Uloha:</strong> Zaokruhli tieto cisla na tisice. Kolko z nich sa po zaokruhleni zmeni na 4 000?</p>
        <p class="scene-note">Spravny vysledok ti da 1. cislicu kodu.</p>
      `,
      visualHtml: `
        <div class="visual-list">
          <div class="visual-pill">3511</div>
          <div class="visual-pill">3622</div>
          <div class="visual-pill">4477</div>
          <div class="visual-pill">4510</div>
          <div class="visual-pill">5488</div>
        </div>
      `,
      choices: [
        {
          label: "2",
          description: "Skus este raz prepocitat knihy, ktore ostanu pri 4 000.",
          action: { type: "feedback", message: "Este nie. Nezabudni, ze 4477 sa po zaokruhleni tiez zmeni na 4 000." }
        },
        {
          label: "3",
          description: "Spravna odpoved otvori chodbu s cislami.",
          action: { type: "goto", target: "P6" }
        },
        {
          label: "4",
          description: "Tato volba vedie do slepej ulicky medzi rozpravky.",
          action: { type: "goto", target: "D2" }
        }
      ]
    },
    D2: {
      kind: "story",
      badge: "D2",
      step: "Slepa ulicka",
      title: "Rozpravkovy regal",
      lead: "Karticka pripomenie, ze zaokruhlovanie nie je len o prvej cifre.",
      art: "art-deadend",
      tags: ["rozpravky", "zaokruhlovanie", "spat"],
      sidebarTitle: "Rozpravkovy regal",
      sidebarText: "Nie vsetko, co zacina stvorkou, ostane styri tisic.",
      goal: "Vrat sa a prepocitaj zaokruhlenie nanovo.",
      bodyHtml: `
        <p>Timea omylom vosla medzi rozpravkove knihy. Z jednej vypadla karticka.</p>
        <blockquote>"Pozor na zaokruhlovanie. Nie vsetko, co zacina stvorkou, ostane styri tisic."</blockquote>
      `,
      choices: [
        {
          label: "Spat k naucnemu regalu",
          description: "Vrat sa k uvahe o zaokruhlovani na tisice.",
          action: { type: "goto", target: "P5" }
        }
      ]
    },
    P6: {
      kind: "story",
      badge: "P6",
      step: "Chodba s cislami",
      title: "Chodba s cislami",
      lead: "Timea ziskala prvu cislicu a pred nou sa objavili tri dvere.",
      art: "art-corridor",
      tags: ["1. cislica", "dvere", "presna volba"],
      sidebarTitle: "Prva cislica",
      sidebarText: "Spravna prva cislica je 3. Len presne cislo otvori spravne dvere.",
      goal: "Otvor dvere s cislom 3.",
      unlockDigit: { slot: 1, value: "3", source: "P6 – Chodba s cislami" },
      bodyHtml: `
        <p>Timea ziskala <strong>1. cislicu kodu: 3</strong>.</p>
        <p>Pred nou sa objavila uzka chodba s tromi dverami.</p>
        <blockquote>"Prva cislica ti otvori spravnu cestu."</blockquote>
        <div class="visual-doors">
          <div class="visual-door">Dvere 3</div>
          <div class="visual-door">Dvere 4</div>
          <div class="visual-door">Dvere 5</div>
        </div>
      `,
      choices: [
        {
          label: "Dvere 3",
          description: "Presna prva cislica otvara presne tieto dvere.",
          action: { type: "goto", target: "P7" }
        },
        {
          label: "Dvere 4",
          description: "Susedne cislo vedie do slepej ulicky.",
          action: { type: "goto", target: "D3" }
        },
        {
          label: "Dvere 5",
          description: "Zvacseny vysledok nie je spravna odpoved.",
          action: { type: "goto", target: "D4" }
        }
      ]
    },
    D3: {
      kind: "story",
      badge: "D3",
      step: "Slepa ulicka",
      title: "Dvere cislo 4",
      lead: "Susedne cislo nestaci.",
      art: "art-deadend",
      tags: ["dvere", "presny vysledok", "spat"],
      sidebarTitle: "Zly vstup",
      sidebarText: "Nepotrebujes susedne cislo. Potrebujes presny vysledok.",
      goal: "Vrat sa do chodby a otvor dvere 3.",
      bodyHtml: `
        <p>Za dverami cislo 4 boli len prazdne police a maly papierik.</p>
        <blockquote>"Toto nie je tvoja cesta. Nepotrebujes susedne cislo. Potrebujes presny vysledok."</blockquote>
      `,
      choices: [
        {
          label: "Spat do chodby",
          description: "Vrat sa k trom dveram.",
          action: { type: "goto", target: "P6" }
        }
      ]
    },
    D4: {
      kind: "story",
      badge: "D4",
      step: "Slepa ulicka",
      title: "Dvere cislo 5",
      lead: "Odpoved si netreba zvacsovat ani zmensovat.",
      art: "art-deadend",
      tags: ["dvere", "presnost", "spat"],
      sidebarTitle: "Zly vstup",
      sidebarText: "Presna cislica otvara presne dvere.",
      goal: "Vrat sa a zvol dvere 3.",
      bodyHtml: `
        <p>Za dverami cislo 5 bolo zamknute okno a dalsi odkaz.</p>
        <blockquote>"Odpoved si nezvacsuj ani nezmensuj. Presna cislica otvara presne dvere."</blockquote>
      `,
      choices: [
        {
          label: "Spat do chodby",
          description: "Skus znova vybrat spravne dvere.",
          action: { type: "goto", target: "P6" }
        }
      ]
    },
    P7: {
      kind: "story",
      badge: "P7",
      step: "Atlasova mapa",
      title: "ATLASOVA MAPA KNIZNICE",
      lead: "Za dverami cislo 3 nasla Timea staru mapu s tromi miestami.",
      art: "art-map",
      tags: ["mapa", "neparna cislica", "volba"],
      sidebarTitle: "Mapa kniznice",
      sidebarText: "Ak je prva cislica neparna, treba hladat miesto, kde stare spravy sepkanu.",
      goal: "Vyber Archív novin.",
      bodyHtml: `
        <p>Na mape boli oznacene tri miesta:</p>
        <ul>
          <li>Archiv novin</li>
          <li>Citatelsky kutik</li>
          <li>Suterenny sklad</li>
        </ul>
        <blockquote>"Ak je prva cislica neparna, hladaj tam, kde stare spravy stale sepkaju."</blockquote>
      `,
      choices: [
        {
          label: "Archiv novin",
          description: "Stare spravy sa skryvaju prave tu.",
          action: { type: "goto", target: "P8" }
        },
        {
          label: "Citatelsky kutik",
          description: "Ticho a pohodlie, ale nie spravna stopa.",
          action: { type: "goto", target: "D5" }
        },
        {
          label: "Suterenny sklad",
          description: "Tato cesta patri len sudym kodom.",
          action: { type: "goto", target: "D6" }
        }
      ]
    },
    D5: {
      kind: "story",
      badge: "D5",
      step: "Slepa ulicka",
      title: "Citatelsky kutik",
      lead: "Tu sa cita, ale stare spravy sa neschovavaju medzi kreslami.",
      art: "art-deadend",
      tags: ["kutik", "noviny", "spat"],
      sidebarTitle: "Zla miestnost",
      sidebarText: "Stare noviny nehladaj v citatelskom kutiku.",
      goal: "Vrat sa k mape a zvol Archiv novin.",
      bodyHtml: `
        <p>V citatelskom kutiku bolo ticho. Na kresle lezali len zalozky a jedna stara veta.</p>
        <blockquote>"Tu sa cita. Ale stare spravy sa necitaju tu."</blockquote>
      `,
      choices: [
        {
          label: "Spat k mape",
          description: "Vrat sa a hladaj miesto so starymi novinami.",
          action: { type: "goto", target: "P7" }
        }
      ]
    },
    D6: {
      kind: "story",
      badge: "D6",
      step: "Slepa ulicka",
      title: "Suterenny sklad",
      lead: "Na dverach visela tabulka pre sudy kod.",
      art: "art-deadend",
      tags: ["sklad", "neparna cislica", "spat"],
      sidebarTitle: "Suterenny sklad",
      sidebarText: "Prva cislica je 3, teda neparna. Tato cesta nie je pre nu.",
      goal: "Vrat sa k mape a zvol Archiv novin.",
      bodyHtml: `
        <p>V suterennom sklade bolo chladno a tmavo. Na dverach visela tabulka.</p>
        <blockquote>"Vstup len pre sude kody."</blockquote>
        <p>Timea si spomenula, ze jej prva cislica bola <strong>3</strong>, teda neparna.</p>
      `,
      choices: [
        {
          label: "Spat k mape",
          description: "Skus miesto, kde stare spravy sepkanu.",
          action: { type: "goto", target: "P7" }
        }
      ]
    },
    P8: {
      kind: "quiz",
      badge: "P8",
      step: "Archiv novin",
      title: "ARCHIV NOVIN",
      lead: "V archive caka dalsi vypocet a druha cislica kodu.",
      art: "art-archive",
      tags: ["odcitanie", "2. cislica", "archiv"],
      sidebarTitle: "Archiv novin",
      sidebarText: "Vypocitaj 8 420 - 2 315 a vezmi cislicu tisicov.",
      goal: "Zisti tisicku vo vysledku 8 420 - 2 315.",
      hint: "Najprv vypocitaj cely priklad. Potom sa pozri len na cislicu tisicov vo vysledku.",
      challengeTitle: "Ziskaj druhu cislicu",
      promptHtml: `
        <p>V archive nasla Timea obalku s napisom <strong>"Ziskaj druhu cislicu."</strong></p>
        <p>V obalke bol priklad:</p>
        <div class="scene-note">8 420 - 2 315 = ?</div>
        <p><strong>Otazka 1:</strong> Vypocitaj vysledok.</p>
        <p><strong>Otazka 2:</strong> Cislica tisicov vo vysledku je 2. cislica kodu.</p>
      `,
      visualHtml: `
        <div class="visual-stack">
          <div class="visual-card">8 420</div>
          <div class="visual-card">- 2 315</div>
          <div class="visual-card">?</div>
        </div>
      `,
      choices: [
        {
          label: "5",
          description: "Vyber, ak si myslis, ze vo vysledku su tisice rovne 5.",
          action: { type: "feedback", message: "Nie. Cely vysledok je 6 105, takze cislica tisicov je vacsia." }
        },
        {
          label: "6",
          description: "Spravna odpoved otvori dalsiu stopu v archive.",
          action: { type: "goto", target: "P9" }
        },
        {
          label: "7",
          description: "Skus este raz odpocitat po stlpcoch.",
          action: { type: "feedback", message: "Nie. Po odcitani vyjde 6 105, nie 7 105." }
        }
      ]
    },
    P9: {
      kind: "story",
      badge: "P9",
      step: "Zasuvky archivu",
      title: "Zasuvky archivu",
      lead: "Timea ma uz aj druhu cislicu a musi spravne zaokruhlit vysledok.",
      art: "art-drawers",
      tags: ["2. cislica", "zaokruhlenie", "zasuvky"],
      sidebarTitle: "Druha cislica",
      sidebarText: "Vysledok 6 105 sa zaokruhluje na stovky na 6 100.",
      goal: "Otvor zasuvku 6100.",
      unlockDigit: { slot: 2, value: "6", source: "P8 – Archiv novin" },
      bodyHtml: `
        <p>Timea uz ma aj <strong>2. cislicu kodu: 6</strong>.</p>
        <p>Vysledok z archivu bol <strong>6 105</strong>. Na stole su tri zasuvky.</p>
        <blockquote>"Zaokruhli vysledok na stovky a otvor spravnu zasuvku."</blockquote>
        <div class="visual-drawers">
          <div class="visual-drawer">6000</div>
          <div class="visual-drawer">6100</div>
          <div class="visual-drawer">6200</div>
        </div>
      `,
      choices: [
        {
          label: "6000",
          description: "Tato zasuvka miesa stovky s tisickami.",
          action: { type: "goto", target: "D7" }
        },
        {
          label: "6100",
          description: "Spravna zasuvka po zaokruhleni na stovky.",
          action: { type: "goto", target: "P10" }
        },
        {
          label: "6200",
          description: "Posledne dve cislice zatial neposunu vysledok tak vysoko.",
          action: { type: "goto", target: "D8" }
        }
      ]
    },
    D7: {
      kind: "story",
      badge: "D7",
      step: "Slepa ulicka",
      title: "Zasuvka 6000",
      lead: "Papierik pripomenie, ze ide o zaokruhlovanie na stovky.",
      art: "art-deadend",
      tags: ["zasuvka", "stovky", "spat"],
      sidebarTitle: "Zla zasuvka",
      sidebarText: "Zaokruhlujes na stovky, nie na tisice.",
      goal: "Vrat sa k zasuvkam a otvor 6100.",
      bodyHtml: `
        <p>V zasuvke bolo len pierko a odkaz.</p>
        <blockquote>"Zaokruhlujes na stovky, nie na tisice."</blockquote>
      `,
      choices: [
        {
          label: "Spat k zasuvkam",
          description: "Vrat sa a skus spravne zaokruhlit 6 105.",
          action: { type: "goto", target: "P9" }
        }
      ]
    },
    D8: {
      kind: "story",
      badge: "D8",
      step: "Slepa ulicka",
      title: "Zasuvka 6200",
      lead: "Posledne dve cislice este nie su dost silne na skok vyssie.",
      art: "art-deadend",
      tags: ["zasuvka", "stovky", "spat"],
      sidebarTitle: "Zla zasuvka",
      sidebarText: "Pozri sa este raz na posledne dve cislice a na pravidlo zaokruhlovania.",
      goal: "Vrat sa k zasuvkam a otvor 6100.",
      bodyHtml: `
        <p>V zasuvke sa skryval papierik.</p>
        <blockquote>"Pozri sa este raz na posledne dve cislice. Je to dost na skok vyssie?"</blockquote>
      `,
      choices: [
        {
          label: "Spat k zasuvkam",
          description: "Vrat sa a skus inu zasuvku.",
          action: { type: "goto", target: "P9" }
        }
      ]
    },
    P10_BASE: {
      kind: "quiz",
      badge: "P10",
      step: "Sepkajuca mapa",
      title: "SEPKAJUCA MAPA",
      lead: "Mapa ukazuje tri vypocty. Len jeden z nich je najvacsi.",
      art: "art-whisper",
      tags: ["scitanie", "odcitanie", "3. cislica"],
      sidebarTitle: "Sepkajuca mapa",
      sidebarText: "Porovnaj vysledky A, B a C. Najvacsie cislo prinesie tretiu cislicu.",
      goal: "Zisti, ktory vysledok je najvacsi.",
      hint: "Spocitaj A, B a C a porovnaj vysledne 4-ciferne cisla medzi sebou.",
      challengeTitle: "Najvacsie cislo",
      promptHtml: `
        <p>Po otvoreni spravnej zasuvky Timea nasla staru mapu a na nej tri vypocty:</p>
      `,
      visualHtml: `
        <div class="visual-calc">
          <div class="visual-equation">A = 4 250 + 2 499</div>
          <div class="visual-equation">B = 9 000 - 2 121</div>
          <div class="visual-equation">C = 3 333 + 3 667</div>
        </div>
      `,
      choices: [
        {
          label: "A",
          description: "Vyber, ak si myslis, ze najvacsi vysledok je A.",
          action: { type: "feedback", message: "Nie. A je 6 749 a B je este vacsie." }
        },
        {
          label: "B",
          description: "Vyber, ak si myslis, ze najvacsi vysledok je B.",
          action: { type: "feedback", message: "Nie. B je 6 879, ale C je este vacsie." }
        },
        {
          label: "C",
          description: "Spravna volba odhali 3. cislicu kodu.",
          action: {
            type: "reveal",
            flag: "p10Solved",
            unlockDigit: { slot: 3, value: "7", source: "P10 – Sepkajuca mapa" },
            message: "Najvacsie cislo je 7 000. To znamena, ze 3. cislica kodu je 7."
          }
        }
      ]
    },
    P10_REVEAL: {
      kind: "quiz",
      badge: "P10",
      step: "Sepkajuca mapa",
      title: "SEPKAJUCA MAPA",
      lead: "Najvacsie cislo je zname a Timea uz pozna tretiu cislicu.",
      art: "art-whisper",
      tags: ["3. cislica", "sedmicka", "dalsia volba"],
      sidebarTitle: "Tretia cislica",
      sidebarText: "Najvacsie cislo bolo 7 000, preto je tretia cislica 7.",
      goal: "Najdi Skrinku siedmich kariet.",
      hint: "Ak najvacsie cislo vyslo presne 7 000, treba hladat miesto so sedmickou v nazve.",
      challengeTitle: "3. cislica odhalena",
      promptHtml: `
        <p><strong>Najvacsie cislo je 7 000.</strong></p>
        <p class="scene-note strong">To znamena, ze 3. cislica kodu je 7.</p>
        <p>Ak je najvacsie cislo presne 7 000, hladaj <strong>Skrinku siedmich kariet</strong>.</p>
      `,
      visualHtml: `
        <div class="visual-doors">
          <div class="visual-door">Skrinka siedmich kariet</div>
          <div class="visual-door">Rebrik k hornym policiam</div>
          <div class="visual-door">Globus</div>
        </div>
      `,
      choices: [
        {
          label: "Skrinka siedmich kariet",
          description: "Spravna cesta podla mapy a vysledku 7 000.",
          action: { type: "goto", target: "P11" }
        },
        {
          label: "Rebrik k hornym policiam",
          description: "Sedmicka tu neukazuje vysku.",
          action: { type: "goto", target: "D9" }
        },
        {
          label: "Globus",
          description: "Mapa nehovori o svete, ale o skrinke.",
          action: { type: "goto", target: "D10" }
        }
      ]
    },
    D9: {
      kind: "story",
      badge: "D9",
      step: "Slepa ulicka",
      title: "Rebrik k hornym policiam",
      lead: "Sedmicka neukazuje vysku, ale miesto.",
      art: "art-deadend",
      tags: ["sedmicka", "rebrik", "spat"],
      sidebarTitle: "Zla cesta",
      sidebarText: "Sedmicka ta neposiela hore, ale k spravnemu miestu.",
      goal: "Vrat sa k mape a vyber skrinku.",
      bodyHtml: `
        <p>Timea vyliezla po rebriku, no nasla iba zaprasene encyklopedie. Medzi nimi bol odkaz.</p>
        <blockquote>"Sedmicka neukazuje vysku. Ukazuje miesto."</blockquote>
      `,
      choices: [
        {
          label: "Spat k mape",
          description: "Vrat sa k Sepkajucej mape.",
          action: { type: "goto", target: "P10" }
        }
      ]
    },
    D10: {
      kind: "story",
      badge: "D10",
      step: "Slepa ulicka",
      title: "Globus",
      lead: "Globus ukazuje svet, ale nie spravnu skrinku.",
      art: "art-deadend",
      tags: ["globus", "skrinka", "spat"],
      sidebarTitle: "Zla cesta",
      sidebarText: "Mapa spomina skrinku, nie globus.",
      goal: "Vrat sa k mape a vyber skrinku siedmich kariet.",
      bodyHtml: `
        <p>Pri globuse bola schovana mala karticka.</p>
        <blockquote>"Globus ukazuje svet. Ty vsak hladas skrinku."</blockquote>
      `,
      choices: [
        {
          label: "Spat k mape",
          description: "Vrat sa k Sepkajucej mape.",
          action: { type: "goto", target: "P10" }
        }
      ]
    },
    P11: {
      kind: "quiz",
      badge: "P11",
      step: "Skrinka siedmich kariet",
      title: "SKRINKA SIEDMICH KARIET",
      lead: "Treba najst cislo najblizsie k 8 000 a potom urcit rozdiel.",
      art: "art-cabinet",
      tags: ["porovnavanie", "vzdialenost", "schodisko"],
      sidebarTitle: "Skrinka kariet",
      sidebarText: "Najblizsie k 8 000 je 8 001, rozdiel je 1.",
      goal: "Vyber Schodisko 1.",
      hint: "Porovnaj, o kolko sa kazde cislo lisi od 8 000. Hladas najmensi rozdiel.",
      challengeTitle: "Najblizsie k 8 000",
      promptHtml: `
        <p>V skrinke boli 4 karty s cislami:</p>
        <div class="scene-note">7 951, 7 499, 8 001, 7 050</div>
        <blockquote>"Najdi cislo, ktore je najblizsie k 8 000. Potom zisti, o kolko sa lisi. To ti ukaze spravne schodisko."</blockquote>
      `,
      visualHtml: `
        <div class="visual-cards">
          <div class="visual-card">7 951</div>
          <div class="visual-card">7 499</div>
          <div class="visual-card">8 001</div>
          <div class="visual-card">7 050</div>
        </div>
      `,
      choices: [
        {
          label: "Schodisko 1",
          description: "Rozdiel od 8 000 je len 1.",
          action: { type: "goto", target: "P12" }
        },
        {
          label: "Schodisko 49",
          description: "Si blizko, ale nevybrala si najspravnejsiu kartu.",
          action: { type: "goto", target: "D11" }
        },
        {
          label: "Schodisko 501",
          description: "Toto schodisko patri vacsiemu rozdielu.",
          action: { type: "goto", target: "D12" }
        }
      ]
    },
    D11: {
      kind: "story",
      badge: "D11",
      step: "Slepa ulicka",
      title: "Schodisko 49",
      lead: "Si blizko, ale nie pri najblizsom cisle.",
      art: "art-deadend",
      tags: ["schodisko", "rozdiel", "spat"],
      sidebarTitle: "Takmer",
      sidebarText: "Treba vybrat cislo NAJBLIZSIE k 8 000, nie len blizke.",
      goal: "Vrat sa ku kartam a hladaj najmensi rozdiel.",
      bodyHtml: `
        <p>Na 49. schode bola len uzamknuta skrinka a veta.</p>
        <blockquote>"Si blizko, ale nevybral si cislo, ktore bolo NAJBLIZSIE."</blockquote>
      `,
      choices: [
        {
          label: "Spat ku kartam",
          description: "Porovnaj vzdialenosti od 8 000 este raz.",
          action: { type: "goto", target: "P11" }
        }
      ]
    },
    D12: {
      kind: "story",
      badge: "D12",
      step: "Slepa ulicka",
      title: "Schodisko 501",
      lead: "Papierova sova pripomenie, ze treba najmensi rozdiel.",
      art: "art-deadend",
      tags: ["schodisko", "rozdiel", "spat"],
      sidebarTitle: "Zla vzdialenost",
      sidebarText: "Nehľadaj len male cislo. Hladaj najmensi rozdiel od 8 000.",
      goal: "Vrat sa ku kartam a zvol Schodisko 1.",
      bodyHtml: `
        <p>Na 501. schode sedela len papierova sova a pod nou odkaz.</p>
        <blockquote>"Porovnaj vzdialenosti este raz. Nehladaj len male cislo. Hladaj najmensi rozdiel."</blockquote>
      `,
      choices: [
        {
          label: "Spat ku kartam",
          description: "Vrat sa a prepocitaj rozdiely.",
          action: { type: "goto", target: "P11" }
        }
      ]
    },
    P12_BASE: {
      kind: "quiz",
      badge: "P12",
      step: "Finalny pult",
      title: "FINALNY PULT",
      lead: "Pred poslednym zamkom treba zistit 4. cislicu kodu.",
      art: "art-final",
      tags: ["finale", "4. cislica", "zaokruhlenie"],
      sidebarTitle: "Posledna stopa",
      sidebarText: "Vyber najvacsi vysledok. Po zaokruhleni na tisice z neho ziskas 9.",
      goal: "Najdi najvacsi vysledok medzi A, B a C.",
      hint: "Najprv porovnaj vysledky A, B a C. Az potom premyslaj nad zaokruhlenim na tisice.",
      challengeTitle: "Zisti 4. cislicu",
      promptHtml: `
        <p>Timea prisla k staremu pultu. Na nom bol posledny zamok a napis:</p>
        <blockquote>"Pred poslednym krokom zisti 4. cislicu."</blockquote>
      `,
      visualHtml: `
        <div class="visual-calc">
          <div class="visual-equation">A = 9 500 - 550</div>
          <div class="visual-equation">B = 8 300 + 520</div>
          <div class="visual-equation">C = 9 999 - 1 250</div>
        </div>
      `,
      choices: [
        {
          label: "A",
          description: "Vyber, ak si myslis, ze A je najvacsi vysledok.",
          action: {
            type: "reveal",
            flag: "p12Solved",
            unlockDigit: { slot: 4, value: "9", source: "P12 – Finalny pult" },
            message: "Najvacsi vysledok je 8 950. Po zaokruhleni na tisice dostanes 9 000, teda 4. cislica kodu je 9."
          }
        },
        {
          label: "B",
          description: "Skus este raz porovnat vysledky vsetkych troch prikladov.",
          action: { type: "feedback", message: "Nie. B je 8 820, ale A je este vacsie." }
        },
        {
          label: "C",
          description: "Pozor, C je 8 749, a teda mensie ako A.",
          action: { type: "feedback", message: "Nie. C nie je najvacsie, aj ked vyzera velke." }
        }
      ]
    },
    P12_REVEAL: {
      kind: "quiz",
      badge: "P12",
      step: "Finalny pult",
      title: "FINALNY PULT",
      lead: "Timea uz pozna aj poslednu cislicu a moze skusit otvorit zamok.",
      art: "art-final",
      tags: ["3679", "finalny kod", "zamok"],
      sidebarTitle: "Cely kod",
      sidebarText: "Mas vsetky cislice. Pozor uz len na spravne poradie.",
      goal: "Vyber kod 3679.",
      hint: "Posledna cislica prisla zo zaokruhlovania na tisice, nie z jednotiek.",
      challengeTitle: "Ktory kod otvori tajomstvo kniznice?",
      promptHtml: `
        <p class="scene-note strong">Timea ma uz cely kod. Ktory z tychto kodov otvori tajomstvo kniznice?</p>
      `,
      visualHtml: `
        <div class="visual-cards">
          <div class="visual-card">3679</div>
          <div class="visual-card">3769</div>
          <div class="visual-card">3678</div>
        </div>
      `,
      choices: [
        {
          label: "3679",
          description: "Spravne poradie vsetkych cifier.",
          action: { type: "goto", target: "P13" }
        },
        {
          label: "3769",
          description: "Tieto cislice su spravne, ale nie v spravnom poradi.",
          action: { type: "goto", target: "D13" }
        },
        {
          label: "3678",
          description: "Posledna cislica nepochadza z jednotiek.",
          action: { type: "goto", target: "D14" }
        }
      ]
    },
    D13: {
      kind: "story",
      badge: "D13",
      step: "Slepa ulicka",
      title: "Zly kod 3769",
      lead: "Kod pozna spravne cislice, ale nie spravne poradie.",
      art: "art-deadend",
      tags: ["kod", "poradie", "spat"],
      sidebarTitle: "Takmer otvorene",
      sidebarText: "V kniznici nestaci vediet cisla. Treba ich mat v spravnom poradi.",
      goal: "Vrat sa k zamku a zvol 3679.",
      bodyHtml: `
        <p>Zamok cvakol, ale neotvoril sa.</p>
        <blockquote>"Pozor na poradie cifier. V kniznici nestaci vediet cisla. Treba ich mat v spravnom poradi."</blockquote>
      `,
      choices: [
        {
          label: "Spat k zamku",
          description: "Vrat sa k finalnemu pultu.",
          action: { type: "goto", target: "P12" }
        }
      ]
    },
    D14: {
      kind: "story",
      badge: "D14",
      step: "Slepa ulicka",
      title: "Zly kod 3678",
      lead: "Posledna cislica neprisla z jednotiek, ale zo zaokruhlovania.",
      art: "art-deadend",
      tags: ["kod", "zaokruhlovanie", "spat"],
      sidebarTitle: "Posledna chyba",
      sidebarText: "Posledna cislica je 9, lebo vysledok sa zaokruhloval na tisice.",
      goal: "Vrat sa k zamku a zvol 3679.",
      bodyHtml: `
        <p>Zamok sa rozsvietil nacerveno.</p>
        <blockquote>"Posledna cislica nie je z jednotiek. Prisla zo zaokruhlovania."</blockquote>
      `,
      choices: [
        {
          label: "Spat k zamku",
          description: "Skus este raz spravne poskladat kod.",
          action: { type: "goto", target: "P12" }
        }
      ]
    },
    P13: {
      kind: "story",
      badge: "P13",
      step: "Koniec",
      title: "TAJOMSTVO KNIZNICE JE ODOMKNUTE",
      lead: "Zamok sa otvoril a Timea nasla poslednu stranu zo starej knihy.",
      art: "art-ending",
      tags: ["3679", "koniec", "tajomstvo"],
      sidebarTitle: "Uspech",
      sidebarText: "Kod 3679 otvoril kniznicu. Vsetky cislice su na spravnom mieste.",
      goal: "Ak chces, spusti pribeh odznova.",
      bodyHtml: `
        <p>Zamok sa otvoril. Vnutri bola posledna stranka zo starej knihy.</p>
        <blockquote>"Kniznica odhali tajomstva len tym, ktori vedia premyslat, porovnavat, pocitat a nevzdat sa pri slepych ulickach."</blockquote>
        <p>Timea sa usmiala. Knihu zavrela, ale na poslednej strane este stihla precitat:</p>
        <blockquote>"Kazde cislo je stopa. Kazda chyba moze byt napoveda."</blockquote>
      `,
      choices: [
        {
          label: "Zahrat znova",
          description: "Vrat Timeu na zaciatok a prejdi kniznicu este raz.",
          action: { type: "restart" }
        }
      ]
    }
  };

  const state = {
    sceneId: "P1",
    digits: {
      1: "",
      2: "",
      3: "",
      4: ""
    },
    clueLog: [],
    visited: {},
    flags: {
      p10Solved: false,
      p12Solved: false
    },
    feedback: "",
    feedbackType: "",
    showHint: false
  };

  function getScene(sceneId) {
    if (sceneId === "P10") {
      return state.flags.p10Solved ? SCENES.P10_REVEAL : SCENES.P10_BASE;
    }

    if (sceneId === "P12") {
      return state.flags.p12Solved ? SCENES.P12_REVEAL : SCENES.P12_BASE;
    }

    return SCENES[sceneId];
  }

  function getDigitCount() {
    return CODE_SLOTS.filter(function (slot) {
      return state.digits[slot.slot];
    }).length;
  }

  function unlockDigit(unlock) {
    if (!unlock || state.digits[unlock.slot] === unlock.value) {
      return;
    }

    state.digits[unlock.slot] = unlock.value;

    state.clueLog = state.clueLog.filter(function (item) {
      return item.slot !== unlock.slot;
    });

    state.clueLog.push({
      slot: unlock.slot,
      value: unlock.value,
      source: unlock.source
    });

    state.clueLog.sort(function (left, right) {
      return left.slot - right.slot;
    });
  }

  function renderTags(tags) {
    sceneTags.innerHTML = "";

    tags.forEach(function (tag) {
      const item = document.createElement("span");
      item.className = "scene-tag";
      item.textContent = tag;
      sceneTags.appendChild(item);
    });
  }

  function renderCodeBoard() {
    codeBoard.innerHTML = "";

    CODE_SLOTS.forEach(function (slotInfo) {
      const item = document.createElement("article");
      item.className = "code-slot";

      item.innerHTML =
        '<div class="slot-topline">' +
        '<span class="slot-title">' +
        slotInfo.label +
        "</span>" +
        "<span>#" +
        slotInfo.slot +
        "</span></div>" +
        '<div class="slot-digit">' +
        (state.digits[slotInfo.slot] || "_") +
        "</div>" +
        '<div class="slot-state">' +
        (state.digits[slotInfo.slot] ? "Objavena" : "Este skryta") +
        "</div>";

      codeBoard.appendChild(item);
    });
  }

  function renderRouteLog() {
    routeLog.innerHTML = "";

    if (state.clueLog.length === 0) {
      const empty = document.createElement("p");
      empty.className = "route-empty";
      empty.textContent = "Zatial nie je objavena ziadna cislica.";
      routeLog.appendChild(empty);
      return;
    }

    state.clueLog.forEach(function (item) {
      const entry = document.createElement("article");
      entry.className = "route-item";
      entry.innerHTML =
        '<div class="route-order">' +
        item.slot +
        "</div>" +
        "<div>" +
        '<div class="route-name">' +
        item.slot +
        ". cislica = " +
        item.value +
        "</div>" +
        '<div class="route-meta">' +
        item.source +
        "</div>" +
        "</div>" +
        '<div class="scene-step">' +
        item.value +
        "</div>";
      routeLog.appendChild(entry);
    });
  }

  function renderSidebar(scene) {
    companionName.textContent = scene.sidebarTitle || scene.title;
    companionText.textContent = scene.sidebarText || scene.lead;
    progressBadge.textContent = getDigitCount() + " / 4 cislice";
    goalText.textContent = scene.goal || "Pokracuj v hladani dalsich stop.";
    renderCodeBoard();
    renderRouteLog();
  }

  function setSceneMeta(scene) {
    sceneBadge.textContent = scene.badge;
    sceneStep.textContent = scene.step;
    sceneTitle.textContent = scene.title;
    sceneLead.textContent = scene.lead;
    renderTags(scene.tags || []);
    sceneArt.className = "scene-art " + scene.art;
  }

  function createButton(choice, variant) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = variant === "choice" ? "choice-card" : "option-button";
    button.innerHTML =
      '<span class="choice-title">' +
      choice.label +
      "</span>" +
      (choice.description
        ? '<span class="choice-desc">' + choice.description + "</span>"
        : "");
    button.addEventListener("click", function () {
      handleAction(choice.action);
    });
    return button;
  }

  function renderStory(scene) {
    storyPanel.classList.remove("hidden");
    challengePanel.classList.add("hidden");
    storyContent.innerHTML = scene.bodyHtml || "";
    choices.innerHTML = "";

    (scene.choices || []).forEach(function (choice) {
      choices.appendChild(createButton(choice, "choice"));
    });
  }

  function renderChallenge(scene) {
    storyPanel.classList.add("hidden");
    challengePanel.classList.remove("hidden");
    challengeTitle.textContent = scene.challengeTitle || scene.title;
    challengePrompt.innerHTML = scene.promptHtml || "";
    challengeVisual.innerHTML = scene.visualHtml || "";
    challengeOptions.innerHTML = "";
    inputWrap.classList.add("hidden");
    answerInput.value = "";

    (scene.choices || []).forEach(function (choice) {
      challengeOptions.appendChild(createButton(choice, "option"));
    });

    feedbackText.textContent = state.feedback;
    feedbackText.className = "feedback-text";

    if (state.feedback) {
      feedbackText.classList.add(state.feedbackType || "error");
    }

    if (scene.hint) {
      hintButton.classList.remove("hidden");
      hintText.textContent = scene.hint;
      hintText.classList.toggle("hidden", !state.showHint);
    } else {
      hintButton.classList.add("hidden");
      hintText.classList.add("hidden");
      hintText.textContent = "";
    }
  }

  function render() {
    const scene = getScene(state.sceneId);
    setSceneMeta(scene);
    renderSidebar(scene);

    if (scene.kind === "quiz") {
      renderChallenge(scene);
    } else {
      renderStory(scene);
    }
  }

  function enterScene(sceneId) {
    state.sceneId = sceneId;
    state.feedback = "";
    state.feedbackType = "";
    state.showHint = false;
    state.visited[sceneId] = true;

    const scene = getScene(sceneId);

    if (scene.unlockDigit) {
      unlockDigit(scene.unlockDigit);
    }

    render();
  }

  function handleAction(action) {
    if (!action) {
      return;
    }

    if (action.type === "goto") {
      enterScene(action.target);
      return;
    }

    if (action.type === "feedback") {
      state.feedback = action.message;
      state.feedbackType = "error";
      state.showHint = false;
      render();
      return;
    }

    if (action.type === "reveal") {
      if (action.flag) {
        state.flags[action.flag] = true;
      }

      if (action.unlockDigit) {
        unlockDigit(action.unlockDigit);
      }

      state.feedback = action.message || "";
      state.feedbackType = action.message ? "success" : "";
      state.showHint = false;
      render();
      return;
    }

    if (action.type === "restart") {
      resetGame();
    }
  }

  function resetGame() {
    state.sceneId = "P1";
    state.digits = {
      1: "",
      2: "",
      3: "",
      4: ""
    };
    state.clueLog = [];
    state.visited = {};
    state.flags = {
      p10Solved: false,
      p12Solved: false
    };
    state.feedback = "";
    state.feedbackType = "";
    state.showHint = false;
    render();
  }

  hintButton.addEventListener("click", function () {
    const scene = getScene(state.sceneId);

    if (!scene || !scene.hint) {
      return;
    }

    state.showHint = !state.showHint;
    render();
  });

  submitAnswerButton.addEventListener("click", function () {
    if (inputWrap.classList.contains("hidden")) {
      return;
    }
  });

  restartButton.addEventListener("click", resetGame);

  resetGame();
})();
