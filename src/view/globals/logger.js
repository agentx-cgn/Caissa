
const abbr = {
    'stockfish':  'FISH',
    'analyzer':   'ANLY',
    'logger':     'LOGG',
    'dispatcher': 'DISP',
};

let 
    cnt = 0,
    list = [

    ]
;

log('logger', 'init: ' + new Date().toLocaleTimeString());

function log (source, line) {
    list.unshift (
        process(source, line),
    );
    cnt += 1;
}

function colorize (line) {
    return (
        line
            .replace(/init/g,     '<strong>init</strong>')
            .replace(/readyok/g,  '<strong class="dark-green">readyok</strong>')
            .replace(/uciok/g,    '<strong class="dark-green">uciok</strong>')
            .replace(/bestmove/g, '<strong class="dark-blue">bestmove</strong>')
            .replace(/ponder/g,   '<strong class="dark-blue">ponder</strong>')
            .replace(/-r>/g,     '<strong class="dark-red">==></strong>')
            .replace(/-g>/g,      '<strong class="dark-green">==></strong>')
    );
}

function process (source, line) {
    return counter() + ' ' + (abbr[source] || '----') + ' - ' + colorize(line);
}

function counter () {
    return ('00000' + cnt).slice(-5);
}

export default {
    list,
    log,
    offset (start=0, length=1000) {
        return list.slice(start, length);
    },

};
