const SUPABASE_URL = "https://ajilqmhulukgnljjklwz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4iQaavGyaW6GSEjQdwCLKw_skhKUv6T";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const commentsDiv = document.getElementById("comments");
const currentUserSpan = document.getElementById("currentUser");
const changeNameBtn = document.getElementById("changeNameBtn");

let currentUser = localStorage.getItem("username");

if (!currentUser) {
  currentUser = prompt("名前を入力してください") || "名無し";
  localStorage.setItem("username", currentUser);
}

currentUserSpan.textContent = "名前: " + currentUser;

changeNameBtn.addEventListener("click", () => {
  const newName = prompt("新しい名前を入力");
  if (!newName) return;

  currentUser = newName.trim();
  localStorage.setItem("username", currentUser);
  currentUserSpan.textContent = "名前: " + currentUser;
});

async function loadComments() {
  const { data } = await supabaseClient
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  commentsDiv.innerHTML = "";

  data.forEach(c => {
    const div = document.createElement("div");
    div.className = "comment";

    div.innerHTML = `
      <strong>${escapeHTML(c.name)}</strong><br>
      ${escapeHTML(c.comment)}
      ${
        c.user_id === currentUser
          ? `<br><button onclick="deleteComment(${c.id})">削除</button>`
          : ""
      }
    `;

    commentsDiv.appendChild(div);
  });
}

async function sendComment() {
  const commentText = document.getElementById("comment").value.trim();
  if (!commentText) return;

  await supabaseClient.from("comments").insert([
    {
      name: currentUser,
      comment: commentText,
      user_id: currentUser,
      created_at: new Date()
    }
  ]);

  document.getElementById("comment").value = "";
  loadComments();
}

async function deleteComment(id) {
  await supabaseClient
    .from("comments")
    .delete()
    .eq("id", id)
    .eq("user_id", currentUser);

  loadComments();
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

loadComments();
