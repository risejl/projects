import base64
import png

MAIN_MESSAGE = """
#######################################
A Steganography Program
You can perform the following operations:
    1.Encryption: 
    2.Decryption:
    q.Quit
#######################################
"""


ENDOFMESSAGE = '0100100101010101010101100100111101010010010001010011100101000111010101000101010101010110010101000101010100110000010001100100100001010010010100110100010100111101'

def encode_message(string):
    string_bytes = string.encode('ascii')
    base64_bytes = base64.b64encode(string_bytes)
    binary_string = ''.join(['{:08b}'.format(x) for x in base64_bytes])
    binary_string += ENDOFMESSAGE
    return binary_string

def get_pixels_from_image(file_name):
    img = png.Reader(file_name).read()
    pixels = img[2]
    return pixels

def encode_pixels_with_message(pixels, byte_string):
    encode_pixels = []
    string_i = 0
    for row in pixels: 
        encode_row = []
        for i, char in enumerate(row):
            if string_i >= len(byte_string):
                pixel = row[i]
            else:
                if row[i] % 2 != int(byte_string[string_i]):
                    if row[i] == 0:
                        pixel = 1
                    else: 
                        pixel = row[i] - 1
                else:
                    pixel = row[i]
            encode_row.append(pixel)
            string_i += 1
        encode_pixels.append(encode_row)
    return encode_pixels

def write_pixels_to_image(pixels, file_name):
    image = png.from_array(pixels, 'RGB').save(file_name)
    return 

def decode_message(byte_string):
    byte_string = byte_string.split(ENDOFMESSAGE)[0]
    message = int(byte_string, 2).to_bytes(len(byte_string) // 8, byteorder='big')
    message = base64.b64decode(message)
    message = message.decode('ascii')
    return message

def decode_pixels(pixels):
    byte_string = []
    for row in pixels:
        for char in row:
            byte_string.append(str(char % 2))
    byte_string = ''.join(byte_string)
    message = decode_message(byte_string)
    return message

def main():
    while True:
        print(MAIN_MESSAGE)
        choice = input('Enter your choice: ')
        if choice == 'q':
            break
        elif choice == '1':
            message = input('Enter the message you want to encrypt: ')
            binary_string = encode_message(message)
            file_name = input('Enter the existing image file name to encrypt (with extension name): ')
            pixels = get_pixels_from_image(file_name)
            print('Encrypt: ---------------------------------------')
            encoded_pixels = encode_pixels_with_message(pixels, binary_string)
            write_pixels_to_image(encoded_pixels, f'./encoded_{file_name}') 
            print('Encrypt success!')
        elif choice == '2':
            file_name = input('Enter the existing image file name to decrypt (with extension name): ')
            pixels = get_pixels_from_image(file_name)
            message = decode_pixels(pixels)
            print('Decrypt: ---------------------------------------')
            print(f'decrypted message: {message}')
        else:
            print('Unsupported choice! Please check your entering.')
    
if __name__ == "__main__":
    main()
