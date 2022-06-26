import m from 'mithril';
import './menu.page.scss';

import { MenuConfig, TMenuEntry } from '@app/config';
import { App } from '@app/views';
import { IEvent, IParams } from '@app/domain';
import { FactoryService } from '@app/services';
import { SectionTitleAtom, SpacerAtom, FlexListAtom, TextLeftAtom, FlexListMenuEntryAtom, NothingAtom} from '@app/atoms';

const onclick  = (route: string, params: IParams) => {
  return route !== 'BACK'
    ? (e: IEvent) => {
      e.redraw = false;
      App.route(route, params);
    }
    : App.onbackormenu
  ;
};

const createMenuEntry = ( [route, label, params, extras]: TMenuEntry) => {
  return m(FlexListMenuEntryAtom, { onclick: onclick(route, params) }, [
    m(TextLeftAtom, [
      extras.img
        ? m('img.menu', { src: extras.img, width: 22, height: 22 })
        : m('i.menu.fa.' + extras.ifa)
      ,
      label,
      m('div.menu.subline', extras.subline),
    ]),
  ]);
};


const MenuPage = FactoryService.create('Menu', {

  view ( vnode ) {

    const { route, className, style, options: { title, description } } = vnode.attrs;

    const menuList  = MenuConfig[route];

    return m('div.page.menu', { className, style },
      m(SectionTitleAtom, { title, description }),
      m(SpacerAtom),
      m(FlexListAtom, [
        ...menuList.map( ( menuEntry: TMenuEntry ) => {
          return createMenuEntry(menuEntry);
        }),
        route !== '/start/'
          ? createMenuEntry(['BACK', 'BACK', {}, {}] as TMenuEntry)
          : m(NothingAtom)
      ]),
    );

  },

});

export { MenuPage };
