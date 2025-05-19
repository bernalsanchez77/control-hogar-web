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
            roku: 'Stream',
            cable: 'Cable'
        },
        id: 'hdmiSala'
    },
    teleCuarto: {
        state: 'off',
        label: 'Tele Cuarto',
        id: 'teleCuarto',
        mute: 'off',
        volume: '0',
        channelSelected: 'siete',
        input: {
            state: 'hdmi1',
            label: {
                hdmi1: 'Roku/Cable',
                hdmi2: 'Chromecast'
            }
        }
    },
    teleSala: {
        state: 'off',
        label: 'Tele Sala',
        id: 'teleSala',
        mute: 'off',
        volume: '0',
        channelSelected: 'siete',
        input: {
            state: 'hdmi1', 
            label: {
                hdmi1: 'Roku/Cable',
                hdmi2: 'Fire stick'
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
                hdmi1: 'Roku/Cable',
                hdmi2: 'Playstation'
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
      channelSelected: 'siete',
      channels: {
        siete: {
            number: '07',
            label: 'Siete',
            id: 'siete',
            info: '',
            img: '/imgs/home-50.png'
        },
        seis: {
            number: '06',
            label: 'Seis',
            id: 'seis',
            info: '',
            img: '/imgs/back-50.png'
        },
      }
    }
};

