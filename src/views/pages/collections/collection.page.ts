
import m from 'mithril';
import './collection.page.scss';

import { IEvent, IGameTree, IPageData, IParams } from '@app/domain';
import { App } from '@app/views';
import { FactoryService, ProviderService }  from '@app/services';
import { YScrollAtom, SectionTitleAtom, FlexListHeaderAtom, FlexListAtom, FlexListLinkAtom, FlexListInputTextAtom } from '@app/atoms';
import { CollectionCell } from './collection.cell';


const DEBUG = false;

// const read  = H.interprete;
// let filter  = '';

let searchtext = '';


const CollectionPage = FactoryService.create('Games', {

  async onmatch (route: string, params: IParams, data: IPageData): Promise<unknown> {

    // console.log('CollectionPage.onmatch', route, params);

    Object.assign(data, { test3: 'test3' });

    return ProviderService.get(params.uuid as string);

    // return Promise.resolve(true);

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

        // console.log(vnode.state.data);

        const provider = ProviderService.find( p => p.uuid === uuid );

        if (!provider) {

          return m('div.page.collection', { className, style }, [
            m(SectionTitleAtom, { title, description } ),
            m(FlexListHeaderAtom, `No games found for '${uuid}'` ),
            m(FlexListLinkAtom, { route: '', params: {} }, 'This is a Link' ),
          ]);

          // return m('div.page.games', { className, style }, m(FlexListEntryAtom, [

          //   m('img.source-icon',         { src: provider.icon } ),
          //   m('div.source-caption.f4',          provider.caption),
          //   m('div.source-subline.f5.ellipsis', provider.subline),

          //   provider.collection.length
          //       ? m('div.games-loaded', provider.collection.length + ' games loaded')
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

              // const games = provider.collection.filter( (game: any) => {
              //     return filter.length
              //         ?  game.searchtext.includes(filter)
              //         :  true;
              // });


            return m('div.page.collection', { className, style }, [


              m(SectionTitleAtom, { title, description } ),
              m(FlexListHeaderAtom, `lore ipsum dolor sit amet, consectetur adipiscing elit.` ),
              m(FlexListLinkAtom, { route: '/collection/:uuid/', params: { uuid: 'pgnimport01'} }, 'Link: pgnimport01' ),
              m(FlexListLinkAtom, { route: '/collection/:uuid/', params: { uuid: 'pgnimport02'} }, 'Link: pgnimport02' ),
              m(FlexListInputTextAtom, { onChange: (e: IEvent) => {
                searchtext = (String(e.value) || '' ).toLowerCase();
                m.redraw();
                console.log(e.value);
              } }),
              m(YScrollAtom,
                m(FlexListAtom,
                  m(CollectionCell, { className, style, provider, searchtext })
                )
              )
            ]);


                //   [
                //   ...provider.collection.map( ( game: IGameTree ) => {
                //     return m('div.white', {onclick: (e: IEvent) => {

                //       e.redraw = false;
                //       App.route('/game/:turn/:uuid/', { uuid: game.uuid, turn: game.moves.length -1 });

                //     }}, game.tags?.White);
                //   } ),
                // ])
            //   )
            // ]);

                  // m(PageTitle, filter.length
                  //     ? read(provider.header) + `[${games.length}/${provider.collection.length}]`
                  //     : read(provider.header) + `[${provider.collection.length}]`,
                  // ),

                  // m(ListFilter, { oninput : (e) => {
                  //     filter = e.target.value.toLowerCase();},
                  // }),

                  // m(GamesList, { games }),

              // );

        }

    },

});

export { CollectionPage };
