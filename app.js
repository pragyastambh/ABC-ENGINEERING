const API_URL = ""; // Set the deployed Google Apps Script Web App URL here.

function api(action, data={}) {
  if (!API_URL) return Promise.resolve({ok:true, demo:true, action, data});
  return fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,...data})})
    .then(r=>r.json());
}

function showLogin(type){
  document.getElementById("loginModal").classList.remove("hidden");
  document.getElementById("loginTitle").textContent=type==="admin"?"Admin Login":"Customer Login";
  document.getElementById("loginForm").dataset.type=type;
  document.getElementById("loginMessage").textContent="";
}
function hideLogin(){document.getElementById("loginModal").classList.add("hidden")}
function logout(){sessionStorage.clear();location.href="index.html"}

document.getElementById("loginForm")?.addEventListener("submit",async e=>{
  e.preventDefault();
  const type=e.currentTarget.dataset.type;
  const email=document.getElementById("loginEmail").value.trim();
  const access=document.getElementById("loginAccess").value.trim();
  const res=await api("login",{type,email,access});
  if(res.ok && !res.demo){
    sessionStorage.setItem("sessionToken",res.token);
    sessionStorage.setItem("role",type);
    location.href=type==="admin"?"admin.html":"customer.html";
  }else if(res.demo){
    document.getElementById("loginMessage").textContent="Demo mode: connect the Apps Script Web App URL in app.js.";
  }else{
    document.getElementById("loginMessage").textContent=res.message||"Login failed.";
  }
});

function initAdmin(){
  document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>{
    document.querySelectorAll(".nav-btn").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".screen").forEach(x=>x.classList.add("hidden"));
    b.classList.add("active");document.getElementById(b.dataset.screen).classList.remove("hidden");
  }));
  document.getElementById("customerForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    const payload={name:cName.value,company:cCompany.value,email:cEmail.value,access:cAccess.value,mobile:cMobile.value,status:cStatus.value};
    const r=await api("createCustomer",payload); alert(r.demo?"Demo form: Apps Script not connected yet.":(r.message||"Saved."));
  });
  document.getElementById("serviceForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    const r=await api("createService",{title:sTitle.value,description:sDescription.value,order:sOrder.value,status:sStatus.value});
    alert(r.demo?"Demo form: Apps Script not connected yet.":(r.message||"Saved."));
  });
  document.getElementById("settingsForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    const r=await api("saveSettings",{business:setBusiness.value,email:setEmail.value,sender:setSender.value,invoicePrefix:setInvoicePrefix.value});
    alert(r.demo?"Demo form: Apps Script not connected yet.":(r.message||"Saved."));
  });
  document.getElementById("drawingForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    const r=await api("addDrawing",{customerId:dCustomer.value,projectId:dProject.value,title:dTitle.value,revision:dRevision.value,driveLink:dDriveLink.value,remarks:dRemarks.value});
    alert(r.demo?"Demo form: Apps Script not connected yet.":(r.message||"Saved."));
  });
}

function initCustomer(){
  const token=sessionStorage.getItem("sessionToken");
  if(!token) { location.href="index.html"; return; }
  api("customerDashboard",{token}).then(r=>{
    if(!r.ok)return;
    customerWelcome.textContent=r.customer?.name?`Welcome, ${r.customer.name}`:"My Projects";
    customerStatus.textContent=r.message||"";
    const box=document.getElementById("customerProjects");
    box.innerHTML=(r.projects||[]).map(p=>`<div class="card"><h2>${escapeHtml(p.name)}</h2><p>${escapeHtml(p.description||"")}</p><div class="file-actions"><button class="btn" onclick="viewFile('${p.fileId||""}')">VIEW</button><button class="btn" onclick="downloadFile('${p.fileId||""}')">DOWNLOAD</button></div></div>`).join("");
  });
}
function viewFile(fileId){api("viewFile",{token:sessionStorage.getItem("sessionToken"),fileId}).then(r=>{if(r.url)window.open(r.url,"_blank");});}
function downloadFile(fileId){api("downloadFile",{token:sessionStorage.getItem("sessionToken"),fileId}).then(r=>{if(r.url)window.open(r.url,"_blank");});}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
