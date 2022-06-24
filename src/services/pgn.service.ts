
import { AppConfig } from '@app/config';
import { TGame, TPgnHeader } from '@app/domain';
import { ToolsService as Tools }  from './tools.service';
import { H }  from './helper.service';

const DEBUG = false;

const PgnService = {

    readGames (pgns: string, delimiter='\n', deleteComments=false): TGame[] {

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

        true && console.log('Info   :', 'Parsed', games.length, 'pgns in', Date.now() - t0, 'msecs');

        return games;


    },

    sanitizeGames (games: TGame[]): TGame[] {
      return games.map( game => {

        // https://en.wikipedia.org/wiki/Portable_Game_Notation#Tag_pairs

        game.uuid  = Tools.Games.hash(game);

        DEBUG && console.log(H.shrink(game));
        game.date  = (
          game.header.Date       ? game.header.Date      :
          game.header.EventDate  ? game.header.EventDate :
          game.header.UTCDate    ? game.header.UTCDate   :
          '????.??.??'
        );

        H.map(game.header, (key: string, val) => {
          val === undefined && delete game.header[key as keyof TPgnHeader];
        });

        game.searchtext = H.map(game.header, (_, val) => val).join(' ').toLowerCase();

        if (!game.pgn) {
          // eslint-disable-next-line no-debugger
          debugger;
        }

        return game;

      });
    },

};

export { PgnService };
