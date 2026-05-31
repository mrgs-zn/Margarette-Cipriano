window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('loading-screen').classList.add('out'),2800);
});

const html=document.documentElement;
const themeBtn=document.getElementById('themeBtn');
const themeLbl=document.getElementById('themeLbl');
let night=false;
themeBtn.addEventListener('click',()=>{
  night=!night;
  night?html.setAttribute('data-night',''):html.removeAttribute('data-night');
  themeLbl.textContent=night?'Light Mode':'Night Mode';
  updateParticles();
});

const menuBtn=document.getElementById('menuBtn');
const nav=document.getElementById('navLinks');
menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const dot=document.getElementById('dot');
const circle=document.getElementById('circle');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function anim(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;circle.style.left=rx+'px';circle.style.top=ry+'px';requestAnimationFrame(anim)})();
document.querySelectorAll('a,button,.tool-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{dot.style.width='14px';dot.style.height='14px';circle.style.width='48px';circle.style.height='48px';circle.style.opacity='.8'});
  el.addEventListener('mouseleave',()=>{dot.style.width='8px';dot.style.height='8px';circle.style.width='32px';circle.style.height='32px';circle.style.opacity='.5'});
});

const bgCanvas=document.getElementById('bg-canvas');
const bgCtx=bgCanvas.getContext('2d');
let BW,BH,bParts=[];
function resizeBG(){BW=bgCanvas.width=innerWidth;BH=bgCanvas.height=innerHeight}
resizeBG();addEventListener('resize',resizeBG);
function BParticle(){
  this.reset=()=>{this.x=Math.random()*BW;this.y=Math.random()*BH;this.r=Math.random()*2+.8;this.vx=(Math.random()-.5)*.4;this.vy=-Math.random()*.4-.1;this.ph=Math.random()*Math.PI*2;this.spd=Math.random()*.03+.01};
  this.reset();this.y=Math.random()*BH;
}
for(let i=0;i<80;i++)bParts.push(new BParticle());
function drawBG(){
  bgCtx.clearRect(0,0,BW,BH);
  if(!night){requestAnimationFrame(drawBG);return}
  bParts.forEach(p=>{
    p.ph+=p.spd;
    const glow=Math.sin(p.ph)*.5+.5;
    const a=(.3+glow*.5);
    const g=bgCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
    g.addColorStop(0,`rgba(255,228,140,${a*.7})`);
    g.addColorStop(.5,`rgba(212,169,106,${a*.2})`);
    g.addColorStop(1,'rgba(0,0,0,0)');
    bgCtx.beginPath();bgCtx.arc(p.x,p.y,p.r*5,0,Math.PI*2);bgCtx.fillStyle=g;bgCtx.fill();
    bgCtx.beginPath();bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2);bgCtx.fillStyle=`rgba(255,245,200,${a})`;bgCtx.fill();
    p.x+=p.vx;p.y+=p.vy;
    if(p.y<-10||p.x<-10||p.x>BW+10)p.reset();
  });
  requestAnimationFrame(drawBG);
}
drawBG();
function updateParticles(){}

document.querySelectorAll('.tool-card').forEach(card=>{
  const cv=card.querySelector('.card-canvas');
  const cx=cv.getContext('2d');
  let W,H,pts=[],raf=null,active=false;
  function resize(){W=cv.width=card.offsetWidth;H=cv.height=card.offsetHeight}
  resize();

  const isNight=()=>document.documentElement.hasAttribute('data-night');

  function Fly(){
    this.reset=()=>{
      this.x=Math.random()*W;this.y=H*.6+Math.random()*H*.4;
      this.r=Math.random()*2+.5;this.vx=(Math.random()-.5)*.7;
      this.vy=-Math.random()*.8-.2;this.ph=Math.random()*Math.PI*2;
      this.spd=Math.random()*.05+.02;this.life=1;this.type='fly';
    };this.reset();
  }

  function Puff(){
    this.reset=()=>{
      this.x=W*.2+Math.random()*W*.6;
      this.y=H*.7+Math.random()*H*.2;
      this.r=6+Math.random()*10;
      this.vx=(Math.random()-.5)*.3;
      this.vy=-Math.random()*.4-.15;
      this.ph=Math.random()*Math.PI*2;
      this.spd=Math.random()*.02+.008;
      this.life=1;
      this.grow=1+Math.random()*.8;
      this.type='puff';
    };this.reset();
  }

  function loop(){
    cx.clearRect(0,0,W,H);
    const night=isNight();

    if(night){
      if(pts.length<18&&Math.random()<.35)pts.push(new Fly());
    } else {
      if(pts.length<10&&Math.random()<.25)pts.push(new Puff());
    }

    pts=pts.filter(p=>{
      p.ph+=p.spd;p.life-=night?.012:.009;
      const g2=Math.sin(p.ph)*.5+.5;

      if(night){
        const al=p.life*(0.4+g2*.5);
        const gr=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
        gr.addColorStop(0,`rgba(255,228,140,${al*.8})`);
        gr.addColorStop(.5,`rgba(212,169,106,${al*.25})`);
        gr.addColorStop(1,'rgba(0,0,0,0)');
        cx.beginPath();cx.arc(p.x,p.y,p.r*4,0,Math.PI*2);cx.fillStyle=gr;cx.fill();
        cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=`rgba(255,245,200,${al})`;cx.fill();
      } else {
        const curR=p.r*(1+(1-p.life)*p.grow);
        const al=p.life*0.18;
        const gr=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,curR);
        gr.addColorStop(0,`rgba(200,195,188,${al})`);
        gr.addColorStop(.5,`rgba(215,210,202,${al*.55})`);
        gr.addColorStop(1,'rgba(220,215,208,0)');
        cx.beginPath();cx.arc(p.x,p.y,curR,0,Math.PI*2);cx.fillStyle=gr;cx.fill();
        cx.beginPath();cx.arc(p.x-curR*.15,p.y-curR*.15,curR*.55,0,Math.PI*2);
        cx.fillStyle=`rgba(240,238,234,${al*.4})`;cx.fill();
      }

      p.x+=p.vx;p.y+=p.vy;
      if(!night)p.vx+=(Math.random()-.5)*.04;
      return p.life>0&&p.y>-20;
    });

    if(active||pts.length>0)raf=requestAnimationFrame(loop);
    else{cx.clearRect(0,0,W,H);raf=null;}
  }

  card.addEventListener('mouseenter',()=>{active=true;resize();pts=[];if(!raf)loop()});
  card.addEventListener('mouseleave',()=>{active=false});
  card.addEventListener('touchstart',()=>{
    active=true;resize();pts=[];if(!raf)loop();
    clearTimeout(card._timer);
    card._timer=setTimeout(()=>{active=false;},3000);
  },{passive:true});
});

const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')}),{threshold:.1});
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
