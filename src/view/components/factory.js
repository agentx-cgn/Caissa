
import { H }   from '../services/helper';
import Caissa  from '../caissa';

const DEBUG = false;

const freezer = [];

const Dispatcher = function (source) {

    return {
        send (channel, msg) {
            freezer.forEach( comp => {
                if (comp[channel] && typeof comp[channel] === 'function' && source !== comp.name){
                    DEBUG && console.log('dispatcher.sending', msg, 'to', comp.name, 'from', source, 'over', channel);
                    comp[channel]({ source, msg });
                }
            });
        },
    };

};

const Factory = {
    onresize () {
        freezer.forEach( comp => {
            if (typeof comp['onresize'] === 'function' ){
                comp.onresize(innerWidth, innerHeight);
            }
        });
        Caissa.redraw();
    },
    create (name, comp) {

        //TODO: check for duplicates,
        // make onafterupdates special in dispatcher
        // ensure comps have oncreate, with onafterupdates

        let vnode          = null;
        let preventUpdates = false;

        // before first view
        (typeof comp.onregister === 'function') && comp.onregister(Dispatcher(name));
        (typeof comp.onresize   === 'function') && comp.onresize(innerWidth, innerHeight);

        const ice = Object.assign({
            name,
            onbeforeupdate( /* vnode, old */) {

                // https://mithril.js.org/lifecycle-methods.html#onbeforeupdate
                // The onbeforeupdate(vnode, old) hook is called before a vnode is diffed in a update.
                // If this function is defined and returns false, Mithril prevents a diff from happening to the vnode,
                // and consequently to the vnode's children.

                if (preventUpdates) {
                    DEBUG && console.log('Component.' + name, 'prevented Updates');
                }
                return !preventUpdates;
            },
            get preventUpdates () {
                return preventUpdates;
            },
            set preventUpdates (value) {
                preventUpdates = value;
            },
        }, comp);

        // monkeypatching
        if (ice.oncreate){
            ice.oncreate = function (orgvnode) {
                vnode = orgvnode;
                comp.oncreate(vnode);
            };
        }
        if (ice.onupdate){
            ice.onupdate = function (orgvnode) {
                vnode = orgvnode;
                comp.onupdate(vnode);
            };
        }
        if (ice.onafterupdates){
            ice.onafterupdates = function () {
                if (!vnode) {
                    console.warn('Factory.onafterupdates', 'no vnode');
                    // eslint-disable-next-line no-debugger
                    debugger;
                }
                comp.onafterupdates(vnode);
            };
        }

        freezer.push(H.deepFreezeCreate(ice));

        return ice;

    },
};

export default Factory;
