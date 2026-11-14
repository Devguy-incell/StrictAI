/**
 * StrictAI Polyglot Dictionary Data & IPA/Audio Module
 * Provides robust phonetic transcriptions (IPA), fallback audio URLs,
 * definitions, and helper lookups for 6 languages: en, de, es, zh, pl, uk.
 */

(function(window) {
    'use strict';

    const DICT_DATA = {
        en: {
            "hello": {
                ipa: "/həˈloʊ/",
                audio: "https://api.dictionaryapi.dev/media/pronunciations/en/hello-us.mp3",
                translation: "cześć / witać",
                definition: "Used as a greeting or to begin a phone conversation."
            },
            "world": {
                ipa: "/wɜːrld/",
                audio: "https://api.dictionaryapi.dev/media/pronunciations/en/world-us.mp3",
                translation: "świat",
                definition: "The earth, together with all of its countries and peoples."
            },
            "artificial": {
                ipa: "/ˌɑːrtɪˈfɪʃəl/",
                audio: "https://api.dictionaryapi.dev/media/pronunciations/en/artificial-us.mp3",
                translation: "sztuczny",
                definition: "Made or produced by human beings rather than occurring naturally."
            },
            "intelligence": {
                ipa: "/ɪnˈtɛlɪdʒəns/",
                audio: "https://api.dictionaryapi.dev/media/pronunciations/en/intelligence-us.mp3",
                translation: "inteligencja",
                definition: "The ability to acquire and apply knowledge and skills."
            },
            "language": {
                ipa: "/ˈlæŋɡwɪdʒ/",
                audio: "https://api.dictionaryapi.dev/media/pronunciations/en/language-us.mp3",
                translation: "język",
                definition: "The method of human communication, either spoken or written."
            }
        },
        de: {
            "hallo": {
                ipa: "/haˈloː/",
                audio: "https://upload.wikimedia.org/wikipedia/commons/transcript/de/Hallo.ogg",
                translation: "hello",
                definition: "Ein Ausdruck der Begrüßung."
            },
            "welt": {
                ipa: "/vɛlt/",
                audio: "https://upload.wikimedia.org/wikipedia/commons/transcript/de/Welt.ogg",
                translation: "world",
                definition: "Die Erde als Wohnort der Menschen."
            },
            "künstliche": {
                ipa: "/ˈkʏnstlɪçə/",
                audio: "",
                translation: "artificial",
                definition: "Von Menschen gemacht, nicht natürlich."
            },
            "intelligenz": {
                ipa: "/ɪntɛliˈɡɛnt͡s/",
                audio: "",
                translation: "intelligence",
                definition: "Fähigkeit zu denken, zu verstehen und zu handeln."
            },
            "sprache": {
                ipa: "/ˈʃpʁaːxə/",
                audio: "",
                translation: "language",
                definition: "Das System der menschlichen Kommunikation."
            }
        },
        es: {
            "hola": {
                ipa: "/ˈola/",
                audio: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Es-hola.ogg",
                translation: "hello",
                definition: "Saludo afectuoso o fórmula usual para iniciar una conversación."
            },
            "mundo": {
                ipa: "/ˈmundo/",
                audio: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Es-mundo.ogg",
                translation: "world",
                definition: "El planeta Tierra y todo lo que hay en él."
            },
            "artificial": {
                ipa: "/aɾtifiˈsjal/",
                audio: "",
                translation: "artificial",
                definition: "Hecho por mano o arte del hombre."
            },
            "inteligencia": {
                ipa: "/inteleˈxensja/",
                audio: "",
                translation: "intelligence",
                definition: "Capacidad de entender o comprender."
            },
            "idioma": {
                ipa: "/iˈðjoma/",
                audio: "",
                translation: "language",
                definition: "Lengua propia de un pueblo o nación, o común a varios."
            }
        },
        zh: {
            "你好": {
                ipa: "/nì.háʊ/",
                audio: "https://upload.wikimedia.org/wikipedia/commons/transcript/zh/你好.ogg",
                translation: "hello",
                definition: "最常用的问候语。"
            },
            "世界": {
                ipa: "/ʂî.t͡ɕi̯ɛ̌/",
                audio: "https://upload.wikimedia.org/wikipedia/commons/transcript/zh/世界.ogg",
                translation: "world",
                definition: "自然界和人类社会的统称，地球。"
            },
            "人工智能": {
                ipa: "/rɛ́n.t͡ɕʰy̌.t͡ɕʰy̌.nɤ̌ŋ/",
                audio: "",
                translation: "artificial intelligence",
                definition: "由人制造出来的系统所表现出来的智能。"
            },
            "语言": {
                ipa: "/y̌.ɥɛ̌n/",
                audio: "",
                translation: "language",
                definition: "人类进行沟通交流的符号系统。"
            }
        },
        pl: {
            "cześć": {
                ipa: "/t͡ʂɛɕt͡ɕ/",
                audio: "",
                translation: "hello / hi",
                definition: "Nieoficjalne pozdrowienie przy powitaniu lub pożegnaniu."
            },
            "świat": {
                ipa: "/ɕfʲat/",
                audio: "",
                translation: "world",
                definition: "Ziemia wraz z ludźmi i wszystkim, co na niej istnieje."
            },
            "sztuczna": {
                ipa: "/ˈʂtut͡ʂ.na/",
                audio: "",
                translation: "artificial (fem.)",
                definition: "Wytworzona przez człowieka, nie naturalna."
            },
            "inteligencja": {
                ipa: "/ˌin.tɛ.liˈɡɛn.t͡sja/",
                audio: "",
                translation: "intelligence",
                definition: "Zdolność rozumienia oraz radzenia sobie w nowych sytuacjach."
            },
            "język": {
                ipa: "/ˈjɛw.zɨk/",
                audio: "",
                translation: "language",
                definition: "System znaków dźwiękowych służący do komunikacji."
            }
        },
        uk: {
            "привіт": {
                ipa: "/prɪˈʋʲit/",
                audio: "",
                translation: "hello / hi",
                definition: "Дружнє вітання при зустрічі."
            },
            "світ": {
                ipa: "/swʲit/",
                audio: "",
                translation: "world",
                definition: "Земля з усім існуючим на ній, людство."
            },
            "штучний": {
                ipa: "/ˈʃtʊtʃ.nɪj/",
                audio: "",
                translation: "artificial",
                definition: "Створений людиною, а не природою."
            },
            "інтелект": {
                ipa: "/in.teˈlɛkt/",
                audio: "",
                translation: "intelligence",
                definition: "Здатність до мислення, пізнання та аналізу."
            },
            "мова": {
                ipa: "/ˈmɔ.ʋa/",
                audio: "",
                translation: "language",
                definition: "Система знаків, що використовується для спілкування."
            }
        }
    };

    const StrictDictData = {
        getData(lang) {
            return DICT_DATA[lang] || DICT_DATA['en'];
        },
        lookup(lang, word) {
            const l = (lang || 'en').toLowerCase();
            const w = (word || '').trim().toLowerCase();
            const langDict = DICT_DATA[l] || DICT_DATA['en'];
            return langDict[w] || {
                ipa: `[${w}]`,
                audio: "",
                translation: "translation not available",
                definition: "Definition not available in offline corpus."
            };
        },
        supportedLanguages() {
            return Object.keys(DICT_DATA);
        }
    };

    window.StrictDictData = StrictDictData;
})(typeof window !== 'undefined' ? window : global);
