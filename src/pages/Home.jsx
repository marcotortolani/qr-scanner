import { useState } from "preact/hooks";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorage from "../helpers/useLocalStorage";

const userInitial = "";

export default function Home() {
  const [user, setUser] = useLocalStorage("userName", userInitial);
  const [nameInput, setNameInput] = useState(user);
  const navigate = useNavigate();

  function handleChange(e) {
    e.preventDefault();

    if (e.target.id === "user") {
      console.log(e.target.value);
      setNameInput(e.target.value);
    }
  }

  function handleAccept() {
    setUser(nameInput);
    navigate("/enter-data");
  }

  return (
    <main className="w-screen max-w-md h-screen flex flex-col items-center justify-around">
      <input
        onChange={(e) => handleChange(e)}
        //onChange={handleChange}
        className=" w-10/12 h-14 p-4 rounded-2xl text-2xl text-center"
        type="text"
        name="user"
        id="user"
        value={nameInput}
        placeholder="Nombre de Usuario"
      />

      <button
        disabled={nameInput==="" ? true : false}
        onClick={handleAccept}
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
        bg-blue-800 disabled:bg-gray-500 disabled:shadow-none disabled:text-gray-700"
      >
        Crear nuevo picking
      </button>
      
    </main>
  );
}
