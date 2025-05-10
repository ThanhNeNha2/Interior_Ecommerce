import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./Users.scss";
import { useState } from "react";
import Add from "../../components/add/Add";
// import { userRows } from "../../data";
import { useQuery } from "@tanstack/react-query";
import { apiCustom } from "../../custom/customApi";
// import { useQuery } from "@tanstack/react-query";

const Users = () => {
  const [open, setOpen] = useState(false);

  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["alluser"],
    queryFn: () => apiCustom.get("/user").then((res) => res.data),
  });

  const userRows = data?.users || [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "img",
      headerName: "Avatar",
      width: 100,
      renderCell: (params) => {
        return <img src={params.row.image || "/noavatar.png"} alt="" />;
      },
    },
    {
      field: "username",
      type: "string",
      headerName: "User Name",
      width: 150,
    },

    {
      field: "email",
      type: "string",
      headerName: "Email",
      width: 200,
    },
    {
      field: "phone",
      type: "string",
      headerName: "Phone",
      width: 200,
    },
    {
      field: "address",
      type: "string",
      headerName: "Address",
      width: 200,
    },
    {
      field: "createdAt",
      type: "string",
      headerName: "CreatedAt",
      width: 200,
    },
    {
      field: "role",
      headerName: "Role",
      width: 100,
      type: "string",
    },
    {
      field: "isActive",
      headerName: "Verified",
      width: 100,
      type: "boolean",
    },
  ];

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button className="UserButton" onClick={() => setOpen(true)}>
          Add New User
        </button>
      </div>
      <DataTable
        slug="user"
        columns={columns}
        rows={userRows}
        infoSearch="email"
      />
      {/* TEST THE API */}

      {/* {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="users" columns={columns} rows={data} />
      )} */}
      {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Users;
