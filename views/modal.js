// 共用的 ResultModal
export const createResultModal = () => {
  // 獲取 bsResultModal DOM
  const bsResultModal = document.querySelector('#bsResultModal');
  // 建立 bootstrap modal 實體
  const myResultModal = new bootstrap.Modal(bsResultModal);
  
  return myResultModal;
};

export const createDeleteModal = () => {
  // 獲取 bsDeleModal ＤＯＭ
  const bsDeleModal = document.querySelector('#bsDeleModal');
  // 建立 bootstrap modal 實體
  const myDeleModal = new bootstrap.Modal(bsDeleModal);

  return myDeleModal;
};