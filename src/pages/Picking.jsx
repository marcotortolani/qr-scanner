import { useState, useEffect } from "preact/hooks";
import QrReader from "react-web-qr-reader";
import useLocalStorage from "../helpers/useLocalStorage";

const elementPicked = {
  sku: "",
  location: "",
  amount: 0,
};

const pickingCompleted = {
    date: "",
    timeInitial: "",
    timeFinish: "",
    cart: 0,
    name: "",
    elementsPicked: []
};

const date = new Date();

const DATE = `${date.getDate()}/${
  date.getMonth() + 1
}/${date.getFullYear()}`;

const TIME_INITIAL = `${date.getHours()}:${date.getMinutes()}`;



export default function EnterData() {
  const delay = 500;

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const [pickingStored, setPickingStored] = useLocalStorage(
    "pickingStored",
    []
  );
  const [user, setUser] = useLocalStorage("userData",);
  const [pickingCompleted, setPickingCompleted] = useLocalStorage("pickingCompleted", []);

  const [result, setResult] = useState("Sin resultado");
//   const [currentDate, setCurrentDate] = useState(DATE);
//   const [timeInitial, setTimeInitial] = useState(TIME_INITIAL);
  const [skuData, setSkuData] = useState("");
  const [locData, setLocData] = useState("");
  const [amountInput, setAmountInput] = useState(0);



  //   useEffect(() => {

  //     if (!dataStored[0]) {
  //       console.log("no existe data");
  //       setDataStored(dataUser);
  //     } else if (dataStored[0].user !== user || dataStored[0].cart !== cart) {
  //       const newDataStored = [...dataStored, dataUser];
  //       setDataStored(newDataStored);
  //     }
  //   }, []);

  //   setResult("TBHOG217");
  //   console.log("result original:", result);
  //   console.log("result filtrado: ", result.split(""));

  const handleScan = (result) => {
    if (result) {
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
        date: DATE,
        timeInitial: TIME_INITIAL,
        timeFinish: TIME_FINISH,
        cart: user.cart,
        name: user.name,
        elementsPicked: pickingStored
    };
    setPickingCompleted(newPickingCompleted);
  }

  return (
    <main className="h-full p-x-4 flex flex-col items-center justify-around">
      <h1>Escanear QR</h1>
      <h5>{DATE}</h5>
      <QrReader
        className="w-[90vw] max-w-lg min-w-[260px] h-auto "
        delay={delay}
        // style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      {/* <p className=" w-full h-20 text-white bg-black">{result}</p> */}
      <h3 className=" w-full h-10 text-white text-center text-lg bg-black">
        SKU Hijo: {skuData}
      </h3>
      <h3 className=" w-full h-10 text-white text-center text-lg bg-black">
        Ubicación: {locData}
      </h3>
      {/* <span className=" w-full h-10 text-white text-lg font-extrabold bg-black">
        {result}
      </span> */}

      <input
        className="h-10 p-6 text-center rounded-xl"
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
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
        bg-blue-800 disabled:bg-gray-500 disabled:shadow-none disabled:text-gray-700"
      >
        Cargar Nuevo
      </button>

      <button
        // disabled={
        //   skuData != "" && locData != "" && amountInput > 0 ? false : true
        // }
        onClick={handleFinish}
        type="button"
        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
        bg-blue-800 disabled:bg-gray-500 disabled:shadow-none disabled:text-gray-700"
      >
        Finalizar
      </button>
    </main>
  );
}
