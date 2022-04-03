import {COLOR} from './../extern/cm-chessboard/Chessboard';
import CFG from './config';

export default {
    chess: {
        pgn:        '',
        fen:        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        curMove:    0,
    },
    analysis: {
        status:     '',
        depth:      CFG.analysis.depth,
        maxpv:      CFG.analysis.maxpv,
        maxmate:    CFG.analysis.maxmate,
        multipv:    CFG.analysis.multipv,
        fen:        '', //rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        turn:       '',
        credits:    '',
        info:       {depth: '', nps: '', status: '', hash: 0, time: 0, nodes: 0 },
        bestmove:   {move: '-', ponder: '-'},
        options:    {},
        lines:      [],
        moves:      [
            // {score: '', depth: '', moves: []},
        ],
        mates:      [
            // {score: '', depth: '', moves: []},
        ],
        last:       {line: ''},
    },
    stockfish : {
        debug: false,
    },
    dispatcher: {
        counter: 0,
    },
    games : {
        value: null,
    },
    game : {
        listMoves : [],
        htmlMoves : [],
        pointer   : 'w0',
    },
    board: {
        fen: '',
        pgn: '',
        orientation: COLOR.white,
        bestmove: {move: {from: '', to: ''}, ponder: {from: '', to: ''}},
        marker : {
            valid:  false,
            attack: false,
        },
        arrows: {
            pinned: false,
            bestmove: true,
            test:   false,
            best:   true,
            last:   true,
        },
    },


};
