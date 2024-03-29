export default {
  methods:{
    deleteCheck(){
      this.$emit('delete-function');
    },
  },
  props: ['showData',],
  emits: ['delete-function',],
  template: `<div class="modal fade" id="bsDeleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-main-spec text-main-light">
        <h3 class="modal-title fs-5" id="exampleModalLabel">
          刪除訊息
        </h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>是否刪除<strong class="text-main-spec">{{showData.title}}</strong>？</p>
        <p>刪除後將無法恢復</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-normal-dpgray" data-bs-dismiss="modal">關閉</button>
        <button type="button" class="btn btn-normal-spec" @click="deleteCheck">刪除</button>
      </div>
    </div>
  </div>
</div>`,
}