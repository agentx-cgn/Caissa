import m from 'mithril';

import { ICellContentComponent, IRoutesConfigs } from '@app/domain';
import { LayoutCell, ContentCellBasic, ContentCellBoard } from '@app/cells';
import {
  MenuPage,
  SystemPage,
  ErrorPage,
  PreferencesPage,
  // CollectionsPage,
  HelpPage,
  GamesPage,
  CollectionPage,
  GamePage,
}     from '@app/pages';

const Nothing: ICellContentComponent = {
  view ( ) {
    return m('div.nothing.dn');
  },
};

const RoutesConfig: IRoutesConfigs = {

    // routes must start with '/'
    // Route                Layout  Page              Content          Options (Title)

    '/':                  [ LayoutCell, MenuPage,         ContentCellBoard,   { title: 'Start 1',      description: 'aaa'}      ],
    '/start/':            [ LayoutCell, MenuPage,         ContentCellBoard,   { title: 'Start',        description: 'aab'}        ],
    '/games/':            [ LayoutCell, MenuPage,         ContentCellBoard,   { title: 'Games',        description: 'aac'}        ],
    '/collections/':      [ LayoutCell, MenuPage,         ContentCellBoard,   { title: 'Collections',  description: 'aad'}  ],
    '/collection/:uuid/': [ LayoutCell, CollectionPage,   ContentCellBoard,   { title: 'Collection',   description: 'aae'}  ],
    '/games/:uuid/':      [ LayoutCell, GamesPage,        ContentCellBasic,   { title: 'Games %s',     description: 'aaf'}    ],
    '/game/:ply/:uuid/':  [ LayoutCell, GamePage,         ContentCellBoard,   { title: 'Game %s',      description: '5678'}     ],

    '/preferences/':      [ LayoutCell, PreferencesPage,  ContentCellBasic,   { title: 'Preferences',  description: 'aag'}  ],
    '/help/':             [ LayoutCell, HelpPage,         Nothing,            { title: 'Help',         description: ''}         ],
    '/system/':           [ LayoutCell, SystemPage,       Nothing,            { title: 'System',       description: ''}       ],
    '/system/:module/':   [ LayoutCell, SystemPage,       Nothing,            { title: 'System %s',    description: ''}    ],
    '/:404...':           [ LayoutCell, ErrorPage,        Nothing,            { title: 'Error %s',     description: ''}     ],

    // '/sources/':          [ Layout, Sources,  Board,     { title: 'Sources'}     ],
    // '/games/':            [ Layout, Games,    Board,     { title: 'Games'}       ],
    // '/game/:turn/:uuid/': [ Layout, Game,     Board,     { title: 'Game %s'}     ],
    // '/plays/':            [ Layout, Plays,    Board,     { title: 'Plays'}       ],
    // '/plays/:rivals/':    [ Layout, Plays,    Board,     { title: 'Plays'}       ],

    // https://mithril.js.org/route.html#variadic-routes
    // '/openings/':                               [ Layout, Openings,   Board,     { title: 'Openings'}    ],
    // '/openings/:volume/':                       [ Layout, Volumes,    Board,     { title: 'Openings'}    ],
    // '/openings/:volume/:group/':                [ Layout, Groups,     Board,     { title: 'Openings'}    ],
    // '/openings/:volume/:chapter/':              [ Layout, Chapters,   Board,     { title: 'Openings'}    ],
    // '/openings/:volume/:chapter/:variation':    [ Layout, Variations, Board,     { title: 'Openings'}    ],

    // '/analyzer/:source/': [ Layout, Source,   Analyzer,  { title: 'System %s'}   ],

    // '/analyzer/:fen/':    [ Layout, Game,    Board,    { title: 'Analyzer'}    ],
    // '/game/':             [ Layout, Game,    Board,    { title: 'Games'}       ],
    // '/help/':             [ Layout, Help,    Nothing,  { title: 'Help'}        ],
    // '/help/:url/':        [ Layout, Help,    Nothing,  { title: 'Help'}        ],

};

const DefaultRoute = '/start/';

export {
  DefaultRoute,
  RoutesConfig,
};
