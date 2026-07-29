import{V as P,S as G,P as j,W as N,a as q,b as F,c as O,M as W,C as X}from"./three.module-BRPQWrth.js";import{q as Y,r as _,d as M,o as R,_ as z,b as u,c as d,e as r,g as H,h as b,s as J,F as K,j as Q,t as Z,n as e2,m as t2,w as s2,k as w}from"./index-BXxkFetA.js";function a2(a){const e=_(),c=_();let t,v,l,s,m,o,g=0;const h=new P(0,0);let x=!1;const B=new X;let p=null,C=!0,f=null;const T=async()=>{if(!e.value||!c.value){console.error("Container or canvas element not found!");return}const n=e.value.clientWidth,i=e.value.clientHeight;v=new G,l=new j(45,n/i,.1,1e3),l.position.z=5,t=new N({canvas:c.value,alpha:!0,antialias:!0,powerPreference:"high-performance"}),t.setPixelRatio(1),t.setClearColor(0,0),t.setSize(n,i,!1);const y=new q(15,15,1,1);s=new F({uniforms:{iTime:{value:0},iResolution:{value:new P(n,i)},iMouse:{value:new O(0,0,0,0)},iChannel0:{value:null},...a.uniforms},vertexShader:a.vertexShader,fragmentShader:a.fragmentShader,transparent:!0}),m=new W(y,s),v.add(m)},S=()=>{if(o=requestAnimationFrame(S),!t||!v||!l||!s||!C)return;const n=B.getDelta();g+=n,s.uniforms.iTime.value=g*.5,x?(s.uniforms.iMouse.value.x=h.x*s.uniforms.iResolution.value.x,s.uniforms.iMouse.value.y=h.y*s.uniforms.iResolution.value.y,s.uniforms.iMouse.value.z=1):s.uniforms.iMouse.value.z=0,t.render(v,l)},A=()=>{o&&cancelAnimationFrame(o),m&&(m.geometry.dispose(),m.material.dispose()),t&&t.dispose()},k=()=>{p&&clearTimeout(p),p=window.setTimeout(()=>{if(!e.value||!t||!l||!s)return;const n=e.value.clientWidth,i=e.value.clientHeight;l.aspect=n/i,l.updateProjectionMatrix(),t.setSize(n,i,!1),s.uniforms.iResolution.value.set(n,i)},150)},E=()=>{x=!0},L=()=>{x=!1},V=n=>{if(!e.value)return;const i=e.value.getBoundingClientRect(),y=(n.clientX-i.left)/i.width*2-1,D=-((n.clientY-i.top)/i.height)*2+1;h.set(y,D)},U=()=>{e.value&&(f=new IntersectionObserver(n=>{n.forEach(i=>{C=i.isIntersecting})},{threshold:.1}),f.observe(e.value))},I=()=>{e.value&&(e.value.addEventListener("mouseenter",E),e.value.addEventListener("mouseleave",L),e.value.addEventListener("mousemove",V)),window.addEventListener("resize",k)},$=()=>{e.value&&(e.value.removeEventListener("mouseenter",E),e.value.removeEventListener("mouseleave",L),e.value.removeEventListener("mousemove",V)),window.removeEventListener("resize",k),p&&clearTimeout(p),f&&(f.disconnect(),f=null)};return Y(()=>{A(),$()}),{containerEl:e,canvasEl:c,init:T,animate:S,setupVisibilityObserver:U,setupEventListeners:I,removeEventListeners:$}}const o2=M({name:"SpaceLens3D",props:{active:{type:Boolean,default:!1}},setup(){const a=`
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,e=`
      uniform float iTime;
      uniform vec2 iResolution;
      varying vec2 vUv;
      
      #define MAX 100.
      #define EPS 4e-4
      #define SAMPLES 32.0
      #define TINT vec4(1.5, 1.2, 1, 1)

      float hash(vec2 p) {
        return fract(sin(p.x*75.3 + p.y*94.2)*4952.);
      }
      
      vec2 hash2(vec2 p) {
        return normalize(fract(cos(p*mat2(95,74,86,83))*3742.0)-0.5);
      }
      
      float value(vec2 p) {
        vec2 f = floor(p);
        vec2 s = p-f;
        s *= s * (3.0 - 2.0 * s);
        vec2 o = vec2(0, 1);
        
        return mix(mix(hash(f+o.xx),hash(f+o.yx),s.x),
                   mix(hash(f+o.xy),hash(f+o.yy),s.x),s.y);
      }
      
      float dist(vec3 p) {
        vec2 n = p.xz*0.6+1.0;
        mat2 m = mat2(0.6754904, 0.7373688, -0.7373688, 0.6754904)*2.0;
        float weight = 0.3;
        float water = 0.0;
        float speed = 0.3;
        
        for(int i = 0; i<10; i++) {
          water += smoothstep(0.1, 0.9, value(n+speed*iTime)) * weight;
          n *= m;
          speed *= 1.3;
          weight *= 0.45;
        }
        return (water+0.5-p.y);
      }
      
      vec3 normal(vec3 p) {
        vec2 e = vec2(4,-4)*EPS;
        return normalize(dist(p+e.yxx)*e.yxx+dist(p+e.xyx)*e.xyx+
                         dist(p+e.xxy)*e.xxy+dist(p+e.yyy)*e.yyy);
      }

      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec3 ray = normalize(vec3(fragCoord*2.0 - iResolution.xy, iResolution.x));
        ray.yz *= mat2(cos(0.5+vec4(0,11,33,0)));
        vec3 pos = vec3(iTime*0.2,0,0);
        vec4 mar = vec4(pos,0);
        
        for(int i = 0; i<50; i++) {
          float stp = dist(mar.xyz);
          mar += vec4(ray, 1) * stp;
          
          if (stp<EPS || mar.w>MAX) break;
        }
        
        vec3 nor = normal(mar.xyz);
        vec3 sun = normalize(vec3(0,-1,9));
        vec3 ref = refract(ray, nor, 1.333);
        float spec = exp(dot(ref, sun) * 9.0 - 9.0);
        float fog = max(1.0 - mar.w/MAX, 0.0);
        
        vec2 texel = 1.0 / iResolution.xy;
        vec2 uv = fragCoord * texel;
        
        vec4 blur = vec4(0.0);
        float total = 0.0;
        float radius = 6.0;
        float scale = radius/sqrt(SAMPLES);
        vec2 point = hash2(uv)*scale;
        
        float rad = 1.0;
        mat2 ang = mat2(-0.7373688, -0.6754904, 0.6754904, -0.7373688);
        
        for(float i = 0.0; i<SAMPLES; i++) {
          point *= ang;
          rad += 1.0/rad;
          
          vec2 coord = uv + point*(rad-1.0)*texel;
          float weight = 1.0/(1.0+i);
          
          blur += vec4(sqrt(spec) * fog) * weight;
          total += weight;
        }
        blur /= total;
        
        vec4 finalColor = blur * TINT;
        finalColor += vec4(sqrt(spec) * fog) * 0.5;
        
        vec2 centered = (fragCoord - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
        float circleMask = smoothstep(1.0, 0.95, length(centered));
        
        finalColor *= circleMask;
        gl_FragColor = vec4(finalColor.rgb, finalColor.a * circleMask);
      }
    `,{containerEl:c,canvasEl:t,init:v,animate:l,setupVisibilityObserver:s,setupEventListeners:m}=a2({vertexShader:a,fragmentShader:e});return R(()=>{v().then(()=>{l(),s(),m()})}),{containerEl:c,canvasEl:t}}}),n2={class:"lens-container",ref:"containerEl"},i2={ref:"canvasEl"};function r2(a,e,c,t,v,l){return u(),d("div",n2,[r("canvas",i2,null,512)],512)}const c2=z(o2,[["render",r2],["__scopeId","data-v-6e052330"]]),l2=M({name:"HeadSection",components:{SpaceLens3D:c2}}),v2={class:"head-container"},m2={class:"header"},u2={class:"title"};function d2(a,e,c,t,v,l){const s=b("SpaceLens3D");return u(),d("div",v2,[r("div",m2,[r("div",u2,[H(s,{active:!1})])])])}const h2=z(l2,[["render",d2],["__scopeId","data-v-78f4dc98"]]),p2=M({components:{HeadSection:h2},setup(){const a=_(!1),e=()=>{a.value=document.documentElement.classList.contains("dark-theme")};return R(()=>{e(),new MutationObserver(()=>{e()}).observe(document.documentElement,{attributes:!0,attributeFilter:["class"]})}),{projects:J(()=>[{name:"Passport Buddy",slug:"passport-buddy",github:"https://github.com/Izaacapp/my-awesome-project",website:"https://myawesomeproject.com",image:new URL("/assets/passport-buddy-CIrzfLUm.svg",import.meta.url).href,npm:"",darkInvert:!0},{name:"Pi-hole",slug:"pi-hole",github:"https://github.com/YourUsername/project2",website:"https://project2website.com",image:a.value?new URL("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2048'%3e%3cdefs%3e%3clinearGradient%20id='New_Gradient_Swatch_1'%20x1='2.71'%20x2='69.77'%20y1='20.04'%20y2='20.04'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0'%20stop-color='%2312b212'/%3e%3cstop%20offset='1'%20stop-color='%230f0'/%3e%3c/linearGradient%3e%3cstyle%3e.cls-2{fill:%23980200}.cls-3{fill:red}%3c/style%3e%3c/defs%3e%3cpath%20fill='url(%23New_Gradient_Swatch_1)'%20d='M36.56%2039.93C20.34%2038.2%204%2025.94%202.71%200c25.17%200%2038.63%2014.9%2039.93%2038.51%204.76-28.32%2027.07-25%2027.07-25%201.06%2016.05-12.12%2025.78-27.07%2026.59-4.2-8.85-29.36-30.56-29.36-30.56a.07.07%200%200%200-.11.08s24.28%2021.15%2023.39%2030.31'%20transform='translate(7.686)%20scale(.36943)'/%3e%3cpath%20d='M24%2048c-.58-.033-5.992-.24-6.32-6.32-.267-3.695%202.652-6.418%202.652-10.005-.662-8.944-12.646-7.836-12.646%200a7.366%207.366%200%200%200%202.154%205.224l8.929%208.932a7.366%207.366%200%200%200%205.224%202.154'%20class='cls-2'/%3e%3cpath%20d='M40.314%2031.679c-.033.58-.24%205.992-6.32%206.32-3.695.267-6.422-2.652-10.005-2.652-8.944.661-7.836%2012.642%200%2012.642a7.366%207.366%200%200%200%205.224-2.154l8.936-8.929a7.366%207.366%200%200%200%202.154-5.224'%20class='cls-3'/%3e%3cpath%20d='M24%2015.365c.58.033%205.992.24%206.321%206.32.266%203.695-2.653%206.418-2.653%2010.005.662%208.944%2012.642%207.835%2012.642%200a7.366%207.366%200%200%200-2.153-5.224l-8.933-8.937A7.366%207.366%200%200%200%2024%2015.376'%20class='cls-2'/%3e%3cpath%20d='M7.716%2031.679c.033-.58.24-5.993%206.32-6.321%203.695-.266%206.421%202.652%2010.005%202.652%208.944-.672%207.835-12.642%200-12.642a7.366%207.366%200%200%200-5.224%202.154L9.88%2026.455a7.366%207.366%200%200%200-2.153%205.224'%20class='cls-3'/%3e%3c/svg%3e",import.meta.url).href:new URL("data:image/svg+xml,%3csvg%20height='2500'%20viewBox='3.84488914%200%2016.3096363%2024.36325238'%20width='2500'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='m9.375%208.782-4.442%204.44a3.714%203.714%200%200%200%200%205.253l4.442%204.439a3.712%203.712%200%200%200%205.249%200l4.442-4.439a3.713%203.713%200%200%200%200-5.253l-4.442-4.44a3.712%203.712%200%200%200%20-5.249%200zm1.22-1.402c-2.998-.32-6.018-2.586-6.257-7.38%204.652%200%207.14%202.754%207.38%207.118.88-5.234%205.003-4.621%205.003-4.621.196%202.966-2.24%204.765-5.003%204.914-.776-1.636-5.426-5.648-5.426-5.648-.005-.004-.014-.004-.018.002a.012.012%200%200%200%20-.002.013s4.487%203.909%204.323%205.602m1.399%2010.304c-2.231.165-3.212%201.738-3.148%203.274-.003-.036-.007-.07-.009-.107-.133-1.848%201.327-3.21%201.327-5.005-.172-2.322-1.869-3.287-3.462-3.133a4.92%204.92%200%200%201%20.313-.028c1.848-.133%203.212%201.327%205.005%201.327%202.082-.157%203.074-1.537%203.146-2.969.022%201.75-1.331%203.079-1.331%204.81.165%202.23%201.736%203.21%203.271%203.148-.036.003-.07.007-.107.009-1.848.134-3.212-1.326-5.005-1.326z'/%3e%3c/svg%3e",import.meta.url).href,npm:"https://www.npmjs.com/package/project2"},{name:"BlackArch",slug:"blackarch",github:"",website:"",image:new URL("/assets/blackarchlogo-0LEU-JY8.webp",import.meta.url).href,npm:""},{name:"Aethermail",slug:"aethermail",github:"",website:"",image:new URL("/assets/icon-Be9GHPb5.png",import.meta.url).href,npm:""}])}},methods:{handleCardBackground(a){console.log("caca");const e=a.target,c=e.getBoundingClientRect(),t=a.clientX-c.left,v=a.clientY-c.top;e.style.setProperty("--y",`${v}px`),e.style.setProperty("--x",`${t}px`)}}}),f2="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='30'%20height='30'%20fill='white'%20class='bi%20bi-github'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M8%200C3.58%200%200%203.58%200%208c0%203.54%202.29%206.53%205.47%207.59.4.07.55-.17.55-.38%200-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01%201.08.58%201.23.82.72%201.21%201.87.87%202.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95%200-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12%200%200%20.67-.21%202.2.82.64-.18%201.32-.27%202-.27s1.36.09%202%20.27c1.53-1.04%202.2-.82%202.2-.82.44%201.1.16%201.92.08%202.12.51.56.82%201.27.82%202.15%200%203.07-1.87%203.75-3.65%203.95.29.25.54.73.54%201.48%200%201.07-.01%201.93-.01%202.2%200%20.21.15.46.55.38A8.01%208.01%200%200%200%2016%208c0-4.42-3.58-8-8-8'/%3e%3c/svg%3e",g2="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20x='0px'%20y='0px'%20width='45'%20height='30'%20viewBox='0%200%2018%207'%3e%3cpath%20fill='%23ffffff'%20d='M0,0h18v6H9v1H5V6H0V0z%20M1,5h2V2h1v3h1V1H1V5z%20M6,1v5h2V5h2V1H6z%20M8,2h1v2H8V2z%20M11,1v4h2V2h1v3h1V2h1v3h1V1H11z'/%3e%3c/svg%3e",w2="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='30'%20height='30'%20fill='white'%20class='bi%20bi-globe'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M0%208a8%208%200%201%201%2016%200A8%208%200%200%201%200%208m7.5-6.923c-.67.204-1.335.82-1.887%201.855A8%208%200%200%200%205.145%204H7.5zM4.09%204a9.3%209.3%200%200%201%20.64-1.539%207%207%200%200%201%20.597-.933A7.03%207.03%200%200%200%202.255%204zm-.582%203.5c.03-.877.138-1.718.312-2.5H1.674a7%207%200%200%200-.656%202.5zM4.847%205a12.5%2012.5%200%200%200-.338%202.5H7.5V5zM8.5%205v2.5h2.99a12.5%2012.5%200%200%200-.337-2.5zM4.51%208.5a12.5%2012.5%200%200%200%20.337%202.5H7.5V8.5zm3.99%200V11h2.653c.187-.765.306-1.608.338-2.5zM5.145%2012q.208.58.468%201.068c.552%201.035%201.218%201.65%201.887%201.855V12zm.182%202.472a7%207%200%200%201-.597-.933A9.3%209.3%200%200%201%204.09%2012H2.255a7%207%200%200%200%203.072%202.472M3.82%2011a13.7%2013.7%200%200%201-.312-2.5h-2.49c.062.89.291%201.733.656%202.5zm6.853%203.472A7%207%200%200%200%2013.745%2012H11.91a9.3%209.3%200%200%201-.64%201.539%207%207%200%200%201-.597.933M8.5%2012v2.923c.67-.204%201.335-.82%201.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7%2013.7%200%200%201-.312%202.5m2.802-3.5a7%207%200%200%200-.656-2.5H12.18c.174.782.282%201.623.312%202.5zM11.27%202.461c.247.464.462.98.64%201.539h1.835a7%207%200%200%200-3.072-2.472c.218.284.418.598.597.933M10.855%204a8%208%200%200%200-.468-1.068C9.835%201.897%209.17%201.282%208.5%201.077V4z'/%3e%3c/svg%3e",x2={id:"projects",class:"projects-container"},y2={class:"projects-grid"},_2={class:"title"},b2=["src"],M2={class:"links"},z2=["href"],C2=["href"],S2=["href"];function k2(a,e,c,t,v,l){const s=b("head-section"),m=b("router-link");return u(),d("div",null,[H(s),r("div",x2,[e[5]||(e[5]=r("div",{class:"projects-wrapper"},[r("div",{class:"projects-title"},"Projects")],-1)),r("div",y2,[(u(!0),d(K,null,Q(a.projects,(o,g)=>(u(),d("div",{key:`project-${g}`,class:"card",onMousemove:e[0]||(e[0]=h=>a.handleCardBackground(h))},[r("div",_2,Z(o.name),1),r("img",{src:o.image,class:e2({"icon-invert":o.darkInvert})},null,10,b2),o.slug?(u(),t2(m,{key:0,to:`/portfolio/${o.slug}`,class:"card-overlay"},{default:s2(()=>[...e[1]||(e[1]=[r("span",{class:"overlay-cta"},"See the Process",-1)])]),_:1},8,["to"])):w("",!0),r("div",M2,[o.github?(u(),d("a",{key:0,href:o.github,target:"_blank"},[...e[2]||(e[2]=[r("img",{src:f2,alt:""},null,-1)])],8,z2)):w("",!0),o.npm?(u(),d("a",{key:1,href:o.npm,target:"_blank"},[...e[3]||(e[3]=[r("img",{src:g2,alt:""},null,-1)])],8,C2)):w("",!0),o.website?(u(),d("a",{key:2,href:o.website,target:"_blank"},[...e[4]||(e[4]=[r("img",{src:w2,alt:"Website"},null,-1)])],8,S2)):w("",!0)])],32))),128))])])])}const V2=z(p2,[["render",k2],["__scopeId","data-v-e20d444a"]]);export{V2 as default};
