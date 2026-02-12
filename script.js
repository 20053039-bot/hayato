// =====================
// 🔥 自分の情報
// =====================
const SUPABASE_URL = "https://ajilqmhulukgnljjklwz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4iQaavGyaW6GSEjQdwCLKw_skhKUv6T";
// =====================

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const commentsDiv = document.getElementById("comments");

const currentUser = localStorage.getItem("chatUser") || prompt("名前を入力してください");
localStorage.setItem("chatUser", currentUser);

// =====================
// コメント読み込み
// =====================
async function loadComments() {
  const { data, error } = await supabaseClient
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("取得エラー:", error);
    return;
  }

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

// =====================
// コメント送信
// =====================
async function sendComment() {
  const commentText = document.getElementById("comment").value.trim();
  if (!commentText) return;

  const { error } = await supabaseClient
    .from("comments")
    .insert([
      {
        name: currentUser,
        comment: commentText,
        user_id: currentUser,
        created_at: new Date()
      }
    ]);

  if (error) {
    console.error("保存エラー:", error);
    alert("保存できませんでした");
    return;
  }

  document.getElementById("comment").value = "";
  loadComments();
}

// =====================
// 削除（自分のみ表示される）
// =====================
async function deleteComment(id) {
  const { error } = await supabaseClient
    .from("comments")
    .delete()
    .eq("id", id)
    .eq("user_id", currentUser);

  if (error) {
    console.error("削除エラー:", error);
    return;
  }

  loadComments();
}

// =====================
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

loadComments();
