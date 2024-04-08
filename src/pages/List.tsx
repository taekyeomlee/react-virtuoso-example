import { useRef } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { keyStore, snapshotStore } from "../stores";
import { Post } from "../models";

interface PostItemProps {
  id: number;
  title: string;
  body: string;
  onClick: () => void;
}

const LIMIT = 10;

const fetchPhotos = async ({
  limit,
  page,
}: {
  limit: number;
  page: number;
}): Promise<Post[]> => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export const List = () => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [key, setKey] = useRecoilState(keyStore);
  const [snapshot, setSnapshot] = useRecoilState(snapshotStore);

  const {
    data: { pages = [] } = {},
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["photos", "list"],
    queryFn: ({ pageParam }) => fetchPhotos({ limit: LIMIT, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (_, allPages) => allPages.length + 1,
  });

  const boards = pages.flatMap((page) => page) || [];

  if (isLoading) return <>Loading...</>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <main style={{ margin: "0 auto", maxWidth: 600 }}>
      <h1>Main Page</h1>

      <Virtuoso
        ref={virtuosoRef}
        key={key}
        computeItemKey={(key) => `board-${key.toString()}`}
        // https://virtuoso.dev/virtuoso-api/interfaces/VirtuosoProps/#restorestatefrom
        restoreStateFrom={snapshot}
        useWindowScroll
        endReached={() => hasNextPage && fetchNextPage()}
        data={boards}
        totalCount={boards.length}
        itemContent={(_, board) => (
          <PostItem
            {...board}
            onClick={() => {
              // https://virtuoso.dev/virtuoso-api/interfaces/VirtuosoHandle/#getstate
              virtuosoRef.current?.getState((snapshot) => {
                setSnapshot(snapshot);
                setKey((prev) => prev + 1);
              });
            }}
          />
        )}
      />
    </main>
  );
};

export const PostItem = ({ id, title, body, onClick }: PostItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onClick();
    navigate(`/${id}`);
  };

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <h2>
        {id}: {title}
      </h2>
      <p>{body}</p>
    </div>
  );
};
