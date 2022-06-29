
// import Config  from '../data/config';
// import { H }   from '../services/helper';

import m from 'mithril';
import { IGameTree } from "@app/domain";

const formattools = {

    lineResult(game: IGameTree) {
        let accu = '';
        game.header.result      && (accu += game.header.result + ' ');
        // game.header.Termination && (accu += game.header.Termination + ' ');
        // typeof game.timecontrol === 'object' && (accu += game.timecontrol.caption + ' ');
        // typeof game.header.TimeControl === 'string' && (accu += game.header.TimeControl + ' ');
        return accu;
    },

    titlePlayers (game: IGameTree) {
        return m.trust(game.header.white  + ' -<br>' + game.header.black);
    },

};

export default formattools;
