import {useState, useEffect} from "react";
import Quotes from "../components/Quotes";

function Home(){
    const [seconds, setSeconds] = useState(0);
    const [quoteVisible, setQuoteVisible] = useState(true);

    function ShowQuote(){
        setQuoteVisible(!quoteVisible);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return(
        <div className=" grid grid-cols-3 mt-5 gap-4 ml-5">
            <div className="bg-white text-center p-5 rounded-lg">
                <h1>Time Passed</h1>
                <div>
                    {seconds}
                </div>
            </div>
            <div className="bg-white text-center p-5 rounded-lg">
                <Quotes toggleQuote={ShowQuote} quoteVisible={quoteVisible}/>
            </div>
        </div>
    )
}

export default Home