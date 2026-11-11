# „Kelrodžio“ naudojimo ir pasirengimo vertinimas

2026-11-11. Tai kodo ir automatinių bandymų vertinimas. Faktinis važiavimas ir telefonų akumuliatoriaus, GPS, ryšio bei ekrano testai neatlikti. Programėlė tebėra pradinė versija.

## Kam skirti pagrindinį dėmesį

Pagrindinis naudotojas – pristatymo vairuotojas Lietuvoje. Svarbiausi darbai: tiksliai rasti adresą, sudėlioti sustojimus, patikimai nuvažiuoti, rasti įėjimą ir neprarasti darbo nutrūkus programai. Įgyvendinti šiuos darbus verta prieš papildomas socialines ar dekoratyvias funkcijas.

## Didžiausi trūkumai ir siūloma eilė

1. **Tinkamos maršrutų ir paieškos paslaugos.** Dabartinis OSRM serveris yra demonstracinis: jo naudojimo taisyklės riboja naudojimą nekomerciniais atvejais ir negarantuoja pasiekiamumo, delsos ar duomenų atnaujinimo. [OSRM sąlygos](https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server). Todėl dabartinis serveris netinka picerijos darbui ar komerciniam leidimui. Reikia savo OSRM infrastruktūros arba teikėjo, kurio sutartis leidžia šį naudojimą. Dabartinis „Photon“ taip pat negarantuoja pasiekiamumo ir gali riboti intensyvias užklausas: [Photon sąlygos](https://github.com/komoot/photon). Prieš renkantis teikėją būtina įvertinti kainas, lietuviškų adresų tikslumą, sutartį, prieinamumą ir duomenų atnaujinimą.
2. **Tikra navigacija važiuojant.** Posūkio atstumas apytikriai atnaujinamas pagal GPS ir maršruto geometriją, o po kelių tikslių nukrypimo signalų prašoma naujo maršruto. Pasirenkamas lietuviškas balsas veikia tik jei telefonas jį turi. Šie pakeitimai dar neišbandyti važiuojant: nėra pilno navigacijos variklio, kelių uždarymų ar realaus eismo. GPS taškas vizualiai animuojamas tarp telefono pateiktų pozicijų ir nėra patikimai pritraukiamas prie važiuojamosios dalies. Būtinas profesionalus navigacijos variklis ar SDK, kuris atnaujintų posūkį, nustatytų nukrypimą ir patikimai apdorotų kelių apribojimus. Pavyzdžiui, [Mapbox navigacijos dokumentacijoje](https://docs.mapbox.com/android/ja/navigation/guides/turn-by-turn-navigation/rerouting-and-refresh/) aprašytas nukrypimų aptikimas ir maršruto atnaujinimas. Konkretus teikėjas dar nepasirinktas.
3. **Veikimas telefono fone ir dingus ryšiui.** Dabartinis „Android“ APK yra „WebView“ apvalkalas; jis negarantuoja navigacijos užrakinus ekraną arba perėjus į kitą programą. „iPhone“ versija yra žiniatinklio programėlė. Reikia atskirai suprojektuoti ir realiuose įrenginiuose patikrinti foninę navigaciją, pranešimus ir baterijos vartojimą. Esama versija po pirmojo apsilankymo gali atidaryti programos sąsają ir vietoje išsaugotus adresus be ryšio, bet neturi pilnų autonominių žemėlapių bei naujų maršrutų skaičiavimo be interneto. [Google Maps pagalbos puslapyje](https://support.google.com/maps/answer/6291838?ctx=topic&hl=en&topic=2649131) aprašoma, kaip veikia jo atsisiųstos vietovės ir kokie duomenys neprieinami be ryšio.
4. **Pristatymo adreso tikslumas.** Prieš pradedant kelionę aiškiai atskirti namo numerį nuo vien gatvės rezultato; parodyti miestą ir galutinį įėjimą. Sustojimą dabar reikia patvirtinti pačiam, kad GPS paklaida jo netyčia nepraleistų. Išbandyti patvirtinimą realiai ir įvertinti jo patogumą. Įėjimų informacijai reikia peržiūros, paskutinio atnaujinimo datos ir klaidų taisymo, nes pasenęs žymėjimas gali nukreipti neteisingai. Neskelbti gyventojų asmens duomenų.
5. **Eksploatavimas ir apsauga.** Reikia atsarginių duomenų kopijų, atkūrimo bandymų, patikimesnių administratoriaus paskyrų ir sesijų atšaukimo, prieigos bei pakeitimų istorijos, klaidų stebėsenos ir apkrovos testų. Duomenų rinkimą riboti, nes adresai ir buvimo vieta gali būti jautrūs. Saugoti tik būtinus duomenis ir nustatyti saugojimo terminus.

## Ką jau pagerinome

- Sustabdomas sukimosi inertiškumas paleidus du pirštus.
- Adresai ir sustojimai saugomi konkrečiame įrenginyje; po proceso uždarymo atkuriami likę sustojimai. Maršrutą reikia sąmoningai perskaičiuoti.
- Grįžus į tą patį aktyvų navigacijos langą po ilgesnio pertraukimo iš naujo tikrinama vieta ir perskaičiuojamas maršrutas. Rodomas įspėjimas, jei vieta neatnaujinama.
- Išsaugotus adreso duomenis galima pašalinti mygtuku „Išvalyti“.
- Pridėti pasirenkami balso nurodymai, apytikris posūkio atstumo sekimas, atsargus nukrypimo aptikimas, GPS ir ryšio įspėjimai bei pastato informacijos atskyrimas pagal adresą. Įgyvendinimas patikrintas automatiniais bandymais, bet ne realioje kelionėje.

## Bandymas su tikrais telefonais prieš kasdienį naudojimą

1. Naudoti bent du skirtingus „Android“ telefonus ir „iPhone“; išbandyti portretinę bei horizontalią padėtį, šviesų ir tamsų režimus.
2. Palyginti tikslius namų numerius, įvažiavimo vietas ir įėjimus Panevėžyje bei kituose Lietuvos miestuose, įskaitant tuos pačius gatvių pavadinimus skirtingose vietovėse.
3. Sudėlioti bent tris sustojimus, perrikiuoti, pašalinti, sustojimą pažymėti pasiektu ir patikrinti maršrutą uždarius, grįžus bei perkrovus telefoną.
4. Keleiviui ar bandomajam vairuotojui fiksuoti faktinį GPS judėjimą, posūkius, nukrypimus ir klaidingai pažymėtus sustojimus; naudoti tik leidžiamus, ne asmens duomenis turinčius bandomuosius adresus.
5. Imti įeinantį skambutį, užrakinti ekraną, perjungti programas, keisti leidimus ir patikrinti reakciją į labai silpną GPS, išjungtą internetą, lėtą tinklą bei grįžtantį ryšį.
6. Matuoti šalto paleidimo ir adreso paieškos laiką, maršruto apskaičiavimo delsą, baterijos naudojimą ir klaidų skaičių. Išmatuotų rezultatų dar neturime; tikslines ribas nustatyti pagal bandymus ir vairuotojo poreikius.
