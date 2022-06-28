
// import iconChess from '/assets/images/chess.128.trans.png';

// fa: crown horse-head
// chess king  chess-king-piece, queen, bishop, pawn, rook

import { IParams } from '@app/domain';
import { CollectionsConfig } from './collections.config';

type TDeco = {
  ifa?: string;
  img?: string;
  subline: string;
}
type TMenuEntry = [ string, string, IParams, TDeco ];

type TMenuConfig = {
  [key: string]: TMenuEntry[];
}

const MenuConfig: TMenuConfig = {

    '/start/': [

        // route             caption        params
        ['/collections/',          'COLLECTIONS ',       {},             {
            ifa: 'fa-chess',
            subline: 'Collections with remarkable chess games',
        } ],  // loads imported games so far
        ['/openings/',       'OPENINGS',    {},                     {
            // ifa: 'fa-code-branch',
            ifa: 'fa-book',
            subline: 'Explore Chess Openings',
        } ],
        ['/preferences/',    'PREFERENCES', {},                     {
            ifa: 'fa-sliders',
            subline: 'Custumize Caissa to your needs',
        } ],
        ['/system/:module/', 'SYSTEM',      { module: 'system' },   {
            ifa: 'fa-microchip' ,
            subline: 'This is hidden in production',
        } ],
        ['/help/',    'HELP', {},                     {
            ifa: 'fa-info',
            subline: 'You need it',
        } ],

        ['/404/',    '404', {},                     {
            ifa: 'fa-bug',
            // img: iconChess,
            subline: 'Break it',
        } ],
    ],

    '/collections/': CollectionsConfig.map( coll => {
        return [ '/collection/:uuid/', coll.caption, { uuid: coll.uuid }, {
            img: coll.icon,
            subline: coll.subline,
        } ];
    }),


    '/games/': [

        ['/collections/',        'COLLECTIONS', {},                     {
            ifa: 'fa-chess-pawn',
            subline: 'Checkput out games from various collections.',
        } ],
        ['/import/',        'IMPORT', {},                     {
            ifa: 'fa-chess-pawn',
            subline: 'Import games to analyze (*.png).',
        } ],

    ]

        // ['/game/',           'GAME',        {},                     {
        //     ifa: 'fa-cogs',
        //     subline: 'Currently open games',
        // } ],
        // ['/plays/',          'PLAY',        {},                     {
        //     ifa: 'fa-cogs',
        //     subline: 'Start a new game',
        // } ],
        // ['/nothing/',    'NOTHING', {},                     {
        //     ifa: 'fa-cogs',
        //     subline: 'Just a dummy page',
        // } ],
        // ['/analyzer/',       {}, 'ANALYSE'],
        // ['/help/',           {}, 'HELP'],
        // [`/info/${urls[1]}/`,   'INFO'],
        // ['/test',     'TEST'],
};

MenuConfig['/'] = MenuConfig['/start/'];

export { MenuConfig, TMenuEntry };
