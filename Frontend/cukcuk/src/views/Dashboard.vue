<template>
  <div class="dashboard">
    <div class="dashboard-inner">
      <div class="dashboard-header">
        <div class="title">
          <p>Dashboard</p>
        </div>
        <div class="divider"></div>
      </div>
      <div class="dashboard-content">
        <div class="activities">
          <div class="sub-title">
            Hoạt động trong ngày ({{ GetTimeNow() }} - 23:00)
          </div>
          <div class="box-acti">
            <div class="box box-left">
              <div class="box-header">
                <div>
                  <span class="material-icons-outlined"> border_color </span>
                  Order
                </div>
              </div>
              <div class="box-content">
                <div class="line-box">
                  <div class="column1">Đã thanh toán</div>
                  <div class="column2">{{ order.numOfPaid.toString() }}</div>
                  <div class="column3">
                    {{ formatMoney(order.paid.toString()) }}
                  </div>
                </div>
                <div class="line-box">
                  <div class="column1">Đang phục vụ</div>
                  <div class="column2">{{ order.numOfServing }}</div>
                  <div class="column3">
                    {{ formatMoney(order.serving.toString()) }}
                  </div>
                </div>
                <div class="line-box">
                  <div class="column1">Hủy</div>
                  <div class="column2">{{ order.numOfCancel }}</div>
                  <div class="column3">
                    {{ formatMoney(order.cancel.toString()) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="box box-right">
              <div class="box-header">
                <div>
                  <div>
                    <span class="material-icons-outlined"> show_chart </span>
                    Doanh thu ước tính
                  </div>
                </div>
                <div>
                  {{ formatMoney((order.paid + order.serving).toString()) }} VNĐ
                </div>
              </div>
              <div class="box-content">
                <div class="line-box">
                  <div class="column1">Đã thanh toán</div>
                  <div class="column3">
                    {{ formatMoney(order.paid.toString()) }}
                  </div>
                </div>
                <div class="line-box">
                  <div class="column1">Đang phục vụ</div>
                  <div class="column3">
                    {{ formatMoney(order.serving.toString()) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="chart">
          <div class="sub-title">Doanh thu trong tháng</div>
          <div class="bar-chart">
            <chart :chartData="chartData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/base/Chart.vue";
import api from "@/plugins/api";
import { formatMoney } from "@/utils/formatMoney";
export default {
  components: { Chart },
  data: () => ({
    chartData: {
      labels: [],
      datasets: [
        {
          label: "VNĐ",
          backgroundColor: "#ea7c69",
          data: [],
        },
      ],
    },
    order: {
      paid: 0,
      numOfPaid: 0,
      serving: 0,
      numOfServing: 0,
      cancel: 0,
      numOfCancel: 0,
    },
  }),

  created() {
    this.getDataDashboard();
  },
  methods: {
    formatMoney,
    getDataDashboard() {
      var me = this;
      api
        .get("order/dashboard?month=4&year=2022")
        .then(function (res) {
          me.order = res.data;
          var data = res.data.byDate;
          var dataValue = [];
          for (var i = 0; i < data.length; i++) {
            me.chartData.labels.push(i + 1);
            dataValue.push(data[i]);
          }
          me.chartData.datasets[0].data = dataValue;
          console.log(me.order);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    GetTimeNow() {
      var today = new Date();
      var res =
        today.getDate().toString() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getFullYear();
      return res;
    },
  },
};
</script>
<style scoped>
.dashboard-inner {
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
.dashboard-content {
  background: #1f1d2b;
  border-radius: 8px;
}

.sub-title {
  padding: 8px 16px;
  color: rgb(40, 216, 67);
  font-size: 18px;
}
.box-acti {
  display: flex;
  padding: 0 16px;
  justify-content: space-between;
}
.box {
  width: 45%;
  border: 1px solid white;
}
.box-header {
  border: 1px solid white;
  font-size: 18px;
  padding: 8px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
}
.line-box {
  display: flex;
  justify-content: space-between;
  padding: 8px;
}
.column1 {
  width: 50%;
}
.column2 {
  width: 25%;
}
.column3 {
  width: 25%;
  text-align: right;
}
</style>