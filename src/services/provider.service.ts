
// import pgnimport00   from '../../assets/games/famous-chess-games.pgn';
// import pgnimport01   from '../../assets/games/capablanca-best-games.pgn';
// import imgLichess    from '../../assets/images/lichess.trans.128.png';
// import imgFloppy     from '../../assets/images/floppy.256.png';

import { PgnService } from './pgn.service';
import { ICollection, ICollectionProvider, IGameTree } from '@app/domain';
import { CollectionsConfig } from '@app/config';


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


const providers = [] as ICollectionProvider[];


const ImportProvider = function (collection: ICollection): ICollectionProvider {

    const provider = {

        ...collection ,

        error:    '',
        progress: 0,
        games:    [] as IGameTree[],
        header () {
            return `${provider.caption} `;
        },
        fetch () {
            provider.progress = 10;
            return new Promise<void> ((resolve /*, reject */ ) => {
                const parseTree   = PgnService.parseGames(collection.source);
                provider.progress = 60;
                provider.games    = PgnService.processGames(parseTree);
                provider.progress = 0;
                console.log(provider.caption, provider.games.length);
                resolve();
            });
        },
    };

    return provider;
};

const UrlProvider = function (collection: ICollection): ICollectionProvider {

    const provider = {

        ...collection ,

        error:    '',
        progress: 0,
        games:    [] as IGameTree[],
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
                    return PgnService.parseGames(text);
                })
                .then( parseTree => {
                    provider.progress = 70;
                    provider.games = PgnService.processGames(parseTree);
                    console.log(provider.caption, provider.games.length);
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

const ProviderService = {

  collections: CollectionsConfig,

  createProvider (collection: ICollection): ICollectionProvider {

    const provider = (
      collection.provider === 'UrlProvider'    ? UrlProvider(collection)    :
      // collection.provider === 'ImportProvider' ? ImportProvider(collection) :
      ImportProvider(collection)
    );

    providers.push(provider);
    return provider;

  },

  async get ( uuid: string ): Promise<ICollectionProvider | undefined>  {

    let provider = providers.find( p => p.uuid === uuid);

    if (provider) {
      return provider;

    } else {
      const collection = CollectionsConfig.find( c => c.uuid === uuid );
      if (collection) {
        provider = this.createProvider(collection);
        await provider.fetch();
        return provider;
      }

    }

    console.log('ProviderService', `Provider or Collection ${uuid} not found`);

    return undefined;


  },

  find ( fn: (p: ICollectionProvider) => boolean): ICollectionProvider | undefined {
    return providers.find(fn);
  }

};

export { ProviderService };
