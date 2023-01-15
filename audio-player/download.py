import requests

MUSIC_URL = 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Oddio_Overplay/MIT_Concert_Choir/Carmina_Burana/MIT_Concert_Choir_-_01_-_O_Fortuna.mp3'

response = requests.get(MUSIC_URL)
with open('music.mp3', 'wb') as f:
    f.write(response.content)
