
import iconChess from '/assets/images/chess.128.trans.png';

import { IParams } from '@app/domain';

type TDeco = {
    ifa?: string;
    img?: string;
    subline: string;
}
type TMenuEntry = [ string, string, IParams, TDeco ];

const MenuConfig: TMenuEntry[] = [
    // route             caption        params
    // ['/sources/',        'COLLECTIONS', {},                     {
    //     ifa: 'fa-chess-pawn',
    //     subline: 'Checkput out games from various collections.',
    // } ],
    // ['/games/',          'GAMES',       { idx: 0 },             {
    //     ifa: 'fa-cogs',
    //     subline: 'All games from a collection',
    // } ],  // loads imported games so far
    // ['/game/',           'GAME',        {},                     {
    //     ifa: 'fa-cogs',
    //     subline: 'Currently open games',
    // } ],
    // ['/plays/',          'PLAY',        {},                     {
    //     ifa: 'fa-cogs',
    //     subline: 'Start a new game',
    // } ],
    // ['/openings/',       'OPENINGS',    {},                     {
    //     ifa: 'fa-cogs',
    //     subline: 'Explore Chess Openings',
    // } ],
    ['/system/:module/', 'SYSTEM',      { module: 'system' },   {
        ifa: 'fa-microchip' ,
        subline: 'This is hidden in production',
    } ],
    ['/preferences/',    'PREFERENCES', {},                     {
        ifa: 'fa-cogs',
        subline: 'Custumize Caissa to your needs',
    } ],
    ['/nothing/',    'NOTHING', {},                     {
        ifa: 'fa-cogs',
        subline: 'Just a dummy page',
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

    // ['/analyzer/',       {}, 'ANALYSE'],
    // ['/help/',           {}, 'HELP'],

    // [`/info/${urls[1]}/`,   'INFO'],
    // ['/test',     'TEST'],
];

export { MenuConfig, TMenuEntry };
