
import Dispatcher from '../../globals/dispatcher';

const fire = Dispatcher.connect({name: 'analysis-tools'});

function get (line, rex) {
    const res = line.match(rex);
    return res ? res[1] : ''; 
}

function change(what, diff){
    fire('analysis', 'option', [what, diff]);
}

function doShow(what, data) {
    return () => fire('board', 'show', [what, data]);
}

function doMove(data) {
    return () => fire('board', 'move', [data]);
}

function lan2move (lan) {
    return {from: lan.slice(0,2), to: lan.slice(-2) };
}

const tools = {

    parseFen (fen, what) {
        const tokens = fen.split(' ');
        return what === 'turn' ? tokens[1] : console.log('WTF');
    },

    parseInfo (tokens) {
        const 
            info = {},
            line = tokens.join(' '),
            pv       = get(line, /\spv (.*) bmc/),
            depth    = get(line, /depth (.*?) .*/),
            seldepth = get(line, /seldepth (.*?) .*/),
            multipv  = get(line, /multipv (.*?) .*/),
            hashfull = get(line, /hashfull (.*?) .*/),
            score    = get(line, /score (.*?) nodes/),
            nodes    = get(line, /nodes (.*?) .*/),
            cp       = get(line, /cp (.*?) .*/),
            mate     = get(line, /mate (.*?) .*/),
            nps      = get(line, /nps (.*?) .*/),
            time     = get(line, /time (.*?) .*/),
            bmc      = get(line, /bmc (.*?) .*/)
        ;

        if(pv) info.pv = pv;
        if(depth) info.depth = ~~depth;
        if(seldepth) info.seldepth = ~~seldepth;
        if(multipv) info.multipv = ~~multipv;
        if(hashfull) info.hashfull = ~~hashfull;
        if(score) info.score = score;
        if(cp) info.cp = ~~cp;
        if(mate) info.mate = ~~mate;
        if(nodes) info.nodes = ~~nodes;
        if(nps) info.nps = ~~nps;
        if(time) info.time = ~~time;
        if(bmc) info.bmc = parseFloat(bmc);

        return info;

    },

    parseOption (tokens) {
    
        const 
            line    = tokens.join(' '),
            name = get(line, /name (.*?) type/),
            option = {
                name,
                line,
                type : get(line, /type (.*?) .*/),
            },
            def = get(line, /default (.*?) .*/),
            min = get(line, /min (.*?) .*/),
            max = get(line, /max (.*?) .*/)
        ;
    
        if (def){option.default = def;}
        if (min){option.default = min;}
        if (max){option.default = max;}
    
        return [name, option];
    
    },

    processors : {

        id (tokens, state) {
            state.credits = tokens.slice(1).join(' ');
        },

        credits (tokens, state) {
            state.credits = tokens.join(' ');
        },

        bestmove (tokens, state){
            state.bestmove.move   = tokens[0] || '';
            state.bestmove.ponder = tokens[2] || '';
            state.bestmove.score  = tokens[4] || 'none';
            fire('board', 'bestmove', [{
                move:   lan2move(state.bestmove.move), 
                ponder: lan2move(state.bestmove.ponder), 
            }]);
        },

        info (tokens, state){

            const moveinfo = tools.parseInfo(tokens);

            state.info.depth    = moveinfo.depth;
            state.info.multipv  = moveinfo.multipv;
            state.info.nodes    = moveinfo.nodes; 
            state.info.nps      = moveinfo.nps; 
            state.info.hashfull = moveinfo.hashfull; 
            state.info.time     = moveinfo.time; 

            if (moveinfo.cp !== undefined)   state.moves.push(moveinfo);
            if (moveinfo.mate !== undefined) state.mates.push(moveinfo);

            state.moves.sort ( (a, b) => b.cp   - a.cp);
            state.mates.sort ( (a, b) => b.mate - a.mate);

            if (state.moves.length > state.maxpv) {
                state.moves.pop();
            }
            if (state.mates.length > state.maxmate) {
                state.mates.pop();
            }
        },    
    },
    formatters : {
        
        credits (state) {
            const s = state.credits;
            return m('div.ellipsis.eee', [
                m('span.ph1.c167.fw8', 'Credits: '),
                m('span.ph1.eee',  s),
            ]);
        },

        bestmove (state){
            const cm = state.turn === 'b' ? 'c333' : 'ceee';
            const cp = state.turn === 'b' ? 'ceee' : 'c333';

            return m('div.fw4', [
                m('span.ph1.c167.fw8',   'Best:'),
                m(`span.ph1.${cm}`,  state.bestmove.move),
                m('span.ph1.c167.fw8',   'ponder'),
                m(`span.ph1.${cp}`,  state.bestmove.ponder),
            ]);
        },

        move (state, num) {
            const info = state.moves[num];
            const col  = state.turn === 'w' ? 'ceee' : 'c333';
            return !info ? null : 
                m('div', [    
                    m('span.ph1.c167', 'cp:'),
                    m(`span.ph1.${col}`,  info.mate || info.cp),
                    m('span.ph1.c167', 'line:'),
                    m('span.ph1',  tools.formatters.pv(state, info.pv)),
                ]);
        },

        mate (state, num) {
            const info = state.mates[num];
            return !info ? null : 
                m('div', [    
                    m('span.ph1.c167', 'mate:'),
                    m('span.ph1.c333',  info.mate),
                    // m('span.ph1.c167', 'depth:'),
                    // m('span.ph1.c333',  info.depth),
                    m('span.ph1.c167', 'line:'),
                    m('span.ph1',  tools.formatters.pv(state, info.pv)),
                ]);
        },

        fen (state) {
            const col = state.turn === 'w' ? 'ceee' : 'c333';
            return m('div.ellipsis.eee', [    
                m('span.ph1.c167.fw8', 'Fen:'),
                m(`span.ph1.${col}.fnm`, state.fen),
            ]);
        },

        pv (state, pv='') {
            const fen = state.fen;
            const turn = tools.parseFen(fen, 'turn');
            const moves = idx => pv.split(' ').slice(0, idx+1);
            return pv.split(' ').map( (move, idx) => {
                const col = (
                    (idx%2 === 0) && turn === 'w' ? 'eee' :
                    (idx%2 === 1) && turn === 'w' ? 'c333' :
                    (idx%2 === 0) && turn === 'b' ? 'c333' :
                    (idx%2 === 1) && turn === 'b' ? 'eee' :
                    console.log('WTF', 'turn', turn, 'idx', idx, 'fen', fen)
                );
                return m(`span.ph1.${col}.pointer`, {
                    onclick:      doMove(moves(idx)),
                    onmouseover:  doShow('moves', moves(idx)), 
                    onmouseleave: doShow('fen', fen),
                }, move);
            });

        },

        info (state) {
            const col = status.turn === 'w' ? 'ceee' : 'c333';
            return m('div.ellipsis.eee', [

                m('span.ph1.c167.fw8', 'Depth: '),
                m(`span.ph1.${'cfff66f'}.fw8.f3.lh1.pointer`, {onclick: () => change('depth', -1)}, '-'),
                m(`span.ph1.${'cfff66f'}.fw8`, state.info.depth),
                m(`span.ph1.${'cfff66f'}.fw8.f3.lh1.v-mid.pointer`, {onclick: () => change('depth', +1)}, '+'),

                m('span.ph1.c167.fw8', 'Multi: '),
                m(`span.ph1.${'cfff66f'}.fw8.f3.lh1.pointer`, {onclick: () => change('multipv', -1)}, '-'),
                m(`span.ph1.${'cfff66f'}.fw8`, state.info.multipv),
                m(`span.ph1.${'cfff66f'}.fw8.f3.lh1.v-mid.pointer`, {onclick: () => change('multipv', +1)}, '+'),

                m('span.ph1.c167.fw8', 'Nodes: '),
                m(`span.ph1.${col}`, state.info.nodes),
                m('span.ph1.c167.fw8', 'Nps: '),
                m(`span.ph1.${col}`, state.info.nps),
                m('span.ph1.c167.fw8', 'Hash: '),
                m(`span.ph1.${col}`, (state.info.hashfull || '0') + '‰'),
                m('span.ph1.c167.fw8', 'Time: '),
                m(`span.ph1.${col}`, (Math.round(state.info.time / 100) || '0')/10 + ' secs'),

            ]);
        },

        // id (tokens) {
        //     return m('div.pl1.fw8', tokens.slice(1).join(' '));
        // },
        // readyok (tokens){
        //     return m('div.pl1.fw8.dark-green', 'ready ' + tokens.join(' '));
        // },
        // uciok (){
        //     return m('div.pl1.fw8.dark-green', 'uciok');
        // },
        // Legal (tokens) {
        //     return m('div.pl1.fw8.dark-green', 'moves: ' + tokens(2));
        // },


    },
    
};

export default tools;
