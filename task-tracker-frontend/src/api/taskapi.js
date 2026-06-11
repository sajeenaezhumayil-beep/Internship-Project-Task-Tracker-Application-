//Railway build fix
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/tasks";

export const getTasks = async () => {

  return await axios.get(BASE_URL);

};

export const createTask = async (task) => {

  return await axios.post(

    BASE_URL,

    task

  );

};

export const deleteTaskAPI = async (id) => {

  return await axios.delete(

    `${BASE_URL}/${id}`

  );

};

export const updateTaskAPI = async (id, data) => {

  return await axios.put(

    `${BASE_URL}/${id}`,

    data

  );

};

export const suggestPriority = async (title) => {

  return await axios.post(

    "http://127.0.0.1:8000/suggest-priority",

    {
      title
    }

  );

};