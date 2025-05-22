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
        label: 'Proyector Sala',
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
    },
    cableSala: {
        selected: 'seis',
        channels: {
            seis: {
                order: 1,
                number: '06',
                label: 'Seis',
                id: 'seis',
                info: '',
                img: '/imgs/channels/seis.png'
            },
            siete: {
                order: 2,
                number: '07',
                label: 'Siete',
                id: 'siete',
                info: '',
                img: '/imgs/channels/siete.png'
            },
            once: {
                order: 3,
                number: '11',
                label: 'Once',
                id: 'once',
                info: '',
                img: '/imgs/channels/once.png'
            },
        }
    }
};

