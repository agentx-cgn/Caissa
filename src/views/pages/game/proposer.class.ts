import { Pool } from  "../../../extern/pool/index";

const DEBUG = false;

const Proposer = {

    enabled:        false,    // flag
    initialization: Promise.resolve([]),     // or a promise resolving to slots

    start (): Promise<any> {

        Proposer.enabled = true;

        Proposer.initialization = new Promise<any>( resolve => {

            Pool.request('proposer', 1)
                .then( (slots: any) => {
                    resolve(slots);
                    DEBUG && console.log('Proposer.resolved', slots);
                })
            ;

        });

        return Proposer.initialization;

    },

    async stop () {

        Proposer.enabled = false;

        const slots = await Proposer.initialization;

        Pool.release(slots);
        Proposer.initialization = Promise.resolve([]);

        DEBUG && console.log('Proposer.stopped', slots);

    },

    async propose (fen: string, conditions={ depth: 10, maxtime: 1 }): Promise<any> {

        const slots: any[] = await Proposer.initialization;
        const slot  = slots[0];

        await slot.engine.isready();
        await slot.engine.position(fen);

        const result = await slot.engine.go(conditions);

        DEBUG && console.log('Proposer.proposed', result);

        return { bestmove: result.bestmove, ponder: result.ponder };

    },

};

export { Proposer };
