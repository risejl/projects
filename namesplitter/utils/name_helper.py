def name_splitter(name):
    names = name.split(' ')
    
    if name == '':
        return ['', '']
    elif len(names) == 1:
        return ['', name]
    elif len(names) == 2:
        first_name, last_name = name.split(' ')
        return [first_name, last_name]
    else:
        return name_splitter_three_plus(names)

def name_splitter_three_plus(names):
    first_names = []
    last_names = []

    for i, name in enumerate(names):
        if i == len(names) - 1:
            last_names.append(name)
        elif name[0].islower():
            last_names.extend(names[i:])
            break
        else:
            first_names.append(name)

    first_name = ' '.join(first_names)
    last_name = ' '.join(last_names)
    return [first_name, last_name]
