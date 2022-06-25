
import pgnimport00   from '/assets/games/famous-chess-games.pgn';
import pgnimport01   from '/assets/games/capablanca-best-games.pgn';
import imgLichess    from '/assets/images/lichess.trans.128.png';
import imgFloppy     from '/assets/images/floppy.256.png';

import { ICollection } from '@app/domain';

const CollectionsConfig: ICollection[] = [

  {
      uuid:        'pgnimport00',
      caption:     'Famous Chess Games',
      subline:     'Collection included with Caissa, 21 games',
      icon:        imgFloppy,
      source:      pgnimport00,
      provider:    'ImportProvider',
  },
  {
      uuid:        'pgnimport01',
      caption:     'Capablanca\'s Best Games',
      subline:     'José Raúl Capablanca (*1888 †1942), 11 games',
      icon:        imgFloppy,
      source:      pgnimport01,
      provider:    'ImportProvider',
  },
  {
      uuid:        'pgnurl00',
      caption:     'Alekhine\'s Best Games',
      subline:     'Alexander Alekhine (*1882 †1946), 10 games',
      icon:        imgLichess,
      source:      '/static/pgn/alekhine-best-games.coll.pgn',
      infolink:    'https://en.wikipedia.org/wiki/Alexander_Alekhine',
      provider:    'UrlProvider',
  },
  {
      uuid:        'pgnurl01',
      caption:     'Mikhail Tal',
      subline:     'Mikhail Tal (*1936 †1992) was a Soviet Latvian chess player and the eighth World Chess Champion. 2431 games from 1952-1982',
      icon:        imgLichess,
      source:      '/static/pgn/mikhail-tal.coll.pgn',
      provider:    'UrlProvider',
  },
  {
      uuid:        'pgnurl02',
      caption:     'Kateryna Lagno',
      subline:     'Russian GM (*1989), 919 games from 1988-2013',
      icon:        imgLichess,
      source:      '/static/pgn/kateryna-lagno.coll.pgn',
      infolink:    'https://en.wikipedia.org/wiki/Kateryna_Lagno',
      provider:    'UrlProvider',
  },

];

export { CollectionsConfig };
