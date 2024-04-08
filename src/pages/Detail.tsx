import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Post } from "../models";

const fetchBoard = async ({ id }: { id: string }): Promise<Post> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export const Detail = () => {
  const { slug: id = "" } = useParams<{ slug: string }>();
  const {
    data: post,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["posts", "detail", id],
    queryFn: () => fetchBoard({ id }),
    enabled: !!id,
  });

  if (isFetching) return <>Loading...</>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <main style={{ margin: "0 auto", maxWidth: 600 }}>
      <h1>Detail Page</h1>

      <h2>
        {id}: {post?.title || "-"}
      </h2>
      <p>{post?.body || "-"}</p>
    </main>
  );
};
