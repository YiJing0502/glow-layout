const productModalBtn = document.querySelector('.productModalBtn');
const myProductModal = document.querySelector('.myProductModal');
const bsProductModal = new bootstrap.Modal(myProductModal);
productModalBtn.addEventListener('click', () => {
  bsProductModal.show();
})
console.log(myProductModal);