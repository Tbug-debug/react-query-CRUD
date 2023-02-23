import axios from "axios";

interface List {
  id: number;
  title: string;
  body: string;
  isDone: boolean;
}

export const getList = async () => {
  const response = await axios.get("API/list");
  return response;
};

export const addToDo = async (lists: { title: string; body: string }) => {
  const response = await axios.post("API/list", lists);
  return response;
};

export const deleteToDo = async (id: number) => {
  const response = await axios.delete(`API/list/${id}`);
  return response;
};

export const modifyToDo = async (isDone: List) => {
  const data = await axios.patch(
    `API/list/${isDone.id}`,
    isDone
  );
  return data;
};
