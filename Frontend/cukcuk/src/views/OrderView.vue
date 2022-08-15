<template>
  <div class="orders">
    <div class="order-inner">
      <div class="header">
        <div class="title">
          <p>Orders</p>
        </div>
        <div class="divider"></div>
      </div>

      <div class="order-report">
        <div class="order-report-list">
          <div class="top-header">
            <div class="order-report-title">
              <p>Danh sách Orders</p>
            </div>
            <div class="button-delete">
              <button class="btn-delete" @click="deleteOrder()">
                Xóa Order
              </button>
            </div>
          </div>

          <div class="order-report-table">
            <table style="width: 100%">
              <thead>
                <th style="width: 60px">
                  <base-checkbox v-model="isChecked" />
                </th>
                <th class="text-align-left" style="width: 70px">Số bàn</th>
                <th class="text-align-left" style="width: 120px">
                  Người Order
                </th>
                <th class="text-align-left">Món ăn</th>
                <th class="text-align-right" style="width: 150px">Tổng tiền</th>
                <th class="text-align-center" style="width: 150px">
                  Thời gian
                </th>
                <th style="width: 150px">Trạng thái</th>
              </thead>
              <tbody>
                <tr v-for="item in orders" :key="item" @dblclick="openModal()">
                  <td class="text-align-center">
                    <base-checkbox v-model="item.isChecked" />
                  </td>
                  <td>{{ item.tableNumber }}</td>
                  <td>Khách hàng</td>
                  <td class="td-menu">
                    <span
                      v-for="(menuname, index) in item.orderDetails"
                      :key="index"
                    >
                      {{ menuname.menu.menuName
                      }}<sup style="color: yellow">({{ menuname.amount }})</sup
                      ><span v-if="index < item.orderDetails.length - 1"
                        >,
                      </span>
                    </span>
                  </td>
                  <td class="text-align-right">
                    {{ formatMoney(item.totalPrice.toString()) }} VNĐ
                  </td>
                  <td class="text-align-center">
                    {{ FormatDate(item.createdTime) }}
                  </td>
                  <td class="text-align-center">
                    <div
                      class="column-status"
                      v-bind:class="[
                        { waiting: item.status == 0 },
                        { processing: item.status == 1 },
                        { completed: item.status == 2 },
                        { canceled: item.status == 3 },
                        { paid: item.status == 4 },
                      ]"
                    >
                      {{ FormatStatus(item.status) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal v-model="isShow" :close="closeModal">
        <div
          class="
            modal
            bg-dark-second
            min-w-[450px]
            absolute
            top-50
            right-50
            rounded-lg
            text-white
            p-6
          "
        ></div>
      </Modal>

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
import BaseCheckbox from "@/components/base/BaseCheckbox.vue";
import Pagination from "@/components/atoms/Pagination.vue";
import { formatMoney } from "@/utils/formatMoney";
import api from "@/plugins/api";

export default {
  components: { BaseCheckbox, Pagination },
  data: () => ({
    orders: [],
    pagination: {
      currentPage: 1,
      totalPage: 1,
    },
    pageNumber: 1,
    isShow: false,
    isChecked: false,
  }),
  created() {
    this.GetOrders();
  },
  watch: {
    $route() {
      this.GetOrders();
    },
    isChecked() {
      if (this.isChecked == true) {
        this.orders = this.orders.map((item) => {
          return {
            ...item,
            isChecked: true,
          };
        });
      }
      if (this.isChecked == false) {
        this.orders = this.orders.map((item) => {
          return {
            ...item,
            isChecked: false,
          };
        });
      }
    },
  },
  methods: {
    formatMoney,
    // Lấy dữ liệu
    GetOrders() {
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      this.pageNumber = Number(searchParams.get("page"));
      var me = this;
      api
        .get(`order?pageSize=10&pageNumber=${this.pageNumber}`)
        .then(function (res) {
          me.pagination.currentPage = res.data.pagination.pageNumber;
          me.pagination.totalPage = res.data.pagination.totalPage;
          me.orders = res.data.data.map((item) => {
            return {
              ...item,
              isChecked: false,
            };
          });
          console.log(me.orders);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    // Định dạng thời gian
    FormatDate(val, mode) {
      if (val != null) {
        const date = new Date(val);
        var h = date.getHours().toString().padStart(2, "0");
        var p = date.getMinutes().toString().padStart(2, "0");
        const y = date.getFullYear().toString();
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        const d = date.getDate().toString().padStart(2, "0");
        if (mode == 1) {
          return `${h}:${p} ${y}-${m}-${d}`;
        } else {
          return `${h}:${p} ${d}/${m}/${y}`;
        }
      }
    },
    // Định dạng trạng thái order
    FormatStatus(val) {
      switch (val) {
        case 0:
          return "Đang chờ";
        case 1:
          return "Đang chế biến";
        case 2:
          return "Đã hoàn thành";
        case 3:
          return "Hủy";
        case 4:
          return "Đã thanh toán";
      }
    },
    openModal() {
      this.isShow = true;
    },
    closeModal() {
      this.isShow = false;
    },
    deleteOrder() {
      var arr = this.orders.filter((x) => x.isChecked == true);
      arr = arr.map((x) => {
        return x.orderId;
      });
      var me = this;
      arr.forEach((e) => {
        api
          .delete(`order/${e}`)
          .then(function (res) {
            console.log(res);
            me.GetOrders();
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    },
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
.order-inner {
  padding: 24px;
}
/* Header */
.title p {
  font-weight: 600;
  font-size: 28px;
}
.divider {
  border: 1px solid #393c49;
  margin: 24px 0;
}
/* List Order */
.order-report {
  background: #1f1d2b;
  border-radius: 8px;
}
.order-report-list {
  padding: 16px 24px 0 24px;
}
.top-header {
  display: flex;
  justify-content: space-between;
}
.order-report-title p {
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
.order-report-table {
  padding: 16px 0;
}
.order-report-table table thead th {
  height: 40px;
  border-bottom: 1px solid #393c49;
}
.order-report-table table tbody td {
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.order-report-table table tbody tr:hover {
  background: #393c49;
}
.td-menu {
  display: -webkit-box;
  -webkit-line-clamp: 1; /* số dòng hiển thị */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.column-status {
  border-radius: 30px;
  padding: 0px 8px;
}
.waiting {
  background: rgba(255, 181, 114, 0.2);
  color: #ffb572;
}
.processing {
  background: rgba(146, 144, 254, 0.2);
  color: #9290fe;
}
.completed {
  background: rgba(101, 176, 246, 0.24);
  color: #65b0f6;
}
.canceled {
  background: rgba(223, 44, 41, 0.24);
  color: #eb2020;
}
.paid {
  background: rgba(107, 226, 190, 0.24);
  color: #50d1aa;
}
/* css phân trang */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.page-button button {
  width: 32px;
  height: 32px;
  background: #2d303e;
  border: 1px solid #393c49;
  box-sizing: border-box;
  border-radius: 8px;
  margin: 4px;
}

.page-button button:hover {
  background: #774840;
}
.page-button button:focus {
  background: #ea7c69;
}
.btn-active {
  background: #ea7c69 !important;
}
</style>
