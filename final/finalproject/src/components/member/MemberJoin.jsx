import { useState } from "react";
import { useNavigate } from "react-router-dom"


export default function member(){
    //도구
    const navigate = useNavigate();

    //state
    const [member, setMember] = useState({
        memberId : "", memberPw : "", memberNickname : "",
        memberEmail : "", memberBirth : "", memberContact : "",
        memberPost : "", memberAddress1 : "", memberAddress2 : ""
    });
    const [memberClass, setMemberClass] = useState({
        memberId : "", memberPw : "", memberNickname : "",
        memberEmail : "", memberBirth : "", memberContact : "",
        memberPost : "", memberAddress1 : "", memberAddress2 : ""
    });
    //effect


    //memo


    //callback


    //render
    return (<>
        <h2>회원가입</h2>

        {/* 아이디 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">아이디</label>
            <div className="col-sm-9">
                <input type="text" className={`form-control ${memberClass.memberId}`} 
                            name="memberId" value={member.memberId}
                            //onChange={}
                            //onBlur={}
                            />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback"></div>
            </div>
        </div>

        {/* 비밀번호 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">비밀번호</label>
            <div className="col-sm-9">
                <input type="text" className={`form-control ${memberClass.memberPw}`} 
                            name="memberPw" value={member.memberPw}
                            //onChange={}
                            //onBlur={}
                            />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback"></div>
            </div>
        </div>
        
        {/* 닉네임 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">닉네임</label>
            <div className="col-sm-9">
                <input type="text" className={`form-control ${memberClass.memberNickname}`} 
                            name="memberNickname" value={member.memberNickname}
                            //onChange={}
                            //onBlur={}
                            />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback"></div>
            </div>
        </div>
        
        {/* 이메일 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">이메일</label>
            <div className="col-sm-9">
                <input type="text" className={`form-control ${memberClass.memberEmail}`} 
                            name="memberEmail" value={member.memberEmail}
                            //onChange={}
                            //onBlur={}
                            />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback"></div>
            </div>
        </div>

        {/* 생년월일 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">생년월일</label>
            <div className="col-sm-9">
                <input type="text" className={`form-control ${memberClass.memberBirth}`} 
                            name="memberBirth" value={member.memberBirth}
                            //onChange={}
                            //onBlur={}
                            />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback"></div>
            </div>
        </div>

        {/* 연락처 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">연락처</label>
            <div className="col-sm-9">
                <input type="text" className={`form-control ${memberClass.memberContact}`} 
                            name="memberContact" value={member.memberContact}
                            //onChange={}
                            //onBlur={}
                            />
                <div className="valid-feedback"></div>
                <div className="invalid-feedback"></div>
            </div>
        </div>
        
        {/* 가입버튼  */}
        <div className="row mt-4">
            <div className="col">
                <button type="button" className="btn btn-lg btn-success w-100"
                            //disabled={accountValid === false}
                            //onClink = {sendData}
                            >
                <span>가입</span>
                </button>
            </div>
        </div>


    </>)
}