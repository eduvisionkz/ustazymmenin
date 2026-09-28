import {useEffect,useState} from 'react';

const photos = [
  {file:'1000280778.jpg', caption:'Жаңыл апай'},
  {file:'1000280804.jpg', caption:'Ұстаздар бас қосқан сәт'},
  {file:'1000280797.jpg', caption:'Серуендегі сәт'},
  {file:'1000280795.jpg', caption:'Естелік сурет'},
  {file:'1000280808.jpg', caption:'Бірге өткізген күн'},
];

export default function Gallery(){
  const [active,setActive]=useState<number|null>(null);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
    }),{threshold:.12});
    document.querySelectorAll('.galleryCard').forEach(el=>observer.observe(el));
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(active===null)return;
    const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setActive(null);if(e.key==='ArrowRight')setActive(i=>i===null?null:(i+1)%photos.length);if(e.key==='ArrowLeft')setActive(i=>i===null?null:(i+photos.length-1)%photos.length)};
    document.addEventListener('keydown',onKey);
    const old=document.body.style.overflow;document.body.style.overflow='hidden';
    return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow=old};
  },[active]);
  const url=(file:string)=>`${import.meta.env.BASE_URL}gallery/${file}`;
  return <section className="gallery section" id="suretter"><div className="sectionMark">03 / СУРЕТТЕР</div><div><h2>Сәттерге айналған естеліктер</h2><p>Ұстаздық жол мен бірге өткен күндерден сақталған суреттер. Суретті басып, толық көлемде көре аласыз.</p><div className="galleryGrid">{photos.map((p,i)=><button type="button" className="galleryCard" key={p.file} onClick={()=>setActive(i)} aria-label={`${p.caption} суретін ашу`}><img src={url(p.file)} alt={p.caption} loading="lazy"/><span>{p.caption}</span></button>)}</div></div>
  {active!==null&&<div className="lightbox" role="dialog" aria-modal="true" aria-label="Фотосуретті қарау" onClick={()=>setActive(null)}><button className="lightboxClose" onClick={()=>setActive(null)} aria-label="Жабу">×</button><button className="lightboxPrev" onClick={e=>{e.stopPropagation();setActive((active+photos.length-1)%photos.length)}} aria-label="Алдыңғы сурет">‹</button><figure onClick={e=>e.stopPropagation()}><img src={url(photos[active].file)} alt={photos[active].caption}/><figcaption>{photos[active].caption} · {active+1}/{photos.length}</figcaption></figure><button className="lightboxNext" onClick={e=>{e.stopPropagation();setActive((active+1)%photos.length)}} aria-label="Келесі сурет">›</button></div>}
  </section>
}
