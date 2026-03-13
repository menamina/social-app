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
            try {
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

            } catch(error){
                setQueryError(error.errMsg)
            }
            
        },
        queryRes()
    }, 3000),

    return () => clearTimeout(timeout);
  }, [query])
  

  return (
    <div className="searchDiv">
        <div>Search</div>
        <div>
            <div>
                <input name="seach bar" placeholder="search" aria-label="search bar" value={query} onChange={(e) => setQuery(e.target.value)}></input>
            </div>
            <div>
                {noQueryToReturn && <div>{noQueryToReturn}</div> }
                {queryError && <div>{noQueryToReturn}</div>}
                {queryResults &&
                queryResults.map((result) => {
                    <div key={query.id} id={query.id}>
                    </div>
                }) 

                }
            </div>
        </div>

    </div>
  )



}

export default Search;
