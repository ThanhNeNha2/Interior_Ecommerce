import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./Blogs.scss";
import { useQuery } from "@tanstack/react-query";
import { apiCustom } from "../../custom/customApi";

import { Link } from "react-router-dom";
import { useEffect } from "react";

const Posts = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["allblog"],
    queryFn: () => apiCustom.get("/blog").then((res) => res.data),
  });

  const userRows = data?.blogs || [];
  // console.log("check thong tin get alll ", userRows);
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "img",
      headerName: "ImagePost",
      width: 100,
      renderCell: (params) => {
        return (
          <img
            className="imgPost"
            src={params.row.imgMainBlog || "/noavatar.png"}
            alt=""
          />
        );
      },
    },
    {
      field: "titleBlog",
      type: "string",
      headerName: "Title Blog",
      width: 250,
    },

    {
      field: "descripShort",
      type: "string",
      headerName: "Description Short",
      width: 350,
    },
    {
      field: "description",
      type: "string",
      headerName: "Description",
      width: 200,
    },
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="posts">
      <div className="info">
        <h1>Blog</h1>
        <Link to={"/addBlog"}>
          {" "}
          <button className="BlogButton">Add New Blog</button>
        </Link>
      </div>
      <DataTable
        slug="blog"
        columns={columns}
        rows={userRows}
        infoSearch="titleBlog"
      />
    </div>
  );
};

export default Posts;
