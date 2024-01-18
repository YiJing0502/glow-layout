const productModalBtn = document.querySelector('.productModalBtn');
const myProductModal = document.querySelector('.myProductModal');
const bsProductModal = new bootstrap.Modal(myProductModal);
productModalBtn.addEventListener('click', () => {
  bsProductModal.show();
})
const delProductModalBtn = document.querySelector('.delProductModalBtn');
const myDelProductModal = document.querySelector('.myDelProductModal');
const bsDelProductModal = new bootstrap.Modal(myDelProductModal);
bsDelProductModal.show();
delProductModalBtn.addEventListener('click', () => {
})
