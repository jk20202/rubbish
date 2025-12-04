const ITEMS=[
{id:"cardboard-box",img:"assets/trash/cardboard-box.svg",category:"recyclable",label:"纸箱"},
{id:"glass-cup",img:"assets/trash/glass-cup.svg",category:"recyclable",label:"玻璃杯"},
{id:"coat",img:"assets/trash/coat.svg",category:"recyclable",label:"外衣"},
{id:"cfl-lamp",img:"assets/trash/cfl-lamp.svg",category:"hazardous",label:"废节能灯"},
{id:"insecticide",img:"assets/trash/insecticide.svg",category:"hazardous",label:"杀虫剂"},
{id:"li-battery",img:"assets/trash/li-battery.svg",category:"hazardous",label:"废锂电池"},
{id:"disinfectant",img:"assets/trash/disinfectant.svg",category:"hazardous",label:"消毒液"},
{id:"apple-core",img:"assets/trash/apple-core.svg",category:"wet",label:"苹果核"},
{id:"eggs",img:"assets/trash/eggs.svg",category:"wet",label:"鸡蛋和壳"},
{id:"cake",img:"assets/trash/image.png",category:"wet",label:"蛋糕"},
]
const BUCKETS=[
{id:"bin-recyclable",category:"recyclable",label:"可回收物",color:"#2f80ed"},
{id:"bin-wet",category:"wet",label:"湿垃圾",color:"#27ae60"},
{id:"bin-dry",category:"dry",label:"干垃圾",color:"#7f8c8d"},
{id:"bin-hazardous",category:"hazardous",label:"有害垃圾",color:"#eb5757"}
]
const grid=document.getElementById("trash-grid")
const buckets=document.getElementById("buckets")
const toastContainer=document.getElementById("toast-container")
function renderItems(){
ITEMS.forEach(it=>{
const wrap=document.createElement("div")
wrap.className="trash-item"
wrap.dataset.id=it.id
wrap.dataset.category=it.category
const img=document.createElement("img")
img.src=it.img
img.alt=it.label
img.draggable=true
img.dataset.id=it.id
img.dataset.category=it.category
const label=document.createElement("div")
label.className="label"
label.textContent=it.label
wrap.appendChild(img)
wrap.appendChild(label)
grid.appendChild(wrap)
bindItem(img)
})
}
function renderBuckets(){
BUCKETS.forEach(b=>{
const el=document.createElement("div")
el.className=`bucket ${b.category}`
el.id=b.id
el.dataset.category=b.category
const mouth=document.createElement("div")
mouth.className="mouth"
const label=document.createElement("div")
label.className="label"
label.textContent=b.label
el.appendChild(mouth)
el.appendChild(label)
buckets.appendChild(el)
bindBucket(el)
})
}
function bindItem(img){
img.addEventListener("dragstart",e=>{
e.dataTransfer.setData("text/plain",img.dataset.id)
e.dataTransfer.effectAllowed="move"
})
}
function bindBucket(el){
el.addEventListener("dragover",e=>{e.preventDefault();el.classList.add("dragover")})
el.addEventListener("dragleave",()=>el.classList.remove("dragover"))
el.addEventListener("drop",e=>{
e.preventDefault()
el.classList.remove("dragover")
const id=e.dataTransfer.getData("text/plain")
const itemWrap=[...grid.children].find(c=>c.dataset.id===id)
if(!itemWrap)return
const itemImg=itemWrap.querySelector("img")
if(itemWrap.classList.contains("sorted"))return
const itemCat=itemImg.dataset.category
const binCat=el.dataset.category
  if(itemCat===binCat){
el.classList.add("success")
setTimeout(()=>el.classList.remove("success"),350)
    animateToBucket(itemImg,el,itemWrap,()=>{itemImg.draggable=false;itemWrap.remove()})
showToast("分类正确","success")
}else{
showToast("垃圾分类错误","error")
}
})
}
function showToast(text,type){
const t=document.createElement("div")
t.className=`toast ${type||""}`
t.textContent=text
toastContainer.innerHTML=""
toastContainer.appendChild(t)
setTimeout(()=>{if(t.parentNode)toastContainer.removeChild(t)},2000)
}
function animateToBucket(img,bin,wrap,done){
const r=img.getBoundingClientRect()
const br=bin.getBoundingClientRect()
const clone=img.cloneNode(true)
clone.className="flying"
clone.style.left=`${r.left}px`
clone.style.top=`${r.top}px`
clone.style.transform="translate(0,0) scale(1)"
document.body.appendChild(clone)
if(wrap){wrap.style.visibility="hidden"}
const targetX=br.left+br.width/2-32
const targetY=br.top+30
requestAnimationFrame(()=>{
clone.style.transform=`translate(${targetX-r.left}px,${targetY-r.top}px) scale(.6)`
clone.style.opacity="0"
})
clone.addEventListener("transitionend",()=>{if(clone&&clone.parentNode)clone.parentNode.removeChild(clone);if(typeof done==="function")done()},{once:true})
}
renderItems()
renderBuckets()
