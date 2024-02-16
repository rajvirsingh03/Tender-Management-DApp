import React, { createContext, useState } from "react";
import {
    useAddress,
    useContract,
    useContractWrite,
    useConnect,
    useMetamask
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

export const TransactionContext= createContext();

if(typeof window.ethereum == 'undefined'){
    alert("Install Metamask!");
}

export const TransactionProvider =({ children })=> {
    const {contract}=useContract("0x3f6CF4812cc192De0d0491145797C775dBEBc083");
    const {selectiveContract}=useContract("0xA59af8E1C8ba3e83Fc27278712F62F7fDf6885e3");

    //const address = useAddress();
    //const connectWallet = useMetamask();
    // const connectWallet = handleConnect();
    // const connect = useConnect();
    // async function handleConnect() {
    //     const wallet = await connect(walletConfig, connectOptions);
    // }

    const [currentAccount, setCurrentAccount] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [tenderType, setTenderType] = useState();
    const [bidAmt, setBidAmt] = useState();
    const [bidderName, setBidderName] = useState();
    const [tdrID, setTdrID] = useState();

    const [openTdrs, setOpenTdrs] = useState([]);
    const [selectiveTdrs, setSelectiveTdrs] = useState([]);
    const [OpenBids, setOpenBids] = useState([]);
    const [SelectiveBids, setSelectiveBids] = useState([]);
    const tdrsArray = [];
    const bidsArray = [];

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
        console.log(title);
    }

    const handleChangeDesc = (e) => {
        setDesc(e.target.value);
        console.log(desc);
    }

    const handleChangeStartTime = (e) => {
        setStartTime(e.target.value);
        console.log(startTime);
    }

    const handleChangeEndTime = (e) => {
        setEndTime(e.target.value);
        console.log(endTime);
    }

    const selectOpenTender = () => {
        setTenderType(0);
        console.log("OpenTender selected");
    }

    const selectSelectiveTender = () => {
        setTenderType(1);
        console.log("SelectiveTender selected");
    }

    const handleChangeBidAmt = (e) => {
        console.log("bidAmt: ",e.target.value);
        setBidAmt(e.target.value);
        console.log(bidAmt);
    }

    const handleChangeBidderName = (e) => {
        setBidderName(e.target.value);
        console.log(bidderName);
    }

    const { mutateAsync: createTenderOpen } = useContractWrite(
        contract,
        "createTender"
    );
    const { mutateAsync: createTenderSelective } = useContractWrite(
        selectiveContract,
        "createTender"
    );
    const {mutateAsync: bidOpen} = useContractWrite(
        contract,
        "bid"
    )
    const {mutateAsync: bidSelective} = useContractWrite(
        selectiveContract,
        "bid"
    )


    const createTender = async()=>{
        try{
            console.log(title,desc,startTime,endTime);
            if(tenderType==0){
                const transact = await createTenderOpen({
                    args:[title, startTime, endTime, desc],});
                console.log("openTender Result: ", transact);
            }
            else if(tenderType==1){
                const transact = await createTenderSelective({
                    args:[title, desc, startTime, endTime],});
                console.log("selectiveTender Result: ", transact);
            }
        } catch(error){
            console.log(error);
            throw new Error("No Ethereum Object");
        }
    }

    const loadOpenTdrs = async()=>{
        const tdrCount = await contract.call("getTdrCount");
        if(tdrCount>0){
            for(var i=0; i<tdrCount; i++){
                const tdrInfo = await contract.call("getTdrInfo", [i]);
                const id = tdrInfo.id.toString();
                const title = tdrInfo.title;
                const desc = tdrInfo.desc;
                const startTime = tdrInfo.startTime.toString();
                const endTime = parseInt(tdrInfo.endTime.toString());
                const maxBid = tdrInfo.maxBid.toString();
                const currentTime = parseInt(tdrInfo.currentTime.toString());
                const ended = currentTime > endTime ;

                tdrsArray[i]={
                    tdrId: {id},
                    tdrTitle: {title},
                    tdrDesc: {desc},
                    tdrStartTime: {startTime},
                    tdrEndTime: {endTime},
                    tdrMaxBid: {maxBid},
                    isEnded: {ended},
                };
            }

            setOpenTdrs(tdrsArray);
        }
    }

    const loadSelectiveTdrs = async()=>{
        const tdrCount = await selectiveContract.call("getTdrCount");
            for(var i=0; i<tdrCount; i++){
                const tdrInfo = await selectiveContract.call("getTdrInfo", [i]);
                const id = tdrInfo.id.toString();
                const title = tdrInfo.title;
                const desc = tdrInfo.desc;
                const startTime = tdrInfo.startTime.toString();
                const endTime = parseInt(tdrInfo.endTime.toString());
                const maxBid = tdrInfo.maxBid.toString();
                const currentTime = parseInt(tdrInfo.currentTime.toString());
                const ended = currentTime > endTime ;

                tdrsArray[i]={
                    tdrId: {id},
                    tdrTitle: {title},
                    tdrDesc: {desc},
                    tdrStartTime: {startTime},
                    tdrEndTime: {endTime},
                    tdrMaxBid: {maxBid},
                    isEnded: {ended},
                };
            }

        setSelectiveTdrs(tdrsArray);
    }

    const placeOpenBid = async()=>{
        try{
            const transact = await bidOpen({
                args:[tdrID, bidderName], value: ethers.utils.parseEther(bidAmt.toString())});
            console.log(transact);
        } catch(error){
            console.log(error);
            throw new Error("No Ethereum Object");
        }
    }

    const placeSelectiveBid = async()=>{
        try{
            const transact = await bidSelective({
                args:[tdrID, bidderName, bidAmt], value: ethers.utils.parseEther(bidAmt.toString())});
            console.log(transact);
        } catch(error){
            console.log(error);
            throw new Error("No Ethereum Object");
        }
    }

    const getPrevOpenBids = async()=>{
        try{
            if(tdrID){
                const count = await contract.call("getBidderCountofTdr", [tdrID]);
                for(var i=0;i<count;i++){
                    const bid = await contract.call("getBiddersofTdr", [tdrID, i]);
                    const bidder = bid.bidder.toString();
                    const bidderAmt= bid.bidAmt.toString();
                    bidsArray[i]={
                        bidderAdr: {bidder},
                        amt: {bidderAmt}
                    }
                }
            }
        }catch(error){
            console.log(error);
            throw new Error("No Ethereum Object");
        }
        setOpenBids(bidsArray);
    }

    const getPrevSelectiveBids = async()=>{
        try{
            if(tdrID){
                const count = await selectiveContract.call("getBidderCountofTdr", [tdrID]);
                for(var i=0;i<count;i++){
                    const bid = await selectiveContract.call("getBiddersofTdr", [tdrID, i]);
                    const bidder = bid.bidder.toString();
                    const bidderAmt= bid.bidAmt.toString();
                    bidsArray[i]={
                        bidderAdr: {bidder},
                        amt: {bidderAmt}
                    }
                }
            }
        }catch(error){
            console.log(error);
            throw new Error("No Ethereum Object");
        }
        setSelectiveBids(bidsArray);
    }

    return(
        <TransactionContext.Provider value={{currentAccount, handleChangeTitle, handleChangeDesc, handleChangeStartTime, handleChangeEndTime, selectOpenTender, selectSelectiveTender, createTender, loadOpenTdrs, loadSelectiveTdrs, handleChangeBidAmt, handleChangeBidderName, placeOpenBid, openTdrs, selectiveTdrs,setTdrID, tdrID, getPrevOpenBids, OpenBids, placeSelectiveBid, SelectiveBids, getPrevSelectiveBids}}>
            {children}
        </TransactionContext.Provider>
    )
}