<template>
  <div class="account">
    <div class="account-inner">
      <div class="account-header">
        <div class="title">
          <p>Account</p>
        </div>
        <div class="divider"></div>
      </div>
      <div class="account-content">
        <div class="lst-Account">
          <div class="lst-header">
            <div class="lst-title">
              <h1>Quản lý tài khoản</h1>
            </div>
            <div></div>
          </div>
          <div class="account-table">
            <table style="width: 100%">
              <thead>
                <th class="text-align-left" style="width: 50px">STT</th>
                <th class="text-align-left" style="width: 120px">
                  Tên tài khoản
                </th>
                <th class="text-align-left" style="width: 150px">Họ tên</th>
                <th class="text-align-left" style="width: 80px">
                  Số điện thoại
                </th>
                <th class="text-align-left" style="width: 150px">Email</th>
                <th class="text-align-left" style="width: 100px">Chức vụ</th>
                <th style="width: 120px">Trạng thái</th>
              </thead>
              <tbody>
                <tr v-for="(user,index) in accounts" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{user.userName}}</td>
                  <td>{{user.fullName}}</td>
                  <td>{{user.phoneNumber}}</td>
                  <td>{{user.email}}</td>
                  <td>{{formatPosition(user.position)}}</td>
                  <td class="text-align-center">{{formatStaus(user.status)}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="flex-center mt-6">
        <Pagination
          :currentPage="pagination.currentPage"
          :totalPage="pagination.totalPage"
        />
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/plugins/api";
import Pagination from "@/components/atoms/Pagination.vue";
export default {
  components:{
    Pagination
  },
  data: () => ({
    accounts: [],
    pagination: {
      currentPage: 1,
      totalPage: 1,
    },
    pageNumber: 1,
  }),
  created() {
    this.getAccounts();
  },
  watch:{
    $route(){
      this.getAccounts();
    }
  },
  methods: {
    getAccounts() {
      var me = this;
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      this.pageNumber = Number(searchParams.get("page"));
      api
        .get(`account?pageSize=10&pageNumber=${this.pageNumber}`)
        .then(function (res) {
          me.accounts = res.data.data;
          me.pagination.currentPage = res.data.pagination.pageNumber;
          me.pagination.totalPage = res.data.pagination.totalPage;
          console.log(me.accounts);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    formatPosition(val){
        if(val==0){
            return "Quản lý";
        }
        if(val==1){
            return "Nhân viên";
        }
    },
    formatStaus(val){
        if(val==6){
            return "Đang hoạt động";
        }
        if(val==7){
            return "Vô hiệu hóa";
        }
    }
  },
};
</script>

<style scoped>
.text-align-center {
  text-align: center;
}
.text-align-left {
  text-align: left;
}
.text-align-right {
  text-align: right;
}
.account-inner {
  padding: 24px;
}
.title p {
  font-weight: 600;
  font-size: 28px;
}
.divider {
  border: 1px solid #393c49;
  margin: 24px 0;
}
.account-content {
  background: #1f1d2b;
  border-radius: 8px;
}
.lst-Account {
  padding: 16px 24px 0 24px;
}
.lst-header {
  display: flex;
  justify-content: space-between;
}
.lst-title {
  font-weight: 600;
  font-size: 20px;
}
.btn-delete {
  height: 32px;
  padding: 0 10px;
  background: #9d0505;
  border-radius: 8px;
}
/* table */
.account-table {
  padding: 16px 0;
}
.account-table table thead th {
  height: 40px;
  border-bottom: 1px solid #393c49;
}
.account-table table tbody td {
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.account-table table tbody tr:hover {
  background: #393c49;
}
</style>