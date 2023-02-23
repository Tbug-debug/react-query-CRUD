import React, { FormEvent, useState } from "react";
import "./App.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addToDo, deleteToDo, getList, modifyToDo } from "./api/api";

interface List {
  id: number;
  title: string;
  body: string;
  isDone: boolean;
}

function App() {
  // GET 데이터 불러오기
  const { data, isLoading, isError } = useQuery("list", getList);
  const [text, setText] = useState({
    title: "",
    body: "",
  });

  const queryClient = useQueryClient();

  //POST 데이터 추가하기
  const muation = useMutation(addToDo, {
    onSuccess: () => {
      queryClient.invalidateQueries("list");
    },
  });

  // DELETE 데이터 삭제하기
  const delte = useMutation(deleteToDo, {
    onSuccess: () => {
      queryClient.invalidateQueries("list");
    },
  });

  // PATCH 데이터 수정하기
  const modify = useMutation(modifyToDo, {
    onSuccess: () => {
      queryClient.invalidateQueries("list");
    },
  });

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText({ ...text, title: e.target.value });
  };

  const onChangeBody = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText({ ...text, body: e.target.value });
  };

  const onSubmitValue = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = {
      title: text.title,
      body: text.body,
      isDone: false,
    };

    muation.mutate(form);
    setText({ title: "", body: "" });
  };

  const onDeleteList = (id: number) => {
    delte.mutate(id);
  };

  const onModifyList = async (id: number) => {
    const list = data?.data.filter((a: List) => a.id === id);
    const obj = {
      id: list[0].id,
      title: list[0].title,
      body: list[0].body,
      isDone: !list[0].isDone,
    };
    modify.mutate(obj);
  };

  return (
    <div>
      <div>
        <form onSubmit={onSubmitValue}>
          <input value={text.title} onChange={onChangeTitle} type="text" />
          <input value={text.body} onChange={onChangeBody} type="text" />
          <button>제출하기</button>
        </form>
      </div>
      <div>
        {isLoading ? (
          <h1>로딩중입니다.</h1>
        ) : (
          data?.data.map((a: List) => {
            return (
              <div key={a.id}>
                <h1>{a.title}</h1>
                <h2>{a.body}</h2>
                <button onClick={() => onDeleteList(a.id)}>삭제</button>
                <button onClick={() => onModifyList(a.id)}>
                  {a.isDone ? "완료" : "취소"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;
