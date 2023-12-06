# Namukilke 2.0

## Käynnistys ja kehittäminen

### Setup
Varmista, että seuraavat asiat on tehtynä:
- SSH-avain on luotu paikallisesti ja linkattu Githubiin (Tai HTTPS-autentikaatio kunnossa)
- Asenna Docker Desktop (Mac, Windows) ja docker-compose (https://www.docker.com/products/docker-desktop/)
- Asenna VSCodessa seuraavat extensionit
  - [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---
1. Kloonaa repositorio
  - SSH: `git clone git@github.com:Prodeko/namu2.git`. (SSH-avaimella) tai
  - HTTPS: `git clone https://github.com/Prodeko/namu2.git` (Käyttäen [Personal Access Tokeneita](https://github.com/settings/tokens))
2. (Käynnistä Docker ja varmista, että docker-compose on myös asennettuna).
3. Mikäli SSH-avaimesi ei ole tiedostossa `~/.ssh/id_rsa`, luo .devcontainer-kansioon [.env.examplen](.devcontainer/.env.example) rinnalle [.env](.devcontainers/.env)-tiedosto.
4. Avaa VS Code devcontainer (F1 + `Reopen in container`). Samalla asentuvat paketit.
5. Aja migraatiot komennolla `pnpx prisma migrate dev`. Tämä luo tietokannan taulut `prisma/migrations`-kansion sisällä olevien migraatiotiedostojen mukaan.
6. Luo testidata tietokantaan ajamalla `pnpm db:generate-test-data`.
7. Käynnistä Next komennolla `pnpm dev`.

Dev-kontin onnistuu painamalla F1 ja valitsemalla Rebuild container.

Sovellus käynnistyy porttiin 3000. Siirry siis selaimella [http://localhost:3000](http://localhost:3000).

### Git devikontissa
Jos git valittaa puuttuvasta avaimesta, laita .env tiedostoon SSH_KEY_PATH, jossa määrittelet polun hostikoneella sijaitsevan ssh avaimeen.


## Tech stack

Namukilkkeen pohjana toimii seuraavat teknologiat:
- [React](https://beta.reactjs.org/learn) (Todella hyvä dokumentaatio!)
- [Next](https://nextjs.org/docs/app)
- [TypeScript](https://react-typescript-cheatsheet.netlify.app/docs/basic/setup)
- [Tailwind](https://tailwindcss.com/docs/installation)

Koodityylistä huolehtii
- [Biome](https://biomejs.dev/guides/getting-started/) Rust-pohjainen formatter / linter, tässä projektissa käytetään vain linttaukseen
- [Prettier](https://prettier.io/docs/en/) Default JS formatointi työkalu. Tässä projektissa tätä käytetään Biomen formatoijan oman formatoijan sijasta, koska Prettierillä on plugineja esimerkiksi Tailwind-classien sorttaamiseen mitä Biomelta ei löydy.

### Design system

Projektin väriteema on helposti muokattavissa `tailwind.config.ts`-tiedostosta. Vaihda vain `colors`-muuttujien arvoa ja koko projektin väriteema vaihtuu jokaiselle sivulle.

### Formatointi ja linttaus
- Linttausasetukset on määritelty `biome.json`-filussa.
- Formatointiasetukset on määritelty `prettier.config.mjs`-filussa. 
- `.vscode/settings.json` on määritelty, että tallentaessa formatointi runataan mutta linttausta ei. Näitä voi säätää muuttamalla asetuksia `source.fixAll.biome` (linttaus) ja `editor.formatOnSave` (formatointi)

### Components-kansio

#### ui

ui-directoryyn kirjoitetaan kaikki UI-layerin komponentin. Näissä komponenteissa määritellään lähinnä vain visuaalisen aspektit, mutta ei toimintalogiikkaa. Esimerkiksi Input ja Buttonit näyttävät eri paikoissa samanlaisilta mutta tekevät eri asioita. Nämä sitten importataan eri paikkoihin ja toimintalogiikka määritellään käyttökohtaisesti erikseen.


### Path aliakset

Tsconfig-filussa on määritetty ns. "path-aliakset" kansiolle, joita käytetään usein. Nämä osoittavat absoluuttisen reitin tähän kansioon ja näitä patheja voi siten kutsua mistä tahansa kansiosta.

Esimerkki:
- Olet kansiossa /src/components/index.tsx
- Haluat importttaa komponentin "Input" kansiosta /src/components/ui/Input/index.tsx
- --> Voit importtaa "Input"-komponentin kirjoittamalla `import { Input } from '@/src/app/_components/ui/Input'`