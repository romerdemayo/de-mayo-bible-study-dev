/* De Mayo Bible Studies - Build 1.24.1 Interactive Library Dashboard */
(function(){
'use strict';
const ROUTES={notes:'verseNotes',prayers:'prayerlibrary',reels:'reelcreator',social:'socialstudio',favourites:'favourites'};
function go(page){
 if(typeof window.route==='function')window.route(page);
 else location.hash=page;
}
function openResources(){
 const resourcesFilter=document.querySelector('.dm-library-filter[data-lib-filter="resources"]');
 if(resourcesFilter)resourcesFilter.click();
 const main=document.querySelector('.dm-library-main');
 if(main)main.scrollIntoView({behavior:'smooth',block:'start'});
}
function activate(card){
 const category=card?.dataset?.libFilter;
 if(!category)return;
 if(category==='resources'){openResources();return;}
 const route=ROUTES[category];
 if(route)go(route);
}
function enhance(){
 if(location.hash!=='#mylibrary')return;
 document.querySelectorAll('.dm-library-stat').forEach(card=>{
  card.dataset.dmDashboardLink='1';
  card.setAttribute('aria-label',`Open ${card.querySelector('span:not(.dm-stat-icon)')?.textContent||card.dataset.libFilter}`);
  card.title='Tap to open';
 });
}
document.addEventListener('click',event=>{
 const card=event.target.closest('.dm-library-stat[data-lib-filter]');
 if(!card)return;
 event.preventDefault();
 event.stopImmediatePropagation();
 activate(card);
},true);
document.addEventListener('keydown',event=>{
 const card=event.target.closest?.('.dm-library-stat[data-lib-filter]');
 if(!card||!['Enter',' '].includes(event.key))return;
 event.preventDefault();activate(card);
});
const style=document.createElement('style');
style.textContent=`.dm-library-stat[data-dm-dashboard-link]{cursor:pointer;transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease}.dm-library-stat[data-dm-dashboard-link]:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(25,55,47,.12)}.dm-library-stat[data-dm-dashboard-link]:active{transform:scale(.98)}.dm-library-stat[data-dm-dashboard-link]:focus-visible{outline:3px solid var(--accent,#2f7d68);outline-offset:3px}`;
document.head.appendChild(style);
window.addEventListener('load',()=>setTimeout(enhance,80));
window.addEventListener('hashchange',()=>setTimeout(enhance,80));
document.addEventListener('click',event=>{if(event.target.closest('#dmMyLibraryNav'))setTimeout(enhance,100)});
})();
