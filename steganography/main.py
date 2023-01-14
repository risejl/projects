import base64
import png

ENDOFMESSAGE = "0100100101010101010101100100111101010010010001010011100101000111010101000101010101010110010101000101010100110000010001100100100001010010010100110100010100111101"
 
def encode_message_as_bytestring(message):
    b64 = message.encode('utf8')
    bytes_ = base64.encodebytes(b64)
    bytestring = ''.join(["{:08b}".format(x) for x in bytes_])
    bytestring += ENDOFMESSAGE
    return bytestring

def get_pixels_from_image(image):
    img = png.Reader(image)
    pixels = img.read()[2]
    return pixels

def encode_pixels_with_message(pixels, bytestring):
    enc_pixels = []
    string_i = 0
    for row in pixels:
        enc_row = []
        for i, char in enumerate(row):
            if string_i >= len(bytestring):
                pixel = row[i]
            else:
                if row[i] % 2 != int(bytestring[string_i]):
                    if row[i] == 0:
                        pixel = 1
                    else:
                        pixel = row[i] - 1
                else:
                    pixel = row[i]
            enc_row.append(pixel)
            string_i += 1
        enc_pixels.append(enc_row)
    return enc_pixels

def write_pixels_to_image(pixels, image):
    png.from_array(pixels, 'RGB').save(image)

def decode_message_from_bytestring(bytestring):
    bytestring = bytestring.split(ENDOFMESSAGE)[0]
    message = int(bytestring, 2).to_bytes(len(bytestring) // 8, byteorder='big')
    message = base64.decodebytes(message).decode('utf8')
    return message

def decode_pixels(pixels):
    bytestring = []
    for row in pixels:
        for c in row:
            bytestring.append(str(c % 2))
    bytestring = ''.join(bytestring)
    message = decode_message_from_bytestring(bytestring)
    return message

PROMPT = '''
It's a basic steganography, choose:
1. To encode a message into an image
2. To decode an image into a message 
q. to quit
'''

def main():
    print(PROMPT)
    user_inp = ''
    while user_inp not in ('1', '2', 'q'):
        user_inp = input('Your choice: ')
    
    if user_inp == '1':
        in_image = input('Enter an existing PNG image filename: ')
        in_message = input('Enter the message to encode: ')
        print('Encoding')
        encoded = encode_pixels_with_message(get_pixels_from_image(in_image), encode_message_as_bytestring(in_message))
        write_pixels_to_image(encoded, in_image + '-encoded.png')

    elif user_inp == '2':
        in_image = input('Enter the image filename to decode: ')
        print('Decoding')
        pixels = get_pixels_from_image(in_image)
        print(decode_pixels(pixels))

if __name__ == '__main__':
    main()
