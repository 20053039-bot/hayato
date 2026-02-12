// =====================
// 🔥 自分の情報に変更
// =====================
const SUPABASE_URL = "https://ajilqmhulukgnljjklwz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4iQaavGyaW6GSEjQdwCLKw_skhKUv6T";
// =====================

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const commentsDiv = document.getElementById("comments");

async function loadComments() {
  const { data, error } = await supabaseClient
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  commentsDiv.innerHTML = "";

  data.forEach(c => {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
      <strong>${escapeHTML(c.name)}</strong><br>
      ${escapeHTML(c.comment)}
    `;
    commentsDiv.appendChild(div);
  });
}

async function sendComment() {
  const name = document.getElementById("name").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!name || !comment) return;

  const { error } = await supabaseClient
    .from("comments")
    .insert([{ name: name, comment: comment }]);

  if (error) {
    console.error(error);
    alert("保存できませんでした");
    return;
  }

  document.getElementById("name").value = "";
  document.getElementById("comment").value = "";

  loadComments();
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

loadComments();
