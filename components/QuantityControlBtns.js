
export default {
  data() {
    return {
      currentNum: 1,
    }
  },
  props: ['inventory', 'id', 'qty','productCartId'],
  emit: ['putNum'],
  methods: {
    // 按鈕, 增加數量
    plusNum(){
      this.currentNum = parseInt(this.currentNum);
      if(this.currentNum >= 1 && this.currentNum<this.inventory){
        this.currentNum += 1;
        this.$emit('putNum', this.productCartId, this.id, this.currentNum);
      };
    },
    // 按鈕, 減少數量
    minusNum(){
      this.currentNum = parseInt(this.currentNum);
      if(this.currentNum > 1){
        this.currentNum -= 1;
        this.$emit('putNum', this.productCartId, this.id, this.currentNum);
      };
    },
    // 輸入, 自訂數量
    blurNum(e){
      this.currentNum = parseInt(e.target.value);
      if(this.currentNum > this.inventory){
        this.currentNum = this.inventory;
      }else if(this.currentNum <= 0){
        this.currentNum = 1;
      };
      this.$emit('putNum', this.productCartId, this.id, this.currentNum);
    }
  },
  watch: {
    qty(newQty, oldQty){
      this.currentNum = newQty;
    }
  },
  mounted() {
    if(this.qty > this.inventory){
      this.$emit('putNum', this.productCartId, this.id, this.inventory);
    };
    this.currentNum = this.qty;
  },
  template: `<div class="d-flex">
  <div class="bg-white d-flex w-50 mb-3 gap-3 border">
    <button type="button" class="btn btn-lg" @click="minusNum">-</button>
    <input type="number" class="form-control border-white shadow-none text-center" v-model.number="currentNum" @blur="blurNum">
    <button type="button" class="btn btn-lg" @click="plusNum">+</button>
  </div>
  <p class="d-flex align-items-end ms-3">目前庫存：{{ inventory }}</p>
</div>`,
}