import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"



export default function BoardDetail(){

    //state
    const [board, setBoard] = useState({});
    const {boardNo} = useParams();


    // effect
    useEffect(()=>{
        console.log(boardNo);
        loadData();
    },[])

    // callback
    const loadData = useCallback(async()=>{
        const {data} = await axios.get(`/board/${boardNo}`);
        setBoard(data);
    },[])

    const deleteBoard = useCallback(()=>{

    },[])

    //rendar
    return (<>
        <div className="row">
            <div className="col">
                {board.boardNo}
            </div>
        </div>

        {board.boardTitle} <br/>
        {board.boardContentsId}<br/>
        {board.boardWtime}<br/>
        {board.boardEtime}<br/>
        {board.boardWriter}<br/>
        {board.boardText}<br/>

        <div className="row mt-2">
            <div className="col">
                <Link className="btn btn-secondary me-2" to="/board/list">전체목록</Link>
                <Link className="btn btn-secondary me-2" to={`/board/edit/${board.boardNo}`}>수정</Link>
                <button type="button" className="btn btn-secondary" onClick={deleteBoard}>삭제</button>
            </div>
        </div>
    </>)


}