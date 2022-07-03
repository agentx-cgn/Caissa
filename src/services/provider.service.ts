
import { PgnService } from './pgn.service';
import { ICollection, ICollectionProvider, IPlayTree } from '@app/domain';
import { CollectionsConfig } from '@app/config';

const DEBUG = false;

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

const providers = [] as ICollectionProvider[];

const ImportProvider = function (cfgCollection: ICollection): ICollectionProvider {

  const provider = {

    ...cfgCollection ,

    error:      '',
    progress:   0,
    collection: [] as IPlayTree[],
    header () {
      return `${provider.caption} `;
    },
    fetch () {
      provider.progress = 10;
      return new Promise<void> ((resolve /*, reject */ ) => {
        const parseTrees    = PgnService.parseCollection(cfgCollection.source);
        provider.progress   = 60;
        const gameTrees     = PgnService.sanitizeCollection(parseTrees);
        provider.progress   = 70;
        const playTrees     = PgnService.enhanceCollection(gameTrees);
        provider.collection = playTrees;
        provider.progress   = 70;
        DEBUG && console.log(provider.caption, provider.collection.length);
        resolve();
      });
    },
  };

  return provider;
};

const UrlProvider = function (cfgCollection: ICollection): ICollectionProvider {

  const provider = {

    ...cfgCollection ,

    error:       '',
    progress:    0,
    collection:  [] as IPlayTree[],
    header () {
      return `${provider.collection.length} downloaded Games`;
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
          return PgnService.parseCollection(text);
        })
        .then( parseTrees => {
          provider.progress = 70;
          return PgnService.sanitizeCollection(parseTrees);
        })
        .then( gameTrees => {
          provider.progress = 90;
          const playTrees = PgnService.enhanceCollection(gameTrees);
          provider.collection = playTrees;
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

  createProvider (cfgCollection: ICollection): ICollectionProvider {

    const provider = (
      cfgCollection.provider === 'UrlProvider'    ? UrlProvider(cfgCollection)    :
      // collection.provider === 'ImportProvider' ? ImportProvider(collection) :
      ImportProvider(cfgCollection)
    );

    providers.push(provider);
    return provider;

  },

  async get ( uuid: string ): Promise<ICollectionProvider | undefined>  {

    let provider = providers.find( p => p.uuid === uuid);

    if (provider) {
      return provider;

    } else {
      const cfgCollection = CollectionsConfig.find( c => c.uuid === uuid );
      if (cfgCollection) {
        provider = this.createProvider(cfgCollection);
        await provider.fetch();
        return provider;
      }

    }

    // console.log('ProviderService', `Provider or Collection ${uuid} not found`);

    return undefined;


  },

  find ( fn: (p: ICollectionProvider) => boolean): ICollectionProvider | undefined {
    return providers.find(fn);
  }

};

export { ProviderService };
