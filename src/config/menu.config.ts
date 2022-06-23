
import iconChess from '/assets/images/chess.128.trans.png';

import { IParams } from '@app/domain';

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
        ['/games/',          'GAMES',       {},             {
            ifa: 'fa-cogs',
            subline: 'All games from a collection',
        } ],  // loads imported games so far
        ['/openings/',       'OPENINGS',    {},                     {
            ifa: 'fa-cogs',
            subline: 'Explore Chess Openings',
        } ],
        ['/preferences/',    'PREFERENCES', {},                     {
            ifa: 'fa-cogs',
            subline: 'Custumize Caissa to your needs',
        } ],
        ['/system/:module/', 'SYSTEM',      { module: 'system' },   {
            ifa: 'fa-microchip' ,
            subline: 'This is hidden in production',
        } ],
        ['/help/',    'HELP', {},                     {
            ifa: 'fa-cogs',
            subline: 'You need it',
        } ],

        ['/404/',    '404', {},                     {
            // ifa: 'fa-cogs',
            img: iconChess,
            subline: 'Break it',
        } ],
    ],

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

export { MenuConfig, TMenuEntry };
