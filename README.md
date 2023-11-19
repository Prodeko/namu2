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
5. Käynnistä Next komennolla `bun dev`.

Dev-kontin onnistuu painamalla F1 ja valitsemalla Rebuild container.

Sovellus käynnistyy porttiin 3000. Siirry siis selaimella [http://localhost:3000](http://localhost:3000).

### Git devikontissa
Jos git valittaa puuttuvasta avaimesta, laita .env tiedostoon SSH_KEY_PATH, jossa määrittelet polun hostikoneella sijaitsevan ssh avaimeen.


## Tech stack

Namukilkkeen pohjana toimii seuraavat teknologiat:
- [Bun](https://bun.sh) (Noden tilalla uudenkarhea JavaScript-runtime)
- [React](https://beta.reactjs.org/learn) (Todella hyvä dokumentaatio!)
- [Next](https://nextjs.org/docs/app)
- [TypeScript](https://react-typescript-cheatsheet.netlify.app/docs/basic/setup)
- [Tailwind](https://tailwindcss.com/docs/installation)

### Components-kansio

#### ui

ui-directoryyn kirjoitetaan kaikki UI-layerin komponentin. Näissä komponenteissa määritellään lähinnä vain visuaalisen aspektit, mutta ei toimintalogiikkaa. Esimerkiksi Input ja Buttonit näyttävät eri paikoissa samanlaisilta mutta tekevät eri asioita. Nämä sitten importataan eri paikkoihin ja toimintalogiikka määritellään käyttökohtaisesti erikseen.


### Path aliakset

Tsconfig-filussa on määritetty ns. "path-aliakset" kansiolle, joita käytetään usein. Nämä osoittavat absoluuttisen reitin tähän kansioon ja näitä patheja voi siten kutsua mistä tahansa kansiosta.

Esimerkki:
- Olet kansiossa /src/components/index.tsx
- Haluat importttaa komponentin "Input" kansiosta /src/components/ui/Input/index.tsx
- Tsconfigissa on path alias nimeltä `@ui`, joka osoittaa kansioon `/src/components/ui`
- --> Voit importtaa "Input"-komponentin kirjoittamalla `import { Input } from '@ui/Input'`