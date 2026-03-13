import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState(null);
  const [noQueryToReturn, setNoQueryToReturn] = useState(null)
  const [queryError, setQueryError] = useState(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => {
        async function queryRes(){
            const res = await fetch("http://localhost:5555/search", {
                method: "GET",
                credentials: "include",
                body: JSON.stringify({
                    query
                })
            })

            const data = await res.json()

            if (!res.ok){
                setNoQueryToReturn(data.noResult)
                setLoading(false)
                return
            }

            setQueryResults(data.queryResults)
            setLoading(false)
            return
        },
        queryRes()
    }, 3000),

    return () => clearTimeout(timeout);
  }, [query])
  



}

export default Search;
