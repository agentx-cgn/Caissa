import m from 'mithril';

import { IRoutesConfigs, IComponent } from '@app/domain';
import { LayoutCell, ContentCell } from '@app/cells';
import {
  MenuPage,
  SystemPage,
  ErrorPage,
  PreferencesPage,
  CollectionsPage,
  HelpPage,
  GamesPage,
}     from '@app/pages';

const Nothing: IComponent = {
  view ( ) {
    return m('div.nothing.dn');
  },
};

const RoutesConfig: IRoutesConfigs = {

    // routes must start with '/'
    // Route                Layout  Page              Content          Options (Title)

    '/':                  [ LayoutCell, MenuPage,         ContentCell,   { title: 'Start 1',      description: ''}      ],
    '/start/':            [ LayoutCell, MenuPage,         ContentCell,   { title: 'Start',        description: ''}        ],
    '/games/':            [ LayoutCell, MenuPage,         ContentCell,   { title: 'Games',        description: ''}        ],
    '/collections/':      [ LayoutCell, CollectionsPage,  ContentCell,   { title: 'Collections',  description: ''}  ],
    '/games/:uuid/':      [ LayoutCell, GamesPage,        ContentCell,   { title: 'Games %s',     description: ''}    ],
    '/preferences/':      [ LayoutCell, PreferencesPage,  ContentCell,   { title: 'Preferences',  description: ''}  ],
    '/help/':             [ LayoutCell, HelpPage,         Nothing,       { title: 'Help',         description: ''}         ],
    '/system/':           [ LayoutCell, SystemPage,       Nothing,       { title: 'System',       description: ''}       ],
    '/system/:module/':   [ LayoutCell, SystemPage,       Nothing,       { title: 'System %s',    description: ''}    ],
    '/:404...':           [ LayoutCell, ErrorPage,        Nothing,       { title: 'Error %s',     description: ''}     ],

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
