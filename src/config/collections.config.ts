
import pgnimport00   from '/assets/games/famous-chess-games.pgn';
import pgnimport01   from '/assets/games/capablanca-best-games.pgn';
import imgLichess    from '/assets/images/lichess.trans.128.png';
import imgFloppy     from '/assets/images/floppy.256.png';

import { TCollectionItem } from '@app/domain';

const CollectionsConfig: TCollectionItem[] = [

  {
      idx:         0,
      key:         'pgnimport00',
      caption:     'Famous Chess Games',
      subline:     'Collection included with Caissa',
      icon:        imgFloppy,
      source:      pgnimport00,
      constructor: 'ImportProvider',
  },
  {
      idx:         1,
      key:         'pgnimport01',
      caption:     'Capablanca\'s Best Games',
      subline:     'José Raúl Capablanca, 1888 – 1942',
      icon:        imgFloppy,
      source:      pgnimport01,
      constructor: 'ImportProvider',
  },
  {
      idx:         2,
      key:         'pgnurl00',
      caption:     'Alekhine\'s Best Games',
      subline:     'Alexander Alekhine, 1882 – 1946',
      icon:        imgLichess,
      source:      '/static/pgn/alekhine-best-games.pgn',
      info:        'https://en.wikipedia.org/wiki/Alexander_Alekhine',
      constructor: 'UrlProvider',
  },
  {
      idx:         3,
      key:         'pgnurl01',
      caption:     'Kateryna Lagno',
      subtext:     'Russian GM, 919 games from 1988-2013',
      icon:        imgLichess,
      source:      '/static/pgn/kateryna-lahno.pgn',
      constructor: 'UrlProvider',
  },
  {
      idx:         4,
      key:         'pgnurl02',
      caption:     'Mikhail Tal',
      subtext:     'Mikhail Tal was a Soviet Latvian chess player and the eighth World Chess Champion. 2431 games from 1952-1982',
      icon:        imgLichess,
      source:      '/static/pgn/tal.pgn',
      constructor: 'UrlProvider',
  },

];

export { CollectionsConfig };
