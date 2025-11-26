import { useState, useEffect } from "react";

function Quotes({toggleQuote, quoteVisible}){
    const [quotes, setQuote] = useState(null);

    useEffect(() => {
        fetch("https://api.api-ninjas.com/v2/randomquotes",{
            headers: {"X-Api-Key": "h+1OnWGB2dO+hC3zXsLsDQ==zMtxkioQEGycte14"}
        })
        .then(res => res.json())
        .then(data => setQuote(data[0]))
        .catch(x => console.error(x));
    }, [quoteVisible]);

    return(
        <div>
            <button onClick={toggleQuote}>{quoteVisible ? 'Hide Quote':'Show Quote'}</button>
            { quoteVisible && quotes && (
                <div>
                    <p>"{quotes.quote}"</p>
                    <p>- {quotes.author || "Unknown"}</p>
                </div>
            )}
        </div>
    );
}

export default Quotes