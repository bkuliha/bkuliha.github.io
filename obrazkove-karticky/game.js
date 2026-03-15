(function () {
  const GAME_SIZE = 15;
  const ADVANCE_DELAY_MS = 850;
  const imageCache = new Map();

  const answers = {
    candles: { label: "sviečky", icon: "🕯️", type: "object", pool: "objects", colors: ["#ffd166", "#f77f00"] },
    book: { label: "knihu", icon: "📖", type: "object", pool: "objects", colors: ["#90caf9", "#3a86ff"] },
    eatAction: { label: "ješ", icon: "🍽️", type: "action", pool: "actions", colors: ["#ffd6a5", "#ff8c42"] },
    relaxAction: { label: "oddychuješ", icon: "🛋️", type: "action", pool: "actions", colors: ["#cdb4db", "#7b2cbf"] },
    baseballBat: { label: "bejzbalovú palicu", icon: "🏏", type: "object", pool: "objects", colors: ["#d8c3a5", "#b5651d"] },
    eraser: { label: "gumu", icon: "🩹", type: "object", pool: "school-tools", colors: ["#ffd6e0", "#ff6392"] },
    phone: { label: "telefón", icon: "📱", type: "object", pool: "tech", colors: ["#ade8f4", "#0077b6"] },
    umbrella: { label: "dáždnik", icon: "☂️", type: "object", pool: "objects", colors: ["#cdb4db", "#6a4c93"] },
    headphones: { label: "slúchadlá", icon: "🎧", type: "object", pool: "tech", colors: ["#f1fa8c", "#ffb703"] },
    key: { label: "kľúčom", icon: "🔑", type: "object", pool: "objects", colors: ["#ffe082", "#d4a017"] },
    playAction: { label: "hrá sa", icon: "🎲", type: "action", pool: "actions", colors: ["#caffbf", "#57cc99"] },
    cookAction: { label: "varíš", icon: "👩‍🍳", type: "action", pool: "actions", colors: ["#ffddd2", "#e76f51"] },
    readAction: { label: "čítaš", icon: "📚", type: "action", pool: "actions", colors: ["#bde0fe", "#4361ee"] },
    chair: { label: "stolička", icon: "🪑", type: "object", pool: "furniture", colors: ["#ddb892", "#99582a"] },
    knife: { label: "nožom", icon: "🔪", type: "object", pool: "objects", colors: ["#dee2e6", "#6c757d"] },
    drinkAction: { label: "napiješ sa", icon: "🥤", type: "action", pool: "actions", colors: ["#caf0f8", "#48cae4"] },
    sleepAction: { label: "ideš spať", icon: "😴", type: "action", pool: "actions", colors: ["#dfe7fd", "#6c63ff"] },
    chalk: { label: "kriedou", icon: "✏️", type: "object", pool: "school-tools", colors: ["#f8f9fa", "#adb5bd"] },
    comb: { label: "hrebeňom", icon: "🪮", type: "object", pool: "care-tools", colors: ["#f7cad0", "#f28482"] },
    shoeBrush: { label: "kefou na topánky", icon: "🧽", type: "object", pool: "care-tools", colors: ["#ccd5ae", "#6b705c"] },
    swimAction: { label: "plávaš", icon: "🏊", type: "action", pool: "actions", colors: ["#a9def9", "#00b4d8"] },
    watchMovieAction: { label: "pozeráš film", icon: "🎬", type: "action", pool: "actions", colors: ["#ced4da", "#495057"] },
    washHandsAction: { label: "umývaš si ruky", icon: "🧼", type: "action", pool: "actions", colors: ["#d8f3dc", "#52b788"] },

    christmas: { label: "na Vianoce", icon: "🎄", type: "time", pool: "time", colors: ["#c9f2c7", "#2d6a4f"] },
    easter: { label: "na Veľkú noc", icon: "🥚", type: "time", pool: "time", colors: ["#ffe5ec", "#ff6b6b"] },
    movieTime: { label: "keď pozeráš film", icon: "🍿", type: "time", pool: "time", colors: ["#fff1b6", "#ffb703"] },
    darkTime: { label: "keď je tma", icon: "💡", type: "time", pool: "time", colors: ["#e9ecef", "#577590"] },
    winter: { label: "v zime", icon: "🧣", type: "time", pool: "time", colors: ["#d9edff", "#4ea8de"] },
    evening: { label: "večer", icon: "🌆", type: "time", pool: "time", colors: ["#ffcad4", "#ff7b54"] },
    summer: { label: "v lete", icon: "🧴", type: "time", pool: "time", colors: ["#ffe066", "#f77f00"] },
    birthday: { label: "na narodeniny", icon: "🎂", type: "time", pool: "time", colors: ["#ffd6ff", "#b5179e"] },
    daytime: { label: "cez deň", icon: "☀️", type: "time", pool: "time", colors: ["#fff3b0", "#f4a261"] },
    night: { label: "v noci", icon: "🌙", type: "time", pool: "time", colors: ["#cddafd", "#3f37c9"] },
    autumn: { label: "na jeseň", icon: "🍂", type: "time", pool: "time", colors: ["#f9c74f", "#bc6c25"] },
    spring: { label: "na jar", icon: "🌷", type: "time", pool: "time", colors: ["#caffbf", "#80ed99"] },
    schoolDays: { label: "cez týždeň", icon: "🗓️", type: "time", pool: "time", colors: ["#caf0f8", "#0077b6"] },
    morning: { label: "ráno", icon: "🌅", type: "time", pool: "time", colors: ["#ffe5b4", "#f8961e"] },

    bathroom: { label: "v kúpeľni", icon: "🪥", type: "place", pool: "places", colors: ["#d9f0ff", "#48bfe3"] },
    livingRoom: { label: "v obývačke", icon: "📺", type: "place", pool: "places", colors: ["#fef3c7", "#f59e0b"] },
    attic: { label: "v podkroví", icon: "🏠", type: "place", pool: "places", colors: ["#e9d8a6", "#bb6c25"] },
    basement: { label: "v pivnici", icon: "🧱", type: "place", pool: "places", colors: ["#d8dee9", "#4c566a"] },
    sink: { label: "v dreze", icon: "🚰", type: "place", pool: "places", colors: ["#d8f3ff", "#1d3557"] },
    airport: { label: "na letisku", icon: "🛫", type: "place", pool: "places", colors: ["#caf0f8", "#0096c7"] },
    bedroom: { label: "v spálni", icon: "🛏️", type: "place", pool: "places", colors: ["#f8edeb", "#c77dff"] },
    library: { label: "v knižnici", icon: "🏛️", type: "place", pool: "places", colors: ["#e5e5e5", "#6d597a"] },
    garden: { label: "v záhrade", icon: "🥕", type: "place", pool: "places", colors: ["#d9ed92", "#55a630"] },
    bakery: { label: "v pekárni", icon: "🥖", type: "place", pool: "places", colors: ["#ffe8a1", "#dda15e"] },
    hospital: { label: "v nemocnici", icon: "🏥", type: "place", pool: "places", colors: ["#e0fbfc", "#3d5a80"] },
    forest: { label: "v lese", icon: "🌲", type: "place", pool: "places", colors: ["#d8f3dc", "#2d6a4f"] },
    water: { label: "vo vode", icon: "🐟", type: "place", pool: "places", colors: ["#bde0fe", "#0077b6"] },
    wardrobe: { label: "v skrini", icon: "👕", type: "place", pool: "places", colors: ["#ffd6a5", "#e76f51"] },
    balcony: { label: "na balkóne", icon: "🌿", type: "place", pool: "places", colors: ["#edf6f9", "#2a9d8f"] },
    kidsRoom: { label: "v detskej izbe", icon: "🧸", type: "place", pool: "places", colors: ["#ffe5ec", "#ff5d8f"] },
    playroom: { label: "v herni", icon: "🧩", type: "place", pool: "places", colors: ["#f1faee", "#457b9d"] },
    garage: { label: "v garáži", icon: "🚗", type: "place", pool: "places", colors: ["#dee2ff", "#4361ee"] },
    playground: { label: "na ihrisku", icon: "🛝", type: "place", pool: "places", colors: ["#ffddd2", "#f28482"] },
    pharmacy: { label: "v lekárni", icon: "💊", type: "place", pool: "places", colors: ["#e3f2fd", "#2b9348"] },
    nervous: { label: "nervózny", icon: "😬", type: "feeling", pool: "feelings", colors: ["#ffd6a5", "#ff6b6b"] },
    tired: { label: "unavený", icon: "🥱", type: "feeling", pool: "feelings", colors: ["#dee2ff", "#6c63ff"] },
    quiet: { label: "tichá", icon: "🤫", type: "descriptor", pool: "descriptors", colors: ["#e0fbfc", "#5c677d"] },
    big: { label: "veľký", icon: "🐘", type: "descriptor", pool: "descriptors", colors: ["#e9ecef", "#6c757d"] },
    red: { label: "červenú", icon: "❤️", type: "descriptor", pool: "descriptors", colors: ["#ffccd5", "#d62828"] },
    orangeColor: { label: "oranžovú", icon: "🍊", type: "descriptor", pool: "descriptors", colors: ["#ffd6a5", "#f77f00"] },
    happy: { label: "šťastný", icon: "🎁", type: "feeling", pool: "feelings", colors: ["#fdffb6", "#ffb703"] },
    scared: { label: "vystrašený", icon: "⛈️", type: "feeling", pool: "feelings", colors: ["#d9d9d9", "#4f5d75"] },
    sour: { label: "kyslý", icon: "🍋", type: "descriptor", pool: "descriptors", colors: ["#fef9c3", "#84a98c"] },
    sweet: { label: "sladký", icon: "🍬", type: "descriptor", pool: "descriptors", colors: ["#ffd6ff", "#ff85a1"] },
    cold: { label: "studený", icon: "🧊", type: "descriptor", pool: "descriptors", colors: ["#d9edff", "#48cae4"] },
    soft: { label: "mäkká", icon: "🧸", type: "descriptor", pool: "descriptors", colors: ["#ffe5d9", "#d4a373"] },
    slow: { label: "pomalý", icon: "🐌", type: "descriptor", pool: "descriptors", colors: ["#e9edc9", "#606c38"] },
    fast: { label: "rýchly", icon: "🐆", type: "descriptor", pool: "descriptors", colors: ["#d8f3dc", "#1b9aaa"] },

    passportReason: { label: "aby si mohol cestovať do iných krajín", icon: "🛂", type: "reason", pool: "reasons", colors: ["#caf0f8", "#4361ee"] },
    noWaterReason: { label: "pretože nemá dosť vody", icon: "🥀", type: "reason", pool: "reasons", colors: ["#f8edeb", "#9c6644"] },
    seeAtNightReason: { label: "aby bolo v tme lepšie vidno", icon: "🌃", type: "reason", pool: "reasons", colors: ["#dee2ff", "#3f37c9"] },
    protectEyesReason: { label: "aby chránili oči pred slnkom", icon: "🕶️", type: "reason", pool: "reasons", colors: ["#f1fa8c", "#f77f00"] },
    flowersGrowReason: { label: "aby kvety rástli", icon: "💧", type: "reason", pool: "reasons", colors: ["#d8f3dc", "#52b788"] },
    energyReason: { label: "aby sme mali energiu", icon: "⚡", type: "reason", pool: "reasons", colors: ["#ffe066", "#f8961e"] },
    notThirstyReason: { label: "aby sme neboli smädní", icon: "💦", type: "reason", pool: "reasons", colors: ["#bde0fe", "#00b4d8"] },
    cleanHandsReason: { label: "aby sme mali čisté ruky", icon: "🫧", type: "reason", pool: "reasons", colors: ["#edf6f9", "#83c5be"] },
    warmReason: { label: "aby nám bolo teplo", icon: "🧥", type: "reason", pool: "reasons", colors: ["#fbc4ab", "#e76f51"] },
    healthyTeethReason: { label: "aby boli zuby zdravé", icon: "🦷", type: "reason", pool: "reasons", colors: ["#f8f9fa", "#90e0ef"] },

    plantGrowth: { label: "vyrastie z neho rastlina", icon: "🌱", type: "knowledge", pool: "knowledge", colors: ["#d9ed92", "#55a630"] },
    ambulance: { label: "sanitka", icon: "🚑", type: "knowledge", pool: "knowledge", colors: ["#ffd6d6", "#d62828"] },
    moon: { label: "mesiac", icon: "🌕", type: "knowledge", pool: "knowledge", colors: ["#fff1b6", "#adb5bd"] },
    giraffe: { label: "žirafa", icon: "🦒", type: "knowledge", pool: "knowledge", colors: ["#ffe5b4", "#b5651d"] },
    scissors: { label: "nožnice", icon: "✂️", type: "knowledge", pool: "knowledge", colors: ["#dee2e6", "#495057"] },
    strawberry: { label: "jahoda", icon: "🍓", type: "knowledge", pool: "knowledge", colors: ["#ffd6d6", "#e63946"] },
    sneakers: { label: "tenisky", icon: "👟", type: "knowledge", pool: "knowledge", colors: ["#e0fbfc", "#00afb9"] },
    bus: { label: "autobus", icon: "🚌", type: "knowledge", pool: "knowledge", colors: ["#ffe066", "#e09f3e"] },
    pencilCaseItem: { label: "ceruzka", icon: "✏️", type: "knowledge", pool: "knowledge", colors: ["#f8f9fa", "#ff006e"] },
    bed: { label: "posteľ", icon: "🛏️", type: "knowledge", pool: "knowledge", colors: ["#f1f1ff", "#7b2cbf"] },
    paintSet: { label: "farby a štetec", icon: "🎨", type: "knowledge", pool: "knowledge", colors: ["#d8e2dc", "#ef476f"] },
    sunday: { label: "nedeľa", icon: "📅", type: "knowledge", pool: "knowledge", colors: ["#caf0f8", "#0077b6"] },
    airplane: { label: "lietadlo", icon: "✈️", type: "knowledge", pool: "knowledge", colors: ["#d9edff", "#0096c7"] },
    towel: { label: "uterák", icon: "🧺", type: "knowledge", pool: "knowledge", colors: ["#fff1e6", "#9c6644"] },

    spoon: { label: "lyžicu", icon: "🥄", type: "object", pool: "objects", colors: ["#edf2f4", "#8d99ae"] },
    tablet: { label: "tablet", icon: "💻", type: "object", pool: "tech", colors: ["#c3fae8", "#2a9d8f"] },
    sofa: { label: "gauč", icon: "🛋️", type: "object", pool: "furniture", colors: ["#e9d8fd", "#5a189a"] },
    marker: { label: "fixku", icon: "🖍️", type: "object", pool: "school-tools", colors: ["#fff3bf", "#ff922b"] },
    toothbrush: { label: "zubnú kefku", icon: "🪥", type: "knowledge", pool: "knowledge", colors: ["#d9f0ff", "#00b4d8"] },
    zoo: { label: "v zoologickej záhrade", icon: "🦁", type: "place", pool: "places", colors: ["#e9edc9", "#606c38"] },
    salty: { label: "slaný", icon: "🧂", type: "descriptor", pool: "descriptors", colors: ["#f8f9fa", "#868e96"] },
    hard: { label: "tvrdá", icon: "🪨", type: "descriptor", pool: "descriptors", colors: ["#dee2e6", "#495057"] },
    calm: { label: "pokojná", icon: "🌤️", type: "descriptor", pool: "descriptors", colors: ["#d8f3dc", "#52b788"] },
    brave: { label: "odvážny", icon: "🦸", type: "feeling", pool: "feelings", colors: ["#fff3b0", "#f77f00"] }
  };

  const questions = [
    { prompt: "Čo zapáliš na narodeninovej torte?", answerId: "candles" },
    { prompt: "Čo čítaš, keď si chceš vypočuť príbeh?", answerId: "book" },
    { prompt: "Čo robíš, keď sedíš za jedálenským stolom?", answerId: "eatAction" },
    { prompt: "Čo robíš, keď sedíš na gauči?", answerId: "relaxAction" },
    { prompt: "Čo používaš na odpálenie bejzbalovej loptičky?", answerId: "baseballBat" },
    { prompt: "Čo použiješ na vymazanie chyby v zošite?", answerId: "eraser" },
    { prompt: "Čo používaš na videohovory s kamarátmi?", answerId: "phone" },
    { prompt: "Čo si vezmeš so sebou, keď vonku prší?", answerId: "umbrella" },
    { prompt: "Čo používaš na počúvanie hudby, aby si nikoho nerušil?", answerId: "headphones" },
    { prompt: "Čím odomykáš dvere na dome?", answerId: "key" },
    { prompt: "Čo robíš v parku?", answerId: "playAction" },
    { prompt: "Čo robíš v kuchyni?", answerId: "cookAction" },
    { prompt: "Čo robíš v knižnici?", answerId: "readAction" },
    { prompt: "Na čom zvyčajne sedíš pri stole?", answerId: "chair" },
    { prompt: "Čím si krájaš jedlo na tanieri?", answerId: "knife" },
    { prompt: "Čo robíš, keď si smädný?", answerId: "drinkAction" },
    { prompt: "Čo robíš, keď si hladný?", answerId: "eatAction" },
    { prompt: "Čo robíš, keď si unavený?", answerId: "sleepAction" },
    { prompt: "Čím píšeš na tabuľu v škole?", answerId: "chalk" },
    { prompt: "Čím si češeš vlasy?", answerId: "comb" },
    { prompt: "Čím si čistíš topánky?", answerId: "shoeBrush" },
    { prompt: "Čo robíš v bazéne?", answerId: "swimAction" },
    { prompt: "Čo robíš v kine?", answerId: "watchMovieAction" },
    { prompt: "Čo robíš na ihrisku?", answerId: "playAction" },
    { prompt: "Čo robíš s mydlom a vodou?", answerId: "washHandsAction" },

    { prompt: "Kedy si ľudia zvyčajne vymieňajú darčeky?", answerId: "christmas" },
    { prompt: "Kedy deti hľadajú veľkonočné vajíčka?", answerId: "easter" },
    { prompt: "Kedy zvyčajne ješ pukance?", answerId: "movieTime" },
    { prompt: "Kedy zapínaš svetlo v izbe?", answerId: "darkTime" },
    { prompt: "Kedy nosíš rukavice a šál?", answerId: "winter" },
    { prompt: "Kedy chodíš spať do postele?", answerId: "evening" },
    { prompt: "Kedy používaš opaľovací krém?", answerId: "summer" },
    { prompt: "Kedy oslavuješ svoje narodeniny?", answerId: "birthday" },
    { prompt: "Kedy svieti na oblohe slnko?", answerId: "daytime" },
    { prompt: "Kedy sa objavujú na oblohe hviezdy?", answerId: "night" },
    { prompt: "Kedy padá lístie zo stromov?", answerId: "autumn" },
    { prompt: "Kedy kvitnú kvety na lúke?", answerId: "spring" },
    { prompt: "Kedy chodíš do školy?", answerId: "schoolDays" },
    { prompt: "Kedy raňajkuješ?", answerId: "morning" },
    { prompt: "Kedy večeriaš?", answerId: "evening" },

    { prompt: "Kde si umývaš zuby?", answerId: "bathroom" },
    { prompt: "Kde v dome zvyčajne pozeráš televíziu?", answerId: "livingRoom" },
    { prompt: "Kde nájdeš v dome izbu priamo pod strechou?", answerId: "attic" },
    { prompt: "Kde v dome nájdeš izbu pod úrovňou zeme?", answerId: "basement" },
    { prompt: "Kde umývaš špinavý riad?", answerId: "sink" },
    { prompt: "Kde parkujú lietadlá?", answerId: "airport" },
    { prompt: "Kde spíš?", answerId: "bedroom" },
    { prompt: "Kde nájdeš veľa kníh na jednom mieste?", answerId: "library" },
    { prompt: "Kde rastie zelenina a ovocie?", answerId: "garden" },
    { prompt: "Kde si kupuješ chlieb a pečivo?", answerId: "bakery" },
    { prompt: "Kde sa liečia chorí ľudia?", answerId: "hospital" },
    { prompt: "Kde bývajú divoké zvieratá?", answerId: "forest" },
    { prompt: "Kde plávajú ryby?", answerId: "water" },
    { prompt: "Kde si odkladáš svoje oblečenie?", answerId: "wardrobe" },
    { prompt: "Kde v byte môžeš vyjsť von na čerstvý vzduch?", answerId: "balcony" },
    { prompt: "Kde sa nachádza tvoja obľúbená hračka?", answerId: "kidsRoom" },
    { prompt: "Kde sa hrajú deti v škôlke?", answerId: "playroom" },
    { prompt: "Kde stoja autá, keď nejazdia?", answerId: "garage" },
    { prompt: "Kde nájdeš pieskovisko a šmýkačku?", answerId: "playground" },
    { prompt: "Kde kúpiš lieky, keď si chorý?", answerId: "pharmacy" },

    { prompt: "Ako sa cítiš, keď čakáš na veľmi dôležitú správu?", answerId: "nervous" },
    { prompt: "Ako sa cítiš po veľmi dlhej prechádzke?", answerId: "tired" },
    { prompt: "Ako by si opísal atmosféru v knižnici?", answerId: "quiet" },
    { prompt: "Ktoré slovo najlepšie opisuje slona?", answerId: "big" },
    { prompt: "Akú farbu má drahokam rubín?", answerId: "red" },
    { prompt: "Akú farbu má ovocie pomaranč?", answerId: "orangeColor" },
    { prompt: "Ako sa cítiš, keď dostaneš pekný darček?", answerId: "happy" },
    { prompt: "Ako sa cítiš, keď vonku hrmí a blýska sa?", answerId: "scared" },
    { prompt: "Aký je citrón na chuť?", answerId: "sour" },
    { prompt: "Aký je cukor na chuť?", answerId: "sweet" },
    { prompt: "Aký je ľad na dotyk?", answerId: "cold" },
    { prompt: "Aká je deka na dotyk?", answerId: "soft" },
    { prompt: "Ako sa cítiš, keď si v noci sám v tme?", answerId: "scared" },
    { prompt: "Ako by si opísal slimáka?", answerId: "slow" },
    { prompt: "Ako by si opísal geparda?", answerId: "fast" },

    { prompt: "Prečo potrebuješ cestovný pas?", answerId: "passportReason" },
    { prompt: "Prečo rastlina zvädne?", answerId: "noWaterReason" },
    { prompt: "Prečo sa v noci zapínajú pouličné lampy?", answerId: "seeAtNightReason" },
    { prompt: "Prečo nosíme v lete slnečné okuliare?", answerId: "protectEyesReason" },
    { prompt: "Prečo musíme zalievať kvety?", answerId: "flowersGrowReason" },
    { prompt: "Prečo jeme jedlo?", answerId: "energyReason" },
    { prompt: "Prečo pijeme vodu?", answerId: "notThirstyReason" },
    { prompt: "Prečo si umývame ruky pred jedlom?", answerId: "cleanHandsReason" },
    { prompt: "Prečo nosíme v zime teplý kabát?", answerId: "warmReason" },
    { prompt: "Prečo chodíme k zubárovi?", answerId: "healthyTeethReason" },

    { prompt: "Čo sa stane so semienkom, keď ho zasadíš do zeme?", answerId: "plantGrowth" },
    { prompt: "Čo vydáva hlasný zvuk ako siréna?", answerId: "ambulance" },
    { prompt: "Čo svieti na nočnej oblohe?", answerId: "moon" },
    { prompt: "Ktoré zviera má veľmi dlhý krk?", answerId: "giraffe" },
    { prompt: "Čo používaš na strihanie papiera?", answerId: "scissors" },
    { prompt: "Ktoré ovocie je červené a sladké?", answerId: "strawberry" },
    { prompt: "Čo nosíš na nohách, keď ideš behať?", answerId: "sneakers" },
    { prompt: "Čo z uvedeného je dopravný prostriedok?", answerId: "bus" },
    { prompt: "Čo patrí do peračníka?", answerId: "pencilCaseItem" },
    { prompt: "Ktorý kus nábytku nájdeš v spálni?", answerId: "bed" },
    { prompt: "Čo potrebuješ na maľovanie obrázka?", answerId: "paintSet" },
    { prompt: "Ktoré ročné obdobie je najteplejšie?", answerId: "summer" },
    { prompt: "Ktorý deň nasleduje po sobote?", answerId: "sunday" },
    { prompt: "Čo lieta v oblakoch a má krídla?", answerId: "airplane" },
    { prompt: "Čo používaš na utretie rúk po umytí?", answerId: "towel" }
  ];

  const introScreen = document.getElementById("introScreen");
  const gameScreen = document.getElementById("gameScreen");
  const resultScreen = document.getElementById("resultScreen");
  const progressValue = document.getElementById("progressValue");
  const scoreValue = document.getElementById("scoreValue");
  const questionBadge = document.getElementById("questionBadge");
  const questionText = document.getElementById("questionText");
  const feedbackText = document.getElementById("feedbackText");
  const optionsGrid = document.getElementById("optionsGrid");
  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const playAgainButton = document.getElementById("playAgainButton");

  let gameQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let currentQuestionMissed = false;
  let questionResolved = false;
  let advanceTimeoutId = null;

  function shuffle(items) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function pickOptions(answerId) {
    const answer = answers[answerId];
    const allEntries = Object.entries(answers);
    const samePool = allEntries.filter(function ([id, item]) {
      return id !== answerId && item.pool === answer.pool;
    });
    const sameType = allEntries.filter(function ([id, item]) {
      return id !== answerId && item.type === answer.type;
    });
    const others = allEntries.filter(function ([id]) {
      return id !== answerId;
    });

    const distractors = [];
    [shuffle(samePool), shuffle(sameType), shuffle(others)].forEach(function (source) {
      source.forEach(function ([id]) {
        if (distractors.length >= 3 || distractors.includes(id)) {
          return;
        }
        distractors.push(id);
      });
    });

    return shuffle([answerId].concat(distractors.slice(0, 3)));
  }

  function getImageSource(answer) {
    if (imageCache.has(answer.label)) {
      return imageCache.get(answer.label);
    }

    const svg = [
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 360'>",
      "<defs>",
      "<linearGradient id='g' x1='0%' x2='100%' y1='0%' y2='100%'>",
      "<stop offset='0%' stop-color='" + answer.colors[0] + "'/>",
      "<stop offset='100%' stop-color='" + answer.colors[1] + "'/>",
      "</linearGradient>",
      "</defs>",
      "<rect width='480' height='360' rx='34' fill='url(#g)'/>",
      "<circle cx='372' cy='82' r='58' fill='rgba(255,255,255,0.22)'/>",
      "<circle cx='92' cy='278' r='84' fill='rgba(255,255,255,0.14)'/>",
      "<rect x='48' y='42' width='384' height='276' rx='28' fill='rgba(255,255,255,0.18)' stroke='rgba(255,255,255,0.32)'/>",
      "<text x='240' y='206' text-anchor='middle' font-size='112'>",
      answer.icon,
      "</text>",
      "</svg>"
    ].join("");

    const src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
    imageCache.set(answer.label, src);
    return src;
  }

  function updateStatus() {
    progressValue.textContent = String(Math.min(currentIndex + 1, GAME_SIZE)) + " / " + String(GAME_SIZE);
    scoreValue.textContent = String(score);
  }

  function setFeedback(message) {
    feedbackText.textContent = message;
  }

  function showScreen(screen) {
    [introScreen, gameScreen, resultScreen].forEach(function (element) {
      element.classList.toggle("hidden", element !== screen);
    });
  }

  function renderQuestion() {
    const currentQuestion = gameQuestions[currentIndex];
    const optionIds = pickOptions(currentQuestion.answerId);

    currentQuestionMissed = false;
    questionResolved = false;
    updateStatus();
    questionBadge.textContent = "Kartička " + String(currentIndex + 1) + " z " + String(GAME_SIZE);
    questionText.textContent = currentQuestion.prompt;
    setFeedback("Vyber jednu z možností.");
    optionsGrid.innerHTML = "";

    optionIds.forEach(function (optionId) {
      const answer = answers[optionId];
      const button = document.createElement("button");
      const image = document.createElement("img");
      const label = document.createElement("span");

      button.type = "button";
      button.className = "option-card";
      button.dataset.answerId = optionId;

      image.src = getImageSource(answer);
      image.alt = "";
      image.loading = "eager";

      label.className = "option-label";
      label.textContent = answer.label;

      button.appendChild(image);
      button.appendChild(label);
      button.addEventListener("click", function () {
        handleOptionClick(button, optionId);
      });

      optionsGrid.appendChild(button);
    });
  }

  function lockOptions() {
    Array.from(optionsGrid.querySelectorAll(".option-card")).forEach(function (button) {
      button.disabled = true;
      button.classList.add("is-locked");
    });
  }

  function handleCorrect(button) {
    const gainedPoint = !currentQuestionMissed;

    questionResolved = true;
    if (gainedPoint) {
      score += 1;
      setFeedback("Správne. Získavaš bod a ideš ďalej.");
    } else {
      setFeedback("Správne, ale po predchádzajúcom omyle už tento bod nezískaš.");
    }

    button.classList.add("is-correct");
    updateStatus();
    lockOptions();

    advanceTimeoutId = window.setTimeout(function () {
      currentIndex += 1;
      if (currentIndex >= GAME_SIZE) {
        showResults();
      } else {
        renderQuestion();
      }
    }, ADVANCE_DELAY_MS);
  }

  function handleWrong(button) {
    if (button.classList.contains("is-wrong")) {
      return;
    }

    currentQuestionMissed = true;
    button.classList.add("is-wrong");
    setFeedback("Táto odpoveď nie je správna. Skús ďalšiu možnosť.");
  }

  function handleOptionClick(button, optionId) {
    const currentQuestion = gameQuestions[currentIndex];
    if (!currentQuestion || questionResolved) {
      return;
    }

    if (optionId === currentQuestion.answerId) {
      handleCorrect(button);
      return;
    }

    handleWrong(button);
  }

  function showResults() {
    updateStatus();
    resultTitle.textContent = "Tvoje skóre: " + String(score) + " / " + String(GAME_SIZE);

    if (score === GAME_SIZE) {
      resultText.textContent = "Perfektná hra. Všetkých 15 kariet si zvládol na prvý pokus.";
    } else if (score >= 11) {
      resultText.textContent = "Veľmi dobré. Nová hra ti vyberie ďalších 15 náhodných otázok z banky 100 kariet.";
    } else if (score >= 6) {
      resultText.textContent = "Dobré tempo. Skús novú hru a traf viac odpovedí bez omylu.";
    } else {
      resultText.textContent = "Banka kariet ostáva veľká, takže ďalšia hra prinesie inú kombináciu otázok.";
    }

    showScreen(resultScreen);
  }

  function startGame() {
    window.clearTimeout(advanceTimeoutId);
    gameQuestions = shuffle(questions).slice(0, GAME_SIZE);
    currentIndex = 0;
    score = 0;
    updateStatus();
    showScreen(gameScreen);
    renderQuestion();
  }

  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", startGame);
  playAgainButton.addEventListener("click", startGame);

  updateStatus();
  showScreen(introScreen);
})();
