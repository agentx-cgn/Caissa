import m from 'mithril';

import { IDefComponent, IEvent, IParams } from '@app/domain';
import { H, $ } from '@app/services';
import { App } from '@app/views';
import { DefaultRoute } from '@app/config';

import { BackdropCell } from '../backdrop.cell';

const NavigationCell: IDefComponent =  {

  view ( vnode ) {

    const { route } = vnode.attrs;

    // const navi     = PagesConfig[route].navi;
    const clicker  = (route: string, params: IParams ) => {
      return (e: IEvent) => {
        e.redraw = false;
        BackdropCell.hide();
        ($('#toggle-mobile-menu') as HTMLInputElement).checked = false;
        App.route(route, params);
        return H.eat(e);
      };
    };

    const onmenu = (e: IEvent) => {
      e.redraw = false;
      App.route(DefaultRoute);
    };

      return m('nav', [

        // hamburger
        // m('label', {for:'toggle-mobile-menu', 'aria-label':'Menu'},
        m('label', {'aria-label':'Menu', onclick: onmenu},
          m('i.hamburger.fa.fa-bars '),
          m('span.home.f4.fiom.white.pl3', 'Caissa'),
        ),

        // toggle, needs id for label
        m('input[type=checkbox]', {id: 'toggle-mobile-menu', oninput: (e: IEvent) => {
          e.redraw = false;
          if ((e.target as HTMLInputElement).checked) {
            BackdropCell.show( () => {
              ($('#toggle-mobile-menu') as HTMLInputElement).checked = false;
            });
          }
        }}),

          // m('ul', Array.from(MenuConfig[route]).map( ([route, entry, params]) => {
          //   return m('li', {
          //     onclick: clicker(route, params),
          //     class: route.startsWith('navi') ? 'selected' : 'unselected'}, entry)
          //   ;
          // })),
              // m('li.unselected', m('a.link', {target:'_blank', href: 'https://github.com/agentx-cgn/caissa'}, 'SOURCE')),
              // m('li.unselected', m('a.link', {target:'_blank', href: 'https://caissa.js.org/'}, 'LIVE')),

          // ]),

      ]);
  },

};

export { NavigationCell };
