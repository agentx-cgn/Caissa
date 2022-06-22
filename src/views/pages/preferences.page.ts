import m from 'mithril';

import { FactoryService, DatabaseService as DB } from '@app/services';
import { SectionTitleAtom } from '@app/atoms';
import { IPageAttrs } from '@app/domain';

const PreferencesPage = FactoryService.create<IPageAttrs>('Preferences', {

    view ( vnode ) {

        const formgroups = Object.keys(DB.Options.first);

        return m('div.page.options', vnode.attrs, [
            m(SectionTitleAtom, 'Preferences'),
            m('div.viewport-y', [
                //TODO: use formgrous to hide uuid
                ...formgroups.map( formgroup => {
                    const formdata = {
                        group: formgroup,
                        autosubmit: true,
                        ...DB.Options.first[formgroup],
                        submit: () => {
                            delete formdata.group;
                            delete formdata.submit;
                            delete formdata.autosubmit;
                            DB.Options.update('0', {[formgroup]: formdata}, true);
                        },
                    };
                    // return m(Forms, {formdata, noheader: false, className: 'default-options group-' + formgroup});
                }),
            ]),
            m('div.mv1.ph3.w-100.tc.pv2',
                m('button.w-80.pv1', { style: 'border-radius: 15px', onclick: () => DB.reset() },        'Defaults'),
            ),

        ]);
    },

});

export { PreferencesPage};
