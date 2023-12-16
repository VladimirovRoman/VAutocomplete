import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchComments = createAsyncThunk('VAutocomplete/fetchComments', async () => {
    // Имитация задержки получения данных
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await fetch('https://jsonplaceholder.typicode.com/comments');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
});