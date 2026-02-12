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

    const content = document.createElement("div");
    content.innerHTML = `
      <strong>${escapeHTML(c.name)}</strong><br>
      ${escapeHTML(c.comment)}
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.onclick = async () => {
      const { error } = await supabaseClient
        .from("comments")
        .delete()
        .eq("id", c.id);

      if (error) {
        alert("削除できませんでした");
        return;
      }

      loadComments();
      loadMembers();
    };

    div.appendChild(content);
    div.appendChild(deleteBtn);
    commentsDiv.appendChild(div);
  });
}

async function sendComment() {
  const name = document.getElementById("name").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!name || !comment) return;

  const { error } = await supabaseClient
    .from("comments")
    .insert([{ name, comment }]);

  if (error) {
    alert("保存できませんでした");
    return;
  }

  document.getElementById("name").value = "";
  document.getElementById("comment").value = "";

  loadComments();
  loadMembers();
}

function toggleMembers() {
  document.getElementById("members").classList.toggle("show");
}

async function loadMembers() {
  const { data, error } = await supabaseClient
    .from("comments")
    .select("name");

  if (error) return;

  const uniqueNames = [...new Set(data.map(d => d.name))];

  const memberList = document.getElementById("memberList");
  memberList.innerHTML = "";

  uniqueNames.forEach(name => {
    const p = document.createElement("p");
    p.textContent = name;
    memberList.appendChild(p);
  });
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

loadComments();
loadMembers();
