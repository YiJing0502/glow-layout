// 共用的 ResultModal
export const createResultModal = () => {
  // 獲取 bsResultModal DOM
  const bsResultModal = document.querySelector('#bsResultModal');
  // 建立 bootstrap modal 實體
  const myResultModal = new bootstrap.Modal(bsResultModal);
  
  return myResultModal;
};