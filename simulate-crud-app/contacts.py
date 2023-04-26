def add_contact(name, number):
    is_user_exist = get_contact(name)
    if is_user_exist:
        return False
    else:
        line = name + ' ' + number + '\n'
        with open('contacts.txt', 'a') as f:
            f.write(line)
        return True

def get_contact(name):
    with open('contacts.txt', 'r') as f:
        for line in f:
            if name == line.split()[0]:
                number = line.split()[1]
                return number
        return False

def update_contact(name, number):
    is_user_exist = get_contact(name)
    if is_user_exist:
        delete_contact(name)
        with open('contacts.txt', 'a') as f:
            f.write(name + ' ' + number + '\n')
            return True
    else:
        return False

def delete_contact(name):
    is_user_exist = get_contact(name)
    if is_user_exist:
        with open('contacts.txt', 'r') as f:
            lines = f.readlines()
        with open('contacts.txt', 'w') as f:
            for line in lines:
                if line.split()[0] != name:
                    f.write(line)
                    return True
    else: 
        return False

