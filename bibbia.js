var Bib= new function(){	 
var that=this
var BOOKS={'1tim':'1tm','dan':'dn','gen':'gn','ml':'mal','mat':'mt','num':'nm','prv':'pro','rm':'rom','rt':'rut','zac':'zc'}
var CLEAN=new RegExp('([^ <]*)<([^>]*)>','g')
var FBrkl=''
var FStat
var FHide
var NOTES=new RegExp('{ *([^}]*) *}','g')
var abs=Math.abs, log=Math.log, exp=Math.exp, pow=Math.pow, round=Math.round, sqrt=Math.sqrt, floor=Math.floor
var L2=log(2)
var Body,Num=[],Status,Stdout,Stats
var NN=0
function Log(s) {
	var o=document.createElement('p')
	o.innerHTML=s
	Body.appendChild(o)
}
function changeValue(id,prop,chg) {
	var o=document.getElementById(id)
	var p=o.style[prop]
	p=p.replace(/(^[0-9]*)(.*)/,
		function(s,n,u) {
			n=Math.round(Number(n)*chg)
			return n+u
		})
	o.style[prop]=p
}
function cycleValue(o,values) {
	var i=values.indexOf(o.value)+1
	if(i>=values.length)i=0
	o.value=values[i]
}
function debug(err) {
	alert(err
				+'\nline '+err.lineNumber
				+'\ncol. '+err.columnNumber
				+'\nfile '+err.fileName )
}
function Display(id) {
	var node=document.getElementById(id)
	var stack=[]
	function set(s) {
		if(s.constructor==Array) s=s.join(' ')
		node.innerHTML=s
	}
	function push(s) {
		stack.push(node.innerHTML)
		set(s)
	}
	function pop() {
		node.innerHTML=stack.pop()
	}
	this.set=set
	this.push=push
	this.pop=pop
}
function find(txt,i,j,hint) {
	// return: x where ol=txt[x]
	//					 and 1000*l[0]+l[1]=i
	// hint: startpoint for search
	//			 eg. result of previous search
	var a,b,l,n
	n=txt.length
	for(a=hint,b=a+1;
		a>=0||b<n;
		a--,b++) {
		if(a>=0 && a<n){
			l=txt[a]
			if(l && l[0]==i) return a
		}
		if(b>=0 && b<n){
			l=txt[b]
			if(l && l[0]==i) return b
		}
	}
	return -1
}
function fixForm(o) {
	var S=document.getElementById('S')
	var SR=document.getElementById('SR')
	var SN=document.getElementById('SN')
	var SS=document.getElementById('SS')
	var FS=document.getElementById('FS')
	var ST=document.getElementById('ST')
	var STH=document.getElementById('STH')
	S.value=SR.value+SN.value+SS.value
	FS.value=Body.style.fontSize
	STH.value=ST.value
}
function hili(t) {
	var a,i,on=0
	a=document.getElementsByTagName('a')
	for(i=0;i<a.length;i++) {
		if(String(a[i].onclick).search(t.replace(/'/g,"\\\\'"))>=0) {
			if(a[i].style.backgroundColor!='yellow') {
				a[i].style.backgroundColor='yellow'
				on=1
			}
			else {
				a[i].style.backgroundColor=null
			}
		}
	}
	a=Bib.Q.value
	if(on) {
		if(a) a+='&'+t
		else a=t
	}else{
		a=a.replace(t,'').replace(/\&\&/g,'\&').replace(/^\&/,'')
	}
	Bib.Q.value=a
}
function jsonpget(src,ret) {
	var jsonp=document.createElement('script')
	var t
	function Bib_ret(x) {
		function cont(){
			Status.set(src+'.')
			ret(x)
		}
		jsonp.parentNode.removeChild(jsonp)
		t=setTimeout(cont,10)
		Status.set(src+'..')
	}
	Bib.ret=Bib_ret
	jsonp.src=src
	document.getElementsByTagName('head')[0].appendChild(jsonp)
	Status.set(src+'...')
}
function load(book,ver,ret) {
	// ret( [[chap,vers,txt], ...])
	// load 'ver/book.txt' or 'notes/book.html'
	// return: [[chap,vers,txt],...]
	var b,src
	ver=truevers(ver)
	b=book.toLowerCase()
	if(b in BOOKS) b=BOOKS[b]
	if(b=='') ret([])
	src=ver+"/"+b+".js"
	jsonpget(src,ret)
}
function main() {
	// get elements //
	Body=document.getElementsByTagName('body')[0]
	Bib.Q=document.getElementById('Q')
	Bib.R=document.getElementById('R')
	var RS=document.getElementById('RS')
	var SN=document.getElementById('SN')
	var SR=document.getElementById('SR')
	var SS=document.getElementById('SS')
	var SH=document.getElementById('SH')
	Status=new Display('Status')
	Status.set('>')
	Stdout=document.getElementById('Stdout')
	Stats=document.getElementById('Stats')
	Bib.V=document.getElementById('V')
	var VS=document.getElementById('VS')
	var S=document.getElementById('S')
	var Stat=document.getElementById('Stat')
	var ST=document.getElementById('ST')
	// init from url parameters //
	var s=location.search.substr(1).split('&')
	var buf,i,q,r,t,v
	for(i in s) {
		t=s[i].split('=')
		if(t[0]=='r')
			Bib.R.value=urldecode(t[1])
		else if(t[0]=='q') {
			Bib.Q.value=urldecode(t[1]/*
				).replace(/&#257;/g,'ā'
				).replace(/&#275;/g,'ē'
				).replace(/&#259;/g,'ă'
				).replace(/&#333;/g,'ō'
				).replace(/&#346;/g,'Ś'
				).replace(/&#377;/g,'Ź'*/
				)
		}
		else if(t[0]=='v')
			Bib.V.value=urldecode(t[1])
		else if(t[0]=='s') {
			v=urldecode(t[1])
		}
		else if(t[0]=='w') Body.style.width=t[1]
		else if(t[0]=='fs')
			Body.style.fontSize=t[1]+'pt'
		else if(t[0]=='stat')
			Stat.value=urldecode(t[1])
		else if(t[0]=='st')
			ST.value=urldecode(t[1])
	}
	r=Bib.R.value
	q=Bib.Q.value
  //if (!v) {if (q || !r) v='=3l'; else v='-0l'}
  if (!v) {v='=3l';}
  S.value=v
  SR.value=v[0]
  SN.value=v[1]
  SS.value=v[2]
	v=Bib.V.value
	if(r.length==0||v.length==0) return
	r=r.replace(/&nbsp;|ï¿½/g,' '
    ).replace(/\[([^\]]*)\]/g,function(match,p1,offset,string){
      return p1.replace(/ /g,'_') + '_ ' + p1.replace(/[:\[\]]/g,'')
    }).replace(/{([^}]*)}/g,function(match,p1,offset,string){return p1.replace(/ /g,'_') + '_ '}
		).replace(/, +/g,','
		).replace(/;/g,' ; '
		).replace(/ +/g,' '
		).replace(/^ | $/g,''
    )
  //alert(r)
	r=r.split(' ')
	Vers=v.split(',')
	if(q) {
		nq=[]; pq=[] // neg/pos query
		q=q.replace(/!/g,'&!').split(/[&+]/ )
		for(i=0;i<q.length;i++) {
			if(q[i]=='') continue
			if (q[i][0]=="!") neg=1; else neg=0
			s=q[i].substr(neg).replace(
					/^ | $/g,'\\b').replace(
					/ /g,'[ .,;:?\'«»"!-]+').replace(
					/\//g,'|')
			if(s=='') t=''
			else if(q[i].search(/[A-Z]/)<0) t='gi'
			else t='g'
			if (neg) nq.push(new RegExp(s,t))
			else pq.push(new RegExp(s,t))
		}
	}else {pq=nq=null;}
	for(i=0; i<Vers.length; i++) Num.push({"":0})
	Show(r,pq,nq,Stat.value)
}
function Print(buf,format) {
	vers = Vers.slice()
  if(truevers(Vers[0])=='notes')
  {vers.push(vers.shift())}
  vers = vers.join(',')
	FHide=format.indexOf('X')+1
	var FBook=format.indexOf('3')+1
	var FChap=format.indexOf('2')+1+FBook
	var FVers=format.indexOf('1')+1+FChap
	var FPar =format.indexOf('p')+1
	var FSup =format.indexOf('^')+1
	var FLink=format.indexOf('l')+1
	var FBold=format.indexOf('b')+1
	var FItal=format.indexOf('i')+1
	FBrkl=''
	if(format.indexOf('=')>=0)	FBrkl=1
	var cl='',i,j,o,t,a,b,c,u,v,n
	function count(str,word,root){
		Num[j-1]['']++
		if(root in Num[j-1]) Num[j-1][root]++
		else Num[j-1][root]=1
		return
	}
	function count_replace(str,word,root){
		Num[j-1]['']++
		if(root in Num[j-1]) Num[j-1][root]++
		else Num[j-1][root]=1
		return '<a href="#" onclick="if(Bib.Q.value)Bib.Q.value+=\'|\';Bib.Q.value+=\'&lt;'+root.replace(/'/g,"\\'")+'&gt;\';return false">'+word+'</a>'
	}
	for(i=0;i<buf.length;i++) {
		o=buf[i]
		// o: [book index cv0 txt0 cv1 txt1 ...]
		if(o.constructor==Array) {
			if(FHide) {
				for(j=1;2*j<o.length;j++) {
					o[j+j+1].replace(CLEAN,count)
				}
				continue
			}
			n=0
			a=document.createElement('span')
			for(j=1;j+j<o.length;j++) {
				if(o[j+j]!=n) {
					t=''; n=o[j+j]
					c=Math.floor(n/1000);
					v=(n%1000); u=(v%1)*100+.5
					v=Math.floor(v)
					if(u>=1) {
						v=v+String.fromCharCode(Math.floor(u)+96)
					}
					if(FBook && j==1)t+=o[0]+' '
					if(FChap||FVers) {
						if(FChap||(FVers&&v==1)||j>1) t+=c+','
						if(FVers||j>1)t+=v
					}
					cl='ublue '
					if(FPar){t=' ['+t+'] ';cl=''}
					if(FSup){t=' <sup>'+t+'</sup> ';cl=''}
					if(FItal){t=' <i>'+t+'</i> ';cl=''}
					if(FBold){t=' <b>'+t+'</b> ';cl=''}
					if(cl){
						t='<a class="'+cl
							+'" onclick="if(Bib.R.value)Bib.R.value+=\' \';Bib.R.value+=\''+t+'\';">'+t+'</a> '
					}else{
						t='<span>'+t+'</span> '
					}
					b=document.createElement('span')
					b.innerHTML=t
					a.appendChild(b)
				}
				t=document.createElement('span')
				if(j%3==2) t.style.color='#dd0000'
				if(j%3==0) t.style.color='darkgreen'
        if(truevers(Vers[j-1])=='notes') {
          t.innerHTML=o[j+j+1]
            .replace(/<([^>]*)>/g, "&lt;$1&gt;")
            .replace(NOTES,
              '<a href="?r=$1&v='
              +vers+'&f='+format
              +';" target="bib2"><span class="blue">$1</span></a>'
            )+' '
        } else {
          t.innerHTML=o[j+j+1].replace(CLEAN,count_replace
            )+' '
        }
        a.appendChild(t)
      }
			if(!FHide) {
				Stdout.appendChild(a)
				if (FBrkl) {
					a=document.createElement('br')
					Stdout.appendChild(a)
				}
			}
		}
		else if(!FHide) {
			a=document.createElement('span')
			a.innerHTML=buf[i]
			Stdout.appendChild(a)
		}
	}
	//scrollId('hr')
}
function PrintStat(j,num,stat,a) {
	var i,k,l,n,n1,p,s,t
	var include=(document.getElementById("ST").value=="I")
	function proc_freq(freq) {
		var x,b=1,c=0,d=0,l,r,t1
		t=num[j]['']
		t1=freq['']
		if(include) t1-=t
		i=s=0
		for(k in num[j]) {
			if(k=="") continue
			c++
			x=num[j][k]/t
			if(x<b) b=x
			d+=log(x)
		}
		for(k in freq) i++
		c/=i
		d=d/i-log(b)
		r=1/b
		l=log(r)
		x=-0.5;k=2048/8190
		for(i=1;i<=12;i++) {
			if(pow(r,x)*l+1/x+d > 0) x+=k
			else x-=k
			k/=2
		}
		k=0
		for(i=1;i<=t;i++) k+=pow(i,x-1)
		k=c/k
		d=1
		for(i in num[j]) {
			if(i=="") continue
			n=num[j][i]; n1=freq[i]
			if(!n1) n1=0
			if(include) n1-=n
			//if(n<n1*t/t1) continue
			if(n1>0) c=n1/t1
			else c=0/t1
			d-=sqrt(c*n/t)
			s=test(n,t,c,k,x)
			a.push([i,round(100*s)/100,n,n1,j])
		}
		PrintStat(j+1,num,stat,a)
	}
	if(j<Vers.length) {
		jsonpget(truevers(Vers[j])+'/'+stat+'.freq',proc_freq)
	}
	else {
		a.sort(function(a,b){
			var t=b[1]-a[1]
			if(t) return t
			t=b[2]-a[2]
			if(t) return t
			if(b[0]<a[0]) return 1
			return -1
		})
		p=''
		if(a.length && a[0][1]==Infinity)
			p+='<tr><td></td><td></td><td><p class="godown"><a name="stats" href="#endhapax">&darr;&darr;&darr;</a></td></tr>'
		for(i=0;i<a.length;i++) {
			t=a[i]
			if(s==Infinity && isFinite(t[1]))
				p+='<tr><td><p class="goup"><a name="endhapax" href="#stats">&uarr;&uarr;&uarr;</a></td><td></td></tr>'
			k=t[0];s=t[1];n=t[2];n1=t[3];j=t[4]
			if(j%3==2) j='darkgreen'
			else if(j%3==0) j='black'
			else j='#dd0000'
			p+='<tr><td class="blue">'
			if(s==Infinity) p+="&infin;"
			else p+=s
			p+='</td>'
			p+='<td><a '+'style="color:'+j+'" onclick="Bib.hili(\'<'+k.replace(/'/g,"\\'")+'>\')">'+k+'</a></td>'
			p+='<td class="blue">'+n+'/'+n1+'</td></tr>'
		}
		l=document.createElement('hr')
		Stats.appendChild(l)
		l=document.createElement('table')
		l.innerHTML=p
		Stats.appendChild(l)
		Status.set('>')
	}
}
function scrollId(id) {
	document.getElementById(id).scrollIntoView(true)
}
function select(k,book,toks,query,nquery,buf,ret) {
	// ret( [[book,chap,verse,ver1...]...] )
	// book: eg. 'Mt' '1Cor'
	// toks: [tok, ...] eg.:
	//	 7001,8014 = 7,1-8,14
	//	 ';' (print <hr>)
	//	 'print_a_comment'
	//	 'comment:'
	// query: [RE1,...REn] (txt ~ RE1&&...REn)
	// nquery: [RE1,...REn] (txt !~ RE1&&...REn)
	// Vers: eg. ['it-2008','grk','it-1974']
	function cont(){
		select(k+1,book,toks,query,nquery,buf,ret)
	}
	function select0(txt){
		var a,b,beg,end,i,j,l,s,t
		while(toks.length>0) {
			s=toks.shift()
			if(typeof(s)=='string') {
				if(s==';') {
					buf.push('<hr/>')
					continue
				}
				if (s.indexOf(':')>=0 || s.indexOf('_')>=0) {
					buf.push('<i>'+s.replace(/_$/,'').replace(/_/g,' ')+'</i><br>')
					continue
				}
			}
			beg=Number(s)
			end=Number(toks.shift())
			for(i=0;i<txt.length;i++){
				l=txt[i]
				if(!l) continue
				a=l[0];b=l[1]
				if(b.substring) b=a
				if(beg && b<beg) continue
				if(end && b>=end+1) continue
				if(l[1].substring) {
					t=l.slice(1).join(' ')
				} else {
					t=l.slice(2).join(' ')
				}
				if(nquery) {
					for(j=0;j<nquery.length;j++)
						if(t.search(nquery[j])>=0)break
					if(j<nquery.length) continue
				}
				if(query) {
					for(j=0;j<query.length;j++)
						if(t.search(query[j])<0)break
					if(j<query.length) continue
					if(!FHide) for(j=0;j<query.length;j++){
						t=t.replace(query[j],'*$&')
					}
				}
				buf.push([book,a,b,t])
			}
		}
		setTimeout(cont,0)
	}
	function select1(txt){
		var a,b,j,s,t
		t=0
		m={}
		for(j=0;j<txt.length;j++) {
			i=txt[j][0]
			m[i]=j
		}
		for(j=0;j<buf.length;j++) {
			s=buf[j]
			if(s.constructor!=Array) continue
			b=a=s[1]
			if(a<=0) continue
			s=m[a]
			if(s>=0) {
				s=txt[s]
				b=s[1]
				if(b.substring) {
					b=a
					s=s.slice(1).join(' ')
				} else {
					s=s.slice(2).join(' ')
				}
			}
			else if(truevers(Vers[k])=='notes') s=''
			else s='---'
			buf[j].push(b)
			buf[j].push(s)
		}
		setTimeout(cont,0)
	}
	if(toks.length==0) toks=[0,10000000]
	if(k==Vers.length) {
		ret(buf)
		return
	}
	if(k==0) {
		buf=[]
		load(book,Vers[0],select0)
	}else{
		load(book,Vers[k],select1)
	}
}
function Show(r,query,nquery,stat) {
	var a,b,c,d,book='',i,s,ss,t=[]
	function cont(){
		Show(r,query,nquery,stat)
	}
	function print_buf(buf){
		Print(buf,S.value)
		setTimeout(cont,0)
	}
	function last_print_buf(buf){
		Print(buf,S.value)
		if(stat) PrintStat(0,Num,stat,[])
		else Status.set('>')
	}
	function select0() {
		select(0,book,t,query,nquery,null,print_buf)
	}
	while(r.length) {
		a=true
		while(a) {
			a=false
			s=r[0]
			if(s=='anti'){
				a='pent stor prof sapi poet'
			}else if(s=='bib'){
				a='anti nuov'
			}else if(s=='catt'){
				a='Gc 1Pt 2Pt 1Gv 2Gv 3Gv Gd'
			}else if(s=='nuov'){
				a='vang At paol catt Eb Ap'
			}else if(s=='opgv'){
				a='Gv 1Gv 2Gv 3Gv Ap'
			}else if(s=='oplc'){
				a='Lc At'
			}else if(s=='paol'){
				a='1Ts 2Ts 1Cor 2Cor Gal Rom Fil Fm Col Ef 1Tm Tt 2Tm'
			}else if(s=='pent'){
				a='Gn Es Lv Num Dt'
			}else if(s=='poet'){
				a='Gb Ct Rut Gdt Dn Gio Tb Est'
			}else if(s=='prof'){
				a='Am Os Mic Na Ab Sof Is Ger Bar Lam Ez Gl Abd Ag Zac Mal '
			}else if(s=='sapi'){
				a='Sal Qo Pro Sir Sap'
			}else if(s=='stor'){
				a='Gs Gdc 1Sam 2Sam 1Re 2Re 1Cr 2Cr Esd Ne 1Mac 2Mac'
			}else if(s=='vang'){
				a='Mc Mt Lc Gv'
			}
			if(a) r=a.split(' ').concat(r.slice(1))
		}
		if(s.search(/^[1-3]?[A-Za-z]+$/)==0){
			if(book) {
				setTimeout(select0,0)
				return
			}
			s=r.shift()
			book=s
			continue
		}
		s=r.shift()
		if(s==';'||s.indexOf('_')>=0||s.indexOf(':')>=0) {
			t.push(s)
			continue
		}
    ss=s.replace(/\./g,' ,').split(' ')
    while (ss.length) {
      s=ss.shift()
      // a,b-c,d | a?,b-d | a-c | a?,b | a
      s=s.split('-')
      b=s[0].split(',')
      a=b[0]
      if(a=='') a=c // ,b
      a=Number(a)
      if(b.length==1) // a-c | a
          b=0
      else // a,b-c,d | a?,b-d | a?,b
          b=Number(b[1])
      if(s.length==1) { // a?,b | a
        if(b) c=a // a?,
        else c=a+1 // a
        d=b
      }else{
        d=s[1].split(',')
        c=Number(d[0])
        if(d.length==1) {
          if(b) {d=c;c=a}
          else {c+=1;d=0}
        }
        else d=Number(d[1])
      }
      t.push(1000*a+b)
      t.push(1000*c+d)
    }
	}
	select(0,book,t,query,nquery,null,last_print_buf)
}
function logcomb(N,n) {
	var t=log(N)
	var i
	if(n==0) return 0
	for(i=1;i<n;i++) t+=log((N-i)/(i+1))
	return t
}
function test(n,N,p,k,x) {
	var r=0
	if(n>0) r=(x-1)*log(n) +log(k)
	return r -n*log(p) -(N-n)*log(1-p) -logcomb(N,n)
}
function toggleHelp(o) {
	if(o.innerHTML=='[?]'){
		o.innerHTML='[X]'
		o.parentNode.nextElementSibling.style.display='block'
	}else{
		o.innerHTML='[?]'
		o.parentNode.nextElementSibling.style.display='none'
	}
}
function truevers(v) {
	var V={'b':'bgm','e':'ebr','g':'grk','i':'it-2008','74':'it-1974','n':'notes','ilc':'tilc'}
	if(v in V) return V[v]
	else return v
}
function urldecode(s) {
	s=s.replace(/\+/g,' ')
	s=decodeURIComponent(s)
	//s=unescape(s)
	return s
}
that.cycleValue=cycleValue
that.fixForm=fixForm
that.hili=hili
that.main=main
that.scrollId=scrollId
that.toggleHelp=toggleHelp
}
// TODO NEXT : change find add end index
//	vim: set sw=2 ts=2 sts=2 fdm=expr nosmartindent nocindent autoindent:
