import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import arCommon from "./locales/ar/common.json";
import deCommon from "./locales/de/common.json";
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import frCommon from "./locales/fr/common.json";
import jaCommon from "./locales/ja/common.json";
import ptCommon from "./locales/pt/common.json";
import ruCommon from "./locales/ru/common.json";
// Bundled locale imports — no HTTP fetch needed
import skCommon from "./locales/sk/common.json";
import zhCommon from "./locales/zh/common.json";

const STORAGE_KEY = "neferty_lang";
const savedLang =
  typeof localStorage !== "undefined"
    ? (localStorage.getItem(STORAGE_KEY) ?? "sk")
    : "sk";

i18n.use(initReactI18next).init({
  lng: savedLang,
  fallbackLng: "sk",
  defaultNS: "common",
  interpolation: { escapeValue: false },
  resources: {
    sk: { common: skCommon },
    en: { common: enCommon },
    de: { common: deCommon },
    fr: { common: frCommon },
    es: { common: esCommon },
    zh: { common: zhCommon },
    ja: { common: jaCommon },
    ar: { common: arCommon },
    pt: { common: ptCommon },
    ru: { common: ruCommon },
  },
});

export default i18n;
