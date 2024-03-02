import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";

export const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pathParams] = useSearchParams();
  const page = Number(pathParams.get("page")) || 1;
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const search = new URLSearchParams();

      if (query) {
        search.set("query", query.toString());
      } else {
        searchParams.delete("query");
      }

      setSearchParams(search);

      let path;

      if (query) {
        path = `?query=${query}`;
      } else if (page > 1) {
        path = `?page=${page}`;
      } else {
        path = "/";
      }

      navigate(path);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [navigate, searchParams, query, setSearchParams, page]);
  return (
    <div className="search">
      <img src="/assets/icons/search.svg" alt="search" width={24} height={24} />

      <Input
        className="search-field"
        placeholder="Search"
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};
