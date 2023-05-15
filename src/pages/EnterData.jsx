import { useState } from "preact/hooks";
import QrReader from "react-web-qr-reader";

export default function EnterData() {
  const delay = 500;

  const previewStyle = {
    height: 240,
    width: 320,
  };
  const [result, setResult] = useState("Sin resultado");
  const [skuData, setSkuData] = useState("");

  const handleScan = (result) => {
    if (result) {
      setResult(result.data);
      console.log(result.data);
    }
  };

  const handleError = (error) => {
    console.log(error);
  };

  return (
    <main className="p-x-4 flex flex-col items-center justify-around">
      
      <h1>Escanear Código SKU</h1>
      <QrReader
      className="w-[90vw] max-w-lg min-w-[260px] h-auto "
        delay={delay}
        // style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      {/* <p className=" w-full h-20 text-white bg-black">{result}</p> */}
      <h5 className=" w-full h-10 text-white text-center text-lg bg-black">Texto escaneado:</h5>
      <span className=" w-full h-10 text-white text-lg font-extrabold bg-black">{result}</span>
    </main>
  );
}
