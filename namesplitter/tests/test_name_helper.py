from namesplitter.utils import name_helper

def test_two_names():
    assert name_helper.name_splitter('Ethan Hunt') == ['Ethan', 'Hunt']

def test_middle_name():
    assert name_helper.name_splitter('John Charlie Smith') == ['John Charlie', 'Smith']
    assert name_helper.name_splitter('John Charlie Mike Smith') == ['John Charlie Mike', 'Smith']
    
def test_surname_prefixs():
    assert name_helper.name_splitter('John van der Berg') == ['John', 'van der Berg']
    assert name_helper.name_splitter('John Patrick van der Berg') == ['John Patrick', 'van der Berg']

def test_split_name_onename():
    assert name_helper.name_splitter('Smith') == ['', 'Smith']

def test_split_name_nonames():
    assert name_helper.name_splitter('') == ['', '']

