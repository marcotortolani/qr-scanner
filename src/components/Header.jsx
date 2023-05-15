import { Link } from "react-router-dom";


export default function Header() {
  return (
    <header className="w-full max-w-md flex flex-col sm:flex-row items-center sm:items-end justify-around ">
      <Link to="/">
        <h1 className=" text-xl font-extrabold text-blue-500 hover:cursor-pointer hover:text-cyan-500 uppercase">
          ATRIX
        </h1>
      </Link>
    </header>
  );
}
