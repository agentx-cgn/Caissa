
// import board     from './tools/board-tools';
import game      from './tools/game-tools';
// import global    from './tools/global-tools';
import format    from './tools/format-tools';

const ToolsService = {
    Games:  { ...game   },
    // Board:  { ...board  },
    Format: { ...format },
};

export { ToolsService };
