// =====================
const SUPABASE_URL = "https://ajilqmhulukgnljjklwz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4iQaavGyaW6GSEjQdwCLKw_skhKUv6T";
// =====================

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const commentsDiv = document.getElementById("comments");

/* =========================
   🔥 ブラウザごとのユーザーID生成
========================= */
function getUserId() {
  let id = localStorage.getItem("user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("user_id", id);
  }
  return id;
}

/* =========================
   コメント読み込み
========================= */
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

  const myId = getUserId();

  data.forEach(c => {
    const div = document.createElement("div");
    div.className = "comment";

    const content = document.createElement("div");
    content.innerHTML = `
      <strong>${escapeHTML(c.name)}</strong><br>
      ${escapeHTML(c.comment)}
    `;

    div.appendChild(content);

    // 🔥 自分のコメントだけ削除ボタン表示
    if (c.user_id === myId) {
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
      };

      div.appendChild(deleteBtn);
    }

    commentsDiv.appendChild(div);
  });
}

/* =========================
   コメント送信
========================= */
async function sendComment() {
  const name = document.getElementById("name").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!name || !comment) return;

  const { error } = await supabaseClient
    .from("comments")
    .insert([{
      name: name,
      comment: comment,
      user_id: getUserId()  // 🔥 ここが重要
    }]);

  if (error) {
    console.error(error);
    alert("保存できませんでした");
    return;
  }

  document.getElementById("name").value = "";
  document.getElementById("comment").value = "";

  loadComments();
}

/* =========================
   XSS対策
========================= */
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* 初期読み込み */
loadComments();
