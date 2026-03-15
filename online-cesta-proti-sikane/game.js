(function () {
  const QUESTIONS_PER_RUN = 15;
  const STORAGE_KEY = "online-cesta-proti-sikane-best-run";
  const STATIONS = [
    "Domáci chat",
    "Skupinový rozhovor",
    "Herná hala",
    "Video miestnosť",
    "Sociálna sieť",
    "Fotogaléria",
    "Triedny cloud",
    "Komentárová zóna",
    "Správová brána",
    "Profilové mesto",
    "Emoji most",
    "Meme ulica",
    "Mobilný prístav",
    "Bezpečný portál",
    "Diplomové námestie"
  ];
  const STICKER_EMOJIS = ["🛡️", "💬", "🔒", "🚦", "👀", "📱", "🎧", "🧠", "🤝", "🌟", "🧩", "🚀", "🫶", "✅", "🏆"];

  const QUESTION_BANK = [
    { id: "q01", category: "Provokatéri", prompt: "Niekto v chate píše urážky len preto, aby ostatných vyprovokoval k hádke. O koho ide najskôr?", choices: ["O pomocníka", "O provokatéra", "O rozhodcu", "O kamaráta, ktorý radí"], answer: 1, explanation: "Provokatér sa snaží úmyselne rozohnať konflikt a vyvolať prudkú reakciu." },
    { id: "q02", category: "Provokatéri", prompt: "Čo je najlepší prvý krok, keď si všimneš provokatéra v online diskusii?", choices: ["Pridať sa a napísať niečo ostré", "Zdieľať jeho správu ďalej", "Zachovať pokoj a neprihrávať mu pozornosť", "Vysmiať sa mu pred všetkými"], answer: 2, explanation: "Provokatér často čaká na reakciu. Pokoj a rozumný postup mu berú priestor." },
    { id: "q03", category: "Provokatéri", prompt: "Prečo provokatér často pokračuje v nevhodnom správaní?", choices: ["Lebo dostáva pozornosť a reakcie", "Lebo musí odpovedať za spolužiaka", "Lebo si pletie úlohu s domácou prácou", "Lebo opravuje chyby v texte"], answer: 0, explanation: "Pozornosť je pre provokatéra odmena, preto je dôležité neeskalovať situáciu." },
    { id: "q04", category: "Provokatéri", prompt: "Ktorá veta skôr pomôže zastaviť provokáciu?", choices: ["Poďme to riešiť pokojne alebo nahlásme nevhodné správanie.", "Skús napísať ešte horšiu poznámku.", "Dám to do každej skupiny.", "Nech sa všetci pridajú."], answer: 0, explanation: "Pokojná reakcia a presun k nahláseniu je bezpečnejší ako hádka." },
    { id: "q05", category: "Provokatéri", prompt: "Provokatér chce, aby si odpovedal nahnevane. Čo mu to najviac sťaží?", choices: ["Dlhé vysvetľovanie pred triedou", "Ignorovanie provokácie a využitie blokovania či nahlásenia", "Poslanie screenshotu všetkým spolužiakom", "Napísanie výhražnej správy"], answer: 1, explanation: "Blokovanie a nahlásenie chránia teba a nepridávajú ďalší konflikt." },
    { id: "q06", category: "Provokatéri", prompt: "Ktorý príklad najlepšie ukazuje provokáciu?", choices: ["Niekto sa pýta na termín úlohy", "Niekto opakovane píše posmešné správy, aby vyvolal hádku", "Niekto poďakuje za pomoc", "Niekto pošle prezentáciu učiteľovi"], answer: 1, explanation: "Provokácia je úmyselné dráždenie alebo rozohriatie konfliktu." },
    { id: "q07", category: "Agresor", prompt: "Ako sa prejavuje agresor v online priestore?", choices: ["Opakovane útočí, zastrašuje alebo ponižuje", "Vždy len pozoruje", "Píše len usmievavé správy", "Pomáha vyriešiť spor"], answer: 0, explanation: "Agresor používa útoky a nátlak, aby druhému ublížil alebo získal moc." },
    { id: "q08", category: "Agresor", prompt: "Ktoré správanie je najbližšie k správaniu agresora?", choices: ["Pravidelne niekoho zosmiešňuje a zastrašuje v skupine", "Požiada o vysvetlenie učiva", "Pošle odkaz na zaujímavé video", "Vypne si notifikácie"], answer: 0, explanation: "Agresor využíva opakovanie a ponižovanie, nie bežnú komunikáciu." },
    { id: "q09", category: "Agresor", prompt: "Prečo je dôležité správanie agresora nenechať bez reakcie dospelých?", choices: ["Aby mal viac publika", "Aby sa útoky mohli zastaviť a niekto bol chránený", "Aby sa z neho stal moderátor", "Aby získal viac sledovateľov"], answer: 1, explanation: "Keď sa dospelí dozvedia o probléme, môžu zasiahnuť a nastaviť ochranu." },
    { id: "q10", category: "Agresor", prompt: "Čo nie je vhodná reakcia na agresora?", choices: ["Uložiť dôkazy", "Vyhľadať pomoc dospelého", "Vyhrážať sa mu naspäť", "Zablokovať ho"], answer: 2, explanation: "Protiútok môže situáciu zhoršiť. Bezpečnejší je pokojný a podporný postup." },
    { id: "q11", category: "Agresor", prompt: "Spolužiak hovorí: 'Keď mi nepošleš heslo, zničím ti profil.' Čo to pripomína?", choices: ["Nevinný žart", "Agresívne zastrašovanie", "Priateľskú pomoc", "Bežný technický problém"], answer: 1, explanation: "Vyhrážka a nátlak patria medzi jasné varovné znaky agresívneho správania." },
    { id: "q12", category: "Agresor", prompt: "Ktorý cieľ má agresor najčastejšie?", choices: ["Rozveseliť všetkých", "Ublížiť, získať moc alebo kontrolu", "Pomôcť spolužiakovi s projektom", "Chrániť pravidlá skupiny"], answer: 1, explanation: "Agresor často útočí kvôli moci, kontrole alebo vedomému ubližovaniu." },
    { id: "q13", category: "Šikana", prompt: "Kedy už nejde len o jednorazový konflikt, ale o šikanu?", choices: ["Keď sa deje opakovane a niekomu ubližuje", "Keď raz niekto nesúhlasí", "Keď sa niekto oneskorí na hodinu", "Keď si niekto zabudne zošit"], answer: 0, explanation: "Šikana je opakované ubližovanie spojené s nerovnováhou síl alebo tlakom." },
    { id: "q14", category: "Šikana", prompt: "Ktorý príklad najviac pripomína šikanu?", choices: ["Každý týždeň tá istá skupina zosmiešňuje jedného žiaka", "Dvaja spolužiaci majú rozdielny názor", "Niekto požiada o požičanie pera", "Niekto zabudne odpísať na správu"], answer: 0, explanation: "Opakovanie a zameranie na jednu osobu sú dôležité znaky šikany." },
    { id: "q15", category: "Šikana", prompt: "Ak si svedok šikany, čo je rozumné urobiť?", choices: ["Tváriť sa, že nič nevidíš", "Pridať posmešok, aby si zapadol", "Podporiť ohrozeného a povedať to dospelému", "Nahrať to a zavesiť online"], answer: 2, explanation: "Svedok môže pomôcť tým, že nenechá obeť samu a vyhľadá pomoc dospelého." },
    { id: "q16", category: "Šikana", prompt: "Prečo vetu 'to bol len žart' treba hodnotiť opatrne?", choices: ["Lebo nie každý žart je vtipný a môže ubližovať", "Lebo každý žart je automaticky v poriadku", "Lebo žarty sa nedajú riešiť", "Lebo učiteľ ich vždy zakáže"], answer: 0, explanation: "Ak správanie ponižuje alebo bolí, nejde o bezpečný žart." },
    { id: "q17", category: "Šikana", prompt: "Ktorý výrok je správny?", choices: ["Šikana sa vyrieši sama, netreba nič hovoriť", "Šikanu je dobré čo najskôr riešiť s dospelým", "Šikana je normálna súčasť triedy", "Obeť si za to vždy môže sama"], answer: 1, explanation: "Včasné riešenie pomáha zastaviť ubližovanie a chráni žiakov." },
    { id: "q18", category: "Šikana", prompt: "Ako môžeš podporiť spolužiaka, ktorý zažíva šikanu?", choices: ["Povieš mu, nech to tají", "Zosmiešniš situáciu, aby to bolelo menej", "Vypočuješ ho a pomôžeš mu osloviť dospelého", "Napíšeš agresorovi urážku"], answer: 2, explanation: "Empatia a pomoc s vyhľadaním dospelého sú bezpečnejšie ako protiútok." },
    { id: "q19", category: "Kyberšikana", prompt: "Čo patrí medzi kyberšikanu?", choices: ["Opakované urážanie a zosmiešňovanie cez internet", "Stiahnutie aktualizácie aplikácie", "Zmena tapety telefónu", "Založenie školského dokumentu"], answer: 0, explanation: "Kyberšikana sa deje cez digitálne nástroje a môže mať rovnaký dopad ako šikana naživo." },
    { id: "q20", category: "Kyberšikana", prompt: "Niekto bez dovolenia zverejní trápnu fotku spolužiaka, aby sa mu smiali. O čo ide?", choices: ["O pomoc pri úprave fotiek", "O kyberšikanu", "O technickú kontrolu", "O náhodný omyl bez následkov"], answer: 1, explanation: "Zverejnenie na zosmiešnenie a ublíženie patrí medzi formy kyberšikany." },
    { id: "q21", category: "Kyberšikana", prompt: "Prečo môže byť kyberšikana zvlášť náročná?", choices: ["Lebo sa môže šíriť rýchlo a zasiahnuť veľa ľudí", "Lebo sa deje len počas vyučovania", "Lebo ju vidí len učiteľ", "Lebo sa po minúte automaticky vymaže"], answer: 0, explanation: "Obsah sa môže rýchlo šíriť, kopírovať a objaviť sa znova." },
    { id: "q22", category: "Kyberšikana", prompt: "Ktorý krok je pri kyberšikane dôležitý?", choices: ["Vymazať všetko bez dôkazov", "Uložiť screenshoty a správy", "Písať útočníkovi stále naspäť", "Zdieľať obsah ďalej ako varovanie bez súhlasu"], answer: 1, explanation: "Dôkazy pomáhajú pri nahlasovaní a riešení situácie." },
    { id: "q23", category: "Kyberšikana", prompt: "Niekto vytvorí falošný profil spolužiaka a píše zaňho trápne veci. To je:", choices: ["Vtipná prezývka", "Kyberšikana a zneužitie identity", "Bežné nastavenie profilu", "Reklamná kampaň"], answer: 1, explanation: "Falošný profil môže niekoho poškodiť a ponížiť, preto ide o vážny problém." },
    { id: "q24", category: "Kyberšikana", prompt: "Čo je bezpečnejšie pri kyberšikane ako pokračovať v hádke?", choices: ["Blokovať, nahlásiť a povedať to dospelému", "Posielať urážky späť", "Pozvať ďalších ľudí do konfliktu", "Napísať, že sa to musí celé zverejniť"], answer: 0, explanation: "Blokovanie, nahlásenie a pomoc dospelého chránia lepšie ako hádka." },
    { id: "q25", category: "Kyberšikana", prompt: "Ktorá veta vystihuje kyberšikanu najlepšie?", choices: ["Je to ubližovanie pomocou technológií", "Je to každé vypnutie mobilu", "Je to len neškodné komentovanie", "Je to bežná súčasť každej hry"], answer: 0, explanation: "Kyberšikana využíva digitálne prostredie na ubližovanie, nátlak alebo ponižovanie." },
    { id: "q26", category: "Kyberšikana", prompt: "Prečo sa netreba hanbiť povedať o kyberšikane dospelému?", choices: ["Lebo pomoc dospelého môže situáciu zastaviť", "Lebo potom bude agresor populárnejší", "Lebo dôkazy už netreba", "Lebo dospelý vždy zmaže internet"], answer: 0, explanation: "Vyhľadanie pomoci je rozumný krok, nie žalovanie bez dôvodu." },
    { id: "q27", category: "Zablokovať niekoho", prompt: "Čo znamená zablokovať niekoho v aplikácii?", choices: ["Zabrániť mu v ďalšom kontakte cez danú službu", "Poslať mu ocenenie", "Pridať ho medzi obľúbené kontakty", "Vymazať všetky svoje fotky"], answer: 0, explanation: "Blokovanie obmedzuje kontakt a pomáha zastaviť nepríjemné správy." },
    { id: "q28", category: "Zablokovať niekoho", prompt: "Kedy je blokovanie dobrý nápad?", choices: ["Keď niekto opakovane ubližuje alebo obťažuje", "Keď ti niekto pošle domácu úlohu", "Keď ti učiteľ pošle oznam", "Keď si chceš uložiť kontakt"], answer: 0, explanation: "Pri obťažovaní je blokovanie jedným z nástrojov ochrany." },
    { id: "q29", category: "Zablokovať niekoho", prompt: "Čo je múdre urobiť pred zablokovaním pri vážnom incidente?", choices: ["Uložiť dôkazy, ak je to bezpečné", "Poslať obsah všetkým kamarátom", "Vyhrážať sa späť", "Zmazať celý účet bez rozmýšľania"], answer: 0, explanation: "Screenshoty alebo správy môžu neskôr pomôcť pri nahlásení." },
    { id: "q30", category: "Zablokovať niekoho", prompt: "Je blokovanie žalovanie?", choices: ["Nie, je to spôsob ochrany vlastného priestoru", "Áno, vždy je to nespravodlivé", "Áno, ale iba cez víkend", "Nie, ale len v škole"], answer: 0, explanation: "Blokovanie je hranica, ktorou chrániš seba, nie útok na druhého." },
    { id: "q31", category: "Zablokovať niekoho", prompt: "Ak niekto po zablokovaní vytvorí nový účet a pokračuje, čo ďalej?", choices: ["Nechať to tak", "Opäť ho zablokovať, nahlásiť a povedať to dospelému", "Pridať sa do hádky", "Zverejniť jeho meno všade"], answer: 1, explanation: "Ak sa útok vracia, je dôležité kombinovať blokovanie s nahlásením a pomocou." },
    { id: "q32", category: "Zablokovať niekoho", prompt: "Ktoré tvrdenie o blokovaní je pravdivé?", choices: ["Môže okamžite obmedziť nepríjemné správy", "Vždy automaticky vyrieši celý problém bez dospelého", "Je to to isté ako zdieľanie profilu", "Nedá sa použiť pri hrách ani sociálnych sieťach"], answer: 0, explanation: "Blokovanie pomáha, ale niekedy je potrebné aj nahlásenie a podpora dospelých." },
    { id: "q33", category: "Nahlásiť niekoho", prompt: "Čo znamená nahlásiť niekoho na platforme?", choices: ["Požiadať službu, aby preverila nevhodné správanie", "Poslať mu darček", "Označiť ho za najlepšieho hráča", "Vymazať svoj profil"], answer: 0, explanation: "Nahlásenie upozorní platformu na porušenie pravidiel alebo nebezpečný obsah." },
    { id: "q34", category: "Nahlásiť niekoho", prompt: "Kedy je vhodné použiť nahlásenie?", choices: ["Pri urážkach, výhražkách, podvodnom profile alebo šikanovaní", "Keď sa ti nepáči farba ikony", "Keď nechceš písať domácu úlohu", "Keď si zabudneš heslo do zošita"], answer: 0, explanation: "Nahlásenie je určené na porušenia pravidiel a nebezpečné správanie." },
    { id: "q35", category: "Nahlásiť niekoho", prompt: "Prečo môže byť nahlásenie užitočné aj pre iných?", choices: ["Pomôže zastaviť škodlivý účet alebo obsah", "Zaručí okamžitú slávu", "Spraví z teba administrátora", "Odstráni všetky reklamy"], answer: 0, explanation: "Nahlásenie môže chrániť nielen teba, ale aj ďalších používateľov." },
    { id: "q36", category: "Nahlásiť niekoho", prompt: "Ktorá kombinácia je pri vážnej kyberšikane najsilnejšia?", choices: ["Ignorovať a nikomu nič nepovedať", "Blokovať, nahlásiť, uložiť dôkazy a osloviť dospelého", "Len si zmeniť profilovku", "Poslať agresorovi hlasovku s krikom"], answer: 1, explanation: "Viac bezpečných krokov spolu zvyšuje šancu, že sa situácia zastaví." },
    { id: "q37", category: "Nahlásiť niekoho", prompt: "Je nahlásenie vhodné aj pri falošnom profile, ktorý niekoho zosmiešňuje?", choices: ["Áno, je to presne situácia na nahlásenie", "Nie, to je vždy len hra", "Nie, treba sa pridať", "Len ak to spraví viac ako desať ľudí"], answer: 0, explanation: "Falošný profil s cieľom ubližovať je vážny dôvod na nahlásenie." },
    { id: "q38", category: "Nahlásiť niekoho", prompt: "Ak sa bojíš nahlásiť niekoho sám, čo je dobrý krok?", choices: ["Požiadať o pomoc dôveryhodného dospelého", "Vzdať to a mlčať", "Napísať páchateľovi ospravedlnenie", "Vymazať si telefón"], answer: 0, explanation: "Dospelý môže pomôcť s formuláciou, dôkazmi aj ďalším bezpečným postupom." },
    { id: "q39", category: "Rozpoznanie situácie", prompt: "Spolužiak pošle správu: 'Ak to niekomu povieš, zverejním tvoju fotku.' Je to v poriadku?", choices: ["Áno, je to súčasť hry", "Nie, je to vyhrážka a treba hľadať pomoc", "Áno, ak sa to stane cez víkend", "Nie, ale len ak je to v škole"], answer: 1, explanation: "Vyhrážanie sa je nebezpečné a nemalo by zostať bez reakcie." },
    { id: "q40", category: "Rozpoznanie situácie", prompt: "Ktoré správanie je bezpečné pre svedka kyberšikany?", choices: ["Poslať urážlivý príspevok ďalej", "Napísať obeti, že ju podporuješ, a upozorniť dospelého", "Lajkovať posmešný komentár", "Hľadať, čo je na tom zábavné"], answer: 1, explanation: "Podpora obete a pomoc dospelého je lepšia než šírenie škody." },
    { id: "q41", category: "Rozpoznanie situácie", prompt: "Niekto stále posiela nepríjemné správy neskoro večer. Čo je vhodné?", choices: ["Zostať hore a hádať sa", "Nastaviť si súkromie, zablokovať ho a povedať to dospelému", "Odpovedať ešte ostrejšie", "Poslať mu svoje heslo, nech dá pokoj"], answer: 1, explanation: "Bezpečnosť a hranice sú dôležitejšie než pokračovanie v konflikte." },
    { id: "q42", category: "Rozpoznanie situácie", prompt: "Čo je správne pri zdieľaní screenshotov z útoku?", choices: ["Šíriť ich po triede", "Uložiť ich ako dôkaz a zdieľať len s dôveryhodným dospelým", "Urobiť z nich meme", "Povesiť ich na nástenku"], answer: 1, explanation: "Dôkazy majú pomôcť pri riešení, nie vytvárať ďalšie ponižovanie." },
    { id: "q43", category: "Rozpoznanie situácie", prompt: "Ktoré tvrdenie je pravdivé?", choices: ["Ak sa útok deje online, nie je taký vážny", "Aj online útoky môžu veľmi ublížiť", "Online správy sa nedajú dokázať", "Na internete nič neplatí"], answer: 1, explanation: "Digitálne útoky môžu zasiahnuť psychiku, reputáciu aj pocit bezpečia." },
    { id: "q44", category: "Rozpoznanie situácie", prompt: "Niekto niekoho zámerne vylučuje zo skupinového chatu a ostatných navádza, aby ho ignorovali. Je to problém?", choices: ["Nie, lebo je to len online", "Áno, môže to byť forma ubližovania a vylučovania", "Nie, ak to trvá menej ako hodinu", "Áno, ale len ak ide o cudzieho človeka"], answer: 1, explanation: "Zámerné vylučovanie a navádzanie ostatných môžu byť veľmi zraňujúce." },
    { id: "q45", category: "Rozpoznanie situácie", prompt: "Čo by si nemal robiť, keď sa niekto zdôverí s kyberšikanou?", choices: ["Vypočuť ho", "Zľahčovať to vetou 'nerieš to, to prejde'", "Pomôcť mu nájsť dospelého", "Ubezpečiť ho, že v tom nie je sám"], answer: 1, explanation: "Zľahčovanie môže človeku ublížiť a odradiť ho od hľadania pomoci." },
    { id: "q46", category: "Rozpoznanie situácie", prompt: "Ak niekto pod cudzou fotkou napíše posmešné komentáre a vyzýva ostatných, aby sa pridali, ide o:", choices: ["Podporu priateľstva", "Organizované zosmiešňovanie", "Bežnú úpravu profilu", "Nácvik pravopisu"], answer: 1, explanation: "Navádzanie ďalších ľudí do posmechu je závažná forma ubližovania." },
    { id: "q47", category: "Bezpečný postup", prompt: "Ktorá kombinácia hesiel a účtu pomáha chrániť pred zneužitím profilu?", choices: ["Silné heslo a nezdieľanie prihlasovacích údajov", "Heslo napísané do spoločného chatu", "Rovnaké heslo pre všetkých kamarátov", "Poslanie hesla tomu, kto si oň pýta"], answer: 0, explanation: "Ochrana účtu znižuje riziko, že niekto zneužije tvoju identitu." },
    { id: "q48", category: "Bezpečný postup", prompt: "Čo môže pomôcť, ak sa ti niekto vysmieva v hre cez hlasový chat?", choices: ["Vypnúť alebo stíšiť hráča, zablokovať ho a nahlásiť", "Začať kričať späť", "Preposlať adresu bydliska", "Vstúpiť do ďalšej hádky"], answer: 0, explanation: "Herné platformy často ponúkajú blokovanie, stíšenie a nahlásenie." },
    { id: "q49", category: "Bezpečný postup", prompt: "Prečo sa oplatí mať pri nepríjemnej situácii dôveryhodného dospelého?", choices: ["Vie pomôcť rozhodnúť, chrániť a kontaktovať potrebnú pomoc", "Nahradí všetky pravidlá internetu", "Vždy okamžite zmaže všetky aplikácie", "Zakáže mobil celej triede"], answer: 0, explanation: "Dospelý môže poskytnúť podporu, bezpečný postup aj kontakt s ďalšou pomocou." },
    { id: "q50", category: "Bezpečný postup", prompt: "Čo je vhodné povedať kamarátovi, ktorý sa bojí blokovať agresora?", choices: ["Nemusíš to znášať sám, poďme to riešiť bezpečne", "Musíš mu odpovedať ešte horšie", "Je to tvoja vina", "Nemáš právo sa brániť"], answer: 0, explanation: "Podpora a bezpečný plán sú dôležitejšie než obviňovanie." },
    { id: "q51", category: "Bezpečný postup", prompt: "Niekto ťa tlačí, aby si poslal cudziu trápnu fotku ďalej. Čo je správne?", choices: ["Nezdieľať ju a zastaviť šírenie", "Preposlať ju len najbližším", "Pridať vtipný komentár", "Dať ju na ďalšiu sieť"], answer: 0, explanation: "Nešírenie škodlivého obsahu pomáha chrániť človeka, ktorému sa ubližuje." },
    { id: "q52", category: "Bezpečný postup", prompt: "Čo je rozumné po vyriešení incidentu?", choices: ["Skontrolovať nastavenia súkromia a podporiť obeť", "Založiť ďalší účet agresora", "Posmievať sa tomu ešte týždeň", "Rozposielať staré screenshoty"], answer: 0, explanation: "Po incidente pomáha posilniť bezpečnosť a obnoviť pocit podpory." },
    { id: "q53", category: "Scenáre", prompt: "V skupine sa každý smeje na jednom spolužiakovi a píšu mu, aby zo školy odišiel. Čo je to najpravdepodobnejšie?", choices: ["Podporná diskusia", "Šikana alebo kyberšikana", "Bežné hlasovanie", "Technická pomoc"], answer: 1, explanation: "Hromadné ponižovanie a tlak na jedného človeka sú vážnym varovným signálom." },
    { id: "q54", category: "Scenáre", prompt: "Kamarát ti pošle screenshot urážok a pýta sa, čo má robiť. Aká rada je najlepšia?", choices: ["Nech si to nechá pre seba", "Nech uloží dôkazy, zablokuje útočníka a povie to dospelému", "Nech si založí nový účet a mlčí", "Nech rovno zverejní celé mená všetkých"], answer: 1, explanation: "Takýto postup chráni a zároveň pripravuje dôkazy na riešenie." },
    { id: "q55", category: "Scenáre", prompt: "Niekto napíše: 'Poďme mu všetci dávať posmešné reakcie.' Ako sa zachováš bezpečne?", choices: ["Pridám sa, aby som nezapadol", "Nepridám sa a môžem upozorniť dospelého", "Pošlem to do ďalšej skupiny", "Pridám ešte ostrý komentár"], answer: 1, explanation: "Nepridávať sa k ubližovaniu je dôležitý krok, aj keď to robí viac ľudí." },
    { id: "q56", category: "Scenáre", prompt: "Človek, ktorého si zablokoval, ti začne písať cez účet kamaráta. Čo to ukazuje?", choices: ["Že blokovanie nebolo zbytočné, ale treba pridať ďalšie kroky", "Že je všetko vyriešené", "Že máš zrušiť pomoc dospelých", "Že mu máš poslať svoje údaje"], answer: 0, explanation: "Blokovanie pomohlo, no útok sa presúva, preto je čas na nahlásenie a pomoc." },
    { id: "q57", category: "Scenáre", prompt: "V hernom chate niekto sústavne kričí na slabšieho hráča a uráža ho. Čo sa oplatí spraviť?", choices: ["Použiť stíšenie alebo blokovanie a nahlásiť ho", "Pridať sa do urážok", "Poslať mu telefónne číslo", "Presvedčiť ostatných, aby ho natáčali"], answer: 0, explanation: "Herné nástroje a nahlásenie sú bezpečnejšie než konflikt." },
    { id: "q58", category: "Scenáre", prompt: "Prečo je dobré všímať si aj to, čo sa deje s obeťou po incidente?", choices: ["Lebo môže potrebovať podporu a pocit bezpečia", "Lebo musí hneď všetko zabudnúť", "Lebo sa tým získa viac reakcií", "Lebo to zvyšuje sledovanosť profilu"], answer: 0, explanation: "Po incidente je dôležitá podpora, vypočutie a bezpečný priestor." },
    { id: "q59", category: "Scenáre", prompt: "Ktoré správanie patrí medzi pomoc obeti?", choices: ["Napísať jej súkromne, že v tom nie je sama", "Prehovoriť všetkých, aby ju ignorovali", "Pýtať sa, prečo si za to môže sama", "Zdieľať jej správy bez súhlasu"], answer: 0, explanation: "Súkromná podpora a rešpekt k súkromiu môžu veľmi pomôcť." },
    { id: "q60", category: "Scenáre", prompt: "Niekto posmešne upraví fotografiu spolužiaka a šíri ju. Čo je vhodné?", choices: ["Neposúvať ju ďalej, uložiť dôkaz a riešiť to s dospelým", "Pridať ďalšie efekty", "Zdieľať ju ako vtip", "Napísať, že je to slávna fotka"], answer: 0, explanation: "Nešíriť škodlivý obsah a hľadať pomoc je bezpečný postup." },
    { id: "q61", category: "Pojmy", prompt: "Ktorý pojem najlepšie označuje človeka, ktorý sa snaží druhého rozčúliť a rozohnať konflikt?", choices: ["Provokatér", "Moderátor", "Kronikár", "Rozhodca"], answer: 0, explanation: "Provokatér cielene dráždi a čaká na prudkú reakciu." },
    { id: "q62", category: "Pojmy", prompt: "Ktorý pojem najlepšie sedí na človeka, ktorý opakovane útočí, ponižuje a zastrašuje?", choices: ["Pozorovateľ", "Agresor", "Pomocník", "Hostiteľ"], answer: 1, explanation: "Agresor ubližuje aktívne a cielene." },
    { id: "q63", category: "Pojmy", prompt: "Ktorý výraz znamená, že platformu upozorníš na nevhodný obsah alebo správanie?", choices: ["Zablokovať", "Nahlásiť", "Prehliadnuť", "Označiť ako obľúbený"], answer: 1, explanation: "Nahlásenie posiela podnet službe, aby obsah preverila." },
    { id: "q64", category: "Pojmy", prompt: "Ktorý výraz znamená zastaviť ďalší kontakt určitej osoby s tebou v aplikácii?", choices: ["Odpovedať", "Zdieľať", "Zablokovať", "Pripnúť"], answer: 2, explanation: "Blokovanie obmedzí kontakt cez danú službu alebo profil." }
  ];

  const introScreen = document.getElementById("introScreen");
  const playersScreen = document.getElementById("playersScreen");
  const gameScreen = document.getElementById("gameScreen");
  const resultsScreen = document.getElementById("resultsScreen");
  const bestRunIntroText = document.getElementById("bestRunIntroText");
  const startFlowButton = document.getElementById("startFlowButton");
  const playerNameInput = document.getElementById("playerNameInput");
  const addPlayerButton = document.getElementById("addPlayerButton");
  const playerHintText = document.getElementById("playerHintText");
  const playerList = document.getElementById("playerList");
  const playerCountBadge = document.getElementById("playerCountBadge");
  const backToIntroButton = document.getElementById("backToIntroButton");
  const beginGameButton = document.getElementById("beginGameButton");
  const gameHeadline = document.getElementById("gameHeadline");
  const gameLead = document.getElementById("gameLead");
  const activePlayerBadge = document.getElementById("activePlayerBadge");
  const launchTurnButton = document.getElementById("launchTurnButton");
  const openQuestionButton = document.getElementById("openQuestionButton");
  const turnPlayerName = document.getElementById("turnPlayerName");
  const turnStationText = document.getElementById("turnStationText");
  const turnStateText = document.getElementById("turnStateText");
  const progressText = document.getElementById("progressText");
  const scoreText = document.getElementById("scoreText");
  const percentText = document.getElementById("percentText");
  const categoryText = document.getElementById("categoryText");
  const stickerCount = document.getElementById("stickerCount");
  const stickerAlbum = document.getElementById("stickerAlbum");
  const mapTrack = document.getElementById("mapTrack");
  const journeyStatus = document.getElementById("journeyStatus");
  const turnCardHeadline = document.getElementById("turnCardHeadline");
  const turnCardText = document.getElementById("turnCardText");
  const playerProgressList = document.getElementById("playerProgressList");
  const resultHeadline = document.getElementById("resultHeadline");
  const resultSummary = document.getElementById("resultSummary");
  const resultBadge = document.getElementById("resultBadge");
  const resultStickerCount = document.getElementById("resultStickerCount");
  const resultStickerAlbum = document.getElementById("resultStickerAlbum");
  const repeatTurnButton = document.getElementById("repeatTurnButton");
  const nextPlayerButton = document.getElementById("nextPlayerButton");
  const backToPlayersFromResultsButton = document.getElementById("backToPlayersFromResultsButton");
  const finishedCountBadge = document.getElementById("finishedCountBadge");
  const rankingList = document.getElementById("rankingList");
  const diplomaName = document.getElementById("diplomaName");
  const diplomaAchievement = document.getElementById("diplomaAchievement");
  const diplomaPercent = document.getElementById("diplomaPercent");
  const diplomaStickers = document.getElementById("diplomaStickers");
  const diplomaRating = document.getElementById("diplomaRating");
  const diplomaDate = document.getElementById("diplomaDate");
  const printDiplomaButton = document.getElementById("printDiplomaButton");
  const downloadDiplomaButton = document.getElementById("downloadDiplomaButton");
  const questionModal = document.getElementById("questionModal");
  const closeModalButton = document.getElementById("closeModalButton");
  const stationLabel = document.getElementById("stationLabel");
  const questionType = document.getElementById("questionType");
  const questionPrompt = document.getElementById("questionPrompt");
  const questionHelp = document.getElementById("questionHelp");
  const choicesEl = document.getElementById("choices");
  const feedbackText = document.getElementById("feedbackText");
  const nextButton = document.getElementById("nextButton");

  const screens = {
    intro: introScreen,
    players: playersScreen,
    game: gameScreen,
    results: resultsScreen
  };

  const state = {
    players: [],
    results: [],
    currentPlayerIndex: 0,
    currentPlayerName: "",
    active: false,
    questions: [],
    currentIndex: 0,
    correct: 0,
    answeredCurrent: false,
    finished: false,
    modalOpen: false
  };

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

  function buildShuffledQuestion(question) {
    const shuffledChoices = shuffle(question.choices.map(function (choice, index) {
      return {
        choice: choice,
        isAnswer: index === question.answer
      };
    }));

    return {
      id: question.id,
      category: question.category,
      prompt: question.prompt,
      choices: shuffledChoices.map(function (item) {
        return item.choice;
      }),
      answer: shuffledChoices.findIndex(function (item) {
        return item.isAnswer;
      }),
      explanation: question.explanation
    };
  }

  function formatPlayerCount(count) {
    if (count === 1) {
      return "1 hráč";
    }

    if (count >= 2 && count <= 4) {
      return count + " hráči";
    }

    return count + " hráčov";
  }

  function getPercent() {
    return Math.round((state.correct / QUESTIONS_PER_RUN) * 100);
  }

  function getRating(percent) {
    if (percent >= 90) {
      return "najlepšie";
    }

    if (percent >= 75) {
      return "veľmi dobre";
    }

    if (percent >= 50) {
      return "dobre";
    }

    if (percent >= 25) {
      return "slabé";
    }

    return "veľmi zle";
  }

  function getCurrentQuestion() {
    return state.questions[state.currentIndex];
  }

  function safeStudentName() {
    return state.currentPlayerName || "Odvážny hráč";
  }

  function getResultForPlayer(playerIndex) {
    return state.results.find(function (result) {
      return result.playerIndex === playerIndex;
    }) || null;
  }

  function getSortedResults() {
    return state.results.slice().sort(function (left, right) {
      if (right.percent !== left.percent) {
        return right.percent - left.percent;
      }

      if (right.correct !== left.correct) {
        return right.correct - left.correct;
      }

      return left.name.localeCompare(right.name, "sk");
    });
  }

  function showScreen(screenName) {
    Object.keys(screens).forEach(function (key) {
      screens[key].classList.toggle("hidden", key !== screenName);
    });
  }

  function setPlayerHint(text, isError) {
    playerHintText.textContent = text;
    playerHintText.classList.toggle("error-text", Boolean(isError));
  }

  function renderBestRun() {
    try {
      const currentBestRaw = localStorage.getItem(STORAGE_KEY);

      if (!currentBestRaw) {
        bestRunIntroText.textContent = "Zatiaľ bez uloženého výsledku.";
        return;
      }

      const best = JSON.parse(currentBestRaw);
      bestRunIntroText.textContent = best.name + ": " + best.percent + " % (" + best.correct + " z " + QUESTIONS_PER_RUN + "), hodnotenie " + best.rating + ".";
    } catch (error) {
      bestRunIntroText.textContent = "Zatiaľ bez uloženého výsledku.";
    }
  }

  function updateSetupButtons() {
    const hasPlayers = state.players.length > 0;
    beginGameButton.disabled = !hasPlayers;
    playerCountBadge.textContent = formatPlayerCount(state.players.length);
  }

  function renderPlayerList() {
    if (state.players.length === 0) {
      playerList.innerHTML = '<p class="empty-state">Zoznam hráčov je zatiaľ prázdny.</p>';
      updateSetupButtons();
      return;
    }

    playerList.innerHTML = state.players.map(function (player, index) {
      return [
        '<div class="player-chip">',
        '<span>' + player + "</span>",
        '<button class="chip-remove" type="button" data-remove-player="' + index + '" aria-label="Odstrániť hráča ' + player + '">×</button>',
        "</div>"
      ].join("");
    }).join("");

    updateSetupButtons();
  }

  function getPlayerStatus(index) {
    const result = getResultForPlayer(index);

    if (result) {
      if (index === state.currentPlayerIndex && state.finished) {
        return { label: "Dokončené", className: "done" };
      }

      return { label: "Hotovo", className: "done" };
    }

    if (index === state.currentPlayerIndex) {
      if (state.active) {
        return { label: state.answeredCurrent ? "Čaká na ďalší krok" : "Práve hrá", className: "current" };
      }

      return { label: "Na rade", className: "current" };
    }

    return { label: "Čaká", className: "waiting" };
  }

  function renderPlayerProgressList() {
    if (state.players.length === 0) {
      playerProgressList.innerHTML = '<p class="empty-state">Priebeh hráčov sa zobrazí po výbere zostavy.</p>';
      return;
    }

    playerProgressList.innerHTML = state.players.map(function (player, index) {
      const status = getPlayerStatus(index);
      const result = getResultForPlayer(index);
      const detail = result ? result.percent + " % • " + result.rating : "Bez výsledku";

      return [
        '<div class="player-row">',
        '<div>',
        '<strong>' + player + "</strong>",
        '<p>' + detail + "</p>",
        "</div>",
        '<span class="status-pill ' + status.className + '">' + status.label + "</span>",
        "</div>"
      ].join("");
    }).join("");
  }

  function renderRankingList() {
    const sortedResults = getSortedResults();
    finishedCountBadge.textContent = sortedResults.length + " / " + state.players.length;

    if (state.players.length === 0) {
      rankingList.innerHTML = '<p class="empty-state">Výsledky sa zobrazia po výbere hráčov.</p>';
      return;
    }

    if (sortedResults.length === 0) {
      rankingList.innerHTML = '<p class="empty-state">Prvé poradie sa objaví po dokončení prvého kola.</p>';
      return;
    }

    const completedRows = sortedResults.map(function (result, index) {
      return [
        '<div class="ranking-row">',
        '<span class="rank-number">' + (index + 1) + "</span>",
        '<div class="ranking-copy">',
        '<strong>' + result.name + "</strong>",
        '<p>' + result.correct + " z " + QUESTIONS_PER_RUN + " správne • " + result.rating + "</p>",
        "</div>",
        '<span class="rank-score">' + result.percent + " %</span>",
        "</div>"
      ].join("");
    }).join("");

    const waitingNames = state.players.filter(function (_, index) {
      return !getResultForPlayer(index);
    });

    const waitingRows = waitingNames.map(function (name) {
      return [
        '<div class="ranking-row waiting-row">',
        '<span class="rank-number">·</span>',
        '<div class="ranking-copy">',
        '<strong>' + name + "</strong>",
        '<p>Čaká na svoje kolo</p>',
        "</div>",
        '<span class="rank-score">-</span>',
        "</div>"
      ].join("");
    }).join("");

    rankingList.innerHTML = completedRows + waitingRows;
  }

  function renderMap() {
    const nodes = STATIONS.map(function (station, index) {
      const stepNumber = index + 1;
      let stateClass = "";
      let note = "Čaká";

      if (state.finished || index < state.currentIndex) {
        stateClass = "done";
        note = "Hotovo";
      } else if (state.active && index === state.currentIndex) {
        stateClass = "current";
        note = state.answeredCurrent ? "Potvrď krok" : "Práve riešiš";
      }

      return [
        '<article class="map-node ' + stateClass + '">',
        '<span class="map-node-number">' + stepNumber + "</span>",
        '<div class="map-node-name">' + station + "</div>",
        '<p class="map-node-note">' + note + "</p>",
        "</article>"
      ].join("");
    }).join("");

    mapTrack.innerHTML = nodes;
  }

  function buildStickerMarkup(correctCount) {
    const stickers = [];

    for (let index = 0; index < QUESTIONS_PER_RUN; index += 1) {
      const earned = index < correctCount;
      const emoji = STICKER_EMOJIS[index] || "⭐";
      stickers.push('<div class="sticker ' + (earned ? "earned" : "") + '" title="Nálepka ' + (index + 1) + '">' + emoji + "</div>");
    }

    return stickers.join("");
  }

  function renderStickers() {
    stickerAlbum.innerHTML = buildStickerMarkup(state.correct);
    stickerCount.textContent = state.correct + " / " + QUESTIONS_PER_RUN;
  }

  function renderResultStickers() {
    resultStickerAlbum.innerHTML = buildStickerMarkup(state.correct);
    resultStickerCount.textContent = state.correct + " / " + QUESTIONS_PER_RUN;
  }

  function getCurrentQuestionCategory() {
    const currentQuestion = getCurrentQuestion();
    return currentQuestion ? currentQuestion.category : "Výsledok";
  }

  function updateStats() {
    const progressValue = state.finished ? QUESTIONS_PER_RUN : (state.active ? state.currentIndex + 1 : 0);
    progressText.textContent = progressValue + " / " + QUESTIONS_PER_RUN;
    scoreText.textContent = String(state.correct);
    percentText.textContent = getPercent() + " %";
    categoryText.textContent = state.finished ? "Výsledok" : (state.active ? getCurrentQuestionCategory() : "Pripravené");
    renderStickers();
    renderMap();
  }

  function setJourneyMessage(text) {
    journeyStatus.textContent = text;
  }

  function renderGameOverview() {
    const playerName = safeStudentName();

    activePlayerBadge.textContent = state.currentPlayerName ? "Na rade: " + playerName : "Na rade";
    turnPlayerName.textContent = playerName;

    if (!state.currentPlayerName) {
      gameHeadline.textContent = "Pripraviť ďalšie kolo";
      gameLead.textContent = "Vyber hráčov a potom spusti prvé kolo.";
      turnStationText.textContent = "Štart";
      turnStateText.textContent = "Pripravené";
      turnCardHeadline.textContent = "Otázky sa zobrazia v modálnom okne";
      turnCardText.textContent = "Po spustení sa otvorí prvá otázka. Ak modal zavrieš, môžeš ho znovu otvoriť tlačidlom.";
      launchTurnButton.classList.remove("hidden");
      openQuestionButton.classList.add("hidden");
      return;
    }

    if (!state.active) {
      gameHeadline.textContent = "Na rade je " + playerName;
      gameLead.textContent = "Keď bude hráč pripravený, spusti jeho cestu. Každá otázka sa otvorí v modálnom okne.";
      turnStationText.textContent = "Štart";
      turnStateText.textContent = "Pripravené";
      turnCardHeadline.textContent = "Prvé kolo čaká na spustenie";
      turnCardText.textContent = playerName + " začne na prvej zastávke a bude postupovať po jednej otázke.";
      launchTurnButton.classList.remove("hidden");
      openQuestionButton.classList.add("hidden");
      return;
    }

    turnStationText.textContent = STATIONS[state.currentIndex];
    turnStateText.textContent = state.answeredCurrent ? "Odpoveď vyhodnotená" : "Otázka otvorená";
    gameHeadline.textContent = playerName + " práve hrá";
    gameLead.textContent = "Mapu a nálepky vidíš na stránke, samotná otázka je otvorená v modálnom okne.";
    turnCardHeadline.textContent = state.answeredCurrent ? "Pokračuj ďalšou zastávkou v modale" : "Odpovedz na otázku v modale";
    turnCardText.textContent = state.answeredCurrent
      ? "Otvoriť môžeš ten istý modal a potvrdiť ďalší krok."
      : "Ak modal zavrieš skôr, otvoríš ho znovu tlačidlom Otvoriť otázku.";
    launchTurnButton.classList.add("hidden");
    openQuestionButton.classList.remove("hidden");
    openQuestionButton.textContent = state.answeredCurrent ? "Vrátiť sa do modalu" : "Otvoriť otázku";
  }

  function openQuestionModal() {
    if (!state.active) {
      return;
    }

    questionModal.classList.remove("hidden");
    questionModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    state.modalOpen = true;
  }

  function closeQuestionModal() {
    questionModal.classList.add("hidden");
    questionModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    state.modalOpen = false;
  }

  function renderQuestion() {
    const question = getCurrentQuestion();

    if (!question) {
      return;
    }

    stationLabel.textContent = STATIONS[state.currentIndex];
    questionType.textContent = question.category;
    questionPrompt.textContent = question.prompt;
    questionHelp.textContent = "Vyber jednu odpoveď, ktorá je najbezpečnejšia alebo najpresnejšia.";
    feedbackText.textContent = "Premysli si, čo pomáha chrániť ľudí a zastaviť ubližovanie.";
    nextButton.classList.add("hidden");

    choicesEl.innerHTML = question.choices.map(function (choice, index) {
      const prefix = String.fromCharCode(65 + index);
      return '<button class="choice-button" type="button" data-index="' + index + '"><strong>' + prefix + ".</strong> " + choice + "</button>";
    }).join("");

    Array.from(choicesEl.querySelectorAll(".choice-button")).forEach(function (button) {
      button.addEventListener("click", onChoiceSelected);
    });

    updateStats();
    setJourneyMessage("Zastávka " + (state.currentIndex + 1) + " z " + QUESTIONS_PER_RUN);
    renderGameOverview();
  }

  function onChoiceSelected(event) {
    if (state.answeredCurrent || state.finished) {
      return;
    }

    const question = getCurrentQuestion();
    const selectedIndex = Number(event.currentTarget.dataset.index);
    const buttons = Array.from(choicesEl.querySelectorAll(".choice-button"));
    const isCorrect = selectedIndex === question.answer;

    state.answeredCurrent = true;

    buttons.forEach(function (button, index) {
      button.disabled = true;

      if (index === question.answer) {
        button.classList.add("correct");
      }

      if (index === selectedIndex && index !== question.answer) {
        button.classList.add("incorrect");
      }
    });

    if (isCorrect) {
      state.correct += 1;
      feedbackText.textContent = "Správne. " + question.explanation;
    } else {
      feedbackText.textContent = "Tentoraz nie. " + question.explanation;
    }

    updateStats();
    renderGameOverview();
    nextButton.classList.remove("hidden");
    nextButton.textContent = state.currentIndex === QUESTIONS_PER_RUN - 1 ? "Zobraziť výsledok" : "Ďalšia zastávka";
  }

  function resetRunState() {
    state.currentPlayerName = state.players[state.currentPlayerIndex] || "";
    state.active = false;
    state.questions = [];
    state.currentIndex = 0;
    state.correct = 0;
    state.answeredCurrent = false;
    state.finished = false;
    closeQuestionModal();
    updateStats();
    setJourneyMessage("Čakám na štart");
    renderGameOverview();
    renderPlayerProgressList();
  }

  function preparePlayerTurn() {
    showScreen("game");
    resetRunState();
  }

  function startTournament() {
    state.results = [];
    state.currentPlayerIndex = 0;
    renderRankingList();
    preparePlayerTurn();
  }

  function startRun() {
    if (!state.currentPlayerName) {
      return;
    }

    state.active = true;
    state.finished = false;
    state.currentIndex = 0;
    state.correct = 0;
    state.answeredCurrent = false;
    state.questions = shuffle(QUESTION_BANK).slice(0, QUESTIONS_PER_RUN).map(buildShuffledQuestion);
    renderQuestion();
    openQuestionModal();
    renderPlayerProgressList();
  }

  function fillDiploma(percent, rating) {
    const today = new Intl.DateTimeFormat("sk-SK", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date());

    diplomaName.textContent = safeStudentName();
    diplomaPercent.textContent = percent + " %";
    diplomaStickers.textContent = state.correct + " / " + QUESTIONS_PER_RUN;
    diplomaRating.textContent = rating;
    diplomaDate.textContent = "Dátum: " + today;

    if (state.correct === QUESTIONS_PER_RUN) {
      diplomaAchievement.textContent = "za perfektné zvládnutie celej online cesty. Získal alebo získala všetky nálepky palec hore a je super v tejto téme.";
      return;
    }

    diplomaAchievement.textContent = "za úspešné zvládnutie úloh o šikane, kyberšikane, blokovaní a nahlasovaní. Na ceste získal alebo získala " + state.correct + " nálepiek palec hore.";
  }

  function saveBestRun(percent, rating) {
    const nextBest = {
      name: safeStudentName(),
      percent: percent,
      correct: state.correct,
      rating: rating
    };

    try {
      const currentBestRaw = localStorage.getItem(STORAGE_KEY);

      if (!currentBestRaw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBest));
        return;
      }

      const currentBest = JSON.parse(currentBestRaw);
      if (percent > currentBest.percent) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBest));
      }
    } catch (error) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBest));
    }
  }

  function upsertCurrentResult(percent, rating) {
    const nextResult = {
      playerIndex: state.currentPlayerIndex,
      name: safeStudentName(),
      percent: percent,
      correct: state.correct,
      rating: rating
    };
    const existingIndex = state.results.findIndex(function (result) {
      return result.playerIndex === state.currentPlayerIndex;
    });

    if (existingIndex >= 0) {
      state.results[existingIndex] = nextResult;
      return;
    }

    state.results.push(nextResult);
  }

  function finishRun() {
    const percent = getPercent();
    const rating = getRating(percent);
    const perfect = state.correct === QUESTIONS_PER_RUN;
    const hasNextPlayer = state.currentPlayerIndex < state.players.length - 1;

    state.active = false;
    state.finished = true;
    closeQuestionModal();
    upsertCurrentResult(percent, rating);
    fillDiploma(percent, rating);
    saveBestRun(percent, rating);
    renderBestRun();
    renderPlayerProgressList();
    renderRankingList();
    updateStats();
    renderResultStickers();
    setJourneyMessage(perfect ? "Všetky nálepky získané" : "Cieľ je splnený");

    resultHeadline.textContent = perfect ? safeStudentName() + " zvládol alebo zvládla perfektnú jazdu" : safeStudentName() + " dokončil alebo dokončila cestu";
    resultSummary.textContent = safeStudentName() + " získal alebo získala " + state.correct + " z " + QUESTIONS_PER_RUN + " správnych odpovedí, teda " + percent + " %. Celkové hodnotenie je " + rating + ".";
    resultBadge.textContent = perfect ? "Super v tejto téme" : rating;
    nextPlayerButton.classList.toggle("hidden", !hasNextPlayer);

    showScreen("results");
  }

  function nextStep() {
    if (!state.answeredCurrent) {
      return;
    }

    if (state.currentIndex >= QUESTIONS_PER_RUN - 1) {
      finishRun();
      return;
    }

    state.currentIndex += 1;
    state.answeredCurrent = false;
    renderQuestion();
    openQuestionModal();
  }

  function sanitizeForXml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function createDiplomaSvg() {
    const percent = getPercent();
    const rating = getRating(percent);
    const today = new Intl.DateTimeFormat("sk-SK", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date());
    const achievement = state.correct === QUESTIONS_PER_RUN
      ? "Získal alebo získala všetky nálepky palec hore a je super v tejto téme."
      : "Zvládol alebo zvládla online cestu a bezpečne riešil alebo riešila úlohy o šikane a kyberšikane.";

    return [
      '<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="990" viewBox="0 0 1400 990">',
      '<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f9feff"/><stop offset="100%" stop-color="#fff5de"/></linearGradient></defs>',
      '<rect width="1400" height="990" fill="url(#bg)"/>',
      '<rect x="42" y="42" width="1316" height="906" rx="28" fill="none" stroke="#0f8b8d" stroke-width="4"/>',
      '<rect x="68" y="68" width="1264" height="854" rx="22" fill="none" stroke="#45b7d1" stroke-width="2" stroke-dasharray="12 10"/>',
      '<text x="700" y="165" text-anchor="middle" font-family="Georgia, serif" font-size="38" fill="#5f7185">Diplom za bezpečný pohyb online svetom</text>',
      '<text x="700" y="280" text-anchor="middle" font-family="Georgia, serif" font-size="94" fill="#1d2f43">Diplom</text>',
      '<text x="700" y="362" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="30" fill="#5f7185">Tento diplom získava</text>',
      '<text x="700" y="445" text-anchor="middle" font-family="Georgia, serif" font-size="70" fill="#0f8b8d">' + sanitizeForXml(safeStudentName()) + "</text>",
      '<text x="700" y="530" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="28" fill="#5f7185">' + sanitizeForXml(achievement) + "</text>",
      '<text x="310" y="660" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="26" fill="#5f7185">Úspešnosť</text>',
      '<text x="310" y="715" text-anchor="middle" font-family="Georgia, serif" font-size="58" fill="#1d2f43">' + percent + "%</text>",
      '<text x="700" y="660" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="26" fill="#5f7185">Nálepky</text>',
      '<text x="700" y="715" text-anchor="middle" font-family="Georgia, serif" font-size="58" fill="#1d2f43">' + state.correct + "/" + QUESTIONS_PER_RUN + "</text>",
      '<text x="1090" y="660" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-size="26" fill="#5f7185">Hodnotenie</text>',
      '<text x="1090" y="715" text-anchor="middle" font-family="Georgia, serif" font-size="50" fill="#1d2f43">' + sanitizeForXml(rating) + "</text>",
      '<text x="160" y="865" font-family="Trebuchet MS, sans-serif" font-size="26" fill="#5f7185">Dátum: ' + sanitizeForXml(today) + "</text>",
      '<text x="900" y="865" font-family="Trebuchet MS, sans-serif" font-size="26" fill="#5f7185">Podpis učiteľa: ____________________</text>',
      "</svg>"
    ].join("");
  }

  function downloadDiploma() {
    if (!state.finished) {
      return;
    }

    const svg = createDiplomaSvg();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = safeStudentName().toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");

    link.href = url;
    link.download = (fileName || "diplom") + ".svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function printDiploma() {
    if (!state.finished) {
      return;
    }

    window.print();
  }

  function resetTournamentProgress() {
    state.results = [];
    state.currentPlayerIndex = 0;
    state.currentPlayerName = "";
    state.active = false;
    state.questions = [];
    state.currentIndex = 0;
    state.correct = 0;
    state.answeredCurrent = false;
    state.finished = false;
    closeQuestionModal();
    updateStats();
    renderPlayerProgressList();
    renderRankingList();
  }

  function addPlayer() {
    const value = playerNameInput.value.trim();

    if (!value) {
      setPlayerHint("Napíš meno hráča, ktorého chceš pridať.", true);
      return;
    }

    if (state.players.some(function (player) {
      return player.toLocaleLowerCase("sk") === value.toLocaleLowerCase("sk");
    })) {
      setPlayerHint("Tento hráč už v zozname je.", true);
      return;
    }

    state.players.push(value);
    playerNameInput.value = "";
    setPlayerHint("Hráč bol pridaný. Môžeš pridať ďalšieho alebo spustiť hru.", false);
    renderPlayerList();
    renderPlayerProgressList();
    renderRankingList();
    playerNameInput.focus();
  }

  function removePlayer(index) {
    state.players.splice(index, 1);
    setPlayerHint(state.players.length === 0 ? "Pridaj aspoň jedného hráča." : "Hráč bol odstránený zo zoznamu.", false);
    renderPlayerList();
    renderPlayerProgressList();
    renderRankingList();
  }

  function goToPlayersScreen() {
    resetTournamentProgress();
    renderPlayerList();
    showScreen("players");
  }

  startFlowButton.addEventListener("click", function () {
    renderPlayerList();
    showScreen("players");
  });

  backToIntroButton.addEventListener("click", function () {
    showScreen("intro");
  });

  addPlayerButton.addEventListener("click", addPlayer);

  playerNameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addPlayer();
    }
  });

  playerList.addEventListener("click", function (event) {
    const removeButton = event.target.closest("[data-remove-player]");

    if (!removeButton) {
      return;
    }

    removePlayer(Number(removeButton.dataset.removePlayer));
  });

  beginGameButton.addEventListener("click", function () {
    if (state.players.length === 0) {
      setPlayerHint("Najprv pridaj aspoň jedného hráča.", true);
      return;
    }

    startTournament();
  });

  launchTurnButton.addEventListener("click", startRun);
  openQuestionButton.addEventListener("click", openQuestionModal);
  closeModalButton.addEventListener("click", closeQuestionModal);
  questionModal.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-close-modal")) {
      closeQuestionModal();
    }
  });
  nextButton.addEventListener("click", nextStep);
  repeatTurnButton.addEventListener("click", preparePlayerTurn);
  nextPlayerButton.addEventListener("click", function () {
    if (state.currentPlayerIndex >= state.players.length - 1) {
      return;
    }

    state.currentPlayerIndex += 1;
    preparePlayerTurn();
  });
  backToPlayersFromResultsButton.addEventListener("click", goToPlayersScreen);
  printDiplomaButton.addEventListener("click", printDiploma);
  downloadDiplomaButton.addEventListener("click", downloadDiploma);

  updateStats();
  renderBestRun();
  renderPlayerList();
  renderPlayerProgressList();
  renderRankingList();
  renderGameOverview();
  renderResultStickers();
  setPlayerHint("Pridaj aspoň jedného hráča.", false);
})();
