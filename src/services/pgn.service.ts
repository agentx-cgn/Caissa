
import { parse, ParseTree } from '@mliebelt/pgn-parser';



import { AppConfig } from '@app/config';
import { IPgnMove, IGameTree, IGameHeader, IPlayTree, IPlayMove } from '@app/domain';
import { ToolsService as Tools }  from './tools.service';
import { H }  from './helper.service';

const DEBUG = true;

const PgnService = {

  hash: (game: ParseTree): string => {

    const unique = JSON.stringify({
      1: game.tags,
      7: game.moves.slice(0, 20),
    });

    return H.hash(unique);

  },

  parseCollection (pgn: string): ParseTree[] {

    const t0 = Date.now();

    const games = parse(pgn, {startRule: "games"}) as ParseTree[];

    DEBUG && console.log('Info   :', 'Parsed', games.length, 'pgns in', Date.now() - t0, 'msecs');

    return games;

  },

  // recursively collects all values from object as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collectValues (obj: any, values: string[] = []): string[] {

    Object.values(obj).forEach( value => {
      if (typeof value === 'object') {
        PgnService.collectValues(value, values);
      } else {
        values.push(String(value));
      }
    });

    return values;

  },

  sanitizeValues (values: string[]): string[] {
    let text = values.join(' ');
    text = text.replace(/undefined/g, '');
    text = text.replace('.', ' ');
    text = text.replace('????', '');
    text = text.replace('???', '');
    text = text.replace(/\s\d{3}\s/, '');
    text = text.replace(/\s\d{2}\s/, '');
    let res = text.split(' ');
    return res.filter(Boolean).filter( s => s.length > 2);
  },

  reducePgn (game: ParseTree): string {

    const pgn: string = game.moves.reduce((acc: string, move: any) => {
      return acc + move.notation.notation + ' ';
    }, '');

    return pgn.trim();

  },

  sanitizeCollection (pgnTrees: ParseTree[]): IGameTree[] {

    return pgnTrees.map( (pgnTree: ParseTree): IGameTree => {
      return PgnService.sanitizeGame(pgnTree);
    });

  },

  enhanceCollection (gameTrees: IGameTree[]): IPlayTree[] {

    return gameTrees.map( (gameTree: IGameTree): IPlayTree => {
      return PgnService.enhanceGame(gameTree);
    });

  },

  enhanceGame (gameTree: IGameTree): IPlayTree {

    return Object.assign({}, gameTree, {
      rivals: { b: '*', w: '*' },    // Could be any,
      ply: 0,                        // TODO: actually last ply
      over: true,                    // collections are always over, but consider for games
      timecontrol: {budget: 0, increment: 0},
    }) as IPlayTree;

  },
  sanitizeGame (game: ParseTree): IGameTree {

      const header: IGameHeader = {
        black:  game.tags?.Black  || 'Black',
        white:  game.tags?.White  || 'White',
        site:   game.tags?.Site   || '',
        result: game.tags?.Result || '?-?',
        event:  game.tags?.Event  || '',
        round:  game.tags?.Round  || '',
        date: (
          game.tags?.EventDate?.value  ? game.tags.EventDate.value :
          game.tags?.Date?.value       ? game.tags.Date.value :
          game.tags?.Date              ? game.tags?.Date      :
          game.tags?.UTCDate           ? game.tags?.UTCDate   :
          '????.??.??'
          ) as string,
        }
      ;
      const pgn    = PgnService.reducePgn(game);
      const values = PgnService.sanitizeValues(PgnService.collectValues(header));
      const unique = JSON.stringify({
        1: values,
        2: pgn,
      });


      const gameTree: IGameTree = {
        pgn,
        header,
        uuid:       H.hash(unique),
        searchtext: values.join(' ').toLowerCase(),
        plycount:   game.moves.length || 0,
        moves:      game.moves as IPgnMove[],
        score:      { maxcp: 0, maxmate: 0 },

      };

      return gameTree;

  },

  processMoves (moves: IPgnMove[]): IPlayMove[] {

    return moves.map( (move: IPgnMove): IPlayMove => {
      return Object.assign({}, move, {
        color: 'w', //move.col,
        san: '', //move.notation.san,
        from: '',
        to: '',
        fen: '',
        ply: 0,
        move: '',
      }) as IPlayMove;
    });

  },


    readGames1 (pgns: string, delimiter='\n', deleteComments=false): IGameTree[] {

        const t0 = Date.now();

        pgns = pgns
            .replace(/\r/g, '')
            .replace(/\t/g, ' ')
        ;

        // let's see who chokes first, also () ...
        deleteComments && ( pgns = pgns.replace(/\s?\{[^}]+\}/g, '') );

        const
            games = [],
            lines = pgns.split(delimiter)
        ;

        let rxp, game = H.clone(AppConfig.templates.game);

        lines.forEach( (line) => {

            line = line.trim();
            rxp  = line.match(/^\[(\w+)\s+"(.*)"\]$/);

            if ( rxp !== null && rxp[1] === 'Event' ){
                // if first dont push
                if (game.header.Event){
                    games.push(game);
                }
                game = H.clone(AppConfig.templates.game);
                game.header[rxp[1]] = rxp[2];

            } else if (rxp !== null) {
                if ( rxp[2] !== ''){
                    game.header[rxp[1]] = rxp[2];
                }

            } else if ( line.length ) {
                game.pgn += ' ' + line;

            }

        });

        // last game
        if (game.header.Event){
            games.push(game);
        }

        DEBUG && console.log('Info   :', 'Parsed', games.length, 'pgns in', Date.now() - t0, 'msecs');

        return games;


    },


    // sanitizeGames1 (games: IGameTree[]): IGameTree[] {

    //   return games.map( game => {

    //     // https://en.wikipedia.org/wiki/Portable_Game_Notation#Tag_pairs

    //     game.uuid  = Tools.Games.hash(game);

    //     DEBUG && console.log(H.shrink(game));
    //     game.date  = (
    //       game.header.Date       ? game.header.Date      :
    //       game.header.EventDate  ? game.header.EventDate :
    //       game.header.UTCDate    ? game.header.UTCDate   :
    //       '????.??.??'
    //     ) as string;

    //     H.each(game.header, (key: string, val) => {
    //       val === undefined && delete game.header[key as keyof IGameHeader];
    //     });

    //     game.searchtext = H.map(game.header, (_, val) => val).join(' ').toLowerCase();

    //     if (!game.pgn) {
    //       // eslint-disable-next-line no-debugger
    //       debugger;
    //     }

    //     return game;

    //   });

    // },

};

export { PgnService };
