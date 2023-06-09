import { useState, useEffect, useCallback } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import QrReader from "react-web-qr-reader";
import useLocalStorage from "../helpers/useLocalStorage";
import debounce from "lodash.debounce";
import axios from "redaxios";
import useSound from "use-sound";

const date = new Date();
const DATE = `${date.getFullYear()}-${
  date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth()
}-${date.getDate()}`;
const TIME_INITIAL = `${date.getHours()}:${
  date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
}`;

const elementPicked = {
  sku: "",
  location: "",
  amount: 0,
};

const pickingCompletedInitial = {
  typeMovement: "",
  date: "",
  timeInitial: "",
  timeFinish: "",
  cart: 0,
  name: "",
  elementsPicked: [],
};

export default function Picking() {
  const delay = 500;

  const [scanOkSound] = useSound("/sounds/scanner-beep.mp3");
  const [scanErrorSound] = useSound("/sounds/8bit-error.mp3");
  const navigate = useNavigate();

  const [typeMovement, setTypeMovement] = useLocalStorage("typeMovement");
  const [user, setUser] = useLocalStorage("userData");

  const pickingCompletedInitial = {
    date: DATE,
    timeInitial: TIME_INITIAL,
    timeFinish: "",
    name: user.name,
    cart: user.cart,
    typeMovement: typeMovement,
    elementsPicked: [],
  };

  const [pickingStored, setPickingStored] = useState([]);
  const [pickingCompleted, setPickingCompleted] = useState(
    pickingCompletedInitial
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
      setAmountInput(parseInt(e.target.value));
    } else {
      setAmountInput(0);
    }
  }
  useEffect(() => {
    const newPickingCompleted = pickingCompleted;
    if (pickingStored.length > 0) {
      newPickingCompleted.elementsPicked = pickingStored;
      setPickingCompleted(newPickingCompleted);
    }
  }, [pickingStored]);

  function handleStoreData() {
    const newElementPicked = {
      sku: "",
      location: "",
      amount: 0,
    };
    newElementPicked.sku = skuData;
    newElementPicked.location = locData;
    newElementPicked.amount = amountInput;

    const newPickingStored = [...pickingStored, newElementPicked];
    setPickingStored(newPickingStored);

    setSkuData("");
    setLocData("");
    setAmountInput(0);
  }

  const submitData = async (event) => {
    const date = new Date();
    const TIME_FINISH = `${date.getHours()}:${date.getMinutes()}`;

    const dataToRequest = pickingCompleted;
    dataToRequest.timeFinish = TIME_FINISH;

    const data = await fetch("https://stock-qrs.deno.dev/", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToRequest),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setTimeout(() => {
      setPickingStored([]);
      setPickingCompleted({});
      navigate("/");
    }, 100);
  };

  function handlerButtonHome() {
    setPickingStored([]);
    setPickingCompleted({});
    navigate("/");
  }

  const submitDataHandler = useCallback(debounce(submitData, 300), []);

  return (
    <main className="h-full mt-2 flex flex-col items-center justify-around gap-0">
      <div className="w-full max-w-lg h-10 p-2 bg-black flex items-end justify-center gap-10 rounded-xl">
        <div className="flex items-center gap-2">
          <h1 className=" text-lg font-light">{user.name}</h1>

          {user.cart && (
            <>
              <span>-</span>
              <h2 className=" text-lg font-bold">Carro: {user.cart}</h2>
            </>
          )}
        </div>
        <div
          className={` flex items-center gap-1 text-sm
          ${
            typeMovement === "egreso"
              ? "flex-row-reverse text-red-600"
              : "text-green-600"
          } `}
        >
          <span className="text-xl">&#x21e8;</span>
          <h2 className=" uppercase">{typeMovement}</h2>
        </div>
        {/* <h5 className="text-sm">{DATE}</h5> */}
      </div>

      <QrReader
        className="w-[80vw] max-w-[400px] min-w-[260px]  h-auto "
        delay={delay}
        onError={handleError}
        onScan={handleScan}
      />

      <div className=" w-[95vw] flex flex-col items-center gap-1 ">
        <h3 className=" w-full  max-w-lg h-10 px-2 flex items-center text-white text-center text-sm bg-black rounded-xl">
          SKU Hijo: <span className=" m-auto text-md">{skuData}</span>
        </h3>
        <h3 className=" w-full  max-w-lg h-10 px-2 flex items-center text-white text-center text-md bg-black rounded-xl">
          Ubicación: <span className=" m-auto text-md">{locData}</span>
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <input
          className=" w-32 px-0 pb-2 pt-2.5  text-center text-lg font-medium rounded-3xl"
          onChange={(e) => handleAmountInput(e)}
          type="number"
          name="amount"
          id="amount"
          value={amountInput > 0 ? amountInput : false}
          placeholder="Cantidad: "
        />

        <button
          disabled={
            skuData != "" && locData != "" && amountInput > 0 ? false : true
          }
          onClick={handleStoreData}
          type="button"
          className=" inline-block rounded-3xl bg-primary px-6 pb-2 pt-2.5 text-md font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
        
        bg-blue-800 disabled:bg-gray-500 disabled:shadow-none disabled:text-gray-400"
        >
          Cargar
        </button>
      </div>
      <div className=" flex items-center justify-around gap-10">
        <button
          onClick={handlerButtonHome}
          type="button"
          className=" bg-blue-800 inline-block rounded-lg bg-primary px-6 pb-2 pt-2.5 mt-2 text-lg font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
         disabled:bg-gray-500 disabled:shadow-none disabled:text-gray-700"
        >
          Volver
        </button>

        <button
          // disabled={
          //   skuData != "" && locData != "" && amountInput > 0 ? false : true
          // }
          onClick={submitDataHandler}
          type="button"
          className=" bg-lime-600 inline-block rounded-lg bg-primary px-6 pb-2 pt-2.5 mt-2 text-lg font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
         disabled:bg-gray-500 disabled:shadow-none disabled:text-gray-700"
        >
          Finalizar
        </button>
      </div>
    </main>
  );
}
