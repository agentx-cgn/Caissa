import { Chess, Move } from 'chess.js';

import { TGame, TMove, TOpponent } from '@app/domain';
import { AppConfig } from '@app/config';
import { H, $ }   from './../helper.service';
import { DatabaseService as DB}          from './../database/database.service';
import { globaltools } from './global-tools';

const gametools = {

    pgnFromMoves (game: TGame, turn: number) {
        const chess = new Chess();
        const moves = game.moves;
        const last  = turn === undefined ? moves.length -1 : turn;
        for (let i=0; i<=last; i++){
            chess.move(moves[i]);
        }
        return chess.pgn().trim();
    },



    // used for terminated games
    hash (game: TGame) {
        const unique = JSON.stringify({
            1: game.header.White,
            2: game.header.Black,
            3: game.header.Event,
            4: game.header.Site,
            5: game.header.Date,
            6: game.header.Result,
            7: game.pgn.slice(0, 20),
        });
        return H.hash(unique);
    },

    fen (game: TGame): string {
      const turn = game.turn;
      return (
        turn === -2      ? AppConfig.fens.empty    :
        turn === -1      ? AppConfig.fens.start    :
          game.moves[turn].fen
      );
    },

    captured (game: TGame): { black: string[] , white: string[] } {

        const fen = gametools.fen(game);

        if (fen === AppConfig.fens.empty) {
            return { black: 'lwtnjo'.split(''), white: 'lwtnjo'.split('') };

        } else if (fen === AppConfig.fens.start) {
            return { black: [], white: [] };

        } else {
            const pieces = AppConfig.pieces.fens.sorted;
            const sorter = (a: string, b: string) => {
                return (
                    pieces.indexOf(a.toLowerCase()) -
                    pieces.indexOf(b.toLowerCase())
                );
            };

            let black = AppConfig.pieces.fens.black;
            let white = AppConfig.pieces.fens.white;

            fen.split(' ')[0].split('').forEach(letter => {
                black = black.replace(letter, '');
                white = white.replace(letter, '');
            });

            const blackPieces = black.split('').sort(sorter); // .map( letter => AppConfig.pieces.font[letter] );
            const whitePieces = white.split('').sort(sorter); // .map( letter => AppConfig.pieces.font[letter] );

            return { black: blackPieces, white: whitePieces };
        }

    },

    scrollTurnIntoView (turn: number, msecs=60) {
        setTimeout( () => {

            const selectorElem = 'td[data-turn="' + turn + '"]';
            const selectorView = 'div.gm-moves';
            const isVisible    = H.isVisibleInView($(selectorElem), $(selectorView));

            if (!selectorElem || !selectorView) {
                console.warn('scrollIntoView', selectorElem, selectorView);
            }

            if ( !isVisible && $(selectorElem) ){
                $(selectorElem)!.scrollIntoView(true);
            }

        }, msecs);
    },

    timeLine(game: TGame) {
        let accu = '';
        game.date
            ? (accu += game.date)
            : game.timestamp
                //TODO: make this locale
                ? (accu += H.date2isoUtc(new Date(game.timestamp)))
                : void(0)
        ;
        return accu;
    },

    resolvePlayers (game: TGame) {

        const opponents = AppConfig.opponents;
        const username = DB.Options.first['user-data'].name;

        const w = game.rivals[0] as TOpponent;
        const b = game.rivals[2] as TOpponent;

        return {
            white: opponents[w] === 'Human' ? username : opponents[w],
            black: opponents[b] === 'Human' ? username : opponents[b],
        };

    },

    fromPlayForm (playtemplate: TGame, formdata: any) {

        const { white, black } = gametools.resolvePlayers(playtemplate);

        const play = H.clone(AppConfig.templates.game, playtemplate, formdata, {
            difficulty: globaltools.resolveDifficulty(formdata.depth),
        });

        play.header.White = white;
        play.header.Black = black;
        play.over  = false;
        play.moves = Array.from(play.moves);

        delete play.autosubmit;
        delete play.group;
        delete play.submit;

        console.log('Tools.fromPlayForm', play);

        return play;

    },

    // generates full list of moves in game
    updateMoves (game: TGame) {

        if (game.pgn === '') {
            game.moves    = [];
            game.plycount = 0;
            return;
        }

        const chess  = new Chess();
        const chess1 = new Chess();
        !chess.load_pgn(game.pgn) && console.warn('gametools.updateMoves.failed', game.pgn);

        chess.history({verbose: true})
            .map( (move: Move, idx: number) => {
                chess1.move(move);
                game.moves.push(Object.assign({}, move , {
                    fen: chess1.fen(),
                    turn: idx,
                }) as TMove);
            })
        ;
        game.plycount = game.moves.length;

    },



    randomFEN() {

        function shuffle (a: string[]): string[] {
            for (let i = a.length - 1; i > 0; i--) {
              let j = Math.floor(Math.random() * (i + 1));
              [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
          };

        let board = [] as string[][];
        for (let x = 0; x < 8; x++) board.push('. . . . . . . .'.split(' '));

        function getRandPos(): [number, number] {
          return [Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
        }

        function isOccupied(pos: [number, number]): boolean {
          return board[pos[0]][pos[1]] != '.';
        }

        function isAdjacent(pos1: [number, number], pos2: [number, number]) {
          if (pos1[0] == pos2[0] || pos1[0] == pos2[0]-1 || pos1[0] == pos2[0]+1)
          if (pos1[1] == pos2[1] || pos1[1] == pos2[1]-1 || pos1[1] == pos2[1]+1)
            return true;
          return false;
        }

        // place kings
        let wk, bk;
        do { wk = getRandPos(); bk = getRandPos(); }
        while (isAdjacent(wk, bk));
        board[wk[0]][wk[1]] = 'K';
        board[bk[0]][bk[1]] = 'k';

        // get peaces
        let peaces = [] as string[];
        let names = 'PRNBQ';
        function pick() {
          for (let x = 1; x < Math.floor(Math.random() * 32); x++)
            peaces.push(names[Math.floor(Math.random() * names.length)]);
        }
        pick();
        names = names.toLowerCase();
        pick();
        shuffle(peaces);

        // place peaces
        while (peaces.length > 0) {
          let p = peaces.shift(), pos;
          // paws: cannot be placed in bottom or top row
          if (p == 'p' || p == 'P')
            do { pos = getRandPos(); }
            while (isOccupied(pos) || pos[0] == 0 || pos[0] == 7);
          // everything else
          else do { pos = getRandPos(); } while (isOccupied(pos));
          board[pos[0]][pos[1]] = p || '?';
        }

        // write FEN
        let fen = [];
        for (let x = 0; x < board.length; x++) {
          let str ='', buf = 0;
          for (let y = 0; y < board[x].length; y++)
            if (board[x][y] == '.') buf++;
            else {
              if (buf > 0) { str += buf; buf = 0; }
              str += board[x][y];
            }
          if (buf > 0) str += buf;
          fen.push(str);
        }
        const res = fen.join('/') + ' w - - 0 1';
        // console.table(board); // for demonstrating purpose
        return res;
      }

};

export default gametools;
