export const devicesOriginal = {
    lamparaComedor: {
        state: 'off',
        label: 'Lampara Comedor',
        id: 'lamparaComedor'
    },
    lamparaSala: {
        state: 'off',
        label: 'Lampara Sala',
        id: 'lamparaSala'
    },
    lamparaTurca: {
        state: 'off',
        label: 'Lampara Turca',
        id: 'lamparaTurca'
    },
    lamparaLava: {
        state: 'off',
        label: 'Lampara Lava',
        id: 'lamparaLava'
    },
    lamparaRotatoria: {
        state: 'off',
        label: 'Lampara Rotatoria',
        id: 'lamparaRotatoria'
    },
    luzCuarto: {
        state: 'off',
        label: 'Luz Cuarto',
        id: 'luzCuarto'
    },
    luzEscalera: {
        state: 'off',
        label: 'Luz Escalera',
        id: 'luzEscalera'
    },
    chimeneaSala: {
        state: 'off',
        label: 'Chimenea Sala',
        id: 'chimeneaSala'
    },
    lamparasAbajo: {
        state: 'off',
        label: 'Lamparas Abajo',
        id: 'lamparasAbajo'
    },
    parlantesSala: {
        state: 'off',
        label: 'Parlantes Sala',
        id: 'parlantesSala'
    },
    calentadorNegro: {
        state: 'off',
        label: 'Calentador Lizzie',
        id: 'calentadorNegro'
    },
    calentadorBlanco: {
        state: 'off',
        label: 'Calentador Amy',
        id: 'calentadorBlanco'
    },
    hdmiSala: {
        state: 'roku',
        label: {
            roku: 'Roku',
            cable: 'Cable'
        },
        id: 'hdmiSala'
    },
    teleCuarto: {
        state: 'off',
        label: 'TV Cuarto',
        id: 'teleCuarto',
        mute: 'off',
        volume: '0',
        channelSelected: 'siete',
        input: {
            state: 'hdmi1',
            label: {
                hdmi1: 'Modo Normal',
                hdmi2: 'Modo Chromecast'
            }
        }
    },
    teleCocina: {
        state: 'off',
        label: 'TV Cocina',
        id: 'teleCocina',
        mute: 'off',
        volume: '0',
        channelSelected: 'siete',
        input: {
            state: 'hdmi1',
            label: {
                hdmi1: 'Modo Normal',
                hdmi2: 'Modo Chromecast'
            }
        }
    },
    teleSala: {
        state: 'off',
        label: 'TV Sala',
        id: 'teleSala',
        mute: 'off',
        volume: '0',
        channelSelected: 'siete',
        input: {
            state: 'hdmi1', 
            label: {
                hdmi1: 'Modo Normal',
                hdmi2: 'Modo Firestick'
            }
        }
    },
    proyectorSala: {
        state: 'off',
        label: 'Proyector',
        id: 'proyectorSala',
        mute: 'off',
        volume: '0',
        input: {
            state: 'hdmi1',
            label: {
                hdmi1: 'Modo Normal',
                hdmi2: 'Modo Playstation'
            }
        }
    },
    proyectorSwitchSala: {
        state: 'off',
        label: 'Proyector Switch Sala',
        id: 'proyectorSwitchSala'
    },
    rokuSala: {
        state: 'play',
        label: '',
        id: 'rokuSala',
        app: 'none',
        apps: {
          netflix: {
            label: 'Netflix',
            id: 'netflix',
            img: '/imgs/apps/netflix.png'
          },
          disney: {
            label: 'Disney',
            id: 'disney',
            img: '/imgs/apps/disney.png'
          },
          youtube: {
            label: 'Youtube',
            id: 'youtube',
            img: '/imgs/apps/youtube.png'
          },
          max: {
            label: 'Max',
            id: 'max',
            img: '/imgs/apps/max.png'
          },
          amazon: {
            label: 'Amazon',
            id: 'amazon',
            img: '/imgs/apps/amazon.png'
          }
        }
    },
    channelsSala: {
        selected: 'seis',
        channels: {
            tve: {
                order: 1,
                number: '03',
                ifttt: '1',
                label: 'Tve',
                id: 'tve',
                info: '',
                img: '/imgs/channels/tve.png',
                category: 'general',
            },
            cuatro: {
                order: 2,
                number: '04',
                ifttt: '1',
                label: 'Cuatro',
                id: 'cuatro',
                info: '',
                img: '/imgs/channels/cuatro.png',
                category: 'national',
            },
            seis: {
                order: 3,
                number: '06',
                ifttt: '1',
                label: 'Seis',
                id: 'seis',
                info: '',
                img: '/imgs/channels/seis.png',
                category: 'national',
            },
            siete: {
                order: 4,
                number: '07',
                ifttt: '1',
                label: 'Siete',
                id: 'siete',
                info: '',
                img: '/imgs/channels/siete.png',
                category: 'national',
            },
            multimedios: {
                order: 5,
                number: '08',
                ifttt: '1',
                label: 'Multimedios',
                id: 'multimedios',
                info: '',
                img: '/imgs/channels/multimedios.png',
                category: 'national',
            },
            nueve: {
                order: 6,
                number: '09',
                ifttt: '1',
                label: 'Nueve',
                id: 'nueve',
                info: '',
                img: '/imgs/channels/nueve.png',
                category: 'national',
            },
            estrellas: {
                order: 7,
                number: '10',
                ifttt: '1',
                label: 'Estrellas',
                id: 'estrellas',
                info: '',
                img: '/imgs/channels/estrellas.png',
                category: 'entertainment',
            },
            once: {
                order: 8,
                number: '11',
                ifttt: '1',
                label: 'Once',
                id: 'once',
                info: '',
                img: '/imgs/channels/once.png',
                category: 'national',
            },
            sinart: {
                order: 9,
                number: '13',
                ifttt: '1',
                label: 'Sinart',
                id: 'sinart',
                info: '',
                img: '/imgs/channels/sinart.png',
                category: 'national',
            },
            xpertv: {
                order: 10,
                number: '14',
                ifttt: '1',
                label: 'Xpertv',
                id: 'xpertv',
                info: '',
                img: '/imgs/channels/xpertv.png',
                category: 'national',
            },
            ucr: {
                order: 11,
                number: '15',
                ifttt: '1',
                label: 'Ucr',
                id: 'ucr',
                info: '',
                img: '/imgs/channels/ucr.png',
                category: 'national',
            },
            tvchile: {
                order: 12,
                number: '16',
                ifttt: '1',
                label: 'Tv Chile',
                id: 'tvchile',
                info: '',
                img: '/imgs/channels/tvchile.png',
                category: 'general',
            },
            caracol: {
                order: 13,
                number: '17',
                ifttt: '1',
                label: 'Caracol',
                id: 'caracol',
                info: '',
                img: '/imgs/channels/caracol.png',
                category: 'general',
            },
            uno: {
                order: 14,
                number: '31',
                ifttt: '1',
                label: 'Canal 1',
                id: 'uno',
                info: '',
                img: '/imgs/channels/uno.png',
                category: 'national',
            },
            tvn: {
                order: 15,
                number: '32',
                ifttt: '1',
                label: 'Tvn 14',
                id: 'tvn',
                info: '',
                img: '/imgs/channels/tvn.png',
                category: 'national',
            },
            tvsur: {
                order: 16,
                number: '33',
                ifttt: '1',
                label: 'Tv Sur',
                id: 'tvsur',
                info: '',
                img: '/imgs/channels/tvsur.png',
                category: 'national',
            },
            trivision: {
                order: 17,
                number: '36',
                ifttt: '1',
                label: 'Trivision',
                id: 'trivision',
                info: '',
                img: '/imgs/channels/trivision.png',
                category: 'national',
            },
            telemundo: {
                order: 18,
                number: '100',
                ifttt: '1',
                label: 'Telemundo',
                id: 'telemundo',
                info: '',
                img: '/imgs/channels/telemundo.png',
                category: 'entertainment',
            },
            azcorazon: {
                order: 19,
                number: '101',
                ifttt: '1',
                label: 'Az Corazon',
                id: 'azcorazon',
                info: '',
                img: '/imgs/channels/azcorazon.png',
                category: 'entertainment',
            },
            gourmet: {
                order: 20,
                number: '105',
                ifttt: '1',
                label: 'Gourmet',
                id: 'gourmet',
                info: '',
                img: '/imgs/channels/gourmet.png',
                category: 'food',
            },
            homeandhealth: {
                order: 21,
                number: '106',
                ifttt: '2',
                label: 'Home And Health',
                id: 'homeandhealth',
                info: '',
                img: '/imgs/channels/homeandhealth.png',
                category: 'science',
            },
            maschic: {
                order: 22,
                number: '107',
                ifttt: '2',
                label: 'Mas Chic',
                id: 'maschic',
                info: '',
                img: '/imgs/channels/maschic.png',
                category: 'entertainment',
            },
            telexitos: {
                order: 23,
                number: '109',
                ifttt: '2',
                label: 'Telexitos',
                id: 'telexitos',
                info: '',
                img: '/imgs/channels/telexitos.png',
                category: 'national',
            },
            hogartv: {
                order: 24,
                number: '110',
                ifttt: '2',
                label: 'Hogar tv',
                id: 'hogartv',
                info: '',
                img: '/imgs/channels/hogartv.png',
                category: 'entertainment',
            },
            lifetime: {
                order: 25,
                number: '111',
                ifttt: '2',
                label: 'Lifetime',
                id: 'lifetime',
                info: '',
                img: '/imgs/channels/lifetime.png',
                category: 'movies',
            },
            holatv: {
                order: 26,
                number: '112',
                ifttt: '2',
                label: 'Hola tv',
                id: 'holatv',
                info: '',
                img: '/imgs/channels/holatv.png',
                category: 'entertainment',
            },
            univision: {
                order: 27,
                number: '113',
                ifttt: '2',
                label: 'Univision',
                id: 'univision',
                info: '',
                img: '/imgs/channels/univision.png',
                category: 'entertainment',
            },
            filmandarts: {
                order: 28,
                number: '115',
                ifttt: '2',
                label: 'Film and Arts',
                id: 'filmandarts',
                info: '',
                img: '/imgs/channels/filmandarts.png',
                category: 'movies',
            },
            foodnetworkes: {
                order: 29,
                number: '116',
                ifttt: '2',
                label: 'Food Network Es',
                id: 'foodnetworkes',
                info: '',
                img: '/imgs/channels/foodnetworkes.png',
                category: 'food',
            },
            foodnetworkus: {
                order: 30,
                number: '117',
                ifttt: '2',
                label: 'Food Network Us',
                id: 'foodnetworkus',
                info: '',
                img: '/imgs/channels/foodnetworkus.png',
                category: 'food',
            },
            hgtv: {
                order: 31,
                number: '118',
                ifttt: '2',
                label: 'Hgtv',
                id: 'hgtv',
                info: '',
                img: '/imgs/channels/hgtv.png',
                category: 'entertainment',
            },
            cartoon: {
                order: 32,
                number: '125',
                ifttt: '2',
                label: 'Cartoon',
                id: 'cartoon',
                info: '',
                img: '/imgs/channels/cartoon.png',
                category: 'children',
            },
            nick: {
                order: 33,
                number: '127',
                ifttt: '2',
                label: 'Nick',
                id: 'nick',
                info: '',
                img: '/imgs/channels/nick.png',
                category: 'children',
            },
        }
    }
};

