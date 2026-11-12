# Maršrutų paslaugos prijungimas

**Licencijos klausimas:** „Mapbox“ naudojimo sąlygose programėlėms, susijusioms su naudojimu transporto priemonėse, gali reikėti atskiros kūrimo ir komercinės licencijos. Kadangi „Kelrodis“ skirtas navigacijai automobiliu, prieš naudojimą darbo veikloje reikia su „Mapbox“ patvirtinti, kokia licencija taikoma šiai programėlei: https://www.mapbox.com/legal/tos . Vien veikiantis API raktas ar nemokamas užklausų limitas licencijos nepatvirtina.

Programėlėje galima įjungti „Mapbox Directions“ maršrutus automobiliu, kuriems naudojamas `driving-traffic` profilis. Kai kuriuose regionuose eismo duomenys gali būti neprieinami; paslauga tada gali grąžinti įprastą maršrutą. Prieš pradedant naudoti pristatymui būtina patikrinti adresų, kelių ir eismo duomenų kokybę konkrečiose vietovėse.

1. Susikurkite paskyrą https://account.mapbox.com/ ir susipažinkite su https://www.mapbox.com/pricing/ . Paslaugai gali reikėti mokėjimo duomenų, o nemokamus limitus viršijantis naudojimas gali būti apmokestintas.
2. Sukurkite tik viešąjį prieigos raktą (`pk.`), apribotą programėlės adresu `https://kelrodis-lietuva.kaikajusk.chatgpt.site/`, ir įjunkite galimus naudojimo bei išlaidų ribojimus. Viešasis raktas matomas naršyklėje; niekada nenaudokite slaptojo (`sk.`) rakto.
3. Programėlės „Sites“ aplinkos kintamajam `MAPBOX_PUBLIC_TOKEN` įrašykite šį viešąjį raktą ir iš naujo paskelbkite išsaugotą programėlės versiją. Raktų nedėkite į „GitHub“ kodą. Patikrinkite, kad URL apribojimas veiktų naršyklėje ir įdiegtos Android programėlės WebView.
4. Patikrinkite realius maršrutus ir įėjimus Lietuvoje bei atsaką, kai limitas viršytas ar nutrūksta ryšys. Esant „Mapbox“ klaidai programa tyliai nepersijungia į kitą maršrutų paslaugą.

Kol raktas nenustatytas, programa tebenaudoja OSRM demonstracinę paslaugą, skirtą nekomerciniams bandymams. Žemėlapis ir adresų paieška šiuo prijungimu nekeičiami: žemėlapį teikia „OpenFreeMap“ / „OpenStreetMap“, paiešką – „Photon“ demonstracinė paslauga. Jas taip pat reikia atskirai įvertinti prieš platesnį ar komercinį naudojimą.
