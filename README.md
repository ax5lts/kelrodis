# Kelrodis

Lietuviška žemėlapių ir navigacijos programėlė su bendra pastatų įėjimų duomenų baze.

- [Atsisiųsti „Android“ APK](https://github.com/ax5lts/kelrodis/releases/latest/download/kelrodis.apk)
- [Atidaryti programėlę naršyklėje](https://kelrodis-lietuva.kaikajusk.chatgpt.site)
- [Atsisiuntimo puslapis](https://ax5lts.github.io/kelrodis/)

„Android“: atsisiųskite APK telefone ir atidarykite failą. Jei „Android“ paprašys, pasirinkite leisti diegimą šiam failų tvarkytuvui arba naršyklei. Ši versija neplatinama per „Google Play“.

„iPhone“: atidarykite programėlės nuorodą „Safari“, pasirinkite „Bendrinti“ → „Įtraukti į pradžios ekraną“ ir „Atidaryti kaip žiniatinklio programėlę“. Ši versija neplatinama per „App Store“.

## Projekto turinys

- `android/` – „Android“ programėlės kodas, rodantis saugų HTTPS adresą ir prašantis vietos leidimo tik tuomet, kai jo prireikia.
- `web/` – žemėlapio sąsajos kodas, skelbiamas atskirame serveryje.
- `backend/` – serverio ir duomenų bazės schemos kodas.
- `docs/` – viešas atsisiuntimo puslapis.

APK automatiškai sukuriamas per „GitHub Actions“ ir pridedamas prie „Releases“. Jis pasirašomas atskirai saugomu raktu; raktas ir administratoriaus slaptažodis nėra viešoje saugykloje. Programėlei reikia interneto. Žemėlapio, paieškos ir maršrutų prototipo paslaugos gali turėti naudojimo ir patikimumo ribojimų.
