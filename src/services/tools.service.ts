
// import board     from './tools/board-tools';
import game      from './tools/game-tools';
// import global    from './tools/global-tools';
import format    from './tools/format-tools';
import board    from './tools/board-tools';

const ToolsService = {
    Games:  { ...game   },
    Board:  { ...board  },
    Format: { ...format },
};

export { ToolsService };
