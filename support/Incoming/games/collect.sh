wget lichess.org/api/games/user/noiv

wget https://api.chess.com/pub/player/noiv/games/2020/04/pgn
wget https://api.chess.com/pub/player/noiv/games/2020/05/pgn
wget https://api.chess.com/pub/player/noiv/games/2020/06/pgn
wget https://api.chess.com/pub/player/noiv/games/2020/07/pgn

cat noiv pgn pgn.1 pgn.2 pgn.3 > noiv.all.pgn
