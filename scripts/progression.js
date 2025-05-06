document.addEventListener('DOMContentLoaded',()=>{
    const img=document.querySelector('.mindmap');
    const halo=document.getElementById('hover-indicator');
    halo.style.transform='translate(-50%,-50%)';
    const areas=document.querySelectorAll('map[name="matieresmap"] area');
  
    function place(a){
      const [x,y,r]=a.coords.split(',').map(Number);
      const s=img.clientWidth/img.naturalWidth;
      const cx=x*s, cy=y*s, rad=r*s;
      halo.style.width=`${rad*2}px`;
      halo.style.height=`${rad*2}px`;
      halo.style.left=`${cx}px`;
      halo.style.top=`${cy}px`;
      halo.style.opacity='1';
    }
    areas.forEach(a=>{
      a.addEventListener('mouseenter',()=>place(a));
      a.addEventListener('mouseleave',()=>halo.style.opacity=0);
    });
    window.addEventListener('resize',()=>halo.style.opacity=0);
  });
  
  // Masquer le loader quand tout est chargé
  window.addEventListener('load',()=>{
    const l=document.getElementById('loader');
    if(l)l.style.display='none';
  });
  