(function(){
var w=[0,0,0],b=0,limit=120;
var $=function(id){return document.getElementById(id)};
function sc(t){return (t-40)/20}
function score(t){return w[0]*sc(t[0])+w[1]*sc(t[1])+w[2]*sc(t[2])+b}
function rnd(seed){return function(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296}}
function train(){
  limit=+$("lim").value||120;
  var r=rnd(7),X=[],y=[],i,e,k;
  for(i=0;i<400;i++){var t=[20+r()*50,20+r()*50,20+r()*50];X.push(t);y.push(t[0]+t[1]+t[2]>limit?1:0)}
  w=[0,0,0];b=0;var lr=0.1,ep=0,conv=false;
  for(e=1;e<=500;e++){
    var err=0;
    for(i=0;i<X.length;i++){
      var p=score(X[i])>0?1:0,d=lr*(y[i]-p);
      if(d!==0){for(k=0;k<3;k++)w[k]+=d*sc(X[i][k]);b+=d;err++}
    }
    ep=e;if(err===0){conv=true;break}
  }
  var ok=0;for(i=0;i<X.length;i++)if((score(X[i])>0?1:0)===y[i])ok++;
  $("sAcc").textContent=(100*ok/X.length).toFixed(1)+"%";
  $("sEp").textContent=conv?ep:ep+" (not converged)";
  $("sW").textContent=w.map(function(v){return v.toFixed(2)}).join(", ");
  $("sB").textContent=b.toFixed(2);
  update();
}
function update(){
  var t=[],i;
  for(i=0;i<3;i++){t[i]=+$("t"+i).value;if(document.activeElement!==$("n"+i))$("n"+i).value=t[i];$("m"+i).style.width=((t[i]-20)/50*100)+"%"}
  var s=score(t),hot=s>0;
  $("status").className="card status"+(hot?" hot":"");
  $("verdict").textContent=hot?"Emergency coolant ON":"Normal";
  $("score").textContent="Sum "+(t[0]+t[1]+t[2])+"°C vs limit "+limit+"°C · neuron output "+s.toFixed(2);
  $("eq").textContent="y = step("+w.map(function(v,j){return v.toFixed(2)+"×"+["top","mid","bottom"][j]}).join(" + ")+" + "+b.toFixed(2)+") = "+(hot?1:0);
}
for(var i=0;i<3;i++){(function(i){
  $("t"+i).addEventListener("input",update);
  $("n"+i).addEventListener("input",function(){var v=Math.max(20,Math.min(70,+this.value||20));$("t"+i).value=v;update()});
  $("n"+i).addEventListener("blur",update);
})(i)}
$("train").addEventListener("click",train);
train();
})();