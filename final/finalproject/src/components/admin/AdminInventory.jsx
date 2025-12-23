import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Modal } from 'bootstrap';
import "./AdminInventory.css";

export default function AdminInventory() {
    // 1. 상태 정의
    const [memberList, setMemberList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    const [selectedUser, setSelectedUser] = useState(null);
    const [inventoryList, setInventoryList] = useState([]);
    const [iconList, setIconList] = useState([]);
    const [viewTab, setViewTab] = useState("item"); // item or icon

    const [storeItems, setStoreItems] = useState([]);
    const [masterIcons, setMasterIcons] = useState([]);
    const [grantTab, setGrantTab] = useState("item");

    const detailModalRef = useRef();
    const grantModalRef = useRef();

    // 2. 유저 목록 로드 (전체/검색)
    const loadMembers = useCallback(async () => {
        try {
            const resp = await axios.get("/admin/inventory/list", { 
                params: { keyword: keyword || null, page } 
            });
            setMemberList(resp.data.list || []);
            setTotalPage(resp.data.totalPage || 0);
        } catch {
            toast.error("유저 목록 로드 실패");
        }
    }, [keyword, page]);

    useEffect(() => { loadMembers(); }, [loadMembers]);

    // 3. 지급용 마스터 데이터 미리 로드
    useEffect(() => {
        const loadMaster = async () => {
            try {
                const [resItems, resIcons] = await Promise.all([
                    axios.get("/admin/inventory/item-list"),
                    axios.get("/admin/icon/list")
                ]);
                setStoreItems(resItems.data || []);
                setMasterIcons(resIcons.data || []);
            } catch {
                console.error("마스터 데이터 로드 실패");
            }
        };
        loadMaster();
    }, []);

    // 4. 자산 관리 모달 열기 (특정 유저 클릭 시)
    const openManageModal = async (user) => {
        setSelectedUser(user);
        try {
            const [resInv, resIcon] = await Promise.all([
                axios.get(`/admin/inventory/${user.memberId}`),
                axios.get(`/admin/icon/${user.memberId}`)
            ]);
            setInventoryList(resInv.data || []);
            setIconList(resIcon.data || []);
            const modal = Modal.getOrCreateInstance(detailModalRef.current);
            modal.show();
        } catch { 
            toast.error("자산 정보를 불러오지 못했습니다."); 
        }
    };

    // 5. 자산 회수 처리
    const handleRecall = async (type, no, name) => {
        const result = await Swal.fire({
            title: '자산 회수',
            text: `${selectedUser.memberId}님의 [${name}]을 회수하시겠습니까?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            background: '#1a1a1a', color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                const url = type === "item" ? `/admin/inventory/${no}` : `/admin/icon/${no}`;
                await axios.delete(url);
                
                // 로컬 상태 즉시 갱신
                if(type === "item") setInventoryList(prev => prev.filter(i => i.inventoryNo !== no));
                else setIconList(prev => prev.filter(i => i.memberIconId !== no));
                
                toast.success("회수 완료");
            } catch { toast.error("회수 실패"); }
        }
    };

    // 6. 자산 지급 처리
    const handleGrant = async (type, targetNo, name) => {
        try {
            const url = type === "item" 
                ? `/admin/inventory/${selectedUser.memberId}/${targetNo}` 
                : `/admin/icon/${selectedUser.memberId}/${targetNo}`;
            await axios.post(url);
            toast.success(`[${name}] 지급 완료`);
            
            // 지급 후 유저 정보 다시 로드해서 동기화
            const resInv = await axios.get(`/admin/inventory/${selectedUser.memberId}`);
            const resIcon = await axios.get(`/admin/icon/${selectedUser.memberId}`);
            setInventoryList(resInv.data || []);
            setIconList(resIcon.data || []);
        } catch { 
            toast.error("지급 실패 (이미 보유 중일 수 있습니다)"); 
        }
    };

    return (
        <div className="ai-wrapper">
            <div className="ai-container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="ai-title m-0">🛡️ 자산 보유 현황 관리</h2>
                    <div className="ai-search-group d-flex gap-2">
                        <input className="ai-search-input" 
                               placeholder="아이디 또는 닉네임 검색" 
                               value={keyword} 
                               onChange={e => setKeyword(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && loadMembers()} />
                        <button className="ai-btn-main" onClick={loadMembers}>조회</button>
                    </div>
                </div>

                <div className="ai-table-container">
                    <table className="ai-table">
                        <thead>
                            <tr>
                                <th>아이디</th><th>닉네임</th><th>회원 등급</th><th className="ai-text-center">액션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {memberList.map(m => (
                                <tr key={m.memberId}>
                                    <td>{m.memberId}</td>
                                    <td className="ai-fw-bold">{m.memberNickname}</td>
                                    <td><span className="ai-badge-gray">{m.memberLevel}</span></td>
                                    <td className="ai-text-center">
                                        <button className="ai-btn-manage" onClick={() => openManageModal(m)}>
                                            🔍 상세보기 / 지급
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                <div className="d-flex justify-content-center mt-4 gap-1">
                    {[...Array(totalPage)].map((_, i) => (
                        <button key={i+1} 
                                className={`ai-page-btn ${page === i+1 ? 'active' : ''}`}
                                onClick={() => setPage(i+1)}>{i+1}</button>
                    ))}
                </div>

                {/* [1. 상세 관리 모달] */}
                <div className="modal fade" ref={detailModalRef} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content ai-modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">📦 {selectedUser?.memberNickname}님의 자산 관리</h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="ai-tab-group-sm">
                                        <button className={`ai-tab-sm ${viewTab === 'item' ? 'active' : ''}`} onClick={() => setViewTab('item')}>인벤토리</button>
                                        <button className={`ai-tab-sm ${viewTab === 'icon' ? 'active' : ''}`} onClick={() => setViewTab('icon')}>아이콘</button>
                                    </div>
                                    <button className="ai-btn-grant-open" onClick={() => Modal.getOrCreateInstance(grantModalRef.current).show()}>
                                        ➕ 신규 자산 지급하기
                                    </button>
                                </div>

                                <div className="ai-asset-grid">
                                    {(viewTab === "item" ? inventoryList : iconList).map(asset => (
                                        <div key={viewTab === "item" ? asset.inventoryNo : asset.memberIconId} className="ai-asset-card">
                                            <img src={viewTab === "item" ? asset.pointItemSrc : asset.iconSrc} alt="" />
                                            <div className="ai-asset-info">
                                                <div className="ai-asset-name">{viewTab === "item" ? asset.pointItemName : asset.iconName}</div>
                                                <button className="ai-btn-recall-sm" onClick={() => handleRecall(viewTab, viewTab === "item" ? asset.inventoryNo : asset.memberIconId, viewTab === "item" ? asset.pointItemName : asset.iconName)}>회수</button>
                                            </div>
                                        </div>
                                    ))}
                                    {(viewTab === "item" ? inventoryList : iconList).length === 0 && <div className="ai-empty w-100 text-center py-5">보유 중인 자산이 없습니다.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* [2. 지급 모달] */}
                <div className="modal fade" ref={grantModalRef} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content ai-modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">🎁 {selectedUser?.memberNickname}님에게 지급</h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="ai-tab-group-sm mb-3">
                                    <button className={`ai-tab-sm ${grantTab === 'item' ? 'active' : ''}`} onClick={() => setGrantTab('item')}>상점 아이템</button>
                                    <button className={`ai-tab-sm ${grantTab === 'icon' ? 'active' : ''}`} onClick={() => setGrantTab('icon')}>마스터 아이콘</button>
                                </div>
                                <div className="ai-grant-grid">
                                    {(grantTab === "item" ? storeItems : masterIcons).map(data => (
                                        <div className="ai-grant-item-card" key={grantTab === "item" ? data.pointItemNo : data.iconId}>
                                            <img src={grantTab === "item" ? data.pointItemSrc : data.iconSrc} alt="" />
                                            <div className="ai-grant-name">{grantTab === "item" ? data.pointItemName : data.iconName}</div>
                                            <button className="ai-btn-give" onClick={() => handleGrant(grantTab, grantTab === "item" ? data.pointItemNo : data.iconId, grantTab === "item" ? data.pointItemName : data.iconName)}>지급하기</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}