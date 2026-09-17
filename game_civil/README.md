# Pripravení pre život

Slovenská obrázková kvízová hra o civilnej ochrane, orientácii, prvej pomoci a ochrane prírody pre 1. až 9. ročník ZŠ.

## Spustenie

Otvor `index.html` v modernom prehliadači. Netreba inštaláciu, server, účet ani internet. Pri kopírovaní hry ponechaj spolu HTML, CSS, všetky tri JS súbory a priečinok `assets`.

Voliteľne môžeš priečinok sprístupniť lokálne cez `python3 -m http.server 8080` a otvoriť `http://localhost:8080`.

## Hranie

- Vyber ročník a spusti výzvu.
- Každý ročník má 40 vlastných otázok, po 10 zo štyroch oblastí; celkovo 360.
- Jedna výzva obsahuje 12 otázok, po 3 z každej oblasti.
- Náhodne sa mieša výber otázok, ich poradie aj poradie troch odpovedí.
- Nasledujúca výzva v tom istom ročníku vylúči všetkých 12 otázok z predchádzajúcej. V ďalších kolách sa staršie otázky môžu vrátiť.
- Po odpovedi sa ukáže správna možnosť aj vysvetlenie. Odpoveď už nemožno zmeniť.
- Výsledok obsahuje skóre, prehľad oblastí a rozklikávacie vysvetlenia; možno zobraziť len nesprávne odpovede.
- Ovládanie myšou, dotykom alebo klávesnicou: Tab, Enter, odpovede 1–3 / A–C, zatvorenie dialógu Escape.
- Bez časového limitu. Za správnu odpoveď je jeden bod, bez záporného hodnotenia.

Najlepšie skóre, ročník a posledný výber sa ukladajú cez `localStorage` iba v danom prehliadači. Pri blokovanom úložisku zostáva hra funkčná a pamätá si hodnoty do zatvorenia/obnovenia stránky. Správanie ukladania pri `file://` závisí od prehliadača. Údaje sa nikam neposielajú.

## Súbory

Otázky sú odstupňované podľa ročníka. Revidovaná banka používa situačné zadania, bežné omyly v nesprávnych možnostiach a porovnateľne dlhé odpovede. Staršie ročníky riešia aj poradie krokov, zmenu podmienok, výpočty trasy a opačné azimuty. Náročnosť nevzniká pridávaním nejednoznačných odpovedí; v uvedenej situácii sa vždy vyberá jedna správna možnosť.

- `index.html` — úvodná stránka a základné rozloženie.
- `styles.css` — responzívny vzhľad, pohybové efekty, prístupné stavy, režim obmedzeného pohybu.
- `app.js` — rozhranie, kvíz, výsledky, lokálny pokrok, informácie pre učiteľov.
- `engine.js` — nezávislé funkcie miešania a výberu otázok.
- `questions.js` — všetkých 360 otázok s odpoveďami a vysvetlením.
- `assets/ilustracie.jpeg` — kópia dodaného obrázka. Jednotlivé ilustrácie zobrazuje SVG výrez; pôvodný súbor zostal zachovaný.
- `SOURCES.md` — vzdelávacie podklady, tematické priradenie a odborné zdroje.
- `tests/quiz.test.js` — kontrola banky a náhodného výberu bez prehliadača a závislostí.

Otázky v `questions.js` sú rozdelené hlavičkou `@ročník|oblasť`. Každý riadok má päť položiek oddelených `|`: otázka, správna odpoveď, dve nesprávne odpovede, vysvetlenie. Značka `[map]` pred otázkou zapína schematickú mapu. Správna odpoveď je v zdrojových dátach prvá, ale pred každým hraním sa možnosti premiešajú a informácia o správnosti zostáva priradená k odpovedi.

## Kontrola

S Node.js: `node --test tests/quiz.test.js`. Syntax: `node --check app.js`, `node --check engine.js`, `node --check questions.js`.

Automaticky sa kontroluje 360 otázok, rozdelenie 40 na ročník / 10 na tému, jedinečnosť, výber 12 otázok, pokrytie všetkých tém, správnosť odpovede po premiešaní a neopakovanie otázok v dvoch po sebe idúcich výzvach. Vizuálna kontrola v prehliadači je ponechaná na ručné otestovanie.

## Výučba

Ročníkové priradenie je didaktický návrh, nie oficiálne potvrdenie súladu každého ročníka s konkrétnym ŠkVP. Nový ŠVP sa zavádza postupne a pracuje s cyklami. Pre mladších žiakov môže otázky čítať dospelý. Kvíz nenahrádza praktický nácvik prvej pomoci; číselné postupy KPR v otázkach sa týkajú dospelého. Podrobnosti a odkazy sú aj priamo v hre cez „Pre učiteľov“.
