import { useState, useEffect } from "preact/hooks";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorage from "../helpers/useLocalStorage";

const userInitial = {
  name: "",
  cart: 0,
};

export default function Home() {
  const [user, setUser] = useLocalStorage("userData", userInitial);
  const [typeMovement, setTypeMovement] = useLocalStorage("typeMovement", "ingreso");
  const [nameInput, setNameInput] = useState(user.name);
  const [cartInput, setCartInput] = useState("");

  const navigate = useNavigate();

  function handleMovement() {
    if (typeMovement === "ingreso") {
      setTypeMovement("egreso");
    } else {
      setTypeMovement("ingreso");
    }
  }

  function handleName(e) {
    e.preventDefault();

    if (e.target.id === "user") {
      console.log(e.target.value);
      setNameInput(e.target.value);
    }
  }

  function handleCart(e) {
    e.preventDefault();
    if (e.target.value > 0) {
      setCartInput(e.target.value);
    }else{
      setCartInput("");
    }
  }

  function handleAccept() {
    const newUser = {
      name: "",
      cart: 0,
    };
    newUser.name = nameInput;
    newUser.cart = cartInput;
    setUser(newUser);

    navigate("/picking");
  }

  return (
    <main className="w-screen max-w-md h-screen flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-1">
      <input
        onClick={handleMovement}
        className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none  after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] 
          bg-green-400 after:bg-green-700 checked:bg-red-400 checked:after:bg-red-700"
        type="checkbox"
        role="switch"
        checked={typeMovement === "ingreso" ? false : true}
        id="flexSwitchCheckDefault01"
      />
      <div className={` flex items-center gap-2 ${typeMovement === "egreso" ? "flex-row-reverse text-red-600" : "text-green-600"} `}>
        <span>&#x21e8;</span>
        <h2 className=" uppercase">{typeMovement}</h2>
      </div>
      </div>
      

      <input
        onChange={(e) => handleName(e)}
        //onChange={handleChange}
        className=" w-10/12 h-14 p-4 mt-10 rounded-2xl text-2xl text-center"
        type="text"
        name="user"
        id="user"
        value={nameInput}
        placeholder="Nombre de Usuario"
      />

      <input
        onChange={(e) => handleCart(e)}
        //onChange={handleChange}
        className=" w-10/12 h-14 p-4 rounded-2xl text-2xl text-center"
        type="number"
        name="cart"
        id="cart"
        value={cartInput}
        placeholder="Número de Carro: "
      />
      <span>{}</span>

      <button
        disabled={nameInput != "" && cartInput > 0 ? false : true}
        onClick={handleAccept}
        type="button"
        className="inline-block rounded-xl bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
        bg-blue-800 disabled:bg-gray-500 disabled:shadow-none disabled:text-gray-300"
      >
        Empezar nuevo picking
      </button>
    </main>
  );
}
