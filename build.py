import re
r=lambda f:open('src/'+f).read()
s=r('shell.html')
for k,f in [('CHIBI','../chibi.js'),('DATA','data.js'),('ENGINE','engine.js'),('UI1','ui1.js'),('PITCH','pitch.js'),('SCENES','scenes.js'),('UI2','ui2.js'),('LAUNCH','launch.js')]:
    s=s.replace('/*%s*/'%k, open('src/'+f).read() if f!='../chibi.js' else open('chibi.js').read())
open('index.html','w').write(s)
print(len(s))
