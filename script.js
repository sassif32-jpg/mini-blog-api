// script.js - Mini Blog API con JSONPlaceholder
// Pagine previste:
// - posts.html -> deve contenere: <div id="posts-list" class="row g-4"></div>
// - autori.html -> deve contenere: <div id="authors-list" class="row g-4"></div>
const JSONPLACEHOLDER_BASE = "https://jsonplaceholder.typicode.com";

document.addEventListener("DOMContentLoaded", () => {
if (document.querySelector("#posts-list")) {
loadPosts();
}
if (document.querySelector("#authors-list")) {
loadAuthors();
}
});
async function getJSON(url) {
const response = await fetch(url);
if (!response.ok) {
throw new Error(`Errore HTTP: ${response.status}`);
}
return await response.json();
}
function escapeHTML(value) {
return String(value)
.replaceAll("&", "&amp;")
.replaceAll("<", "&lt;")
.replaceAll(">", "&gt;")
.replaceAll('"', "&quot;")
.replaceAll("'", "&#039;");
}
function showAlert(container, message, type = "warning") {
container.innerHTML = `
<div class="col-12">
<div class="alert alert-${type}" role="alert">
${escapeHTML(message)}
</div>
</div>
`;
}
async function loadPosts() {
const container = document.querySelector("#posts-list");
showAlert(container, "Caricamento post in corso...", "info");
try {
const [posts, users] = await Promise.all([
getJSON(`${JSONPLACEHOLDER_BASE}/posts`),
getJSON(`${JSONPLACEHOLDER_BASE}/users`)
]);
const usersById = new Map(users.map(user => [user.id, user]));
const visiblePosts = posts.slice(0, 12);
container.innerHTML = visiblePosts.map(post => {
const author = usersById.get(post.userId);
const authorName = author ? author.name : `Autore #${post.userId}`;
return `
<div class="col-md-4">
<article class="card h-100 shadow-sm">
<div class="card-body d-flex flex-column">
<span class="badge text-bg-primary mb-2 align-self-start">Post #${post.id}</span>
<h2 class="h5 card-title">${escapeHTML(post.title)}</h2>
<p class="card-text flex-grow-1">${escapeHTML(post.body)}</p>
<p class="small text-body-secondary mb-0">Autore: ${escapeHTML(authorName)}</p>
</div>
</article>
</div>
`;
}).join("");
} catch (error) {
showAlert(container, `Impossibile caricare i post. Dettaglio: ${error.message}`, "danger");
}
}
async function loadAuthors() {
const container = document.querySelector("#authors-list");
showAlert(container, "Caricamento autori in corso...", "info");
try {
const users = await getJSON(`${JSONPLACEHOLDER_BASE}/users`);

container.innerHTML = users.slice(0, 10).map(user => `
<div class="col-md-6 col-lg-4">
<article class="card h-100 shadow-sm">
<div class="card-body">
<h2 class="h5 card-title">${escapeHTML(user.name)}</h2>
<p class="card-text mb-1"><strong>Email:</strong> ${escapeHTML(user.email)}</p>
<p class="card-text mb-1"><strong>Citta:</strong> ${escapeHTML(user.address.city)}</p>
<p class="card-text"><strong>Azienda:</strong> ${escapeHTML(user.company.name)}</p>
<span class="badge text-bg-secondary">User ID: ${user.id}</span>
</div>
</article>
</div>
`).join("");
} catch (error) {
showAlert(container, `Impossibile caricare gli autori. Dettaglio: ${error.message}`, "danger");
}
}