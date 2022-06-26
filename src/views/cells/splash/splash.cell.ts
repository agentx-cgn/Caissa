import m from 'mithril';
import './splash.cell.scss';
import opera_gif from '/assets/pictures/opera.game.small.gif';

import { ICellComponent } from '@app/domain';
import { IFormValues } from './../form/form.cell';
import { package_json as pjson } from '@app/config';
import { App } from '@app/views';
import { DatabaseService as DB } from '@app/services';
import { ButtonGroup, SectionTitleAtom, FlexListTextAtom, FlexListAtom, YScrollAtom, FlexListHeaderAtom, FlexListEntryAtom, AtomButton } from '@app/atoms';

import { FormCell } from '../form/form.cell';


export const SplashCell: ICellComponent = {

  view ( vnode ) {

    const { className, style } = vnode.attrs;
    const version    = `${pjson.name} / ${pjson.version} / ${DB.scheme}`;
    const values = {
      showsplash: !DB.Options.first.ui.waitscreen,
      username:   DB.Options.first.user.name,
    };
    const onsubmit = (values: IFormValues) => {
      DB.Options.update('0', {
        ui:   { waitscreen: !values.showsplash },
        user: { name:        values.username }
      }, true);
    };

    return m('cell-splash', { className, style }, [

      m(SectionTitleAtom, { title: 'Welcome', description: '' }),
      m(FlexListHeaderAtom, `${pjson.name} - ${pjson.description}`),

      m(YScrollAtom, [
        m(FlexListAtom, [

          m(FormCell, {
            onsubmit,
            onchange: ( values ) => { console.log('splash.change', values); },
            values,
            fields: [
              { name: 'username',   type: 'textfield',  label: 'Please provide a user name' },
              { name: 'showsplash', type: 'checkbox',   label: 'Do not how again' },
              { name: 'submit',     type: 'submit',     label: 'Start' },
            ],
          }),

          m(FlexListEntryAtom, { style: 'padding: 0' },
            m('img', { src: opera_gif, alt: 'The Opera Game', title: 'The Opera Game', width: '100%' })
          ),
          m(FlexListTextAtom, 'Morphy - Brunswick, Isoard, Paris 02.11.1858'),

          m(FlexListEntryAtom,
            m(ButtonGroup, [
              m(AtomButton, {
                label: 'Reload',
                events: { onclick: () => location.reload() },
              }),
              m(AtomButton, {
                label: 'Reset',
                events: { onclick: DB.reset },
              }),
              m(AtomButton, {
                label: 'DB.dump()',
                events: { onclick: App.dumpDB },
              }),

            ]),
          ),

        ])


      ]),

      m(FlexListTextAtom, { style: 'font-size: 12px; color: #666' }, version),

    ]);

  },

};
