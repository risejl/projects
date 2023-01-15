from audioplayer import AudioPlayer
import time

MAIN_MESSAGE = '''
+: Increase volume
-: Decrease volume
c: Change playing speed
space: play/pause music 
s: Stop playing
l: Loop playing
b: Block playing when thread ends
'''

def show_status(player):
    print(f'the current state: {player.state}')
    print(f'the current playing speed: {player.speed}')
    print(MAIN_MESSAGE)

def main():
    player = AudioPlayer('music.mp3')
    player.play()
    show_status(player)

    while True:
        choice = input('Enter your choice: ')
        if choice == '+':
            player.volume(player.volume * 1.1)
        elif choice == '-':
            player.volume(player.volume * 0.9)
        elif choice == 'c':
            speed = input('Enter speed to change: ')
            player.speed = speed
        elif choice == ' ':
            if player.play():
                player.pause()
            else:
                player.resume()
        elif choice == 's':
            player.stop()
        elif choice == 'l':
            player.play(loop=True)
        elif choice == 'b':
            player.play(block=True)
        show_status(player)

main()
