
import Caissa     from '../../../caissa';
import DB         from '../../../services/database';
// import { H }      from '../../../services/helper';
import Forms      from '../../../components/forms';
import Tools      from '../../../tools/tools';
import Config     from '../../../data/config';
import Component  from '../../../components/component';

import {
    Nothing,
    Spacer,
    TitleLeft,
    FlexListShrink,
    FixedList,
    FlexListEntry,
    FlexListPlayEntry } from '../../../components/misc';

const forms = {};

Config.playtemplates.forEach( template =>  {

    const group = 'play-' + template.mode;
    const form = {
        group,
        autosubmit: false,
        ...DB.Options[group],
        submit: (form) => {
            let play = Tools.createPlayTemplate(template, form);
            DB.Plays.create(play);
            console.log('plays.form.submitted', play.uuid, play.mode, play.white, play.black);
            Caissa.route('/play/:uuid/', {uuid: play.uuid});
        },
    };

    forms[template.mode] = form;

});

const Plays = Component.create('Plays', {
    view ( vnode ) {

        const { mode } = vnode.attrs;

        return m('div.page.plays', [

            m(TitleLeft, 'Start a new Play'),
            m(FixedList, Config.playtemplates.map( play => {

                const formdata = forms[play.mode];
                const style = mode === play.mode
                    ? {marginBottom: '0px', backgroundColor: '#89b'}
                    : {}
                ;
                const onclick  = mode === play.mode
                    // just toggles
                    ? (e) => {e.redraw = false; Caissa.route('/plays/',       {},                {replace: true});}
                    : (e) => {e.redraw = false; Caissa.route('/plays/:mode/', {mode: play.mode}, {replace: true});}
                ;

                return m('[', [

                    m(FlexListEntry, { onclick,  style }, [
                        m('div.fiom.f4', play.white + ' vs. ' + play.black),
                        m('div.fior.f5', play.subline),
                    ]),

                    play.mode === mode
                        ? m(Forms, {formdata, class: 'play-options', style: 'background-color: #acb5ca'})
                        : m(Nothing),

                ]);

            })),

            m(TitleLeft, 'Resume a Play (' + DB.Games.list.length + ')'),
            m(FlexListShrink, DB.Plays.list.map (play => {
                const onclick = (e) => {e.redraw = false; Caissa.route('/play/:uuid/', {uuid: play.uuid});};
                return m(FlexListPlayEntry, { onclick, play });
            })),

            m(Spacer),
            m('button.pv1.mh3.mv1', {onclick: () => DB.Plays.clear() }, 'DB.Plays.clear()'),
            m('button.pv1.mh3.mv1', {onclick: () => DB.reset()       }, 'DB.reset()'),

        ]);

    },

});

export default Plays;