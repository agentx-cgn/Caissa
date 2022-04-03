#!/opt/homebrew/bin/python3.9

import sys, os.path
from datetime import datetime 

print(sys.version)

start_month = 1
start_year  = 2020
end_month   = datetime.now().month
end_year    = datetime.now().year  

def months(start_month, start_year, end_month, end_year):
    return (((m_y % 12) + 1, int(m_y / 12)) for m_y in
            range(12 * start_year + start_month - 1, 12 * end_year + end_month))

          
print(list(months(start_month, start_year, end_month, end_year)))

exit()

# To save to a relative path.
r = requests.get(url)  
with open('folder1/folder2/file_name.pdf', 'wb') as f:
    f.write(r.content)



if os.path.isfile('filename.txt'):
    print ("File exist")
else:
    print ("File not exist")










"""

wget lichess.org/api/games/user/noiv

wget https://api.chess.com/pub/player/noiv/games/2020/04/pgn
wget https://api.chess.com/pub/player/noiv/games/2020/05/pgn
wget https://api.chess.com/pub/player/noiv/games/2020/06/pgn
wget https://api.chess.com/pub/player/noiv/games/2020/07/pgn

cat noiv pgn pgn.1 pgn.2 pgn.3 > noiv.all.pgn

"""