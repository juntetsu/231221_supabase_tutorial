// supabaseをimport
import { supabase } from "@/app/utils/supabase";

// 全てのtodoを取得する関数
export const getAllTodos = async () => {
  // supabaseのtodoテーブルから全てのデータを取得
  const todos = await supabase.from("todo").select("*");

  // 取得したデータを返す
  return todos.data;
};
