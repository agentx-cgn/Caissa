
import './system.page.scss';

import m from 'mithril';
import { IComponent, IEvent, IPageAttrs } from '@app/domain';

import { App } from '@app/views';
import { AppConfig } from '@app/config';
import { FactoryService, SystemService, DatabaseService as DB, LoggerService } from '../../services';
import { FlexListAtom, JsonAtom, TOptions } from '@app/atoms';

let search   = '';
// const jsonEcos = ecos.tree;

const Json: IComponent<{ tree: object, options?: TOptions}> =  {
  view ( {attrs : { tree } } ) {
    return m('div.w-100.viewport-y.h-100.bg-ccc', [
      m('div.fior.pv2', { class: 'json-tree'}, [
        m(JsonAtom, { tree, options: { collapseAfter: 1 } }),
      ]),
    ]);
  },
};


const Logs = {
  view (/*vnode*/) {
    return m(FlexListAtom, [
        m('system-filter',
          m('input[type=text].w-100.bg-eee.ph2.pv1', {
            style: 'border: 0',
            oninput: (e: IEvent) => search = (e.target as HTMLInputElement)?.value + '',
            value: search,
            placeholder: 'type to filter',
          }),
        ),
        m('pre.pl3.viewport-xy.f7.bg-ccc.h-100.pt2', [
          m.trust(LoggerService.search(search).slice(0, 1000).join('<br/>')),
        ]),
      ]);
  },
};

const SystemPage = FactoryService.create<IPageAttrs>('System', {

  view ( vnode ) {

    const { params: { module }, className, style } = vnode.attrs;

    const Module = (
      module === 'config' ? m(Json, {tree: AppConfig}) :
      module === 'system' ? m(Json, {tree: SystemService}) :
      // module === 'ecos'   ? m(Json, {tree: jsonEcos})   :
      module === 'db'     ? m(Json, {tree: DB.all()})   :
      m(Logs)
    );

    const clicker = (module: string) => (e: IEvent) => {
      e.redraw = false;
      // replace here, bc can't animate between same page
      App.route('/system/:module/', { module }, {replace: false});
    };

    return m('div.page.system', { className, style }, [
      m('div.systemmenu.w-100.btb20', [
        m('ul.flex.flex-row.ml2.white',
          'System Config DB Logs'.split(' ').map( (mod: string) => {
              return m('li.ph2.pv1.f4.list.pointer', { onclick: clicker(mod.toLowerCase()) }, mod);
          }),
        ),
      ]),
      Module,
    ]);

  },

});

export { SystemPage };
