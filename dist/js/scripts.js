let spellsRepository=function(){let e=[],t="https://www.dnd5eapi.co/api/spells/",n=["index","name","detailsUrl","level","school","castingTime","range","duration","areaOfEffect","classes","description","higherLevel"],i=document.querySelector(".spells-grid"),o=document.querySelector(".loading-overlay"),r=document.querySelector(".search-bar_input"),l=document.querySelector(".search-bar_button"),s=document.querySelector("#modal-container"),c=document.querySelector(".modal_title"),a=document.querySelector(".modal_subheading"),d=document.querySelector(".modal_info_casting-time p"),u=document.querySelector(".modal_info_range p"),f=document.querySelector(".modal_info_duration p"),p=document.querySelector(".modal_info_area-of-effect p"),m=document.querySelector(".show-more-button"),h=document.querySelector(".modal_description-wrapper"),g=document.querySelector(".modal_description"),y=document.querySelector(".modal-close");function v(e){e?o.classList.add("hidden"):o.classList.remove("hidden")}function L(e){v(!1),function(e){let t=e.detailsUrl;return fetch(t).then(function(e){return e.json()}).then(function(t){e.level=t.level,e.school=t.school,e.castingTime=t.casting_time,e.range=t.range,e.duration=t.duration,e.areaOfEffect=t.area_of_effect,e.classes=t.classes,e.description=t.desc,e.higherLevel=t.higher_level}).catch(function(e){console.error(e)})}(e).then(()=>(function(e){h.classList.add("hidden"),m.innerText="Show description",c.innerText=e.name,a.innerText=`Level ${e.level} ${e.school.name}`,d.innerText=`${e.castingTime}`,u.innerText=`${e.range}`,f.innerText=`${e.duration}`;let t="";e.areaOfEffect?t+=`${e.areaOfEffect.size} ft ${e.areaOfEffect.type}`:t+="none";p.innerText=t;let n="";e.description.forEach(function(t,i){i===e.description.length-1||1===e.description.length?n+=`${t}`:n+=`${t}<br><br>`}),g.innerHTML=`${n}`,s.classList.add("is-visible")})(e)).then(()=>v(!0))}function _(){s.classList.remove("is-visible")}return l.addEventListener("click",()=>{let t=function(t){let n=t.replace(/\s+/g,"-").toLowerCase(),i=e.filter(e=>e.index===n);return 1===i.length?i[0]:null}(r.value);t?L(t):alert('Spell not found! Please check your... "spell"-ing.')}),window.addEventListener("keydown",e=>{"Escape"===e.key&&s.classList.contains("is-visible")&&_()}),s.addEventListener("click",e=>{e.target===s&&_()}),y.addEventListener("click",_),m.addEventListener("click",()=>{h.classList.toggle("hidden"),h.classList.contains("hidden")?m.innerText="Show description":m.innerText="Hide description"}),{loadingMessageHidden:v,loadList:function(){return v(!1),fetch(t).then(function(e){return e.json()}).then(function(t){t.results.forEach(function(t){!function(t){"object"==typeof t&&Object.keys(t).every((e,t)=>e===n[t])&&e.push(t)}({index:t.index,name:t.name,detailsUrl:`https://www.dnd5eapi.co${t.url}`})})}).catch(function(e){v(!0),console.error(e)})},getAll:function(){return e},addGridItem:function(e){let t=document.createElement("div");t.classList.add("spells-grid_item");let n=document.createElement("h3");n.innerHTML=e.name,n.classList.add("spells-grid_item_title"),t.setAttribute("role","presentation"),t.setAttribute("aria-label","Click here to view spell details"),t.appendChild(n),i.appendChild(t),t.addEventListener("click",()=>L(e))}}}();spellsRepository.loadList().then(function(){spellsRepository.getAll().forEach(e=>spellsRepository.addGridItem(e)),spellsRepository.loadingMessageHidden(!0)});