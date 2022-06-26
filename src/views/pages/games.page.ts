
import m from 'mithril';

import { IPageData, IParams, TGame } from '@app/domain';
import { FactoryService, ProviderService }  from '@app/services';
import { YScrollAtom, SectionTitleAtom, FlexListHeaderAtom, FlexListAtom } from '@app/atoms';

// import { ListFilter, FlexListEntry, PageTitle } from '../../components/misc';

const DEBUG = true;

// const read  = H.interprete;
// let filter  = '';

const GamesPage = FactoryService.create('Games', {

  async onmatch (route: string, params: IParams, data: IPageData): Promise<boolean> {

    console.log('GamesPage.onmatch', route, params);

    Object.assign(data, { test3: 'test3' });

    await ProviderService.get(params.uuid as string);

    return Promise.resolve(true);

  },

  async oninit ( vnode ) {

    const { params: { uuid } } = vnode.attrs;
    // const provider = ProviderService.find( (p: ICollectionProvider) => p.uuid === uuid );

    const provider = await ProviderService.get(uuid as string);

    if (provider) {
      Object.assign(vnode.state, { provider });

    } else {
      DEBUG && console.log('Games.oninit.provider not found', uuid);

    }

  },

    view ( vnode ) {

        const { params: { uuid }, className, style, options: { title, description } } = vnode.attrs;

        console.log(vnode.state.data);

        const provider = ProviderService.find( p => p.uuid === uuid );

        if (!provider) {

          return m('div.page.games', { className, style }, [
            m(SectionTitleAtom, { title, description } ),
            m(FlexListHeaderAtom, `No gmaes found for '${uuid}'` ),
          ]);

          // return m('div.page.games', { className, style }, m(FlexListEntryAtom, [

          //   m('img.source-icon',         { src: provider.icon } ),
          //   m('div.source-caption.f4',          provider.caption),
          //   m('div.source-subline.f5.ellipsis', provider.subline),

          //   provider.games.length
          //       ? m('div.games-loaded', provider.games.length + ' games loaded')
          //       : '',
          //   provider.error
          //       ? m('div.source-error.f5.mv1', provider.error)
          //       : '',
          //   provider.progress
          //       ? m('div.source-progress-on',  {style: `width: ${provider.progress}%;`})
          //       : m('div.source-progress-off'),

          // ]));

          // From here there is a provider + games to filter
          } else {

              // const games = provider.games.filter( (game: any) => {
              //     return filter.length
              //         ?  game.searchtext.includes(filter)
              //         :  true;
              // });

            return m('div.page.games', { className, style }, [

              m(SectionTitleAtom, { title, description } ),
              m(FlexListHeaderAtom, `lore ipsum dolor sit amet, consectetur adipiscing elit.` ),
              m(YScrollAtom,
                m(FlexListAtom, [
                  ...provider.games.map( ( game: TGame ) => {
                    return m('div', game.header.White);
                  } ),
                ])
              )
            ]);

                  // m(PageTitle, filter.length
                  //     ? read(provider.header) + `[${games.length}/${provider.games.length}]`
                  //     : read(provider.header) + `[${provider.games.length}]`,
                  // ),

                  // m(ListFilter, { oninput : (e) => {
                  //     filter = e.target.value.toLowerCase();},
                  // }),

                  // m(GamesList, { games }),

              // );

        }

    },

});

export { GamesPage };
