(function () {
  const QUESTIONS_PER_ROUND = 15;
  const STORAGE_KEY = "detektor-podvodnych-sprav-best-score";
  const CHANNEL_LABELS = {
    sms: "SMS",
    whatsapp: "WhatsApp",
    email: "Email"
  };
  const VERDICT_LABELS = {
    fraud: "Podvodná správa",
    real: "Môže byť reálna"
  };

  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const bestScoreText = document.getElementById("bestScoreText");
  const playerNameInput = document.getElementById("playerNameInput");
  const nameHintText = document.getElementById("nameHintText");
  const gameScreen = document.getElementById("gameScreen");
  const summaryScreen = document.getElementById("summaryScreen");
  const roundHeadline = document.getElementById("roundHeadline");
  const channelBadge = document.getElementById("channelBadge");
  const scoreValue = document.getElementById("scoreValue");
  const percentValue = document.getElementById("percentValue");
  const remainingValue = document.getElementById("remainingValue");
  const progressFill = document.getElementById("progressFill");
  const taskTitle = document.getElementById("taskTitle");
  const taskContext = document.getElementById("taskContext");
  const messageViewport = document.getElementById("messageViewport");
  const fraudButton = document.getElementById("fraudButton");
  const realButton = document.getElementById("realButton");
  const feedbackPanel = document.getElementById("feedbackPanel");
  const feedbackVerdict = document.getElementById("feedbackVerdict");
  const feedbackText = document.getElementById("feedbackText");
  const clueTitle = document.getElementById("clueTitle");
  const clueList = document.getElementById("clueList");
  const nextButton = document.getElementById("nextButton");
  const summaryHeadline = document.getElementById("summaryHeadline");
  const summaryText = document.getElementById("summaryText");
  const summaryScore = document.getElementById("summaryScore");
  const summaryPercent = document.getElementById("summaryPercent");
  const summaryBest = document.getElementById("summaryBest");
  const diplomaName = document.getElementById("diplomaName");
  const diplomaPercentLine = document.getElementById("diplomaPercentLine");
  const diplomaRating = document.getElementById("diplomaRating");
  const diplomaMessage = document.getElementById("diplomaMessage");
  const historyList = document.getElementById("historyList");

  const state = {
    tasks: [],
    index: 0,
    correct: 0,
    answered: false,
    history: [],
    playerName: ""
  };

  function smsTask(config) {
    return Object.assign(
      {
        channel: "sms",
        messages: [],
        footerTags: []
      },
      config
    );
  }

  function whatsappTask(config) {
    return Object.assign(
      {
        channel: "whatsapp",
        messages: [],
        dayLabel: "Dnes"
      },
      config
    );
  }

  function emailTask(config) {
    return Object.assign(
      {
        channel: "email",
        chips: ["Prijaté"],
        attachments: [],
        body: []
      },
      config
    );
  }

  const TASK_BANK = [
    smsTask({
      id: "sms-01",
      title: "SMS o zablokovanej karte",
      context: "Správa prišla skoro ráno na súkromný telefón.",
      sender: "Tatra Banka",
      senderMeta: "Dnes 06:14 • neoverené krátke číslo",
      verdict: "fraud",
      reasoning: "Banka neposiela odblokovanie karty cez neznámu adresu a netlačí na kliknutie do pár minút.",
      clues: [
        "Odkaz `tb-overenie-pay.com` nie je oficiálna banková doména.",
        "Správa vytvára stres vetou o limite 10 minút.",
        "Žiada prihlásenie cez odkaz v SMS."
      ],
      messages: [
        {
          text: "Bezpečnostné upozornenie: Vaša karta bola dočasne zablokovaná po pokuse o platbu v zahraničí. Overte ju do 10 minút.",
          chip: "tb-overenie-pay.com/login",
          meta: "06:14"
        }
      ],
      footerTags: ["Neoficiálna doména", "Nátlak na okamžitú reakciu"]
    }),
    smsTask({
      id: "sms-02",
      title: "SMS z knižnice",
      context: "Správa prišla po rezervácii knihy v mestskej knižnici.",
      sender: "MsK Knižnica",
      senderMeta: "Dnes 09:11 • notifikačné číslo",
      verdict: "real",
      reasoning: "Správa nadväzuje na očakávanú rezerváciu, nič nepýta a odkazuje na konkrétnu pobočku aj dátum.",
      clues: [
        "Nežiada heslo, platbu ani kliknutie na link.",
        "Obsahuje konkrétnu pobočku a termín vyzdvihnutia.",
        "Text je vecný a bez nátlaku."
      ],
      messages: [
        {
          text: "Vaša rezervácia knihy je pripravená na vyzdvihnutie v pobočke Jilemnického 12. Prosíme, vyzdvihnite si ju do 28. 3. počas otváracích hodín.",
          meta: "09:11"
        }
      ],
      footerTags: ["Bez odkazu", "Konkrétne údaje o rezervácii"]
    }),
    smsTask({
      id: "sms-03",
      title: "SMS o nedoplatku za balík",
      context: "Prišla aj keď príjemca žiadny balík neočakával.",
      sender: "Packeta",
      senderMeta: "Dnes 10:38 • neznáme číslo",
      verdict: "fraud",
      reasoning: "Podvod sa tvári ako doručovacia služba, ale používa nesprávnu doménu a vytvára tlak na okamžitú platbu.",
      clues: [
        "Doména `packeta-clo-help.site` nepôsobí ako oficiálna stránka.",
        "Žiada doplatiť clo cez odkaz v SMS.",
        "Správa hrozí vrátením zásielky ešte v ten istý deň."
      ],
      messages: [
        {
          text: "Zásielka č. SK781442 je pozastavená. Doplatiť clo 1,89 EUR je potrebné ešte dnes, inak bude balík vrátený odosielateľovi.",
          chip: "packeta-clo-help.site/pay",
          meta: "10:38"
        }
      ],
      footerTags: ["Platba cez neznámy web", "Hrozba okamžitého vrátenia"]
    }),
    smsTask({
      id: "sms-04",
      title: "Pripomienka od zubára",
      context: "Pripomienka nadväzuje na objednaný termín.",
      sender: "Dental Smile",
      senderMeta: "Dnes 11:03 • ambulancia",
      verdict: "real",
      reasoning: "Je to typická pripomienka termínu bez linkov, bez citlivých údajov a s jasnými kontaktnými údajmi ambulancie.",
      clues: [
        "Správa len pripomína termín a telefón ambulancie.",
        "Nepožaduje žiadne prihlasovanie ani platbu.",
        "Text je stručný a očakávaný."
      ],
      messages: [
        {
          text: "Pripomíname Vám objednaný termín dentálnej hygieny 27. 3. o 15:30. Ak sa nemôžete dostaviť, prosíme zavolajte na 02/555 219 44.",
          meta: "11:03"
        }
      ],
      footerTags: ["Bez odkazu", "Len pripomienka termínu"]
    }),
    smsTask({
      id: "sms-05",
      title: "SMS o daňovom preplatku",
      context: "Správa prišla počas vyučovania bez predchádzajúcej komunikácie.",
      sender: "Financna Sprava",
      senderMeta: "Dnes 12:17 • bežné mobilné číslo",
      verdict: "fraud",
      reasoning: "Štátna inštitúcia neposiela vrátenie preplatku cez skrátený link v SMS a nežiada okamžité vyplnenie karty.",
      clues: [
        "Použitý je skrátený odkaz `bit.ly`.",
        "Odosielateľ je napísaný nepresne a bez diakritiky.",
        "Správa láka na peniaze a tlačí na rýchlu reakciu."
      ],
      messages: [
        {
          text: "Evidujeme preplatok 164,30 EUR. Vyplňte číslo karty do 24 hodín, inak bude nárok zrušený.",
          chip: "bit.ly/fs-vratenie",
          meta: "12:17"
        }
      ],
      footerTags: ["Skrátený odkaz", "Žiadosť o kartu"]
    }),
    smsTask({
      id: "sms-06",
      title: "SMS z EduPage",
      context: "Správa prišla rodičovi po zaevidovaní absencie.",
      sender: "EduPage",
      senderMeta: "Dnes 07:24 • notifikácia systému",
      verdict: "real",
      reasoning: "Správa oznamuje konkrétnu udalosť v známom systéme a odkazuje na aplikáciu, nie na neznámy web.",
      clues: [
        "Nič nepýta, len informuje o novej správe.",
        "Nenúti klikať na neznámy link.",
        "Obsah súvisí so školským systémom."
      ],
      messages: [
        {
          text: "V aplikácii EduPage máte novú správu od triednej učiteľky k zajtrajšej exkurzii. Podrobnosti nájdete po prihlásení v aplikácii.",
          meta: "07:24"
        }
      ],
      footerTags: ["Bez externého odkazu", "Odkaz na známu aplikáciu"]
    }),
    smsTask({
      id: "sms-07",
      title: "Zľava na energie",
      context: "Prišla z ničoho nič a neviaže sa na konkrétnu zmluvu.",
      sender: "Elektrarne SR",
      senderMeta: "Dnes 15:06 • neznáme číslo",
      verdict: "fraud",
      reasoning: "Podvod zneužíva tému energií a žiada potvrdenie účtu cez neoficiálny web.",
      clues: [
        "Správa sľubuje peniaze bez konkrétnych údajov o odbernom mieste.",
        "Odkazuje na web `vratka-elektrina.com`.",
        "Tvrdí, že akciu treba potvrdiť ešte dnes."
      ],
      messages: [
        {
          text: "Máte nárok na jednorazovú zľavu 87 EUR za energie. Potvrďte IBAN ešte dnes.",
          chip: "vratka-elektrina.com/bonus",
          meta: "15:06"
        }
      ],
      footerTags: ["Žiadosť o IBAN", "Neoverený web"]
    }),
    smsTask({
      id: "sms-08",
      title: "Bankový autorizačný kód",
      context: "Správa prišla počas vlastného prihlasovania do internet bankingu.",
      sender: "365.bank",
      senderMeta: "Dnes 18:42 • autorizačné číslo",
      verdict: "real",
      reasoning: "Takáto správa môže byť reálna, pretože ide len o jednorazový kód a zároveň výslovne varuje, aby sa nikomu neposielal.",
      clues: [
        "Obsahuje len OTP kód a upozornenie, aby sa nezdieľal.",
        "Neobsahuje odkaz ani výzvu na zadanie hesla inde.",
        "Nadväzuje na reálne prihlasovanie používateľa."
      ],
      messages: [
        {
          text: "Autorizačný kód pre prihlásenie: 582941. Tento kód nikomu neposielajte ani nediktujte.",
          meta: "18:42"
        }
      ],
      footerTags: ["Bez odkazu", "Upozornenie nezdieľať kód"]
    }),
    smsTask({
      id: "sms-09",
      title: "Pozastavené streamovacie konto",
      context: "Prišla z neznámeho čísla bez mena používateľa.",
      sender: "NETFLlX",
      senderMeta: "Dnes 21:19 • bežné číslo",
      verdict: "fraud",
      reasoning: "Podvod zneužíva známu službu, používa vizuálne podobný názov a smeruje na neoficiálny web.",
      clues: [
        "Názov `NETFLlX` používa podozrivé písmeno namiesto originálneho zápisu.",
        "Odkaz nevedie na známu doménu služby.",
        "Správa hrozí okamžitým zrušením prístupu."
      ],
      messages: [
        {
          text: "Platba za účet neprešla. Ak chcete pokračovať v sledovaní, potvrďte kartu do 30 minút.",
          chip: "netfIix-billing.help/verify",
          meta: "21:19"
        }
      ],
      footerTags: ["Napodobnený názov značky", "Platba cez podozrivý link"]
    }),
    smsTask({
      id: "sms-10",
      title: "Kód k vyzdvihnutiu balíka",
      context: "Nadväzuje na očakávanú zásielku do boxu.",
      sender: "Packeta",
      senderMeta: "Dnes 08:09 • notifikácia",
      verdict: "real",
      reasoning: "Správa môže byť reálna, lebo obsahuje len kód a miesto vyzdvihnutia bez žiadosti o platbu alebo prihlasovanie.",
      clues: [
        "Nepožaduje doplatok ani citlivé údaje.",
        "Uvádza miesto a PIN na prevzatie.",
        "Text je neutrálny a stručný."
      ],
      messages: [
        {
          text: "Zásielka je pripravená v Z-BOXe Námestie mieru 4. PIN pre vyzdvihnutie: 4817. Úložná doba do 29. 3.",
          meta: "08:09"
        }
      ],
      footerTags: ["PIN bez odkazu", "Konkrétne miesto boxu"]
    }),
    smsTask({
      id: "sms-11",
      title: "Mestská pokuta za parkovanie",
      context: "Správa prišla na telefón žiaka, ktorý ani nešoféruje.",
      sender: "MestoPark",
      senderMeta: "Dnes 14:49 • bežné číslo",
      verdict: "fraud",
      reasoning: "Správa hrá na strach z pokuty a žiada platbu cez link bez akéhokoľvek oficiálneho identifikátora.",
      clues: [
        "Chýbajú konkrétne údaje o vozidle alebo rozhodnutí.",
        "Žiada okamžitú úhradu cez neznámy web.",
        "Adresát správy vôbec nemusí byť vodič."
      ],
      messages: [
        {
          text: "Evidujeme neuhradenú pokutu za parkovanie 49 EUR. Ak ju neuhradíte dnes, suma sa zdvojnásobí.",
          chip: "mesto-park-pay.com/uhrada",
          meta: "14:49"
        }
      ],
      footerTags: ["Vágne obvinenie", "Tlak na okamžitú platbu"]
    }),
    smsTask({
      id: "sms-12",
      title: "Pripomienka plaveckého kurzu",
      context: "Správa je z tréningového centra, kam je žiak prihlásený.",
      sender: "Plaváreň Delfín",
      senderMeta: "Dnes 16:04 • info linka",
      verdict: "real",
      reasoning: "Ide o bežnú organizačnú SMS s miestom, časom a bez akejkoľvek výzvy na zdieľanie údajov.",
      clues: [
        "Obsahuje len organizačné informácie.",
        "Nie je v nej odkaz ani platobná výzva.",
        "Téma zodpovedá prihlásenému kurzu."
      ],
      messages: [
        {
          text: "Pripomíname zajtrajší plavecký kurz o 17:00. Prosíme, prineste si čiapku a potvrdenie o úhrade z recepcie.",
          meta: "16:04"
        }
      ],
      footerTags: ["Organizačná správa", "Bez odkazu"]
    }),
    smsTask({
      id: "sms-13",
      title: "Aktivácia e-schránky",
      context: "Správa prišla bez toho, aby sa používateľ prihlasoval do štátnych služieb.",
      sender: "SLOVENSKO",
      senderMeta: "Dnes 17:56 • neoverené číslo",
      verdict: "fraud",
      reasoning: "Štátna správa nežiada reaktiváciu účtu cez podozrivý link v SMS.",
      clues: [
        "Web `slovensko-login-obcan.com` nevyzerá ako oficiálna doména.",
        "Správa tvrdí, že účet bude zmazaný už o pár hodín.",
        "Používa všeobecné oslovenie a žiadne konkrétne údaje."
      ],
      messages: [
        {
          text: "Váš účet e-schránky vyžaduje reaktiváciu. Dokončite overenie do 6 hodín, aby nebol zmazaný.",
          chip: "slovensko-login-obcan.com",
          meta: "17:56"
        }
      ],
      footerTags: ["Falošná štátna doména", "Hrozba zmazania účtu"]
    }),
    smsTask({
      id: "sms-14",
      title: "Pripomienka kina",
      context: "Správa prišla po kúpe lístkov cez web kina.",
      sender: "Kino Hviezda",
      senderMeta: "Dnes 13:20 • notifikácia",
      verdict: "real",
      reasoning: "Správa iba pripomína rezerváciu a uvádza čas otvorenia sály.",
      clues: [
        "Nepožaduje doplnenie platby ani heslo.",
        "Obsahuje konkrétny názov filmu a čas predstavenia.",
        "Žiadny nátlak ani externý link."
      ],
      messages: [
        {
          text: "Pripomienka rezervácie: Film Roboti z budúcnosti, dnes o 18:30, sála 2. Vstup do sály sa otvára 15 minút pred začiatkom.",
          meta: "13:20"
        }
      ],
      footerTags: ["Konkrétny program", "Bez odkazu"]
    }),
    smsTask({
      id: "sms-15",
      title: "Potvrdenie WhatsApp účtu cez link",
      context: "Správa prišla bez toho, aby si robil zmenu telefónu alebo zálohy.",
      sender: "WhatsApp Secure",
      senderMeta: "Dnes 19:13 • bežné číslo",
      verdict: "fraud",
      reasoning: "WhatsApp neposiela reaktiváciu účtu cez cudzí web v SMS správe.",
      clues: [
        "Správa smeruje na neoficiálny web `wa-restore-access.com`.",
        "Tvrdí, že účet zanikne do jednej hodiny.",
        "Používa všeobecné varovanie bez detailov o účte."
      ],
      messages: [
        {
          text: "Váš WhatsApp účet je napadnutý. Potvrďte vlastníctvo do 1 hodiny, inak bude chat história odstránená.",
          chip: "wa-restore-access.com",
          meta: "19:13"
        }
      ],
      footerTags: ["Falošný obnovovací web", "Hrozba zmazania chatu"]
    }),
    smsTask({
      id: "sms-16",
      title: "Upozornenie na kartovú platbu",
      context: "Správa prišla hneď po nákupe v obchode.",
      sender: "Slovenska sporitelna",
      senderMeta: "Dnes 17:31 • notifikácia",
      verdict: "real",
      reasoning: "Takáto notifikácia môže byť reálna, pretože len informuje o už vykonanej platbe a nič nežiada.",
      clues: [
        "Nie je tam odkaz ani výzva na prihlasovanie.",
        "Suma a obchod zodpovedajú reálnemu nákupu.",
        "Ide o pasívne upozornenie po transakcii."
      ],
      messages: [
        {
          text: "Kartou bola vykonaná platba 6,90 EUR u obchodníka MARTINUS. Ak to nie ste vy, skontrolujte transakcie v aplikácii George.",
          meta: "17:31"
        }
      ],
      footerTags: ["Po nákupe", "Len notifikácia"]
    }),
    smsTask({
      id: "sms-17",
      title: "Reaktivácia školského účtu",
      context: "Správa sa tvári ako povinný školský krok pred polnocou.",
      sender: "School IT",
      senderMeta: "Dnes 20:02 • bežné číslo",
      verdict: "fraud",
      reasoning: "Škola by neobnovovala Microsoft účet cez zvláštny externý web a krátky časový limit.",
      clues: [
        "Doména `skola-login365.help` nie je školská.",
        "Správa hrozí vypnutím účtu do polnoci.",
        "Nečakaná požiadavka na prihlásenie cez SMS link."
      ],
      messages: [
        {
          text: "Školský účet Microsoft bude deaktivovaný o 23:59. Obnovte ho teraz, aby ste nestratili súbory.",
          chip: "skola-login365.help",
          meta: "20:02"
        }
      ],
      footerTags: ["Neškolská doména", "Hrozba straty súborov"]
    }),
    smsTask({
      id: "sms-18",
      title: "Laboratórne výsledky z kliniky",
      context: "Správa nadväzuje na ranný odber.",
      sender: "Poliklinika Sever",
      senderMeta: "Dnes 14:12 • ambulancia",
      verdict: "real",
      reasoning: "Správa neobsahuje žiadny link ani citlivé údaje, len oznamuje dostupnosť výsledkov na recepcii alebo v pacientskom portáli.",
      clues: [
        "Bez nátlaku a bez platby.",
        "Nevypytuje si rodné číslo ani heslo.",
        "Nadväzuje na reálnu návštevu kliniky."
      ],
      messages: [
        {
          text: "Výsledky dnešných odberov sú pripravené. Nájdete ich v pacientskom portáli alebo na recepcii ambulancie po 15:30.",
          meta: "14:12"
        }
      ],
      footerTags: ["Očakávaná informácia", "Bez odkazu"]
    }),

    whatsappTask({
      id: "wa-01",
      title: "Riaditeľ žiada darčekové karty",
      context: "Správa prišla do súkromného WhatsAppu mimo školského času.",
      contactName: "Riaditeľ školy",
      contactMeta: "+44 7421 551 208",
      note: "Nie je vo vašich kontaktoch",
      verdict: "fraud",
      reasoning: "Neznáme zahraničné číslo a žiadosť o nákup darčekových kariet sú typické znaky podvodu na vydávanie sa za autoritu.",
      clues: [
        "Kontakt je z neznámeho zahraničného čísla.",
        "Žiada kúpu darčekových kariet a fotku kódov.",
        "Tlačí na tajnosť a rýchlosť."
      ],
      messages: [
        { from: "them", text: "Dobrý večer, som riaditeľ. Som na porade a potrebujem, aby ste ešte dnes kúpili 6 darčekových kariet po 25 EUR pre hostí školy.", meta: "20:11" },
        { from: "them", text: "Prosím, pošlite mi fotku kódov hneď po kúpe. Nikomu to teraz nehovorte, chcem ich odovzdať zajtra ráno.", meta: "20:12" }
      ]
    }),
    whatsappTask({
      id: "wa-02",
      title: "Triedna zástupkyňa a športový deň",
      context: "Správa prišla do známej triednej skupiny.",
      contactName: "8.B rodičia",
      contactMeta: "Skupina • 23 členov",
      verdict: "real",
      reasoning: "Organizačná správa v známej skupine bez požiadavky na citlivé údaje môže byť reálna.",
      clues: [
        "Ide o známu skupinu s bežnou organizačnou informáciou.",
        "Nežiada heslá ani platby.",
        "Obsahuje konkrétne časy a veci na prinesenie."
      ],
      messages: [
        { from: "them", text: "Prosím, pripomeňte deťom zajtrajší športový deň. Zraz je 7:40 pred telocvičňou a treba si priniesť vodu, prezuvky a kartičku poistenca.", meta: "18:04" }
      ]
    }),
    whatsappTask({
      id: "wa-03",
      title: "Nové číslo od kamarátky",
      context: "Správa prišla z čísla, ktoré nie je uložené v kontaktoch.",
      contactName: "Michaela",
      contactMeta: "+420 703 118 271",
      note: "Nie je vo vašich kontaktoch",
      verdict: "fraud",
      reasoning: "Útočník sa vydáva za známu osobu a snaží sa získať overovací kód pre cudzí účet.",
      clues: [
        "Nové číslo samo o sebe nestačí na dôveru.",
        "Žiada preposlať šesťmiestny kód.",
        "Ponáhľa sa a obchádza overenie identity."
      ],
      messages: [
        { from: "them", text: "Ahoj, toto je moje nové číslo. Môžeš mi rýchlo preposlať kód, ktorý ti teraz príde? Omylom som ho dala na tvoje číslo.", meta: "16:42" }
      ]
    }),
    whatsappTask({
      id: "wa-04",
      title: "Učiteľka a odchod do múzea",
      context: "Správa prišla v skupine pred plánovanou exkurziou.",
      contactName: "Triedna 7.A",
      contactMeta: "Skupina • 26 členov",
      verdict: "real",
      reasoning: "Ide o bežnú organizačnú správu so známym kontextom, bez žiadosti o citlivé údaje.",
      clues: [
        "Nadväzuje na naplánovanú exkurziu.",
        "Obsahuje len čas a miesto stretnutia.",
        "Žiadny link, kód ani platba."
      ],
      messages: [
        { from: "them", text: "Pripomínam zajtrajšiu exkurziu do múzea. Stretneme sa o 8:00 pri hlavnom vchode do školy, autobus odchádza o 8:15.", meta: "19:05" }
      ]
    }),
    whatsappTask({
      id: "wa-05",
      title: "Balík čaká na adresu",
      context: "Správa prišla od neznámeho čísla s odkazom.",
      contactName: "Doručenie balíkov",
      contactMeta: "+31 611 882 930",
      note: "Nie je vo vašich kontaktoch",
      verdict: "fraud",
      reasoning: "Podvodná správa sa hrá na kuriéra, ale prišla cez náhodný WhatsApp kontakt a tlačí na kliknutie na neznámy formulár.",
      clues: [
        "Kuriér obvykle nepíše z náhodného WhatsApp čísla.",
        "Odkaz smeruje na neznámu adresu.",
        "Správa žiada doplniť adresu okamžite."
      ],
      messages: [
        { from: "them", text: "Váš balík sa nepodarilo doručiť. Vyplňte novú adresu do 30 minút, inak bude zásielka zrušená.", chip: "delivery-check-form.net/address", meta: "09:33" }
      ]
    }),
    whatsappTask({
      id: "wa-06",
      title: "Tréner ruší tréning",
      context: "Správa prišla v klubovej skupine počas zlého počasia.",
      contactName: "FK Mládež U13",
      contactMeta: "Skupina • 19 členov",
      verdict: "real",
      reasoning: "Je to typická skupinová organizačná správa bez nátlaku a bez nebezpečných požiadaviek.",
      clues: [
        "Obsahuje len zmenu harmonogramu.",
        "Žiadne odkazy ani pýtanie peňazí.",
        "Dáva zmysel vzhľadom na počasie."
      ],
      messages: [
        { from: "them", text: "Dnes tréning rušíme pre dážď a mokré ihrisko. Náhradný termín pošlem zajtra poobede.", meta: "15:55" }
      ]
    }),
    whatsappTask({
      id: "wa-07",
      title: "Banková podpora cez WhatsApp",
      context: "Správa prišla bez predchádzajúcej komunikácie s bankou.",
      contactName: "SLSP podpora",
      contactMeta: "+91 885 044 1173",
      note: "Nie je vo vašich kontaktoch",
      verdict: "fraud",
      reasoning: "Banka by štandardne neposielala cez WhatsApp link na prihlásenie do účtu z cudzieho čísla.",
      clues: [
        "Kontakt je z cudzieho zahraničného čísla.",
        "Správa žiada prihlásiť sa cez externý link.",
        "Tvrdí, že účet bude obmedzený, ak nereaguješ hneď."
      ],
      messages: [
        { from: "them", text: "Bezpečnostný tím zaznamenal problém s vaším účtom George. Prosím, obnovte prístup tu ešte dnes.", chip: "george-security-check.com", meta: "11:21" }
      ]
    }),
    whatsappTask({
      id: "wa-08",
      title: "Školský parlament hľadá dobrovoľníkov",
      context: "Správa prišla zo známeho školského kontaktu.",
      contactName: "Školský parlament",
      contactMeta: "Skupina • 14 členov",
      verdict: "real",
      reasoning: "Správa môže byť reálna, lebo ide o bežný nábor dobrovoľníkov a odkazuje na školský formulár na známej doméne.",
      clues: [
        "Téma zodpovedá školskej aktivite.",
        "Nie sú pýtané heslá ani finančné údaje.",
        "Link smeruje na školskú doménu."
      ],
      messages: [
        { from: "them", text: "Ahojte, na Deň otvorených dverí hľadáme 6 dobrovoľníkov na sprevádzanie hostí. Kto chce pomôcť, nech sa zapíše dnes do 18:00.", chip: "forms.gymnaziumnovam.sk/dod", meta: "13:07" }
      ]
    }),
    whatsappTask({
      id: "wa-09",
      title: "Bratranec chce urgentnú pôžičku",
      context: "Správa prišla z nového čísla neskoro večer.",
      contactName: "Bratranec Robo",
      contactMeta: "+48 601 445 872",
      note: "Nie je vo vašich kontaktoch",
      verdict: "fraud",
      reasoning: "Naliehavá prosba o peniaze na cudzie číslo účtu je typický sociálny inžiniering.",
      clues: [
        "Nové číslo sa nedá overiť len podľa mena.",
        "Žiada peniaze okamžite a mimo bežného spôsobu kontaktu.",
        "Neponúka overenie hlasom ani videom."
      ],
      messages: [
        { from: "them", text: "Prosím ťa, som v strese, nefunguje mi karta. Pošli mi hneď 80 EUR na tento IBAN, vrátim ti to ráno.", meta: "22:48" },
        { from: "them", text: "Nikomu teraz nevolaj, mám slabý signál.", meta: "22:49" }
      ]
    }),
    whatsappTask({
      id: "wa-10",
      title: "Potvrdenie knižničného workshopu",
      context: "Správa prišla po prihlásení na workshop mediálnej gramotnosti.",
      contactName: "Mestská knižnica",
      contactMeta: "Overený firemný profil",
      verdict: "real",
      reasoning: "Správa len potvrdzuje účasť na udalosti a dáva organizačné pokyny bez akejkoľvek podozrivej požiadavky.",
      clues: [
        "Obsah je očakávaný po registrácii.",
        "Nežiada žiadne platby ani heslá.",
        "Používa vecný tón a konkrétne miesto."
      ],
      messages: [
        { from: "them", text: "Ďakujeme za registráciu na workshop Mediálna gramotnosť. Začíname vo štvrtok o 14:00 v študovni na 2. poschodí.", meta: "10:02" }
      ]
    }),
    whatsappTask({
      id: "wa-11",
      title: "Hlasovanie o školskej fotke",
      context: "Správa prišla v skupine, ale kontakt poslal skrátený link.",
      contactName: "Školská fotosúťaž",
      contactMeta: "+421 902 811 244",
      note: "Nie je vo vašich kontaktoch",
      verdict: "fraud",
      reasoning: "Skrátený odkaz a požiadavka prihlásiť sa školským emailom a heslom sú jasné varovné znaky.",
      clues: [
        "Používa `bit.ly`, takže nevidíš skutočnú cieľovú adresu.",
        "Pýta si školský email a heslo.",
        "Nátlak na hlasovanie do pár minút nie je bežný."
      ],
      messages: [
        { from: "them", text: "Vaša trieda postúpila do finále. Hlas treba potvrdiť do 20 minút po prihlásení školským emailom.", chip: "bit.ly/skolafoto-finale", meta: "17:14" }
      ]
    }),
    whatsappTask({
      id: "wa-12",
      title: "Rodičovské združenie a koláče",
      context: "Správa prišla v rodičovskej skupine pred školským jarmokom.",
      contactName: "RZ 5.A",
      contactMeta: "Skupina • 21 členov",
      verdict: "real",
      reasoning: "Organizačné rozdelenie úloh v známej skupine bez citlivých údajov môže byť úplne bežné.",
      clues: [
        "Téma zodpovedá pripravovanému jarmoku.",
        "Nepýta sa na heslá ani osobné dáta.",
        "Je to bežná koordinácia medzi rodičmi."
      ],
      messages: [
        { from: "them", text: "Na piatkový jarmok zatiaľ chýbajú dva slané koláče a jeden džbán limonády. Kto môže priniesť, prosím napíšte sem do skupiny.", meta: "18:53" }
      ]
    }),
    whatsappTask({
      id: "wa-13",
      title: "Meta Business podpora",
      context: "Správa prišla na súkromný účet bez prevádzky firemnej stránky.",
      contactName: "Meta Support",
      contactMeta: "+1 332 591 6449",
      note: "Nie je vo vašich kontaktoch",
      verdict: "fraud",
      reasoning: "Falošná podpora sa snaží vylákať prihlasovacie údaje cez link a používa tlak na zablokovanie stránky.",
      clues: [
        "Kontakt je nevyžiadaný a z cudzieho čísla.",
        "Žiada overenie cez neoficiálnu adresu.",
        "Hrozí vypnutím profilu do jednej hodiny."
      ],
      messages: [
        { from: "them", text: "Vaša stránka porušila pravidlá komunity. Ak neodošlete potvrdenie vlastníka do 1 hodiny, profil bude zablokovaný.", chip: "meta-appeal-center.help/form", meta: "08:46" }
      ]
    }),
    whatsappTask({
      id: "wa-14",
      title: "Skautský tábor",
      context: "Správa prišla v oddielovej skupine po víkendovej porade.",
      contactName: "Skauti - Vlci",
      contactMeta: "Skupina • 17 členov",
      verdict: "real",
      reasoning: "Obsahuje praktický zoznam vecí a termín, bez akýchkoľvek rizikových požiadaviek.",
      clues: [
        "Len organizačné informácie k táboru.",
        "Bez finančných výziev a bez neznámych linkov.",
        "Zodpovedá bežnej komunikácii v skupine."
      ],
      messages: [
        { from: "them", text: "Na sobotný výjazd si zoberte spacák, pršiplášť, baterku a fľašu na vodu. Odchod je 7:20 od klubovne.", meta: "19:44" }
      ]
    }),
    whatsappTask({
      id: "wa-15",
      title: "Súťaž o iPhone",
      context: "Správa sa tvári ako výhra od známej značky.",
      contactName: "Promo Apple SK",
      contactMeta: "+62 811 741 220",
      note: "Nie je vo vašich kontaktoch",
      verdict: "fraud",
      reasoning: "Výhra bez účasti v súťaži a poplatok za spracovanie je klasický podvodný model.",
      clues: [
        "Nečakaná výhra bez prihlásenia do súťaže.",
        "Žiada malý poplatok ako podmienku.",
        "Kontakt je neoficiálny a neoverený."
      ],
      messages: [
        { from: "them", text: "Gratulujeme, vyhrali ste iPhone 16. Na rezerváciu zásielky stačí uhradiť spracovanie 2 EUR cez tento odkaz.", chip: "apple-gift-slovakia.store/pay", meta: "12:36" }
      ]
    }),
    whatsappTask({
      id: "wa-16",
      title: "Jedálny lístok v triednej skupine",
      context: "Správa prišla od vedúcej školskej jedálne do školskej skupiny.",
      contactName: "Jedáleň školy",
      contactMeta: "Skupina • 31 členov",
      verdict: "real",
      reasoning: "Je to bežná informačná správa bez nebezpečných požiadaviek.",
      clues: [
        "Obsahuje len menu a oznam o zmene.",
        "Bez odkazov, hesiel a platieb.",
        "Posielaná do skupiny, kde takáto komunikácia dáva zmysel."
      ],
      messages: [
        { from: "them", text: "Zajtra bude namiesto ryže zemiaková kaša, ostatné menu ostáva bez zmeny. Prihlášky a odhlášky do 13:30 cez EduPage.", meta: "14:09" }
      ]
    }),
    whatsappTask({
      id: "wa-17",
      title: "Falošná učiteľka a súťaž",
      context: "Správa prišla z neznámeho čísla s požiadavkou na osobné údaje.",
      contactName: "Pani učiteľka SJ",
      contactMeta: "+370 616 103 884",
      note: "Nie je vo vašich kontaktoch",
      verdict: "fraud",
      reasoning: "Neznáme číslo a žiadosť o rodné číslo s adresou kvôli údajnej súťaži sú veľmi podozrivé.",
      clues: [
        "Kontakt nie je uložený a prichádza z cudzieho čísla.",
        "Pýta osobné údaje, ktoré škola cez WhatsApp nepotrebuje.",
        "Neexistuje normálny dôvod posielať rodné číslo cez chat."
      ],
      messages: [
        { from: "them", text: "Vyhrali ste školskú literárnu súťaž. Pošlite mi sem celé meno, adresu a rodné číslo, aby som vedela vystaviť výhru.", meta: "10:57" }
      ]
    }),
    whatsappTask({
      id: "wa-18",
      title: "Krúžok sa presúva do inej miestnosti",
      context: "Správa prišla v skupine výtvarného krúžku.",
      contactName: "Výtvarný krúžok",
      contactMeta: "Skupina • 12 členov",
      verdict: "real",
      reasoning: "Je to jednoduchá zmena miestnosti a času v známej skupine bez rizikových prvkov.",
      clues: [
        "Len organizačný presun miestnosti.",
        "Žiadne linky ani požiadavky na peniaze.",
        "Dáva zmysel v kontexte školského krúžku."
      ],
      messages: [
        { from: "them", text: "Dnes budeme výnimočne v učebni 214 namiesto ateliéru. Začíname o 15 minút neskôr, čiže o 15:15.", meta: "13:41" }
      ]
    }),

    emailTask({
      id: "mail-01",
      title: "Nezaplatená faktúra za účet",
      context: "Email prišiel do školskej schránky bez súvislosti s nákupom.",
      fromName: "Office Billing",
      fromEmail: "billing@office365-payments-alerts.com",
      replyTo: "settlement@fastclaims-mail.ru",
      to: "student@gymnazium.sk",
      sentAt: "25 Mar 2026, 08:14",
      subject: "URGENT: Invoice overdue, account suspension pending",
      preview: "Open the attached invoice and confirm payment to avoid losing access today.",
      verdict: "fraud",
      reasoning: "Neznáma doména, iný reply-to a tlak na otvorenie faktúry sú silné znaky phishingu.",
      clues: [
        "Odosielateľská doména nesúvisí s oficiálnou službou školy.",
        "Reply-to smeruje úplne inde, dokonca na podozrivú doménu.",
        "Predmet tlačí na urgentné konanie ešte dnes."
      ],
      chips: ["Prijaté", "Externý odosielateľ"],
      body: [
        "Dear user,",
        "Your subscription invoice remains unpaid. Open the attachment and submit card confirmation immediately to avoid permanent suspension of services today.",
        "Accounts Department"
      ],
      attachments: ["Invoice_March_2026.docm"]
    }),
    emailTask({
      id: "mail-02",
      title: "Program školskej exkurzie",
      context: "Email prišiel z oficiálnej školskej adresy po odsúhlasení exkurzie.",
      fromName: "Mgr. Kováčová",
      fromEmail: "kovacova@gymnaziumnovam.sk",
      to: "rodicia@trieda.sk",
      sentAt: "25 Mar 2026, 09:06",
      subject: "Program exkurzie do Banskej Štiavnice - 28. 3.",
      preview: "Posielam harmonogram, kontakt na sprievodcu a zoznam vecí, ktoré majú žiaci priniesť.",
      verdict: "real",
      reasoning: "Email z oficiálnej školskej domény s očakávaným obsahom a bez citlivých požiadaviek môže byť reálny.",
      clues: [
        "Odosielateľ je na školskej doméne.",
        "Obsahuje harmonogram a organizačné pokyny, nie žiadosti o heslá.",
        "Téma zodpovedá plánovanej exkurzii."
      ],
      chips: ["Prijaté", "Dôležité"],
      body: [
        "Dobrý deň,",
        "v prílohe posielam harmonogram sobotnej exkurzie do Banskej Štiavnice. Odchod autobusu je o 7:30 od školy, návrat plánujeme približne o 18:00.",
        "Prosím, aby si žiaci priniesli obed, pršiplášť a kartičku poistenca.",
        "S pozdravom",
        "Mgr. Kováčová"
      ],
      attachments: ["program-exkurzie.pdf"]
    }),
    emailTask({
      id: "mail-03",
      title: "Overenie bankovej bezpečnosti",
      context: "Email prišiel do osobnej schránky a tvári sa ako banka.",
      fromName: "Slovenská sporiteľňa",
      fromEmail: "bezpecnost@slsp-klient-alert.com",
      replyTo: "verification@customerslsp.net",
      to: "uziovatel@example.com",
      sentAt: "25 Mar 2026, 10:18",
      subject: "Potvrďte svoj účet do 2 hodín",
      preview: "Detected suspicious login. Confirm your identity now to keep banking active.",
      verdict: "fraud",
      reasoning: "Falošný bankový email používa nesprávnu doménu a tlačí na prihlásenie cez neznámy odkaz.",
      clues: [
        "Banka nepoužíva doménu `slsp-klient-alert.com`.",
        "Reply-to smeruje na inú adresu ako odosielateľ.",
        "Tlačí na overenie do 2 hodín."
      ],
      chips: ["Prijaté", "Externý odosielateľ"],
      body: [
        "Dobrý deň,",
        "zaznamenali sme podozrivé prihlásenie do Vášho účtu. Pre pokračovanie služieb potvrďte identitu v zabezpečenom formulári.",
        "Ak tak neurobíte do 2 hodín, internet banking bude obmedzený."
      ],
      attachments: []
    }),
    emailTask({
      id: "mail-04",
      title: "Potvrdenie termínu na očnom",
      context: "Email prišiel po objednaní termínu cez ambulanciu.",
      fromName: "Očná ambulancia Vista",
      fromEmail: "recepcia@vistaambulancia.sk",
      to: "klient@example.com",
      sentAt: "25 Mar 2026, 11:02",
      subject: "Potvrdenie termínu 31. 3. o 14:20",
      preview: "Termín je rezervovaný. V správe nájdete pokyny k vyšetreniu.",
      verdict: "real",
      reasoning: "Email zodpovedá očakávanej rezervácii, nežiada nič podozrivé a používa konzistentné údaje.",
      clues: [
        "Obsahuje len termín, adresu a pokyny k návšteve.",
        "Nepýta citlivé údaje ani peniaze.",
        "Doména zodpovedá názvu ambulancie."
      ],
      chips: ["Prijaté"],
      body: [
        "Dobrý deň,",
        "potvrdzujeme Váš termín vyšetrenia na 31. 3. 2026 o 14:20. Prosíme, príďte 10 minút vopred a prineste si kartičku poistenca.",
        "Ak sa nemôžete dostaviť, odpovedzte na tento email alebo zavolajte na 02/444 228 19."
      ]
    }),
    emailTask({
      id: "mail-05",
      title: "Zdieľaný dokument z OneDrive",
      context: "Email tvrdí, že bol zdieľaný dokument od učiteľa, ale z podozrivej domény.",
      fromName: "OneDrive Share",
      fromEmail: "notify@onedrive-secure-share.co",
      to: "student@gymnazium.sk",
      sentAt: "25 Mar 2026, 11:55",
      subject: "Mgr. Halás zdieľal dokument s Vami",
      preview: "Open the secure document and sign in with school credentials.",
      verdict: "fraud",
      reasoning: "Názov služby je len napodobený a správa cieli na školské prihlasovacie údaje cez cudziu doménu.",
      clues: [
        "Doména `onedrive-secure-share.co` nie je oficiálna služba.",
        "Žiada prihlásenie školským heslom cez externý odkaz.",
        "Predstiera zdieľanie dokumentu bez ďalšieho kontextu."
      ],
      chips: ["Prijaté", "Externý odosielateľ"],
      body: [
        "A document has been shared with you by Mgr. Halás.",
        "To view the file, sign in with your school email and password using the secure link below.",
        "Access expires today."
      ]
    }),
    emailTask({
      id: "mail-06",
      title: "Potvrdenie objednávky z e-shopu",
      context: "Email prišiel po reálnom nákupe knihy.",
      fromName: "Martinus",
      fromEmail: "objednavky@martinus.sk",
      to: "zakaznik@example.com",
      sentAt: "25 Mar 2026, 12:21",
      subject: "Potvrdenie objednávky č. 2403817",
      preview: "Ďakujeme za objednávku, po odoslaní Vám pošleme sledovanie zásielky.",
      verdict: "real",
      reasoning: "Email môže byť reálny, lebo len potvrdzuje nákup, obsahuje číslo objednávky a nežiada citlivé údaje navyše.",
      clues: [
        "Doména zodpovedá známemu e-shopu.",
        "Obsahuje číslo objednávky a zoznam tovaru.",
        "Nevyžaduje ďalšie prihlasovanie cez podivný link."
      ],
      chips: ["Prijaté", "Objednávky"],
      body: [
        "Dobrý deň,",
        "ďakujeme za Vašu objednávku. Prijali sme položku: Ako funguje internet - 1 ks.",
        "Po odoslaní zásielky Vám pošleme samostatný email s číslom balíka."
      ]
    }),
    emailTask({
      id: "mail-07",
      title: "Aktualizácia mzdových údajov",
      context: "Email prišiel do školskej schránky a tvári sa ako personálne oddelenie.",
      fromName: "Payroll Department",
      fromEmail: "payroll@salary-center-help.com",
      to: "zamestnanec@skola.sk",
      sentAt: "25 Mar 2026, 13:09",
      subject: "Please verify your password for payroll adjustment",
      preview: "To avoid salary delay, reply with your current login and password.",
      verdict: "fraud",
      reasoning: "Nikto legitímny nebude pýtať heslo emailom, navyše z cudzej domény.",
      clues: [
        "Žiada priamo heslo odpoveďou na email.",
        "Odosielateľská doména nesúvisí so školou ani mzdovým systémom.",
        "Hrozí zdržaním výplaty, aby vyvolal paniku."
      ],
      chips: ["Prijaté", "Externý odosielateľ"],
      body: [
        "Dear employee,",
        "We are updating payroll records. Reply with your username and password to avoid salary delay this month.",
        "Payroll support"
      ]
    }),
    emailTask({
      id: "mail-08",
      title: "Upozornenie z knižnice",
      context: "Email prišiel z knižnice, v ktorej má používateľ konto.",
      fromName: "Mestská knižnica Trenčín",
      fromEmail: "upozornenia@kniznicatrencin.sk",
      to: "citatel@example.com",
      sentAt: "25 Mar 2026, 13:42",
      subject: "Blíži sa termín vrátenia vypožičaných kníh",
      preview: "Prosíme, skontrolujte si zoznam výpožičiek a termín vrátenia.",
      verdict: "real",
      reasoning: "Ide o typické notifikačné upozornenie bez podozrivej akcie a s konkrétnym termínom vrátenia.",
      clues: [
        "Nežiada platbu ani heslá.",
        "Obsahuje len termín a názvy výpožičiek.",
        "Doména zodpovedá knižnici."
      ],
      chips: ["Prijaté"],
      body: [
        "Dobrý deň,",
        "upozorňujeme Vás, že knihy Digitálny svet a Mesto v oblakoch je potrebné vrátiť najneskôr do 30. 3. 2026.",
        "V prípade potreby si výpožičku môžete predĺžiť po prihlásení do čitateľského konta cez oficiálny portál knižnice."
      ]
    }),
    emailTask({
      id: "mail-09",
      title: "Colný poplatok s HTML prílohou",
      context: "Email prišiel z neznámej adresy a obsahuje podozrivú prílohu.",
      fromName: "Customs Release",
      fromEmail: "customs@eu-package-release.net",
      to: "student@example.com",
      sentAt: "25 Mar 2026, 14:17",
      subject: "Package held - customs payment required",
      preview: "Open the attached form and enter card details for immediate release.",
      verdict: "fraud",
      reasoning: "Colné úrady neposielajú HTML formuláre na zadanie karty emailom z cudzej domény.",
      clues: [
        "Príloha `payment-form.html` je veľmi podozrivá.",
        "Email žiada zadanie karty kvôli balíku, ktorý nemusíš očakávať.",
        "Doména nie je dôveryhodná inštitúcia."
      ],
      chips: ["Prijaté", "Externý odosielateľ"],
      body: [
        "Your parcel is on hold for customs release.",
        "Open the attached form and submit card details to release your package immediately.",
        "Failure to act today will return the parcel."
      ],
      attachments: ["payment-form.html"]
    }),
    emailTask({
      id: "mail-10",
      title: "Mestský newsletter",
      context: "Email prišiel po prihlásení na odber noviniek mesta.",
      fromName: "Mesto Nová Dubnica",
      fromEmail: "newsletter@novadubnica.sk",
      to: "obyvatel@example.com",
      sentAt: "25 Mar 2026, 14:52",
      subject: "Týždenný prehľad podujatí a oznamov",
      preview: "Koncert, jarné upratovanie a zmena otváracích hodín klientského centra.",
      verdict: "real",
      reasoning: "Bežný mestský newsletter informuje o podujatiach a nevyžaduje citlivé údaje.",
      clues: [
        "Obsahuje viacero mestských oznamov a termínov.",
        "Nežiada heslá ani peniaze.",
        "Email je z oficiálnej mestskej domény."
      ],
      chips: ["Prijaté", "Newsletter"],
      body: [
        "Dobrý deň,",
        "v tomto týždni Vás pozývame na jarný koncert v kultúrnom dome, dobrovoľnícke upratovanie parku a pripomíname zmenu otváracích hodín klientského centra počas sviatkov.",
        "Podrobnosti nájdete na webe mesta."
      ]
    }),
    emailTask({
      id: "mail-11",
      title: "Preplnené cloudové úložisko",
      context: "Email tvrdí, že sa čoskoro zmažú súbory, ak hneď neklikneš.",
      fromName: "Google Team",
      fromEmail: "alerts@google-storage-support.help",
      to: "uziovatel@gmail.com",
      sentAt: "25 Mar 2026, 15:08",
      subject: "Your storage is full - files will be deleted today",
      preview: "Upgrade now to keep photos and documents safe.",
      verdict: "fraud",
      reasoning: "Neoficiálna doména a dramatické hrozby zmazaním dát sú typické phishingové prvky.",
      clues: [
        "Doména `google-storage-support.help` nie je oficiálna.",
        "Predmet hrozí zmazaním súborov ešte dnes.",
        "Tlačí na okamžité kliknutie na údajný upgrade."
      ],
      chips: ["Prijaté", "Externý odosielateľ"],
      body: [
        "Dear user,",
        "your cloud storage is critically full. Upgrade immediately or your documents and photos may be deleted today.",
        "Use the secure billing link in this email to continue."
      ]
    }),
    emailTask({
      id: "mail-12",
      title: "Potvrdenie registrácie na webinár",
      context: "Email prišiel po prihlásení na online seminár.",
      fromName: "EDU konferencia",
      fromEmail: "info@edukonferencia.sk",
      to: "ucastnik@example.com",
      sentAt: "25 Mar 2026, 15:37",
      subject: "Potvrdenie registrácie: Bezpečnosť na internete",
      preview: "V správe nájdete termín, link na prenos a technické pokyny.",
      verdict: "real",
      reasoning: "Tento email môže byť reálny, lebo nadväzuje na registráciu a nežiada nič podozrivé.",
      clues: [
        "Obsah je očakávaný po registrácii.",
        "Technické pokyny nevyžadujú citlivé údaje.",
        "Doména a názov organizátora sú konzistentné."
      ],
      chips: ["Prijaté"],
      body: [
        "Dobrý deň,",
        "ďakujeme za registráciu na webinár Bezpečnosť na internete, ktorý sa uskutoční 2. 4. 2026 o 17:00.",
        "Odkaz na prenos Vám pošleme hodinu pred začiatkom. Prosíme, pripojte sa aspoň 10 minút vopred."
      ]
    }),
    emailTask({
      id: "mail-13",
      title: "Štipendium a sken dokladov",
      context: "Email tvrdí, že študent má nárok na štipendium bez toho, aby oň žiadal.",
      fromName: "Scholarship Office",
      fromEmail: "award@scholarship-support-center.org",
      to: "student@gymnazium.sk",
      sentAt: "25 Mar 2026, 16:11",
      subject: "Urgent scholarship payout verification",
      preview: "Send copy of ID card and bank statement within 12 hours.",
      verdict: "fraud",
      reasoning: "Podvodný email láka na peniaze a pýta veľmi citlivé dokumenty v krátkom čase.",
      clues: [
        "Žiada občiansky preukaz a výpis z účtu emailom.",
        "Používa urgentný časový limit.",
        "Doména nevyzerá ako oficiálna školská ani štátna adresa."
      ],
      chips: ["Prijaté", "Externý odosielateľ"],
      body: [
        "Congratulations,",
        "you have been pre-selected for a scholarship payout. To receive funds, reply within 12 hours with a copy of your ID card and a recent bank statement.",
        "Late submissions will be rejected."
      ]
    }),
    emailTask({
      id: "mail-14",
      title: "Zmena hodiny v ZUŠ",
      context: "Email prišiel od učiteľky hudobného odboru.",
      fromName: "ZUŠ Nové Mesto",
      fromEmail: "klavir@zusnovemesto.sk",
      to: "rodic@example.com",
      sentAt: "25 Mar 2026, 16:43",
      subject: "Presun hodiny klavíra na štvrtok",
      preview: "Pre chorobu sa stredajšia hodina presúva o deň neskôr.",
      verdict: "real",
      reasoning: "Je to bežný organizačný email z konzistentnej adresy bez akýchkoľvek nebezpečných prvkov.",
      clues: [
        "Nadväzuje na existujúci krúžok.",
        "Obsahuje len presun termínu.",
        "Bez odkazov, platieb a citlivých požiadaviek."
      ],
      chips: ["Prijaté"],
      body: [
        "Dobrý deň,",
        "pre chorobu presúvame zajtrajšiu hodinu klavíra na štvrtok 26. 3. o 16:00. Ostatné termíny ostávajú bez zmeny.",
        "Ďakujem za pochopenie."
      ]
    }),
    emailTask({
      id: "mail-15",
      title: "Obnovenie antivírusu",
      context: "Email prišiel zo služby, ktorú používateľ nikdy nemal.",
      fromName: "Norton Renewal Center",
      fromEmail: "billing@norton-auto-renew-secure.com",
      to: "uziovatel@example.com",
      sentAt: "25 Mar 2026, 17:24",
      subject: "Invoice: 349,99 EUR will be charged today",
      preview: "If you did not authorize, call support immediately at the number below.",
      verdict: "fraud",
      reasoning: "Ide o častý scam, ktorý má vyvolať paniku veľkou sumou a následne vylákať kontakt na podvodnú linku.",
      clues: [
        "Hrozí okamžitým strhnutím vysokej sumy.",
        "Snaží sa prinútiť adresáta volať na číslo v emaile.",
        "Doména odosielateľa nie je oficiálna."
      ],
      chips: ["Prijaté", "Externý odosielateľ"],
      body: [
        "Dear customer,",
        "your antivirus subscription has been renewed for 349,99 EUR. If you did not authorize this transaction, call our billing desk immediately.",
        "Do not ignore this invoice."
      ]
    }),
    emailTask({
      id: "mail-16",
      title: "Mesačný výpis zo školskej jedálne",
      context: "Email prišiel rodičovi po prihlásení dieťaťa na obedy.",
      fromName: "Školská jedáleň",
      fromEmail: "jedalen@zscentruum.sk",
      to: "rodic@example.com",
      sentAt: "25 Mar 2026, 17:51",
      subject: "Prehľad odobratých obedov za marec",
      preview: "V prílohe nájdete prehľad obedov a zostávajúci kredit.",
      verdict: "real",
      reasoning: "Môže ísť o štandardný administratívny email s prehľadom obedov a kreditu.",
      clues: [
        "Obsah dáva zmysel pre rodiča žiaka.",
        "Nežiada heslo ani neprikazuje kliknúť na cudzí web.",
        "Email je z adresy jedálne školy."
      ],
      chips: ["Prijaté", "Príloha"],
      body: [
        "Dobrý deň,",
        "v prílohe nájdete prehľad odobratých obedov za marec a aktuálny zostatok kreditu. Prípadné otázky prosím posielajte na túto adresu.",
        "S pozdravom",
        "Školská jedáleň"
      ],
      attachments: ["prehlad-obedov-marec.pdf"]
    }),
    emailTask({
      id: "mail-17",
      title: "Kuriérska faktúra v ZIP prílohe",
      context: "Email prišiel z neznámej adresy s komprimovanou prílohou.",
      fromName: "Courier Finance",
      fromEmail: "documents@delivery-documents-center.net",
      to: "uziovatel@example.com",
      sentAt: "25 Mar 2026, 18:20",
      subject: "Final shipping invoice attached",
      preview: "Download the ZIP archive and confirm your payment reference.",
      verdict: "fraud",
      reasoning: "ZIP príloha a neurčitá faktúra od neznámeho odosielateľa sú výrazné varovania.",
      clues: [
        "Príloha `invoice.zip` je podozrivá.",
        "Chýbajú konkrétne údaje o balíku alebo objednávke.",
        "Odosielateľská doména je neznáma."
      ],
      chips: ["Prijaté", "Externý odosielateľ"],
      body: [
        "Dear client,",
        "please download the attached archive and review the final shipping invoice. Payment confirmation is required to avoid storage charges.",
        "Courier Finance"
      ],
      attachments: ["invoice.zip"]
    }),
    emailTask({
      id: "mail-18",
      title: "Pozvánka na rodičovské stretnutie",
      context: "Email prišiel od triednej učiteľky.",
      fromName: "Mgr. Žilinová",
      fromEmail: "zilinova@zsjasenska.sk",
      to: "rodicia@5a.sk",
      sentAt: "25 Mar 2026, 18:47",
      subject: "Rodičovské stretnutie 1. 4. o 16:30",
      preview: "Program stretnutia a krátke body k hodnoteniu triedy.",
      verdict: "real",
      reasoning: "Bežný školský oznam z oficiálnej domény bez rizikových požiadaviek.",
      clues: [
        "Oficiálna školská doména.",
        "Obsahuje len pozvánku a program stretnutia.",
        "Nepýta heslá ani peniaze."
      ],
      chips: ["Prijaté"],
      body: [
        "Dobrý deň,",
        "pozývam Vás na rodičovské stretnutie, ktoré sa uskutoční 1. 4. 2026 o 16:30 v triede 5.A.",
        "Prejdeme prospech, správanie žiakov a plán školy na apríl.",
        "S pozdravom",
        "Mgr. Žilinová"
      ]
    })
  ];

  function shuffle(list) {
    const next = list.slice();

    for (let index = next.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const temp = next[index];
      next[index] = next[swapIndex];
      next[swapIndex] = temp;
    }

    return next;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getCompletedCount() {
    return state.index + (state.answered ? 1 : 0);
  }

  function getRunningPercent() {
    const completed = getCompletedCount();

    if (!completed) {
      return 0;
    }

    return Math.round((state.correct / completed) * 100);
  }

  function getFinalPercent() {
    return Math.round((state.correct / QUESTIONS_PER_ROUND) * 100);
  }

  function getCurrentTask() {
    return state.tasks[state.index];
  }

  function getBestScore() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveBestScore(score, percent) {
    const currentBest = getBestScore();

    if (currentBest && currentBest.percent >= percent) {
      return currentBest;
    }

    const nextBest = {
      score: score,
      percent: percent,
      savedAt: new Date().toISOString()
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBest));
    } catch (error) {
      return currentBest || nextBest;
    }

    return nextBest;
  }

  function updateBestScoreText() {
    const best = getBestScore();

    if (!best) {
      bestScoreText.textContent = "Najlepší uložený výsledok: zatiaľ bez odohraného kola.";
      return;
    }

    bestScoreText.textContent = "Najlepší uložený výsledok: " + best.score + " / " + QUESTIONS_PER_ROUND + " (" + best.percent + " %).";
  }

  function getEnteredPlayerName() {
    return playerNameInput.value.trim();
  }

  function getActivePlayerName() {
    return state.playerName || getEnteredPlayerName() || "Hráč";
  }

  function updateNameState() {
    const hasName = Boolean(getEnteredPlayerName());
    startButton.disabled = !hasName;
    nameHintText.classList.toggle("error", false);
    nameHintText.textContent = hasName
      ? "Toto meno sa zobrazí na diplome po skončení kola."
      : "Najprv napíš meno alebo prezývku, ktorá sa zobrazí na diplome.";
  }

  function setDecisionButtonsDisabled(disabled) {
    fraudButton.disabled = disabled;
    realButton.disabled = disabled;
  }

  function updateScorePanel() {
    scoreValue.textContent = String(state.correct);
    percentValue.textContent = getRunningPercent() + " %";
    remainingValue.textContent = String(QUESTIONS_PER_ROUND - getCompletedCount());
    progressFill.style.width = ((getCompletedCount() / QUESTIONS_PER_ROUND) * 100) + "%";
  }

  function renderSms(task) {
    const bodyHtml = task.messages.map(function (message) {
      return (
        '<div class="bubble incoming">' +
          escapeHtml(message.text) +
          (message.chip ? '<div class="link-chip">' + escapeHtml(message.chip) + "</div>" : "") +
          '<span class="bubble-meta">' + escapeHtml(message.meta || "") + "</span>" +
        "</div>"
      );
    }).join("");

    return (
      '<article class="device-frame sms-device">' +
        '<div class="device-top">' +
          '<div class="device-kicker">SMS náhľad</div>' +
          '<div class="sms-header">' +
            "<div>" +
              '<p class="device-title">' + escapeHtml(task.sender) + "</p>" +
              '<p class="sms-topline">' + escapeHtml(task.senderMeta) + "</p>" +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="sms-body">' + bodyHtml + "</div>" +
      "</article>"
    );
  }

  function renderWhatsapp(task) {
    const bodyHtml = task.messages.map(function (message) {
      const bubbleClass = message.from === "me" ? "bubble outgoing" : "bubble incoming";

      return (
        '<div class="' + bubbleClass + '">' +
          escapeHtml(message.text) +
          (message.chip ? '<div class="link-chip">' + escapeHtml(message.chip) + "</div>" : "") +
          '<span class="bubble-meta">' + escapeHtml(message.meta || "") + "</span>" +
        "</div>"
      );
    }).join("");

    return (
      '<article class="device-frame whatsapp-device">' +
        '<div class="device-top">' +
          '<div class="device-kicker">WhatsApp náhľad</div>' +
          '<div class="wa-header">' +
            '<div class="wa-contact">' +
              '<div class="wa-avatar">' + escapeHtml(getInitials(task.contactName)) + "</div>" +
              "<div>" +
                '<p class="device-title">' + escapeHtml(task.contactName) + "</p>" +
                '<p class="sms-topline">' + escapeHtml(task.contactMeta) + "</p>" +
                (task.note ? '<span class="wa-note">' + escapeHtml(task.note) + "</span>" : "") +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="wa-body">' +
          '<div class="wa-day">' + escapeHtml(task.dayLabel) + "</div>" +
          bodyHtml +
        "</div>" +
      "</article>"
    );
  }

  function renderEmail(task) {
    const chipsHtml = task.chips.map(function (chip) {
      return '<span class="mail-chip">' + escapeHtml(chip) + "</span>";
    }).join("");

    const bodyHtml = task.body.map(function (paragraph) {
      return "<p>" + escapeHtml(paragraph) + "</p>";
    }).join("");

    const attachmentsHtml = task.attachments.map(function (attachment) {
      return '<span class="attachment-chip">' + escapeHtml(attachment) + "</span>";
    }).join("");

    return (
      '<article class="device-frame email-device">' +
        '<div class="mail-toolbar">' + chipsHtml + "</div>" +
        '<div class="mail-main">' +
          '<div class="device-kicker">Email náhľad</div>' +
          '<div class="mail-top">' +
            "<div>" +
              '<p class="mail-subject">' + escapeHtml(task.subject) + "</p>" +
              '<p class="mail-subtle">' + escapeHtml(task.sentAt) + "</p>" +
            "</div>" +
          "</div>" +
          '<div class="mail-addresses">' +
            '<div class="mail-grid">' +
              '<div class="mail-line"><span class="mail-label">Od</span>' + escapeHtml(task.fromName + " <" + task.fromEmail + ">") + "</div>" +
              (task.replyTo ? '<div class="mail-line"><span class="mail-label">Reply-to</span>' + escapeHtml(task.replyTo) + "</div>" : "") +
              '<div class="mail-line"><span class="mail-label">Komu</span>' + escapeHtml(task.to) + "</div>" +
            "</div>" +
          "</div>" +
          '<p class="mail-preview">' + escapeHtml(task.preview) + "</p>" +
          '<div class="mail-body">' + bodyHtml + "</div>" +
          (attachmentsHtml ? '<div class="attachments"><span class="attachment-label">Prílohy</span>' + attachmentsHtml + "</div>" : "") +
        "</div>" +
      "</article>"
    );
  }

  function renderMessage(task) {
    if (task.channel === "sms") {
      return renderSms(task);
    }

    if (task.channel === "whatsapp") {
      return renderWhatsapp(task);
    }

    return renderEmail(task);
  }

  function renderTask() {
    const task = getCurrentTask();
    state.answered = false;
    roundHeadline.textContent = "Úloha " + (state.index + 1) + " z " + QUESTIONS_PER_ROUND;
    channelBadge.textContent = CHANNEL_LABELS[task.channel];
    taskTitle.textContent = task.title;
    taskContext.textContent = task.context;
    messageViewport.innerHTML = renderMessage(task);
    feedbackPanel.classList.add("hidden");
    feedbackPanel.classList.remove("is-correct", "is-wrong");
    feedbackVerdict.className = "feedback-verdict";
    clueList.innerHTML = "";
    setDecisionButtonsDisabled(false);
    updateScorePanel();
  }

  function showFeedback(task, isCorrect) {
    feedbackPanel.classList.remove("hidden");
    feedbackPanel.classList.toggle("is-correct", isCorrect);
    feedbackPanel.classList.toggle("is-wrong", !isCorrect);
    feedbackVerdict.classList.add(isCorrect ? "correct" : "wrong");
    feedbackVerdict.textContent = isCorrect
      ? "Správne. Toto rozhodnutie sedí."
      : "Nesprávne. Správne riešenie bolo: " + VERDICT_LABELS[task.verdict] + ".";
    feedbackText.textContent = task.reasoning;
    clueTitle.textContent = task.verdict === "fraud"
      ? "Vodítka, ktoré prezradili podvod"
      : "Znaky, prečo môže byť správa reálna";
    clueList.innerHTML = task.clues.map(function (clue) {
      return "<li>" + escapeHtml(clue) + "</li>";
    }).join("");
  }

  function chooseVerdict(choice) {
    if (state.answered) {
      return;
    }

    const task = getCurrentTask();
    const isCorrect = choice === task.verdict;
    state.answered = true;

    if (isCorrect) {
      state.correct += 1;
    }

    state.history.push({
      task: task,
      guess: choice,
      correct: isCorrect
    });

    setDecisionButtonsDisabled(true);
    updateScorePanel();
    showFeedback(task, isCorrect);
  }

  function getResultBand(percent) {
    if (percent >= 70) {
      return {
        headline: "Super, má sa na pozore",
        summary: "Super, má sa na pozore.",
        diploma: "100 - 70 %: super, má sa na pozore."
      };
    }

    if (percent >= 37) {
      return {
        headline: "Má medzery, ale aj znalosti",
        summary: "Má medzery, ale aj znalosti. Treba len dopilovať detaily.",
        diploma: "69 - 37 %: má medzery ale aj znalosti, treba len dopilovať."
      };
    }

    return {
      headline: "Treba sa zlepšiť",
      summary: "Útočník ťa môže obrať o peniaze, alebo o peniaze tvojich rodičov. Treba sa zlepšiť.",
      diploma: "Menej ako 36 %: útočník ťa môže obrať o peniaze (alebo tvojich rodičov, ak máš ich účet), treba sa zlepšiť."
    };
  }

  function getTaskSource(task) {
    if (task.channel === "sms") {
      return task.sender;
    }

    if (task.channel === "whatsapp") {
      return task.contactName;
    }

    return task.fromName;
  }

  function renderHistory() {
    historyList.innerHTML = state.history.map(function (entry, index) {
      return (
        '<article class="history-item">' +
          '<div class="history-top">' +
            "<div>" +
              "<strong>Úloha " + (index + 1) + ": " + escapeHtml(entry.task.title) + "</strong>" +
              '<p class="history-explanation">' + escapeHtml(CHANNEL_LABELS[entry.task.channel] + " • " + getTaskSource(entry.task)) + "</p>" +
            "</div>" +
            '<div class="history-tags">' +
              '<span class="tag-chip neutral">' + escapeHtml(VERDICT_LABELS[entry.task.verdict]) + "</span>" +
              '<span class="tag-chip ' + (entry.correct ? "good" : "bad") + '">' +
                escapeHtml(entry.correct ? "Tvoja odpoveď bola správna" : "Tvoja odpoveď: " + VERDICT_LABELS[entry.guess]) +
              "</span>" +
            "</div>" +
          "</div>" +
          '<p class="history-explanation">' + escapeHtml(entry.task.reasoning) + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function finishRound() {
    const percent = getFinalPercent();
    const best = saveBestScore(state.correct, percent);
    const band = getResultBand(percent);
    const playerName = getActivePlayerName();
    summaryHeadline.textContent = band.headline;
    summaryText.textContent = playerName + " správne vyhodnotil " + state.correct + " z " + QUESTIONS_PER_ROUND + " správ. " + band.summary;
    summaryScore.textContent = state.correct + " / " + QUESTIONS_PER_ROUND;
    summaryPercent.textContent = percent + " %";
    summaryBest.textContent = (best ? best.percent : percent) + " %";
    diplomaName.textContent = playerName;
    diplomaPercentLine.textContent = "Úspešnosť: " + percent + " %";
    diplomaRating.textContent = band.headline;
    diplomaMessage.textContent = band.diploma;
    renderHistory();
    gameScreen.classList.add("hidden");
    summaryScreen.classList.remove("hidden");
    updateBestScoreText();
    summaryScreen.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function nextTask() {
    if (!state.answered) {
      return;
    }

    state.index += 1;

    if (state.index >= QUESTIONS_PER_ROUND) {
      finishRound();
      return;
    }

    renderTask();
  }

  function startRound() {
    const enteredName = getEnteredPlayerName();

    if (!enteredName && !state.playerName) {
      nameHintText.classList.add("error");
      nameHintText.textContent = "Pred začiatkom hry zadaj meno alebo prezývku.";
      playerNameInput.focus();
      return;
    }

    state.playerName = enteredName || state.playerName;
    playerNameInput.value = state.playerName;
    state.tasks = shuffle(TASK_BANK).slice(0, QUESTIONS_PER_ROUND);
    state.index = 0;
    state.correct = 0;
    state.answered = false;
    state.history = [];
    summaryScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    updateNameState();
    renderTask();
    gameScreen.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function getInitials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (part) {
        return part.charAt(0).toUpperCase();
      })
      .join("");
  }

  startButton.addEventListener("click", startRound);
  restartButton.addEventListener("click", startRound);
  playerNameInput.addEventListener("input", updateNameState);
  fraudButton.addEventListener("click", function () {
    chooseVerdict("fraud");
  });
  realButton.addEventListener("click", function () {
    chooseVerdict("real");
  });
  nextButton.addEventListener("click", nextTask);

  updateBestScoreText();
  updateNameState();
})();
