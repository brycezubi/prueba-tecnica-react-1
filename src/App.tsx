import { useEffect, useMemo, useRef, useState } from "react";
import { User } from "./types/user";
import UserList from "./components/UserList";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [colored, setColored] = useState(false);
  const [ordenar, setOrdenar] = useState(false);
  const [search, setSearch] = useState("");

  const originalUsers = useRef<User[]>([]);

  const getData = async () => {
    try {
      const url = `https://randomuser.me/api/?results=100`;
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Response("Error al conectar con la url");
      const datos = await respuesta.json();
      setUsers(datos.results);
      originalUsers.current = datos.results;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const toogleColor = () => {
    setColored(!colored);
  };

  const toogleOrdenar = () => {
    setOrdenar(!ordenar);
  };

  const resetUsers = () => {
    setUsers(originalUsers.current);
  };

  const usuariosFiltrados =
   useMemo(() =>   search.length > 0
   ? users.filter((usuarios) =>
       usuarios.location.country.toLowerCase().includes(search.toLowerCase())
     )
   : users,
   [search , users])
  


   const ordenarUsuarios = 
   useMemo(() => ordenar
      ? usuariosFiltrados.toSorted(
          (
            a: { location: { country: string } },
            b: { location: { country: string } }
          ) => a.location.country.localeCompare(b.location.country)
        )
      : usuariosFiltrados, 
    [ordenar , usuariosFiltrados])

  const handleDelete = (email: string) => {
    const nuevosUsuarios = users.filter((usuarios) => usuarios.email !== email);
    setUsers(nuevosUsuarios);
  };

  return (
    <>
      <header className="container mx-auto my-10">
        <h1 className="text-slate-950 text-center font-bold text-4xl">
          Prueba Tecnica Lista de Usuarios
        </h1>

        <div className="flex flex-col gap-4 pt-8 items-center">
          <div className="flex gap-5">
            <button onClick={toogleColor} className="btn">
              {colored ? "Default" : "Colorear"}
            </button>
            <button className="btn" onClick={toogleOrdenar}>
              {ordenar ? "No ordenar" : "Ordenar"}
            </button>
            <button onClick={resetUsers} className="btn">
              Resetar
            </button>
          </div>
          <form className="flex flex-col gap-1 w-full max-w-sm">
            <label htmlFor="search" className="text-gray-800 font-medium">
              Busqueda por país
            </label>
            <input
              onChange={(e) => setSearch(e.target.value)}
              className="py-1 pl-5 rounded-md"
              type="text"
              placeholder="exm: australia"
              id="search"
            />
          </form>
        </div>
      </header>
      <main className="container mx-auto ">
        <UserList
          usuarios={ordenarUsuarios}
          colorear={colored}
          borrarUsuario={handleDelete}
        />
      </main>
    </>
  );
}

export default App;
