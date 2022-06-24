
// import pgnimport00   from '../../assets/games/famous-chess-games.pgn';
// import pgnimport01   from '../../assets/games/capablanca-best-games.pgn';
// import imgLichess    from '../../assets/images/lichess.trans.128.png';
// import imgFloppy     from '../../assets/images/floppy.256.png';

import { PgnService } from './pgn.service';
import { TGame, TCollectionItem } from '@app/domain';

/*

Providers: Allows access to a list of games, a collection. The provider knows
how to fetch or import the list of games and generate a games-list ready to display.

This games-list is cached in the database. The provider is responsible for
fetching the list of games from the source and generating the games-list.

After the user clicks on a collection the provider gives feedback about errros,
loading status (percentage), and amount of games.

Each provider of a collection has an index, so once the collection is loaded,
the UI can route to '/games/<index>'

Games are always pgn files and the provider also parses them into moves

*/


// function genProviderList (templates) {

//     const params = {
//         user  : DB.Options.first['user-data'].name,
//         month : ('00' + ((new Date()).getUTCMonth() +1)).slice(-2),
//         year  : (new Date()).getUTCFullYear(),
//     };

//     return templates.map( tpl => tpl.constructor(tpl, params));

// }

// let providerList = [];

// const Providers = {
//     list () {
//         if (!providerList.length) {
//             providerList = genProviderList(Collections);
//         }
//         return providerList;
//     },
//     find (filter) {
//         return Providers.list().find(filter);

//     },
//     filter (filter) {
//         return Providers.list().filter(filter);
//     },
// };

// Also needed if changes, think APIs
// providers.list = genProviderList(Collections);
// console.log(providers);



const ImportProvider = function (collection: TCollectionItem) {

    const provider = {

        ...collection ,

        error:    '',
        progress: 0,
        games:    [] as TGame[],
        header () {
            return `${provider.caption} `;
        },
        fetch () {
            provider.progress = 10;
            return new Promise<void> ((resolve /*, reject */ ) => {
                provider.games    = PgnService.readGames(collection.source);
                provider.progress = 60;
                provider.games    = PgnService.sanitizeGames(provider.games);
                provider.progress = 0;
                resolve();
            });
        },
    };

    return provider;
};

const UrlProvider = function (collection: TCollectionItem) {

    const provider = {

        ...collection ,

        error:    '',
        progress: 0,
        games:    [] as TGame[],
        header () {
            return `${provider.games.length} downloaded Games`;
        },
        fetch () {
            provider.progress = 10;
            return fetch(provider.source)
                .then( (result) => {
                    if (!result.ok) {
                        throw(result.status + ' - ' + result.statusText);
                    }
                    provider.progress = 30;
                    return result.text();
                })
                .then( text => {
                    provider.progress = 50;
                    return PgnService.readGames(text);
                })
                .then( games => {
                    provider.progress = 70;
                    provider.games = PgnService.sanitizeGames(games);
                })
                .then( () => {
                    provider.progress = 0;
                })
                .catch( e => {
                    provider.progress = 0;
                    provider.error = String(e);
                })
            ;
        },
    };

    return provider;

};

export { ImportProvider, UrlProvider };
