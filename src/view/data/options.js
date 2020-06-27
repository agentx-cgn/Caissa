
export default {

    'uuid': '0',

    'user-data': {
        name: 'noiv',
    },

    'play-h-s': {
        depth: 1,
        timecontrol:  {idx: 0, caption: '10 secs', value: `${ 1*10*1000}|0`},  // idx from Config.timecontrols
        opening:      {idx: 1, label: 'OP01'},
    },

    'play-s-h': {
        depth: 2,
        timecontrol:  {idx: 0, caption: '10 secs', value: `${ 1*10*1000}|0`},  // idx from Config.timecontrols
        opening:      {idx: 2, label: 'OP02'},
    },

    'play-s-s': {
        depth: 3,
        timecontrol:  {idx: 0, caption: '10 secs', value: `${ 1*10*1000}|0`},  // idx from Config.timecontrols
        opening:      {idx: 3, label: 'OP03'},
    },

    'game-evaluator': {
        engine:      'stockfish', // not yet an options
        maxthreads:  2,           //
        maxdepth:    5,          //
        maxsecs:     1.0,         // 0.01 60 secs
        divisor:     2,           // not yet an options
    },

    'board-illustrations' : {
        pinning   : true,
        bestmove  : true,
        lastmove  : true,
        availmoves: true,
        attack    : true,
        valid     : true,
        test      : false,
    },

    'board-decoration': {
        decoration: false,          // a1 - h8
        'light-color': '#789',      // fields light
        'dark-color':  '#987',      //
    },

    ui: {
        waitscreen: true,
    },
    'other' : {
        'ui-collapsed' : {
            'section-left':  false,
        },
    },


};
