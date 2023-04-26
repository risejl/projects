import contacts
from os import system 

def prompt_add_contact():
    name = input('Enter username: ')
    number = input('Enter user telephone number: ')
    added = contacts.add_contact(name, number)
    if added:
        print(f'Successful added {name} and {number}')
    else:
        print('User already exists!')

def prompt_get_contact():
    name = input('Enter username: ')
    is_exist =  contacts.get_contact(name)
    if is_exist:
        print(f'Username {name} and number {is_exist}')
    else:
        print('No such user!')

def prompt_update_contact():
    name = input('Enter username: ')
    number = input('Enter user telephone number: ')
    is_updated = contacts.update_contact(name, number)
    if is_updated:
        print('Username and telephone updated!')
    else:
        print('No such user to update!')

def prompt_delete_contact():
    name = input('Enter username: ')
    is_deleted = contacts.delete_contact(name)
    if is_deleted:
        print('User deleted!')
    else:
        print('No such user to delete!')

MAIN_MESSAGE = '''
-----------------------------------
Please choose your operation:
1.add a user 
2.get a user
3.update a user
4.delete a user
----------------------------------
'''

def main(): 
    print(MAIN_MESSAGE)
    choice = input('Enter your choice: ').strip()
    if choice == '1':
        prompt_add_contact()
    elif choice == '2':
        prompt_get_contact()
    elif choice == '3':
        prompt_update_contact()
    elif choice == '4':
        prompt_delete_contact()
    else:
        print('Enter again: ')

while True:
    system('clear')
    main()
    input('Press enter to continue: ')

