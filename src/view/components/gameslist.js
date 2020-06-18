
import Caissa       from '../caissa';
import DB           from '../services/database';
import Factory      from './factory';
import { FlexList } from './misc';
import Tools        from '../tools/tools';
import Config       from '../data/config';
import { H }        from '../services/helper';

const GamesList = Factory.create('GamesList', {
    view ( vnode ) {
        return m(FlexList, {class: 'games-list'},
            vnode.attrs.games.map( game => m(GameEntry, { game, onclick: (e) => {
                e.redraw = false;
                const fullgame = H.create({},
                    Config.templates.game,
                    game,
                    { moves: Tools.games.pgn2moves(game.pgn) },
                );
                DB.Games.create(fullgame, true);
                Caissa.route('/game/:turn/:uuid/', { uuid: fullgame.uuid, turn: fullgame.moves.length -1 });
            }})),
        );
    },
});

// STR (Seven Tag Roster)
// white:      'White',        // name of white player
// black:      'Black',        // name of black player
// event:      '',
// date:       '',
// site:       '',
// round:      '',
// result:     '',

const GameEntry = Factory.create('GameEntry', {
    view ( vnode ) {

        const { game, onclick } = vnode.attrs;

        let line1 = `${game.white} - ${game.black}`;
        let line2 = `${game.date} ${game.site} ${game.event}`;
        let line3 = '';

        game.result      && (line3 += `<b>${game.result}</b>` + ' ');
        game.termination && (line3 += game.termination + ' ');
        game.timecontrol && (line3 += game.timecontrol + ' ');

        if (line3.length < 18) {
            line2 = line3 + ' ' + line2;
            line3 = '';
        }

        return m('div.game-entry', { onclick }, [
            m('div.game-line1.f4', line1 ),
            m('div.game-line2.f5.ellipsis', m.trust(line2)),
            line3
                ? m('div.game-line3.f5.ellipsis', m.trust(line3))
                : '',
        ]);

    },

});

export default GamesList;
