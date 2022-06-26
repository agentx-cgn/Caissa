
import m from 'mithril';
import './flexlistprovider.cell.scss';

import { ICollectionProvider, IEvent, ICellComponent, ICellAttrs } from '@app/domain';
import { App } from '@app/views';

interface IAttrs extends ICellAttrs {
  provider: ICollectionProvider;
}

const FlexListProviderCell: ICellComponent<IAttrs> = {

  view ( vnode ) {

    const { className, style, provider } = vnode.attrs;

    const onclick = async (e: IEvent) => {
      e.redraw = false;
      if (!provider.games.length){
          await provider.fetch();
          if (!provider.error){
              App.route('/games/:uuid/', {uuid: provider.uuid});
          }
      } else {
          App.route('/games/:uuid/', {uuid: provider.uuid});
      }
    };

    return m('cell-flexlist-provider', { onclick, class: 'sources' }, [

      m('img.source-icon',          {src: provider.icon}),
      m('div.source-caption.f4',          provider.caption),

      provider.subline
        ? m('div.source-subline.f5', provider.subline)
        : m('div.source-subline.f5.ellipsis', provider.subline),
      provider.games!.length
        ? m('div.games-loaded', provider.games!.length + ' games loaded')
        : '',
      provider.error
        ? m('div.source-error.f5', provider.error)
        : '',
      provider.progress
        ? m('div.source-progress-on',  { style: `width: ${provider.progress}%;` })
        : m('div.source-progress-off'),

    ]);

  },

};

export { FlexListProviderCell };
