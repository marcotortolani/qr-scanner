import { useState, useEffect } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import QrReader from "react-web-qr-reader";
import useLocalStorage from "../helpers/useLocalStorage";
import useSound from "use-sound";

//import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch, withAxios } from 'react-axios';
import axios from 'redaxios';

const elementPicked = {
  sku: "",
  location: "",
  amount: 0,
};

const pickingCompleted = {
  typeMovement: "",
  date: "",
  timeInitial: "",
  timeFinish: "",
  cart: 0,
  name: "",
  elementsPicked: [],
};

const date = new Date();
const DATE = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
const TIME_INITIAL = `${date.getHours()}:${date.getMinutes()}`;

export default function Picking() {
  const delay = 500;

  const [scanOkSound] = useSound("/sounds/scanner-beep.mp3");
  const [scanErrorSound] = useSound("/sounds/8bit-error.mp3");
  const navigate = useNavigate();
  const [pickingStored, setPickingStored] = useLocalStorage(
    "pickingStored",
    []
  );
  const [typeMovement, setTypeMovement] = useLocalStorage("typeMovement");
  const [user, setUser] = useLocalStorage("userData");
  const [pickingCompleted, setPickingCompleted] = useLocalStorage(
    "pickingCompleted",
    []
  );

  const [result, setResult] = useState("Sin resultado");
  const [skuData, setSkuData] = useState("");
  const [locData, setLocData] = useState("");
  const [amountInput, setAmountInput] = useState(0);

  const handleScan = (result) => {
    if (result) {
      scanOkSound();
      setResult(result.data);
      if (
        result.data.split("")[0] === "T" ||
        (result.data.split("")[0] === "t" &&
          result.data.split("")[1] === "B") ||
        result.data.split("")[1] === "b"
      ) {
        setSkuData(result.data);
      } else {
        setLocData(result.data);
      }
    }
  };
  const handleError = (error) => {
    console.log(error);
  };

  function handleAmountInput(e) {
    e.preventDefault();
    if (e.target.value > 0) {
      setAmountInput(e.target.value);
    } else {
      setAmountInput("");
    }
  }

  function handleStoreData() {
    const newElementPicked = {
      sku: "",
      location: "",
      amount: 0,
    };
    newElementPicked.sku = skuData;
    newElementPicked.location = locData;
    newElementPicked.amount = amountInput;

    const newData = [...pickingStored, newElementPicked];
    setPickingStored(newData);

    setSkuData("");
    setLocData("");
    setAmountInput(0);
  }

  function handleFinish() {
    const date = new Date();
    const TIME_FINISH = `${date.getHours()}:${date.getMinutes()}`;

    const newPickingCompleted = {
      typeMovement: typeMovement,
      date: DATE,
      timeInitial: TIME_INITIAL,
      timeFinish: TIME_FINISH,
      cart: user.cart,
      name: user.name,
      elementsPicked: pickingStored,
    };
    setPickingCompleted(newPickingCompleted);

    /*
    setPickingStored([]);
    setPickingCompleted([]);
    navigate("/");
    */
  }

  useEffect(() => {
    axios
      .post("https://stock-prod.deno.dev/", {
        pickingCompleted,
      })
      .then((response) => {
        console.log(response);
      });
  }, [pickingCompleted]);

  return (
    <main className="h-full mt-2 p-x-4 flex flex-col items-center justify-around gap-2">
      <div className="flex items-center gap-5">
        <h1>
          {user.name} - Carro: {user.cart}
        </h1>
        <h5>{DATE}</h5>
      </div>

      <QrReader
        className="w-[90vw] max-w-[400px] min-w-[260px]  h-auto "
        delay={delay}
        onError={handleError}
        onScan={handleScan}
      />

      <div className=" w-full flex flex-col gap-1 ">
        <h3 className=" h-10 flex items-center text-white text-center text-md bg-black">
          SKU Hijo: {skuData}
        </h3>
        <h3 className="  h-10 flex items-center text-white text-center text-md bg-black">
          Ubicación: {locData}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <input
          className=" w-32 px-0 pb-2 pt-2.5  text-center text-lg font-medium rounded-3xl"
          onChange={(e) => handleAmountInput(e)}
          type="number"
          name="quant"
          id="quant"
          placeholder="Cantidad: "
          value={amountInput > 0 ? amountInput : false}
        />

        <button
          disabled={
            skuData != "" && locData != "" && amountInput > 0 ? false : true
          }
          onClick={handleStoreData}
          type="button"
          className=" inline-block rounded-3xl bg-primary px-6 pb-2 pt-2.5 text-md font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
        bg-blue-800 disabled:bg-gray-500 disabled:shadow-none disabled:text-gray-400"
        >
          Cargar
        </button>
      </div>

      <button
        // disabled={
        //   skuData != "" && locData != "" && amountInput > 0 ? false : true
        // }
        onClick={handleFinish}
        type="button"
        className=" bg-lime-600 inline-block rounded bg-primary px-6 pb-2 pt-2.5 mt-6 text-lg font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
         disabled:bg-gray-500 disabled:shadow-none disabled:text-gray-700"
      >
        Finalizar
      </button>
    </main>
  );
}
