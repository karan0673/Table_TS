import {useReactTable,getCoreRowModel,flexRender,getSortedRowModel,getFilteredRowModel,getPaginationRowModel} from "@tanstack/react-table";
import { useState,useMemo,useEffect } from "react";


function App() {

  const [data, setData] = useState([]);
  const [loading, setloading] = useState(true)
  const [sorting, setsorting] = useState([]);
  const [globalFilter, setglobalFilter] = useState("")
  
  useEffect(()=>{
    async function fetchUsers() {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const user = await res.json();
      setData(user);
      setloading(false);
    }
    fetchUsers()
  },[]);

  const columns =useMemo(()=> [{
    accessorKey:"id",
    header: "ID",
    cell:({row})=>(
    <span className="text-white-400">
      {row.original.id}
    </span>
  )
  },{
    accessorKey:"name",
    header: "Name",
    cell:({row})=>(
    <span className="text-purple-400">
      {row.original.name}
    </span>
  )
  },
{
  accessorKey:"username",
  header:"Username",
  cell:({row})=>(
    <span className="text-green-400">
      {row.original.username.toUpperCase()}
    </span>
  )
},
{
  accessorKey:"email",
  header:"Email",
  cell: ({ row }) => (
    <span className="font-bold text-yellow-400">
      {row.original.email.toLowerCase()}
    </span>
  ),
},
{
  accessorKey:"address.city",
  header:"City",
  cell:({row})=>(
    <span className="text-blue-400">
      {row.original.address.city}
    </span>
  )
},
{
  header: "Actions",
  cell: ({ row }) => (
    <div className="space-x-2">
      <button
        className="bg-blue-500 px-2 py-1 rounded"
        onClick={() => alert(row.original.name)}
      >
        Edit
      </button>

      <button
        className="bg-red-500 px-2 py-1 rounded"
        onClick={() => alert("Delete " + row.original.name)}
      >
        Delete
      </button>
    </div>
  ),
}],[]);

const table = useReactTable({
  data,
  columns,
  state:{
    sorting,
    globalFilter,
  },
  initialState:{
      pagination:{
        pageSize:5,
      }
  },
  onSortingChange:setsorting,
  onGlobalFilterChange:setglobalFilter,
  getCoreRowModel:getCoreRowModel(),
  getSortedRowModel:getSortedRowModel(),
  getFilteredRowModel:getFilteredRowModel(),
  getPaginationRowModel:getPaginationRowModel(),
});

if (loading) {
    return (
      <div className="bg-black text-white min-h-screen p-10 text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <>
    <div className="bg-black text-white min-h-screen p-10">
    <input
  type="text"
  placeholder="Search..."
  
  value={globalFilter ?? ""}
  onChange={(e) => setglobalFilter(e.target.value)}
  className="mb-5 p-2 text-white rounded border-white border"/>
    <h1 className="text-5xl font-bold">Engineers Data.</h1>
    <table className="border border-white border-collapse mt-5">
      <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-white px-4 py-2 cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc:"🔼",
                    desc: "🔽",
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border border-white px-4 py-2"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-2 space-x-2 ">
        <button
    onClick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
    className="bg-white text-black px-3 rounded cursor-pointer">
    Prev
  </button>

  <button
    onClick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
    className="bg-white text-black px-3 rounded cursor-pointer">Next</button>
      </div>
    </div>
    </>
  );
}

export default App;