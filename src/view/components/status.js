
import Dispatcher from './../globals/dispatcher';

let 
    fl = {
        turn: {c: 'graý', t: 'turn'},
        over: {c: 'graý', t: 'game over'},
        chck: {c: 'graý', t: 'check'},
        mate: {c: 'graý', t: 'checkmate'},
        draw: {c: 'graý', t: 'draw'},
        stal: {c: 'graý', t: 'stalemate'},
        insu: {c: 'graý', t: 'insufficient material'},
        repe: {c: 'graý', t: 'threefold repetition'},
    }
;

Dispatcher.connect({
    name: 'status',
    update (flags) {
        updateFlags(flags);
    },
});

function updateFlags (flags) {
    fl = {
        turn: {c: flags.turn === 'w'            ? '#ddd'    : '#333',        t: 'turn'},
        over: {c: flags.game_over               ? '#cf3c3c' : 'transparent', t: 'game over'},
        chck: {c: flags.in_check                ? '#cf3c3c' : 'transparent', t: 'check'},
        mate: {c: flags.check_mate              ? '#dc780e' : 'transparent', t: 'checkmate'},
        draw: {c: flags.in_draw                 ? '#cf3c3c' : 'transparent', t: 'draw'},
        stal: {c: flags.in_stalemate            ? '#cf3c3c' : 'transparent', t: 'stalemate'},
        insu: {c: flags.insufficient_material   ? '#cf3c3c' : 'transparent', t: 'insufficient material'},
        repe: {c: flags.in_threefold_repetition ? '#cf3c3c' : 'transparent', t: 'threefold repetition'},
    };
}


export default {
    view( /*vnode*/ ) {
        
        const 
            size   = 'width: 24px; height: 24px',
            radius = 'border-radius: 12px'
        ;
        return (
            m('div', 
                {style: 'margin-left: 30rem; margin-top: 6px'}, 
                [
                    m('div.dib.mh1', {title: fl.turn.t, style: `background: ${fl.turn.c}; ${size}; ${radius}`}),
                    m('div.dib.mh1', {title: fl.over.t, style: `background: ${fl.over.c}; ${size}; ${radius}`}),
                    m('div.dib.mh1', {title: fl.chck.t, style: `background: ${fl.chck.c}; ${size}; ${radius}`}),
                    m('div.dib.mh1', {title: fl.mate.t, style: `background: ${fl.mate.c}; ${size}; ${radius}`}),
                    m('div.dib.mh1', {title: fl.draw.t, style: `background: ${fl.draw.c}; ${size}; ${radius}`}),
                    m('div.dib.mh1', {title: fl.stal.t, style: `background: ${fl.stal.c}; ${size}; ${radius}`}),
                    m('div.dib.mh1', {title: fl.insu.t, style: `background: ${fl.insu.c}; ${size}; ${radius}`}),
                    m('div.dib.mh1', {title: fl.repe.t, style: `background: ${fl.repe.c}; ${size}; ${radius}`}),
                ],
            )
        );  

    },
};
