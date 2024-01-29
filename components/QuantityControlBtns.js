
export default {
  data() {
    return {
      currentNum: 1,
    }
  },
  props: ['inventory', 'id', 'qty','productCartId'],
  emit: ['putNum'],
  methods: {
    // 增加數量
    plusNum(){
      console.log(typeof this.currentNum);
      if(this.currentNum >= 1 && this.currentNum<this.inventory){
        this.currentNum += 1;
        this.$emit('putNum', this.productCartId, this.id, this.currentNum);
        console.log();
      }else{
        this.currentNum = 1;
      };
    },
    // 減少數量
    minusNum(){
      if(this.currentNum > 1){
        this.currentNum -= 1;
        this.$emit('putNum', this.productCartId, this.id, this.currentNum);
      }else{
        this.currentNum = 1;
      };
    },
    // 限制數量
    inputNum(e){
      if(e.target.value > this.inventory){
        this.currentNum = this.inventory;
      }
    },
    blurNum(e){
      this.currentNum = e.target.value;
      this.$emit('putNum', this.productCartId, this.id, Number(this.currentNum));
    }
  },
  watch: {
    qty(newQty, oldQty){
      console.log(newQty);
      console.log(newQty, oldQty);

      this.currentNum = newQty;
    }
  },
  mounted() {
    this.currentNum = this.qty;
  },
  template: `<div class="d-flex">
  <div class="bg-white d-flex w-50 mb-3 gap-3 border">
    <button type="button" class="btn btn-lg" @click="minusNum">-</button>
    <input type="number" class="form-control border-white shadow-none text-center" v-model.number="currentNum" @input="inputNum" @blur="blurNum">
    <button type="button" class="btn btn-lg" @click="plusNum">+</button>
  </div>
  <p class="d-flex align-items-end ms-3">目前庫存：{{ inventory }}</p>
</div>`,
}