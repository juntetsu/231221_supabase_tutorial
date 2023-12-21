---
tags:
  - README.md
---

- [Supabase とは](#supabase-とは)
  - [Firebase との違い](#firebase-との違い)
- [Next.js × TS × Supabase で Todo アプリ](#nextjs--ts--supabase-で-todo-アプリ)
  - [1. 適当に雛形作成](#1-適当に雛形作成)
  - [2. Supabase で RDB 作成](#2-supabase-で-rdb-作成)
    - [2-1. テーブル作成](#2-1-テーブル作成)
    - [2-2. Supabase を使う際のモジュールをインストール](#2-2-supabase-を使う際のモジュールをインストール)
    - [2-3. Initializing（初期化）](#2-3-initializing初期化)
      - [初期化用ファイル作成](#初期化用ファイル作成)
  - [3. API 作成](#3-api-作成)
    - [3-1. 読み込み](#3-1-読み込み)
    - [3-2. todo を入力して追加する API](#3-2-todo-を入力して追加する-api)
    - [3-3. 削除する API](#3-3-削除する-api)

# Supabase とは

https://supabase.com/

BaaS（Backend as a Service）と呼ばれるサービスで、MySQL や PostgreSQL といった DB を自身で作成しなくても、簡単にバックエンドを作成してくれる。

（使い方は[YouTube](https://www.youtube.com/watch?v=CZlZgRo0bZ4&t=373s)の 3:17〜）

## Firebase との違い

Firebase: NoSQL（JSON）  
Supabase: RDB（テーブル）

# Next.js × TS × Supabase で Todo アプリ

`npx create-next-app`
`npm run dev`

## 1. 適当に雛形作成

今回のメインはフロントエンドじゃないので簡単なものでいい。Tailwind でスタイル当てていく。

<small>`@/app/page.tsx`</small>

```javascript
import TodoApp from "@/app/components/TodoApp";

export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen">
      <TodoApp />
    </main>
  );
}
```

<small>`@/app/components/TodoApp.tsx`</small>

```javascript
import TodoList from "@/app/components/TodoList";
import React from "react";

const TodoApp = () => {
  return (
    <section className="text-center mb-2 text-2xl font-medium">
      <h3>Supabase Todo App</h3>
      <form>
        <input type="text" className="shadow-lg p-1 outline-none mr-2" />
        <button className="shadow-md border-2 px-1 py-1 rounded-lg bg-green-200">
          Add
        </button>
      </form>
      <TodoList />
    </section>
  );
};

export default TodoApp;
```

<small>`@/app/components/TodoList.tsx`</small>

```javascript
const TodoList = () => {
  return (
    <div>
      <ul className="mx-auto">
        <li className="flex bg-orange-200 rounded-md mt-2 mb-2 p-2 justify-between font-medium">
          ✅ ジム
          <span className="cursol-pointer">×</span>
        </li>
        <li className="flex bg-orange-200 rounded-md mt-2 mb-2 p-2 justify-between font-medium">
          ✅ 買い物
          <span className="cursol-pointer">×</span>
        </li>
        <li className="flex bg-orange-200 rounded-md mt-2 mb-2 p-2 justify-between font-medium">
          ✅ 勉強
          <span className="cursol-pointer">×</span>
        </li>
      </ul>
    </div>
  );
};

export default TodoList;
```

TodoList はまだハードコーディングだが、これから RDB を作成してそこから取得していく。

## 2. Supabase で RDB 作成

### 2-1. テーブル作成

1. `Table Editor` > `Create a new table`クリック
2. `Name`, `Description`（任意）, `Columns`を設定
3. `Save`クリック

### 2-2. Supabase を使う際のモジュールをインストール

`npm install @supabase/supabase-js`

### 2-3. Initializing（初期化）

[公式ドキュメント](https://supabase.com/docs/reference/javascript/initializing)

#### 初期化用ファイル作成

`.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=https://samplecompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=********************
```

**SUPABASE_URL**: Supabase の`Project Settings` > `Project URL`コピー  
**SUPABASE_ANON_KEY**: Supabase の`Project Settings` > `Project API keys`コピー

`@/app/utils/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

末尾の`!`は`非nullアサーション演算子`

> null 許容型(T | null または T | null | undefined)に対して、非 null アサーション(!)を使用することで、その型が null | undefined ではなく T であることをコンパイラに明示できます。

## 3. API 作成

### 3-1. 読み込み

公式ドキュメント [Fetch data](https://supabase.com/docs/reference/javascript/select?example=getting-your-data)

いきなり追加などの API 作成する前に、まずは読み込み

1. Supabase のテーブルから、`Insert` > 値を入力して`Save`
2. 注意点として、テーブルが`No active RLS policies`になっていると取得できないので、`Disable RLS`してあげる。（Warning 出るので後で詳しく調べる必要あり）
3. `utils/api.ts`作成

<small>`utils/api.ts`</small>

```typescript
// supabaseをimport
import { supabase } from "@/app/utils/supabase";

// 全てのtodoを取得する関数
export const getAllTodos = async () => {
  // supabaseのtodoテーブルから全てのデータを取得
  const todos = await supabase.from("todo").select("*");

  // 取得したデータを返す
  return todos.data;
};
```

<small>`components/TodoApp.tsx`</small>

```typescript
"use client";

import { useEffect, useState } from "react";
import TodoList from "@/app/components/TodoList";
import { getAllTodos } from "@/app/utils/api";

// 型
export interface TodosType {
  id: number;
  title: string;
}

const TodoApp = () => {
  // useStateでtodosを管理
  const [todos, setTodos] = useState<TodosType[] | null>([]);

  // ページ読み込み時に一回だけ発火させたいのでuseEffect
  useEffect(() => {
    const getTodos = async () => {
      const todos = await getAllTodos();
      setTodos(todos);
      console.log(todos);
    };

    // getTodos関数を実行
    getTodos();
  }, []);

  return (
    <section className="text-center mb-2 text-2xl font-medium">
      ...
      {/* propsでtodosを渡す */}
      <TodoList todos={todos} />
    </section>
  );
};

export default TodoApp;
```

<small>`components/TodoList.tsx`</small>

```typescript
import { TodosType } from "@/app/components/TodoApp";

interface TodoListProps {
  todos: TodosType[] | null;
}

const TodoList = ({ todos }: TodoListProps) => {
  return (
    <div>
      <ul className="mx-auto">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="flex bg-orange-200 rounded-md mt-2 mb-2 p-2 justify-between font-medium"
          >
            ✅ {todo.title}
            <span className="cursor-pointer">×</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
```

これで取得は完了。

### 3-2. todo を入力して追加する API

公式ドキュメント[Insert data](https://supabase.com/docs/reference/javascript/insert)

<small>`utils/api.ts`</small>

```typescript
// todoを追加する関数
export const addTodo = async (title: string) => {
  // supabaseのtodoテーブルにデータを追加
  await supabase.from("todo").insert({ title: title });
};
```

<small>`components/TodoApp.tsx`</small>

```typescript
"use client";

import { FormEvent, MouseEvent, useEffect, useState } from "react";
import TodoList from "@/app/components/TodoList";
import { addTodo, getAllTodos } from "@/app/utils/api";

...

const TodoApp = () => {
  // useStateでtodosを管理
  const [todos, setTodos] = useState<TodosType[] | null>([]);
  // useStateでtitleを管理
  const [title, setTitle] = useState<string>("");

  ...

  // フォームの入力値をtitleにセット
  // MouseEvent<HTMLButtonElement>はボタンがクリックされた時のイベントの型
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    // デフォルトのイベントをキャンセル（ページのリロードを防ぐ）
    e.preventDefault();

    // titleが空の場合は処理を中断
    if (!title) return;

    // addTodo関数を実行
    await addTodo(title);

    // これがないと、DBに追加したtodoがブラウザに反映されない
    let newTodos = await getAllTodos();
    setTodos(newTodos);

    // titleを空にする
    setTitle("");
  };

  return (
    <section className="text-center mb-2 text-2xl font-medium">
      <h3>Supabase Todo App</h3>
      <form>
        <input
          type="text"
          className="shadow-lg p-1 outline-none mr-2"
          // inputが変更されるたびにtitleを更新
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <button
          className="shadow-md border-2 px-1 py-1 rounded-lg bg-green-200"
          // onClickでhandleSubmitを発火させる
          onClick={(e) => handleSubmit(e)}
        >
          Add
        </button>
      </form>
      <TodoList todos={todos} />
    </section>
  );
};

export default TodoApp;
```

...多分もっといい書き方はある

### 3-3. 削除する API

公式ドキュメント　[Delete data](https://supabase.com/docs/reference/javascript/delete)

<small>`utils/api.ts`</small>

```typescript
// todoを削除する関数
export const deleteTodo = async (id: number) => {
  // supabaseのtodoテーブルからデータを削除
  await supabase.from("todo").delete().eq("id", id);
};
```

<small>`components/TodoList.tsx`</small>

```typescript
import { TodosType } from "@/app/components/TodoApp";
import { deleteTodo, getAllTodos } from "@/app/utils/api";
import { get } from "http";

interface TodoListProps {
  todos: TodosType[] | null;
  setTodos: React.Dispatch<React.SetStateAction<TodosType[] | null>>;
}

const TodoList = ({ todos, setTodos }: TodoListProps) => {
  // 削除した後、再レンダリングをするためにsetTodosを受け取る

  // 削除ボタンが押された時の処理
  const handelDelete = async (id: number) => {
    await deleteTodo(id);

    const todos = await getAllTodos();
    setTodos(todos);
  };
  return (
    <div>
      <ul className="mx-auto">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="flex bg-orange-200 rounded-md mt-2 mb-2 p-2 justify-between font-medium"
          >
            ✅ {todo.title}
            <span
              className="cursor-pointer"
              // 削除ボタンが押された時にidを引数にしてhandelDelete関数を実行
              onClick={() => handelDelete(todo.id)}
            >
              ×
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
```

削除ボタンクリック後、再レンダリングさせるためにsetTodosをTodoApp.tsxからpropsで渡しているが、正直いい書き方ではないので後で調べる。