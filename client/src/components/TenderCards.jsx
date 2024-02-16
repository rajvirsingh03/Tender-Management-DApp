import { Link } from "react-router-dom";
import { useEffect } from "react";

const TenderCards = (props) => {
    
    useEffect(()=>{
        // console.log(props.type);
    })

    return(
        
        <div className="mx-auto flex flex-row flex-wrap justify-evenly  ">

            {props.ended?
                <div>

                </div>
                :
                <div className="bg-slate-600 bg-base-300 h-[500px] w-[315px] rounded-lg p-4 my-7 mx-4 border-solid border-primary border-t-[1px] border-b-[1px] flex flex-col text-center ">
                <div className="text-3xl">
                <div className="text-left">Title: </div>
                    {props.title}
                </div>
                <div className="flex flex-col h-full justify-center text-ellipsis overflow-hidden bg-slate-600">
                    <div className="text-left">Description: </div>
                    {(props.desc.length)>250 && ( <div>{props.desc.slice(0,77)} . . .</div> )}
                    {(props.desc.length)<250 && ( <div>{props.desc}</div> )}
                </div>
                <div className="bg-slate-600">
                    {props.type=='1'?
                    <Link to="/SelectiveBidPage" state={{tdr:{props}}}>  
                    <button className="btn bg-base-100 m-3">Open s</button>
                    </Link>
                    :
                    <Link to="/OpenBidPage" state={{tdr:{props}}}>  
                        <button className="btn bg-slate-400 p-4 rounded-md m-3">Open</button>
                    </Link>
                }
                </div>
            </div>
            }

            
        </div>
       
    );
}

export default TenderCards;