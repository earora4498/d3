import urllib

link = "http://www.microstaffer.com/msnetlogonvalidation.asp?access_key=135&keycode=13736412&login=Login&randkey=13736412"
f = urllib.urlopen(link)
myfile = f.read()
print myfile