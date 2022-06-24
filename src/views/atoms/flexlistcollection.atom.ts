
import m from 'mithril';

import { IComponent, TCollectionItem } from '@app/domain';

type TGameEntryAttrs = {
  className?: string;
  style?: string;
  collection: TCollectionItem;
}

const FlexListCollectionAtom: IComponent<TGameEntryAttrs> = {

  view ( vnode ) {

    const { className, style, collection } = vnode.attrs;

    return m('atom-flexlist-collection', { onclick, class: 'sources' }, [

      m('img.source-icon',          {src: collection.icon}),
      m('div.source-caption.f4',          collection.caption),

      collection.subtext
        ? m('div.source-subline.f5', collection.subtext)
        : m('div.source-subline.f5.ellipsis', collection.subline),
      collection.games!.length
        ? m('div.games-loaded', collection.games!.length + ' games loaded')
        : '',
      collection.error
        ? m('div.source-error.f5', collection.error)
        : '',
      collection.progress
        ? m('div.source-progress-on',  {style: `width: ${collection.progress}%;`})
        : m('div.source-progress-off'),

    ]);

  },

};

export { FlexListCollectionAtom };
