import { IRoutesConfigs } from '@app/domain';

import { LayoutCell as Layout } from '@app/views';
import { NothingAtom } from '@app/atoms';
import { ContentCell } from '@app/cells';
import { PreferencesPage, SystemPage, HelpPage, ErrorPage, MenuPage, NothingPage }     from '@app/pages';

const RoutesConfig: IRoutesConfigs = {

    // routes must start with '/'
    // Route                Layout  Page     Content      Options (Title)
    '/':                  [ Layout, MenuPage,     ContentCell,     { title: 'Menu 1'}      ],
    '/menu/':             [ Layout, MenuPage,     ContentCell,     { title: 'Menu 2'}      ],
    // '/sources/':          [ Layout, Sources,  Board,     { title: 'Sources'}     ],
    // '/games/':            [ Layout, Games,    Board,     { title: 'Games'}       ],
    // '/games/:idx/':       [ Layout, Games,    Board,     { title: 'Games %s'}    ],
    // '/game/:turn/:uuid/': [ Layout, Game,     Board,     { title: 'Game %s'}     ],
    // '/plays/':            [ Layout, Plays,    Board,     { title: 'Plays'}       ],
    // '/plays/:rivals/':    [ Layout, Plays,    Board,     { title: 'Plays'}       ],
    '/preferences/':      [ Layout, PreferencesPage,  ContentCell, { title: 'Preferences'} ],

    // https://mithril.js.org/route.html#variadic-routes
    // '/openings/':                               [ Layout, Openings,   Board,     { title: 'Openings'}    ],
    // '/openings/:volume/':                       [ Layout, Volumes,    Board,     { title: 'Openings'}    ],
    // '/openings/:volume/:group/':                [ Layout, Groups,     Board,     { title: 'Openings'}    ],
    // '/openings/:volume/:chapter/':              [ Layout, Chapters,   Board,     { title: 'Openings'}    ],
    // '/openings/:volume/:chapter/:variation':    [ Layout, Variations, Board,     { title: 'Openings'}    ],

    '/nothing/':          [ Layout, NothingPage,  NothingAtom,   { title: 'Help'}      ],
    '/help/':             [ Layout, HelpPage,     NothingAtom,   { title: 'Help'}      ],
    '/system/':           [ Layout, SystemPage,   NothingAtom,   { title: 'System'}      ],
    '/system/:module/':   [ Layout, SystemPage,   NothingAtom,   { title: 'System %s'}   ],
    '/:404...':           [ Layout, ErrorPage,    NothingAtom,   { title: 'Error %s'}    ],

    // '/analyzer/:source/': [ Layout, Source,   Analyzer,  { title: 'System %s'}   ],

    // '/analyzer/:fen/':    [ Layout, Game,    Board,    { title: 'Analyzer'}    ],
    // '/game/':             [ Layout, Game,    Board,    { title: 'Games'}       ],
    // '/help/':             [ Layout, Help,    Nothing,  { title: 'Help'}        ],
    // '/help/:url/':        [ Layout, Help,    Nothing,  { title: 'Help'}        ],

};

const DefaultRoute = '/menu/';

export {
  DefaultRoute,
  RoutesConfig,
};
