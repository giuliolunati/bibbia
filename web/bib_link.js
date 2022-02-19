/* EXAMPLE:
 * [1] <a>Gv 1,1-5</a>
 * [2] <a>Giovanni cap. 1 (greco)|r=Gv 1&amp:v=g
 * <script src="bib_link.js"></script>
 *
 * OR WITH ID AS PREFIX:
 * [1] <a>bib: Gv 1,1-5</a>
 * [2] <a>bib: Giovanni cap. 1 (greco)|r=Gv 1&amp:v=g
 * <script id="bib:" src="bib_link.js"></script>
 *
 */

var bib_link= function (url_bibbia_js, id){
  let l= document.getElementsByTagName('a')
  for (let o of l){
    let s,n
    if (o.name || o.href || o.id) continue
		s= o.innerText
    if (id && !s.startsWith(id)) continue
    s= s.substring(id.length)
    n= s.indexOf("|")
    if (n >= 0) { // [2]
      o.innerHTML= s.substring(0, n)
      o.href = url_bibbia_js + "?" + s.substr(n+1)
    } else { // [1]
      o.innerHTML= s
        .replace(/_/g, " ")
      s= s.replace('?','&q=').replace(/\n/g, " ")
      o.href= url_bibbia_js + "?v=i&r=" + s
    }
    o.target= "_blank"
    o.style.whiteSpace= "pre-line"
  }
}

for (let x of document.getElementsByTagName("script")) {
  let i= x.src.indexOf("bib_link.js")
  if (i >= 0) {
    let id
    if (x.id) id= x.id; else id= ""
    bib_link(x.src.substring(0,i)+"bibbia.html", id)
    break
  }
}
// vim:set sw=2 ts=2 sts=2 indk=:
